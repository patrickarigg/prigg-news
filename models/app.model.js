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
  order = "DESC",
  limit,
  page
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
    query += ` ORDER BY ${sort_by} ${order}, a.article_id`;
  }

  return db
    .query(query, queryValues)
    .then((response) => {
      const total_count = response.rows.length;
      return total_count;
    })
    .then((total_count) => {
      if (limit || page) {
        limit = limit ? Number(limit) : 10;
        query += ` LIMIT ${limit}
                  OFFSET ${page ? (Number(page) - 1) * Number(limit) : 0}`;
      }
      return db.query(query, queryValues).then((response) => {
        const articles = response.rows;
        return { articles, total_count };
      });
    });
};

exports.selectCommentsForArticle = (id, limit, page) => {
  let query = `
    select comment_id, votes, created_at, author, body, article_id from comments
    where article_id = $1
    order by created_at DESC, comment_id`;

  if (limit || page) {
    limit = limit ? Number(limit) : 10;
    query += ` LIMIT ${limit}
              OFFSET ${page ? (Number(page) - 1) * Number(limit) : 0}`;
  }

  return db.query(query, [id]).then((response) => {
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

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username not found",
        });
      }
      return response.rows[0];
    });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE comments
    SET votes=votes+$1
    WHERE comment_id = $2 RETURNING*;
    `,
      [inc_votes, comment_id]
    )
    .then((response) => {
      return response.rows[0];
    });
};

exports.insertArticle = (newArticle) => {
  const insertValues = [
    newArticle.title,
    newArticle.topic,
    newArticle.author,
    newArticle.body,
  ];

  if (newArticle.article_img_url) {
    insertValues.push(newArticle.article_img_url);
  }
  return db
    .query(
      `
      INSERT INTO articles (title, topic, author, body, article_img_url)
      VALUES($1, $2, $3, $4, ${newArticle.article_img_url ? "$5" : "DEFAULT"})
      RETURNING*;
    `,
      insertValues
    )
    .then((response) => {
      return response.rows[0];
    });
};

exports.insertTopic = (newTopic) => {
  return db
    .query(
      `
      INSERT INTO topics (slug, description)
      VALUES($1, $2)
      RETURNING*;
    `,
      [newTopic.slug, newTopic.description]
    )
    .then((response) => {
      return response.rows[0];
    });
};

exports.deleteArticle = (article_id) => {
  return db.query(
    `
    DELETE FROM articles
    WHERE article_id = $1;
    `,
    [article_id]
  )
  .catch(err=>{console.log(err);})
};
