const { response } = require("../app");
const fs = require("fs/promises");

db = require("../db/connection");

exports.selectEndpointDescriptions = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((fileContents) => {
      const endpointDescriptions = JSON.parse(fileContents);
      delete endpointDescriptions["GET /api"];
      return endpointDescriptions;
    });
};

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((response) => {
    return response.rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return response.rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `
    SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(comment_id) AS INT) comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id=c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC`
    )
    .then((response) => {
      return response.rows;
    });
};

exports.selectCommentsForArticle = (id) => {
  return db
    .query(
      `
    select comment_id, votes, created_at, author, body, article_id from comments
    where article_id = $1
    order by created_at DESC`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return response.rows;
    });
};
