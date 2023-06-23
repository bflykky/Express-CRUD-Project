const Question = require("../model/question.model.js");

// 새 객체 생성
exports.create = (req, res)=>{
    if(!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    };

    const question = new Question({
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        created: req.body.created,
        writer_id: req.body.writer_id
    });

    // 데이터베이스에 저장
    Question.create(question, (err, data) =>{
        if (err) {
            res.status(500).send({
                message:
                err.message || "Some error occured while creating th Question."
            });
        } else {
          res.status(201).json({
            result: "저장에 성공하였습니다."
          });
        }
    })
};

// 전체 조회 
exports.findAll = (req, res)=>{
    Question.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving questions."
          });
        else res.send(data);
    });
};

// id로 조회
exports.findOne = (req,res)=>{
  Question.findById(req.params.questionId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Question with id ${req.params.questionId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Question with id " + req.params.questionId
          });
        }
      } else {
          res.send(data);
      }
  });
};

// id로 갱신
exports.update = (req, res)=>{
    // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Question.updateById(
    req.params.questionId,
    new Question(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Question with id ${req.params.questionId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Question with id " + req.params.questionId
          });
        }
      } else res.send(data);
    }
  );
};

// id로 삭제
exports.delete = (req, res)=>{
    Question.remove(req.params.questionId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Question with id ${req.params.questionId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Question with id " + req.params.questionId
            });
          }
        } else res.send({ message: `Question was deleted successfully!` });
    });
};

// 전체 삭제
exports.deleteAll = (req,res)=>{
    Question.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all questions."
          });
        else res.send({ message: `All Questions were deleted successfully!` });
      });
};