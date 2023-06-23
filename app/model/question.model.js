const sql = require("./db.js");


// constructor
const Question = function(question) {
    this.id = question.id;
    this.title = question.title;
    this.content = question.content;
    this.created = question.created;
    this.writer_id = question.writer_id;
};

// question insert문
Question.create = (newQuestion, result)=>{
    sql.query("INSERT INTO questions(title, content) VALUES(?, ?)", [newQuestion.title, newQuestion.content], (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Inserted question: ", {id:res.insertId, ...newQuestion});
        result(null, {id: res.insertId, ...newQuestion});
    });
};

// id 검색을 통한 특정 question read
Question.findByID = (questionID, result)=>{
    sql.query("SELECT * FROM questions WHERE id = ?", questionID, (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found question: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        // 해당 id를 가진 튜플 존재하지 않을 경우
        result({kind: "not_found"}, null);
    });
};

// question 전체 read
Question.getAll = result=>{
    sql.query("SELECT * FROM questions", (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        
        console.log("question: ", res);
        result(null, res);
    });
};

// question id로 수정
Question.updateByID = (id, question, result)=>{
    sql.query("UPDATE questions SET title = ?, content = ? WHERE id = ?", 
    [question.title, question.content, id], (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // id 결과가 없을 시 
            result({kind: "not_found"}, null);
            return;
        }

        console.log("update question: ", {id:id, ... question});
        result(null, {id:id, ...question});
    });
};

// question id로 삭제
Question.remove = (id, result)=>{
    sql.query("DELETE FROM questions WHERE id = ?", id, (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // id 결과가 없을 경우
            result({kind: "not_found"}, null);
            return;
        }

        console.log("deleted question with id: ", id);
        result(null, res);
    });
};

// question 전체 삭제
Question.removeAll = result =>{
    sql.query("DELETE FROM questions", (err, res)=>{
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // id 결과가 없을 시 
            result({kind: "not_found"}, null);
            return;
        }

        console.log('deleted ${res.affectedRows} questions');
        result(null, res);
    });
};

module.exports = Question;

