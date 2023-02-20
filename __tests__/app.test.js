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
  describe("/api/categories", () => {
    it("200: GET - responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.categories)).toBe(true);
          expect(response.body.categories.length).toBe(7);
          response.body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
            expect(typeof category.slug).toBe("string");
            expect(typeof category.description).toBe("string");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
