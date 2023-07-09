const sql = require("./db.js");

class Question {
// constructor
    constructor(question) {
        this.id = question.id;
        this.title = question.title;
        this.content = question.content;
        this.created = question.created;
        this.writer_id = question.writer_id;
    };

    // question insert문
    static create(newQuestion) {
        return new Promise((resolve, reject) => {
            sql.query("INSERT INTO questions(title, content) VALUES(?, ?)", [newQuestion.title, newQuestion.content], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                console.log(res);

                console.log("Inserted question: ", {...newQuestion, id: res.insertId});
                resolve(newQuestion);
            });
        });
    }

    // id 검색을 통한 특정 question read
    static findById(questionId) {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * FROM questions WHERE id = ?", questionId, (err, res)=>{
                if (err) {
                    console.log("error: ", err);
                    reject(null);
                    return;
                }

                if (res.length) {
                    console.log("found question: ", res[0]);
                    resolve(res[0]);
                    return;
                }

                resolve(undefined);
            });
        });
    }

    // question 전체 read
    static getAll() {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * FROM questions", (err, res)=>{
                if (err) {
                    console.log("error: ", err);
                    reject(null);
                }

                console.log("questions: ", res);
                resolve(res);
            });
        });
    }

    // question id로 수정
    static updateById(id, question) {
        return new Promise((resolve, reject) => {
            sql.query("UPDATE questions SET title = ?, content = ? WHERE id = ?", [question.title, question.content, id], (err, res)=>{
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                if (res.affectedRows == 0) {
                    // 입력받은 id를 가진 튜플이 없는 경우
                    resolve(undefined);
                }

                
                console.log("res:", res);
                
                console.log("update question: ", {id: id, ...question});
                resolve(question);
            });
        });
    }

    // question id로 삭제
    static remove(id) {
        return new Promise((resolve, reject) => {
            sql.query("DELETE FROM questions WHERE id = ?", id, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                if (res.affectedRows == 0) {
                    // 입력 받은 id를 가진 튜플이 없는 경우
                    resolve(undefined);
                }

                console.log("Deleted question with id: ", id);
                resolve(res);
            });
        });
    }

    // question 전체 삭제
    static removeAll() {
        return new Promise((resolve, reject) => {
            sql.query("DELETE FROM questions", (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                if (res.affectedRows == 0) {
                    // 삭제할 튜플이 하나도 없는 경우 
                    resolve(undefined);
                }

                console.log(`deleted ${res.affectedRows} questions`);
                resolve(res);
            });
        });
    }
}

module.exports = Question;
