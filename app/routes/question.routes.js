var express = require('express');
const questions = require("../controller/question.controller.js");
var router = express.Router();

// 튜플 생성
router.post("/", questions.create);

// 전체 조회
router.get("/", questions.findAll);

// id로 조회
router.get("/:questionId", questions.findOne);

// id로 수정
router.put("/:questionId", questions.update);

// id로 삭제
router.delete("/:questionId", questions.delete);

// 전체 삭제
router.delete("/", questions.deleteAll);


module.exports = router;