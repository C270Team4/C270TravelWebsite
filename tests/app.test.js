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
