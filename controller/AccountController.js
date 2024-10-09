let db = require('../controller/DbController');

module.exports = {
  index: (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let _uid = req.session.uid;
    let _role = req.session.role;
    let account = req.query.account || "";

    let params = {
      code: 0,
      data: [],
      count: 0
    }
    
    console.log("account role:",_role);
    let sql;
    if (_role == 'GM_vip') {
      sql = `select * from d_taiwan.accounts where UID=${_uid} and accountname like '%${account}%' limit ${ (page - 1) * limit}, ${limit};`;
    } else if (_role == 'GM_master') {
      sql = `select * from d_taiwan.accounts where UID<>${_uid} and accountname like '%${account}%' limit ${ (page - 1) * limit}, ${limit};`;
      console.log(sql);
    }
    db(sql)
    .then( data => {
      let sql = `SELECT COUNT(UID) from d_taiwan.accounts where UID<>${_uid} and accountname like '%${account}%'`;
      
      params.data = data;
      return db(sql)
    })
    .then( count => {
      params.count = count[0]["COUNT(UID)"];
      res.json(params)
    })
  },

  delete: (req, res, next) => {
    let uid = req.body.uid;
    if (req.session.role != 'GM_master') {
      return res.json({
        code: -1,
        msg: "无权限"
      })
    }

    let sql = `delete from d_taiwan.accounts where UID='${uid}'`;
    db(sql)
    .then( result => {
      return res.json({
        code: 200,
        msg: "删除成功"
      })
    })
  },

  role: (req, res, next) => {
    let uid = req.session.uid
    let sql = `select charac_no,charac_name,job,lev,grow_type from taiwan_cain.charac_info where m_id=${uid} and delete_flag<>1 order by charac_no asc`
    
    db(sql)
    .then( result => {
      res.json({
        code: 0,
        data: result
      })
    })
  },

  role_delete: (req, res, next) => {
    let datas = req.query;
    let sql = `DELETE FROM taiwan_cain.charac_info WHERE (charac_no = ${datas.charc_no});`
    
    db(sql)
    .then( result => {
      res.json({
        code: 0,
        data: result
      })
    })
  },

  role_select: (req, res, next) => {
    let mid = req.query.mid;
    let role_name = req.query.role_name;
    req.session.mid = mid;
    req.session.role_name = role_name;
    res.json({
      code: 200,
      msg: "选择角色成功"
    })
  },

  give_vip: (req, res, next) => {
    let datas = req.query;
    let _role = req.session.role;
    console.log(req.session, _role);
    if (_role != 'GM_master') {
      return res.json({
        code: -1,
        msg: "无权限"
      })
    }

    let sql = `UPDATE d_taiwan.accounts SET vip='GM_vip' WHERE UID=${datas.uid};`;
    // let sql = `UPDATE d_taiwan.accounts SET qq='GM_vip' WHERE UID=${datas.uid};`;
    console.log(sql);
    db(sql)
    .then( result => {
      console.log(result);
      return res.json({
        code: 200,
        msg: "vip成功"
      })
    })
  }
}