const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET 200: should return array of all topics with required properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api", () => {
  test("should provide a description of all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointDescriptions = body.endpointDescriptions;
        for (const endpoint in endpointDescriptions) {
          expect(endpointDescriptions[endpoint]).toHaveProperty("description");
          expect(endpointDescriptions[endpoint]).toHaveProperty("queries");
          expect(endpointDescriptions[endpoint]).toHaveProperty(
            "exampleResponse"
          );
        }
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: should return article object with required properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404: should return approriate response if id does not exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist");
      });
  });

  test("GET 400: should return approriate response if the id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
