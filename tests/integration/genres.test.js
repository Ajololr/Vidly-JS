const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");

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
});
