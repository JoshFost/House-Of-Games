const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const categoryData = require("../db/data/development-data/categories");
const commentData = require("../db/data/development-data/comments");
const reviewData = require("../db/data/development-data/reviews");
const userData = require("../db/data/development-data/users");
const seed = require("../db/seeds/seed");
const matchers = require("jest-extended");
expect.extend(matchers);

afterEach(() => {
  jest.useRealTimers();
});

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

describe("app", () => {
  describe("Server Errors", () => {
    it("should respond with 400 Bad Request if passed an invalid query", () => {
      return request(app)
        .get("/api/notareview")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Bad Request" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    it("404: should respond with 404 Not Found if given a valid but not existent path", () => {
      return request(app)
        .get("/api/reviewsss")
        .expect(404)
        .then((response) => {
          const serverResponseMessage = response.body.msg;
          expect(serverResponseMessage).toBe("Not Found");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
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
  describe("/api/reviews", () => {
    it("200: GET - responds with an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const { reviews } = response.body;
          expect(Array.isArray(reviews)).toBe(true);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("comment_count");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    it("returns an array of reviews sorted by date(created_at) in decending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
