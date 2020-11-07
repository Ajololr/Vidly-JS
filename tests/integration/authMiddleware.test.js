const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("authorization middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  it("should send 401 if no token provided", async () => {
    const res = await request(server)
      .post("/api/genres/")
      .send({ name: "genre 1" });

    expect(res.status).toBe(401);
  });

  it("should send 400 if wrong token provided", async () => {
    const res = await request(server)
      .post("/api/genres/")
      .set("x-auth-token", "123")
      .send({ name: "genre 1" });

    expect(res.status).toBe(400);
  });

  it("should send 200 if correct token provided", async () => {
    const token = new User().generateAuthToken();

    const res = await request(server)
      .post("/api/genres/")
      .set("x-auth-token", token)
      .send({ name: "genre 1" });

    expect(res.status).toBe(200);
  });
});
