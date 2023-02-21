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
        });
    });
    it("returns an array of reviews sorted by date(created_at) in decending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("404: should respond with 404 Not Found if given a valid but not existent path", () => {
      return request(app)
        .get("/api/reviewsss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found");
        });
    });
  });
  describe("/api/reviews/:review_id", () => {
    it("200: it should respond with a review object with the correct properties", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_body");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("created_at");
        });
    });
    it("404: should respond with 404 Not Found if given a valid but not existent path", () => {
      return request(app)
        .get("/api/bananas")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found");
        });
    });
    it("should respond with a 404 error if review_id does not exist", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body }) => {
          console.log(body.msg);
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
