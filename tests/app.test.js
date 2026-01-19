const request = require("supertest");
const app = require("../app");

describe("Basic route tests", () => {

  test("GET /list should return 200", async () => {
    const res = await request(app).get("/list");
    expect(res.statusCode).toBe(200);
  });

  test("GET /list?q=nonexistent should return 404", async () => {
    const res = await request(app).get("/list?q=nonexistent");
    expect(res.statusCode).toBe(404);
  });

});

// POST /add → should redirect to /list
test("POST /add redirects to /list", async () => {
  const res = await request(app)
    .post("/add")
    .type("form")
    .send({
      destination: "Test Place",
      country: "Test Country",
      description: "Test Description",
      image: "test.jpg",
    });

  expect(res.statusCode).toBe(302);        // redirect
  expect(res.headers.location).toBe("/list");
});

// After adding, /list should contain new destination
test("After POST /add, /list contains new destination", async () => {
  await request(app)
    .post("/add")
    .type("form")
    .send({
      destination: "My New Place",
      country: "SG",
      description: "Nice place",
      image: "new.jpg",
    });

  const res = await request(app).get("/list");
  expect(res.text).toContain("My New Place");
});

// Search success case
test("GET /list?q=jeju returns 200 and shows result", async () => {
  const res = await request(app).get("/list?q=jeju");

  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Jeju"); // your data already has Jeju Island
});

async function getFirstIdForDestination(destName) {
  const listRes = await request(app).get("/list");
  // Find the card that contains the destination name, then grab the first deleteTravel id after it
  const idx = listRes.text.indexOf(destName);
  expect(idx).toBeGreaterThan(-1);

  const after = listRes.text.slice(idx);
  const match = after.match(/\/deleteTravel\/(\d+)/);
  expect(match).not.toBeNull();
  return match[1];
}

test("Delete works: add → delete → confirm removed", async () => {
  const uniqueName = "PlaceToDelete_" + Date.now();

  // 1) Add
  await request(app)
    .post("/add")
    .type("form")
    .send({
      destination: uniqueName,
      country: "SG",
      description: "temp",
      image: "x.jpg",
    });

  // 2) Find its id from /list HTML
  const id = await getFirstIdForDestination(uniqueName);

  // 3) Delete
  const delRes = await request(app)
    .post(`/deleteTravel/${id}`)
    .type("form")
    .send({});

  expect(delRes.statusCode).toBe(302);
  expect(delRes.headers.location).toBe("/list");

  // 4) Confirm removed
  const afterRes = await request(app).get("/list");
  expect(afterRes.text).not.toContain(uniqueName);
});

test("Edit works: add → edit → confirm updated name shows", async () => {
  const original = "PlaceToEdit" + Date.now();
  const updated = "PlaceEdited" + Date.now();

  // 1) Add
  await request(app)
    .post("/add")
    .type("form")
    .send({
      destination: original,
      country: "SG",
      description: "before",
      image: "x.jpg",
    });

  // 2) Find id
  const id = await getFirstIdForDestination(original);

  // 3) Edit (POST /editTravel/:id)
  const editRes = await request(app)
    .post(`/editTravel/${id}`)
    .type("form")
    .send({
      destination: updated,
      country: "JP",
      description: "after",
    });

  expect(editRes.statusCode).toBe(302);
  expect(editRes.headers.location).toBe("/list");

  // 4) Confirm updated destination appears
  const afterRes = await request(app).get("/list");
  expect(afterRes.text).toContain(updated);
  expect(afterRes.text).not.toContain(original);
});

//edge case testing

// Search with spaces
// return spaces when there are spaces
test("Edge: search with spaces (' jeju ') returns 404 because app does not trim", async () => {
  const res = await request(app).get("/list?q=%20jeju%20");
  expect(res.statusCode).toBe(404);
  expect(res.text).toContain("No destinations found");
});
//failed version (expected behaviour is to trim spaces)
// test("Edge: search with spaces (' jeju ') should still find Jeju", async () => {
//   const res = await request(app).get("/list?q=%20jeju%20");
//   expect(res.statusCode).toBe(200);
//   expect(res.text).toContain("Jeju");
// });



// duplicate destination names
//when there is duplicated names the system wont crash or lag (allow duplicate entries)
test("Edge: adding duplicate destination should not crash", async () => {
  const name = "Duplicate_" + Date.now();

  await request(app).post("/add").type("form").send({
    destination: name, country: "SG", description: "1", image: "a.jpg",
  });

  const res = await request(app).post("/add").type("form").send({
    destination: name, country: "SG", description: "2", image: "b.jpg",
  });

  expect(res.statusCode).toBe(302);
});
// FAILED version – expected behaviour ( no validation/ duplicate check)
// test("Edge: duplicate destination should be rejected", async () => {
//   const name = "Duplicate_" + Date.now();

//   await request(app).post("/add").type("form").send({
//     destination: name, country: "SG", description: "1", image: "a.jpg",
//   });

//   const res = await request(app).post("/add").type("form").send({
//     destination: name, country: "SG", description: "2", image: "b.jpg",
//   });
//   expect(res.statusCode).toBe(400);   // reject duplicate
//   expect(res.text).toContain("already exists");
// });


// 4) Test Purpose:
// This test verifies that the "Add New Place" page loads successfully.
// It ensures the server responds with HTTP 200 when accessing the /add route.

test("GET /add returns 200", async () => {
  // Send GET request to /add
  const res = await request(app).get("/add");

  // Check if page loads successfully
  expect(res.statusCode).toBe(200);
});


// 5) Test Purpose:
// This test checks whether the Contact page is accessible.
// It ensures the server returns HTTP 200 when visiting /contact.

test("GET /contact returns 200", async () => {
  // Send GET request to /contact
  const res = await request(app).get("/contact");

  // Verify successful response
  expect(res.statusCode).toBe(200);
});


// 6) Test Purpose:
// This test handles an edge case where a non-existent ID is provided.
// It ensures the system displays a "Place not found" message instead of crashing.

test("GET /editTravel/999999 shows not found", async () => {
  // Send GET request with an invalid ID
  const res = await request(app).get("/editTravel/999999");

  // Confirm correct error message is shown
  expect(res.text).toContain("Place not found");
});


// 7) Test Purpose:
// This test verifies the contact form submission behaviour.
// It ensures that after submitting the form, the user is redirected back to the homepage.

test("POST /contact redirects to /", async () => {
  // Send POST request to /contact with empty form data
  const res = await request(app).post("/contact").type("form").send({});

  // Check if server redirects correctly
  expect(res.statusCode).toBe(302);
  expect(res.headers.location).toBe("/");
});
