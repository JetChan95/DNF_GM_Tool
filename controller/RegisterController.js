let db = require('../controller/DbController');
let md5 = require('md5');


module.exports = {
  register: (req, res, next) => {
    let datas = req.body;
    if (!res.locals.isReg && datas.role == 'GM_master') return res.redirect('/login')
    let newPlayerCeraNum = 1000000
    let d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let hours = d.getHours().toString().padStart(2, '0');
    let minutes = d.getMinutes().toString().padStart(2, '0');
    let seconds = d.getSeconds().toString().padStart(2, '0');
    let datetime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    let sql = `select accountname from d_taiwan.accounts where accountname='${datas.account}'`;
    db(sql)
      .then( result => {
        if (result.length >= 1) {
          res.json({
            code: 400,
            msg: "账号已存在"
          })
          return Promise.reject("账号已存在")
        }

        let sql = `insert into d_taiwan.accounts (accountname,password,vip) values('${datas.account}','${md5(datas.password)}','${datas.role}')`;
        return db(sql)
      })
      .then( result => {
        insertId = result.insertId
        let sql = `insert into taiwan_billing.cash_cera set account='${insertId}',cera='${newPlayerCeraNum}'`;
        return db(sql)
      })
      .then( result => {
        let sql = `insert into taiwan_billing.cash_cera_point set account='${insertId}'`;
        return db(sql)
      })
      .then( result => {
        let sql = `insert into taiwan_cain_2nd.member_avatar_coin set m_id='${insertId}'`;
        return db(sql)
      })
      .then( result => {
        let sql = `insert into d_taiwan.member_white_account (m_id) values ('${insertId}')`;
        
        return db(sql)
      })
      .then( result => {
        let sql = `insert into d_taiwan.member_info (m_id,user_id) values('${insertId}','${insertId}')`
        return db(sql)
      })
      .then( result => {
        let sql = `insert into taiwan_login.member_login (m_id) values ('${insertId}')`
        return db(sql)
      })
      .then( result => {
        return res.json({
          code: 200,
          msg: "添加账号成功"
        })
      })
      .catch(console.log)
  },

  addAccount: (req, res, next) => {
    let datas = req.body;

    if (datas.type == 0) {
      datas.type = '';
    }
    if (datas.type == 1) {
      datas.type = 'GM_vip';
    }
    if (datas.type == 2) {
      datas.type = 'GM_master';
    }

    let insertId = null;
    let sql = `select accountname from d_taiwan.accounts where accountname='${datas.account}'`;

    db(sql)
      .then( result => {
        if (result.length >= 1) {
          res.json({
            code: 400,
            msg: "账号已存在"
          })
          return Promise.reject("账号已存在")
        }

        
        let sql = `insert into d_taiwan.accounts (accountname,password,vip) values('${datas.account}','${md5(datas.password)}','${datas.type}')`;
        return db(sql)
      })
      .then( result => {
        insertId = result.insertId
        let sql = `insert into d_taiwan.member_white_account (m_id) values ('${insertId}')`;
        
        return db(sql)
      })
      .then( result => {
        let sql = `insert into d_taiwan.member_info (m_id,user_id) values('${insertId}','${insertId}')`
        return db(sql)
      })
      .then( result => {
        let sql = `insert into taiwan_login.member_login (m_id) values ('${insertId}')`
        return db(sql)
      })
      .then( result => {
        return res.json({
          code: 200,
          msg: "添加账号成功"
        })
      })
  }
}