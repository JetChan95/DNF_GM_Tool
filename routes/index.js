var express = require('express');
var router = express.Router();
var RegisterController = require('../controller/RegisterController')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 登录
router.get('/login', (req, res) => {
  res.render('session/login', {
    title: "登录"
  })
})

// 注册
router.get('/register', (req, res) => {
  res.render("session/register", {
    title: "注册"
  })
})

router.post('/register', RegisterController.register)
module.exports = router;
