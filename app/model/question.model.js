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

                console.log("Inserted question: ", {id: res.insertId, ...newQuestion});
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
                }

                if (res.length) {
                    console.log("found question: ", res[0]);
                    resolve(res[0]);
                }
                
                // 해당 id를 가진 튜플 존재하지 않을 경우
                // 질문. resolve, reject 함수를 호출했음에도 여기에 도달한다. 즉, 콜백 함수가 종료되지 않음. 왜?
                console.log("==================44line입니다.==================");
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
                
                console.log("update question: ", {id:id, ...question});
                resolve(question);
                /*
                질문: 궁금한 점 2가지
                1. {id: id, ...question} 해당 딕셔너리에서, question 객체는 id 멤버를 갖고 있다. 따라서 출력 시 id 키-값 쌍이 2번 출력되어야 한다고 생각했는데, 한 번만 출력된다. 이유는?
                2. request 시 받는 데이터는 title과 content 뿐이다. 따라서, 해당 데이터를 제외한 나머지 question의 멤버 데이터들은 undefined로 console에 출력된다.
                하지만, send() 시, title과 content만 전달될 뿐, undefined 데이터는 전달되지 않는다. undefined 데이터는 send() 시에 생략되는 것인가?
                */
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

