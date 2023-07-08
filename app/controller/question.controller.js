const Question = require("../model/question.model.js");

// 새 객체 생성
exports.create = async (req, res)=>{
    if(!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
    }

    const question = new Question({
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        created: req.body.created,
        writer_id: req.body.writer_id
    });
    
    try {
        // 데이터베이스에 저장
        await Question.create(question);
        res.status(201).json({result: "저장에 성공하였습니다."});
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occured while creating the question."});
    }
};

// 전체 조회 
exports.findAll = async (req, res) => {
    try {
        const questions = await Question.getAll();
        res.status(206).send(questions);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving questions."});
    }
};

// id로 조회
exports.findOne = async (req,res)=>{
    try {
        const question = await Question.findById(req.params.questionId);

        if (question === undefined) {
            res.status(404).send({message: `Not found Question with id ${req.params.questionId}.`});
        } else {
            res.status(206).send(question);
        }
    } catch (err) {
        res.status(500).send({message: "Error retrieving Question with id " + req.params.questionId});
    }
};

// id로 갱신
exports.update = async (req, res)=>{
    // Validate Request
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
    }

    try {
        const updatedQuestion = await Question.updateById(req.params.questionId, new Question(req.body));

        if (updatedQuestion === undefined) {
            res.status(404).send({message: `Not found Question with id ${req.params.questionId}.`});
        } else {
            res.status(201).send(updatedQuestion);
        }
    } catch (err) {
        res.status(500).send({message: "Error updating Question with id " + req.params.questionId});
    }
};

// id로 삭제
exports.delete = async (req, res)=>{
    try {
        const removedQuestion = await Question.remove(req.params.questionId);

        if (removedQuestion === undefined) {
            res.status(404).send({message: `Not found Question with id ${req.params.questionId}.`});
        } else {
            res.status(200).send({message: `Question was deleted successfully!`});
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Question with id " + req.params.questionId
          });
    }
};

// 전체 삭제
exports.deleteAll = async (req, res)=>{
    try {
        const removedQuestions = await Question.removeAll();

        if (removedQuestions === undefined) {
            res.status(404).send({ message: "There is no question to be deleted." });
        } else {
            res.status(200).send({ message: `All Questions were deleted successfully!` });
        }
    } catch (err) {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all questions."
        });
    }
};