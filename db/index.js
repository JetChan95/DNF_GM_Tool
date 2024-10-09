const config = require('./config')
const mysql = require("mysql");

let connection = mysql.createConnection(config)

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败：', err);
    // 尝试重新连接
    setTimeout(() => {
      connection.connect();
    }, 5000);
  }

  console.log("数据库连接成功");

});


connection.on('error', async (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.log('数据库连接丢失，尝试重新连接...');
    await connection.connect();
  } else {
    console.error(`数据库异常:${err}`);
    throw err;
  }
});

// 定期执行查询以保持连接活性
setInterval(async () => {
  try {
    const result = await connection.query('SELECT 1');
    console.log(`${new Date()}心跳成功:${result}.`);
  } catch (err) {
    console.error('心跳失败:', err);
  }
}, 30000); // 每 30 秒执行一次心跳查询

// connection.on('error', (err) => {
//     console.error('数据库连接错误', err);
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//     console.error('数据库连接丢失，尝试重新连接...');
//     // 尝试重新连接
//     connection.connect();
//   } else {
//     console.error(`数据库异常:${err}，尝试重新连接...`);
//     connection.end();
//     connection.connect();
//   }
  
// });

module.exports = connection;