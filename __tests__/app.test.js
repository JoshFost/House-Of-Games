const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const categoryData = require("../db/data/development-data/categories");
const commentData = require("../db/data/development-data/comments");
const reviewData = require("../db/data/development-data/reviews");
const userData = require("../db/data/development-data/users");
const seed = require("../db/seeds/seed");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

describe("app", () => {
  describe("/api", () => {
    it("200: GET - responds with server OK message", () => {
      return request(app) //ARRANGE
        .get("/api") // ACT
        .expect(200) //ASSERT ---- Supertest
        .then((response) => {
          expect(response.body.msg).toBe("all ok");
        });
    });
  });
  describe("/api/categories", () => {
    it("200: GET - responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          //   console.log(response.body.categories);
          expect(response.body.categories.length).toBe(7);
          expect(response.body.categories[0]).toHaveProperty("slug");
          expect(response.body.categories[0]).toHaveProperty("description");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
