var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_francomm',
  password        : '7863',
  database        : 'cs290_francomm'
});

module.exports.pool = pool;
