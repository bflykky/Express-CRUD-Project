var express = require('express');
const users = require("../controller/user.controller.js");
const auth = require("../controller/auth.controller.js");
var router = express.Router();

// 회원 생성
router.post("/join", [users.checkIdDuplication, users.register]);

// 전체 회원 조회
router.get("/", users.findAll);

// 특정 회원 조회
router.get("/:userId", auth.check, users.findOne);

// 특정 회원의 비밀번호 수정
router.put("/:userId", users.updatePassword);

// 특정 회원 삭제
router.delete("/:userId", users.deleteUser);

// 전체 회원 삭제
router.delete("/", users.deleteUserAll);


module.exports = router;