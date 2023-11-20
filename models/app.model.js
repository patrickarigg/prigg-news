const { response } = require('../app')

db = require('../db/connection')

exports.selectAllTopics = ()=>{
  return db.query(`SELECT * FROM topics`)
  .then((response)=>{
    return response.rows
  })
}
