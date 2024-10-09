let db = require('../db/index')

module.exports = (sql) => {
  return new Promise( (r, j) => {
    console.log("Sql Start:", sql)
    db.query(sql, (error, results) => {
      if (error) {
        return j(error)
      };
      r(results)
    })
    console.log("Sql OK   :", sql)
  })
}
