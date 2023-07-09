var express = require('express');
const auth = require("../controller/auth.controller.js");
var router = express.Router();

// 회원 로그인
router.post("/login", auth.login);

module.exports = router;