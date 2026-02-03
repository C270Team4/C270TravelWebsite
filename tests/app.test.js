//done by zihan, enrui, ryan
const request = require("supertest");

let app;

// Reset the app (and in-memory travelList) before every test
beforeEach(() => {
  jest.resetModules();          // clears require cache
  app = require("../app");      // re-require app.js fresh each test
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

describe("Functionality Tests (Normal Usage)", () => { 
   
// functionality testing (improved coverage)
// Home page load successfully
// Purpose: Verify the main route (/) is reachable and returns HTTP 200,
// homepage content is rendered.
test("GET / (home) returns 200 and shows homepage content", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Top Travel Spots");
  expect(res.text).toContain("View List");
  expect(res.text).toContain("Add New Places");
});

// list page 
// Purpose: Ensure /list works and displays default travel data when no search is applied.
test("GET /list returns 200 and shows default destinations", async () => {
  const res = await request(app).get("/list");
  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Jeju Island");
  expect(res.text).toContain("Suzhou");
  expect(res.text).toContain("Shanghai Disneyland");
});

// Test Case: Search filtering works correctly
// Purpose: Verify /list?q=china returns only matching destinations and excludes non-matching.
// test("GET /list?q=china returns only China destinations", async () => {
//   const res = await request(app).get("/list?q=china");
//   expect(res.statusCode).toBe(200);
//   // Should include China destinations
//   expect(res.text).toContain("Suzhou");
//   expect(res.text).toContain("Shanghai Disneyland");
//   // Should exclude non-China destination
//   expect(res.text).not.toContain("Jeju Island");
// });

// // Edit existing destination (ID 1) page load test
// // verifies that the edit page can be loaded for a valid destination ID.
// // ensures the server responds with HTTP 200 and displays the edit form content.
// test("GET /editTravel/1 loads edit page", async () => {
//   const res = await request(app).get("/editTravel/1");
//   // Page should load successfully
//   expect(res.statusCode).toBe(200);
//   // Page should contain the edit form heading (from app.js)
//   expect(res.text).toContain("Edit Comic");
// });

// // Update existing destination (ID 1)
// // verifies the update (edit) functionality for an existing destination.
// // ensures the POST request updates the record and the updated destination name
// // reflected on the /list page after the redirect.
// test("POST /editTravel/1 updates destination and shows in list", async () => {
//   // Send updated values to the edit endpoint
//   const editRes = await request(app)
//     .post("/editTravel/1")
//     .type("form")
//     .send({
//       destination: "Updated Place",
//       country: "China",
//       description: "Updated",
//     });
//   // Edit route should redirect back to /list after saving changes
//   expect(editRes.statusCode).toBe(302);
//   expect(editRes.headers.location).toBe("/list");
//   // Verify the updated destination appears on the list page
//   const res = await request(app).get("/list");
//   expect(res.statusCode).toBe(200);
//   expect(res.text).toContain("Updated Place");
// });

// // Add page loads test
// // Verify that the Add New Place page is reachable
// // and the form fields for adding a destination are displayed correctly.
// test("GET /add returns 200 and shows Add Place form", async () => {
//   const res = await request(app).get("/add");
//   // Page should load successfully
//   expect(res.statusCode).toBe(200);
//   // Page should contain the form title
//   expect(res.text).toContain("Add a New Place");
//   // Page should contain required input fields for adding a destination
//   expect(res.text).toContain('name="destination"');
//   expect(res.text).toContain('name="country"');
//   expect(res.text).toContain('name="description"');
// });

// // Contact page loads test
// // Verify that the Contact page is reachable
// // and the contact form fields are rendered correctly.
// test("GET /contact returns 200 and shows Contact form", async () => {
//   const res = await request(app).get("/contact");
//   // Page should load successfully
//   expect(res.statusCode).toBe(200);
//   // Page should contain the contact form title
//   expect(res.text).toContain("Contact Me");
//   // Page should contain required input fields for the contact form
//   expect(res.text).toContain('name="name"');
//   expect(res.text).toContain('name="phone"');
//   expect(res.text).toContain('name="email"');
//   expect(res.text).toContain('name="comment"');
// });
});




//edge case testing

// Search with spaces
// return spaces when there are spaces
// test("Edge: search with spaces (' jeju ') returns 404 because app does not trim", async () => {
//   const res = await request(app).get("/list?q=%20jeju%20");
//   expect(res.statusCode).toBe(404);
//   expect(res.text).toContain("No destinations found");
// });
//failed version (expected behaviour is to trim spaces)
test("Edge: search with spaces (' jeju ') should still find Jeju", async () => {
  const res = await request(app).get("/list?q=%20jeju%20");
  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Jeju");
});



// check duplicate destination names
//when there is duplicated names the system wont crash or lag (allow duplicate entries)
// test("Edge: adding duplicate destination should not crash", async () => {
//   const name = "Duplicate_" + Date.now();

//   await request(app).post("/add").type("form").send({
//     destination: name, country: "SG", description: "1", image: "a.jpg",
//   });

//   const res = await request(app).post("/add").type("form").send({
//     destination: name, country: "SG", description: "2", image: "b.jpg",
//   });

//   expect(res.statusCode).toBe(302);
// });
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




// edit invaild id
// This test checks how the system behaves when attempting to delete a non-existent ID.
// It ensures the system redirect properly instead of crashing.

test("Edge: deleting non-existent ID still redirects safely", async () => {
  const res = await request(app)
    .post("/deleteTravel/999999")
    .type("form")
    .send({});

  expect(res.statusCode).toBe(302);
  expect(res.headers.location).toBe("/list");
});
//failed version
// test("Edge: deleting non-existent ID should return 404 (intentional fail)", async () => {
//   const res = await request(app)
//     .post("/deleteTravel/999999")
//     .type("form")
//     .send({});

//   expect(res.statusCode).toBe(404);
// });



