const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
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
  return seed(testData);
});

describe("app", () => {
  describe("/api/categories", () => {
    it("200: GET - responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.categories)).toBe(true);
          expect(response.body.categories.length).toBe(4);
          response.body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
            expect(typeof category.slug).toBe("string");
            expect(typeof category.description).toBe("string");
          });
        });
    });
  });

  //old code
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
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("review_body", expect.any(String));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
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
          expect(body.msg).toBe("review_id not found");
        });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
    it("200: GET: it should respond with an array of objects of comments for the given review_id", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
        });
    });
    it("200:GET: should respond with an empty array if review_id has no comments", () => {
      const reviewId = 1;
      return request(app)
        .get(`/api/reviews/${reviewId}/comments`)
        .expect(200)
        .then(({ body }) => {
          if (body.comments.length === 0) {
            expect(body).toEqual({ comments: [] });
          }
        });
    });
    it("200:GET: should respond with the correct properties", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("review_id", expect.any(Number));
          });
        });
    });
    it("400:should responds with an error message when an invalid path is used", () => {
      return request(app)
        .get("/api/reviews/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Bad Request" });
        });
    });
  });

  describe("POST /api/reviews/:review_id/comments", () => {
    it("responds with the posted comment object", () => {
      const comment = { username: "mallionaire", body: "test comment" };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(comment)
        .expect(201)
        .then((response) => {
          const expectedComment = {
            comment_id: expect.any(Number),
            author: comment.username,
            body: comment.body,
            created_at: expect.any(String),
            review_id: 1,
            votes: expect.any(Number),
          };
          expect(response.body.comment).toMatchObject(expectedComment);
        });
    });
    it("responds with 400 Bad Request when given an invalid review ID", () => {
      const comment = { username: "mallionaire", body: "test comment" };
      return request(app)
        .post("/api/reviews/not_an_id/comments")
        .send(comment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("responds with 404 Not Found when given a non-existent username", () => {
      const comment = { username: "nonexistentuser", body: "test comment" };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(comment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Path Not Found");
        });
    });
    it("201: it should ignore unnecessary properties", () => {
      const comment = {
        username: "mallionaire",
        body: "test comment",
        faveAnimal: "snake",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(comment)
        .expect(201)
        .then((response) => {
          const expectedComment = {
            comment_id: expect.any(Number),
            author: comment.username,
            body: comment.body,
            created_at: expect.any(String),
            review_id: 1,
            votes: expect.any(Number),
          };
          expect(response.body.comment).toMatchObject(expectedComment);
        });
    });
    it("responds with 400 bad request when given a non-existent fields of username and body", () => {
      const comment = {};
      return request(app)
        .post("/api/reviews/1/comments")
        .send(comment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("it should return a 404 status code passed a non existent id", () => {
      const comment = { username: "mallionaire", body: "test comment" };
      return request(app)
        .post("/api/reviews/99999/comments")
        .send(comment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Path Not Found");
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it("updates the review's vote count by 1 and returns the updated review", () => {
      const increasedVote = 1;
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: increasedVote })
        .expect(200)
        .then((response) => {
          expect(response.body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: 2,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          });
        });
    });
    it("updates the review's vote count by -100 and returns the updated review", () => {
      const increasedVote = -100;
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: increasedVote })
        .expect(200)
        .then((response) => {
          expect(response.body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: -99,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          });
        });
    });
    it("returns 400 error when inc_votes is missing from request body", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 error when review_id is not found", () => {
      const increasedVote = 1;
      return request(app)
        .patch("/api/reviews/999")
        .send({ inc_votes: increasedVote })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Review not found");
        });
    });
    it("returns 400 when the review id is not a number", () => {
      const increasedVote = 1;
      return request(app)
        .patch("/api/reviews/bananas")
        .send({ inc_votes: increasedVote })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("returns 400 when sending a patch request body with an incorrect key", () => {
      const increasedVote = 1;
      return request(app)
        .patch("/api/reviews/1")
        .send({ dec_votes: increasedVote })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("returns 400 when sending a patch request body with an incorrect value data type", () => {
      const increasedVote = "one";
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: increasedVote })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
  describe("/api/users", () => {
    it("200: GET - responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.users)).toBe(true);
          expect(response.body.users.length).toBe(4);
          response.body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
    it("404: It should respond with status 404 and Path Not Found when passed an incorrect path", () => {
      return request(app)
        .get("/api/useffwrrs")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Path Not Found");
        });
    });
  });
  describe("/api/reviews/?", () => {
    it("returns an array of reviews filtered by category, if the category query parameter is provided", () => {
      const category = "strategy";
      return request(app)
        .get(`/api/reviews/?category=${category}`)
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          const filteredReviews = reviews.filter(
            (review) => review.category === category
          );
          expect(
            filteredReviews.every((review) => review.category === category)
          ).toBe(true);
        });
    });

    it("returns an array of reviews sorted by a specific column and order, if the sort_by and order query parameters are provided", () => {
      const sort_by = "votes";
      const order = "asc";
      return request(app)
        .get(`/api/reviews?sort_by=${sort_by}&order=${order}`)
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          const sortedReviews = reviews.sort((a, b) => {
            if (order === "asc") {
              return a[sort_by] - b[sort_by];
            } else {
              return b[sort_by] - a[sort_by];
            }
          });
          expect(sortedReviews).toEqual(reviews);
        });
    });
  });
});
// });
//old code
//  describe("/api/reviews", () => {
//     it("200: GET - responds with an array of review objects", () => {
//       return request(app)
//         .get("/api/reviews")
//         .expect(200)
//         .then((response) => {
//           const { reviews } = response.body;
//           expect(Array.isArray(reviews)).toBe(true);
//           reviews.forEach((review) => {
//             expect(review).toHaveProperty("owner");
//             expect(review).toHaveProperty("title");
//             expect(review).toHaveProperty("review_id");
//             expect(review).toHaveProperty("category");
//             expect(review).toHaveProperty("review_img_url");
//             expect(review).toHaveProperty("created_at");
//             expect(review).toHaveProperty("votes");
//             expect(review).toHaveProperty("designer");
//             expect(review).toHaveProperty("comment_count");
//           });
//         });
//     });
//     it("returns an array of reviews sorted by date(created_at) in decending order", () => {
//       return request(app)
//         .get("/api/reviews")
//         .expect(200)
//         .then((response) => {
//           const reviews = response.body.reviews;
//           expect(reviews).toBeSortedBy("created_at", { descending: true });
//         });
//     });
//     it("404: should respond with 404 Not Found if given a valid but not existent path", () => {
//       return request(app)
//         .get("/api/reviewsss")
//         .expect(404)
//         .then(({ body }) => {
//           expect(body.msg).toBe("Path Not Found");
//         });
//     });

// new code
// describe("/api/reviews", () => {
//     it("200: GET - responds with an array of review objects", () => {
//       return request(app)
//         .get("/api/reviews")
//         .expect(200)
//         .then((response) => {
//           const { reviews } = response.body;
//           expect(Array.isArray(reviews)).toBe(true);
//           reviews.forEach((review) => {
//             expect(review).toHaveProperty("owner");
//             expect(review).toHaveProperty("title");
//             expect(review).toHaveProperty("review_id");
//             expect(review).toHaveProperty("category");
//             expect(review).toHaveProperty("review_img_url");
//             expect(review).toHaveProperty("created_at");
//             expect(review).toHaveProperty("votes");
//             expect(review).toHaveProperty("designer");
//             expect(review).toHaveProperty("review_body");
//           });
//         });
//     });
//     it.only("returns an array of reviews sorted by date(created_at) in decending order", () => {
//       return request(app)
//         .get("/api/reviews")
//         .expect(200)
//         .then((response) => {
//           const reviews = response.body.reviews;
//           expect(reviews).toBeSortedBy("created_at", { descending: true });
//         });
//     });
//     it("404: should respond with 404 Not Found if given a valid but not existent path", () => {
//       return request(app)
//         .get("/api/reviewsss")
//         .expect(404)
//         .then(({ body }) => {
//           expect(body.msg).toBe("Path Not Found");
//         });
//     });
//     it("returns an array of reviews filtered by category, if the category query parameter is provided", () => {
//       const category = "strategy";
//       return request(app)
//         .get(`/api/reviews?category=${category}`)
//         .expect(200)
//         .then((response) => {
//           const reviews = response.body.reviews;
//           expect(reviews.toBe((review) => review.category === category)).toBe(
//             true
//           );
//         });
//     });
//     it("returns an array of reviews sorted by a specific column and order, if the sort_by and order query parameters are provided", () => {
//       const sort_by = "votes";
//       const order = "asc";
//       return request(app)
//         .get(`/api/reviews?sort_by=${sort_by}&order=${order}`)
//         .expect(200)
//         .then((response) => {
//           const reviews = response.body.reviews;
//           expect(reviews).toBeSortedBy(sort_by, {
//             ascending: order === "asc",
//           });
//         });
//     });
//   });
