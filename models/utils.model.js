const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(queryString, [value]).then(({ rows }) => {
    if (rows.length===0) {
      return Promise.reject({ status: 404, msg: `${column} not found` });
    }
  });
};
