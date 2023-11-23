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
          article_id: 1,
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
  test("GET 200: should return article object which also includes comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });
  test("GET 404: should return approriate response if id does not exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("GET 400: should return approriate response if the id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("PATCH 200: should update the votes for an article for a given article_id and respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 200,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("PATCH 404: should respond with an approriate response if the article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("PATCH 400: should respond with an approriate response if the article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("PATCH 400: should respond with an approriate response if the request object is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: should return array of all articles with required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles[6]).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });

  test("POST 201: should create a new article given a valid article object", () => {
    const newArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 14,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 201: should create a new article with the default image when no image given", () => {
    const newArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 14,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });

  test("POST 404: should respond appropriately if the author does not exist", () => {
    const newArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "nonexistentauthor",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });

  test("POST 400: should respond appropriately if the article is missing a property", () => {
    const newArticle = {
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/articles?topic=", () => {
  test("GET 200: should return array of all articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });

  test("GET 200: should return empty array if topic exists but there are no articles with that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toEqual([]);
      });
  });

  test("GET 404: should respond with an approriate response if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=blablabla")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("slug not found");
      });
  });
});

describe("/api/articles?sort_by=col&order=asc|desc", () => {
  test("GET 200: should sort by given column if it exists and default to descending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("GET 200: should sort by given column if it exists and by ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("votes");
      });
  });

  test("GET 400: should give appropriate response if order query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("GET 404: should give appropriate response if column doesn't exist", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_col&order=asc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("column does not exist");
      });
  });
});

describe("/api/articles?limit=<value>&p=<value>", () => {
  test("GET 200: should limit number of responses if limit query used", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_count = body.total_count;
        const articleIds = articles.map((article) => article.article_id);
        expect(articles).toHaveLength(5);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articleIds).toEqual([3, 6, 2, 12, 13]);
        expect(total_count).toBe(13);
      });
  });

  test("GET 200: should limit number of responses if limit query used and paginate if p query used", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_count = body.total_count;
        const articleIds = articles.map((article) => article.article_id);
        expect(articles).toHaveLength(5);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articleIds).toEqual([5, 1, 9, 10, 4]);
        expect(total_count).toBe(13);
      });
  });

  test("GET 200: should return empty array if page is higher than amount of data", () => {
    return request(app)
      .get("/api/articles?limit=5&p=10")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_count = body.total_count;
        const articleIds = articles.map((article) => article.article_id);
        expect(articles).toHaveLength(0);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articleIds).toEqual([]);
        expect(total_count).toBe(13);
      });
  });

  test("GET 200: should default to limit of 10 if p given and limit not", () => {
    return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_count = body.total_count;
        const articleIds = articles.map((article) => article.article_id);
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articleIds).toEqual([3, 6, 2, 12, 13, 5, 1, 9, 10, 4]);
        expect(total_count).toBe(13);
      });
  });

  test("GET 400: should respond appropriately if limit given an invalid value", () => {
    return request(app)
      .get("/api/articles?limit=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("GET 400: should respond appropriately if limit given a negative value", () => {
    return request(app)
      .get("/api/articles?limit=-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("GET 400: should respond appropriately if page given a negative value", () => {
    return request(app)
      .get("/api/articles?p=-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: should return array of comments for given article id sorted by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: should return [] if the article id is valid but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("GET 404: should respond with an approriate response if id does not exist", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("GET 400: should respond with an approriate response if the id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("POST 201: should add a comment for a given article id and respond with the posted comment", () => {
    const newComment = {
      username: "rogersop",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "Great article!",
          article_id: 2,
          author: "rogersop",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("POST 404: should respond with an appropriate message if the article_id does not exist", () => {
    const newComment = {
      username: "rogersop",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("POST 404: should respond with an appropriate message if the username does not exist", () => {
    const newComment = {
      username: "prigg",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("POST 400: should respond with an approriate response if the id is invalid", () => {
    const newComment = {
      username: "rogersop",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("POST 400: should respond with an appropriate message if parts of the post request are missing", () => {
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/articles/:article_id/comments?limit=<value>&p=<value>", () => {
  test("GET 200: should limit number of responses if limit query used", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        const commentIds = comments.map((comment) => comment.comment_id);
        expect(comments).toHaveLength(5);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(commentIds).toEqual([5, 2, 18, 13, 7]);
      });
  });

  test("GET 200: should paginate with default limit 10 if p query used", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        const commentIds = comments.map((comment) => comment.comment_id);
        expect(comments).toHaveLength(1);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(commentIds).toEqual([9]);
      });
  });

  test("GET 200: should limit number of responses if limit query used and paginate if p query used", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .then(({ body }) => {
        const comments = body.comments;
        const commentIds = comments.map((comment) => comment.comment_id);
        expect(comments).toHaveLength(5);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(commentIds).toEqual([8, 6, 12, 3, 4]);
      });
  });

  test("GET 200: should return empty array if page number is too high", () => {
    return request(app)
      .get("/api/articles/1/comments?p=10")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        const commentIds = comments.map((comment) => comment.comment_id);
        expect(comments).toHaveLength(0);
        expect(commentIds).toEqual([]);
      });
  });

  test("GET 400: should respond appropriately if limit given an invalid value", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("GET 400: should respond appropriately if limit given a negative value", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("GET 400: should respond appropriately if page given a negative value", () => {
    return request(app)
      .get("/api/articles/1/comments?p=-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH 200: should update the votes for a comment and respond with the updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 4 })
      .expect(200)
      .then(({ body }) => {
        const updatedComment = body.updatedComment;
        expect(updatedComment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 20,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("PATCH 404: should respond approriately if the comment_id does not exist", () => {
    return request(app)
      .patch("/api/comments/100")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });

  test("PATCH 400: should respond approriately if the comment_id is invalid", () => {
    return request(app)
      .patch("/api/comments/invalid_comment_id")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("PATCH 400: should respond with an approriate response if the votes request object is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("DELETE 204: should delete the given comment by comment_id and return no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE 404: should respond with an approriate response if the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });

  test("DELETE 400: should respond with an approriate response if the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid_comment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: should return array of all users with required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((article) => {
          expect(article).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users[0]).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET 200: should return a single user given an existing username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("GET 404: should respond appropriately if the username doesn't exist", () => {
    return request(app)
      .get("/api/users/prigg")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });
});
