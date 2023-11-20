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
        for (const endpoint in endpointDescriptions){
          expect(endpointDescriptions[endpoint]).toHaveProperty(
              "description"
            );
          expect(endpointDescriptions[endpoint]).toHaveProperty("queries");
          expect(endpointDescriptions[endpoint]).toHaveProperty(
            "exampleResponse"
          );
        }

      });
  });
});
