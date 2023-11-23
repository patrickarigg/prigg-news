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
    .query(
      `
    SELECT a.*, CAST(COUNT(comment_id) AS INT) comment_count FROM articles a
    LEFT JOIN comments c ON a.article_id=c.article_id
    WHERE a.article_id=$1
    GROUP BY a.article_id`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      }
      return response.rows[0];
    });
};

exports.selectAllArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  //Handle possible SQL injection
  const validOrders = ["ASC", "asc", "DESC", "desc"];
  const validSortByCols = [
    "article_id",
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (!validSortByCols.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "column does not exist" });
  }

  //build up query
  const queryValues = [];
  let query = `
    SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(comment_id) AS INT) comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id=c.article_id
    `;
  if (topic) {
    query += " WHERE topic=$1";
    queryValues.push(topic);
  }
  query += " GROUP BY a.article_id"; // ORDER BY created_at DESC

  if (sort_by) {
    query += ` ORDER BY ${sort_by} ${order}`;
  }

  //send query
  return db.query(query, queryValues).then((response) => {
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
      return response.rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  return db
    .query(
      `
    INSERT INTO comments(body, article_id, author, votes)
      VALUES($1, $2, $3, $4) RETURNING*;
    `,
      [newComment.body, article_id, newComment.username, 0]
    )
    .then((response) => {
      return response.rows[0];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes=votes+$1
    WHERE article_id = $2 RETURNING*;
    `,
      [inc_votes, article_id]
    )
    .then((response) => {
      return response.rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1;
    `,
    [comment_id]
  );
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
};
