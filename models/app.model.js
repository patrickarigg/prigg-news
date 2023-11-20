const { response } = require("../app");

db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((response) => {
    return response.rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then((response) => {
      if (response.rows.length===0){
        return Promise.reject({status: 404, msg:"Article ID does not exist"})
      }
      return response.rows[0];
    });
};
