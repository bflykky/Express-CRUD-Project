const sql = require("./db");

class User {
    // constructor
    constructor(user) {
        this.id = user.id;
        this.password = user.password;
    }

    // 회원가입한 유저의 정보를 users 테이블에 create하는 함수
    static create(newUser, result) {
        sql.query("SELECT * FROM users", this.#checkIdDuplication);

        sql.query("INSERT INTO users(id, password) VALUES(?, ?)", [newUser.id, newUser.password], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("Inserted user: ", {id:res.insertId, ...newUser});
            result(null, {id: res.insertId, ...newUser});
        });
    }

    // 가입한 유저 중 특정 id를 가진 유저를 조회하는 함수
    static findById(id, result) {
        sql.query("SELECT * FROM users WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found user: ", res[0]);
                result(null, res[0]);
                return;
            }

            result({kind: "not_found"}, null);
        });
    }

    // 가입한 유저의 id를 모두 조회하는 함수
    static getAll(result) {
        sql.query("SELECT * from users", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("users: ", res);
            result(null, res);
        });
    }

    // 비밀번호 변경을 원하는 유저의 비밀번호를 update하는 함수
    static updateById(id, user, result) {
        sql.query("UPDATE users SET password = ? WHERE id = ?", [user.password, id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // 입력받은 id를 가진 튜플이 없는 경우
                result({kind: "not_found"}, null);
                return;
            }
            
            console.log("update user: ", {id:id, ...user});
            result(null, {id:id, ...user});
        });
    }

    // 탈퇴를 원하는 유저의 정보를 users 테이블에서 delete하는 함수
    static remove(id, result) {
        sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // 입력 받은 id를 가진 회원이 없는 경우
                result({kind: "not_found"}, null);
                return;
            }

            console.log("Deleted user with id: ", id);
            result(null, res);
        });
    }

    static removeAll(result) {
        sql.query("DELETE FROM users", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // 삭제할 회원이 한 명도 없는 경우
                result({kind: "not_found"}, null);
                return;
            }

            console.log(`deleted ${res.affectedRows} users`);
            result(null, res);
        });
    }

    static #checkIdDuplication(error, result, checkId) {
        if (result.length > 0) {
            let userIdArr = [];
            
            for (let column in result) {
                userIdArr.push(column.id);
            }

            if (userIdArr.includes(checkId) == false) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}

module.exports = User;