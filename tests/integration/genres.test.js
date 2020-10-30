const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre 1" },
        { name: "genre 2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.name === "genre 1")).toBeTruthy();
      expect(res.body.some((genre) => genre.name === "genre 2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre with the given id", async () => {
      const genres = await Genre.collection.insertMany([
        { name: "genre 1" },
        { name: "genre 2" },
      ]);

      const res = await request(server).get(`/api/genres/${genres.ops[0]._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("genre 1");
    });

    it("should return error for nonexsiting genre id", async () => {
      const res = await request(server).get(
        `/api/genres/${mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if user is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre 1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: Array(52).join("a") });

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre 1" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre 1");
    });
  });
});
