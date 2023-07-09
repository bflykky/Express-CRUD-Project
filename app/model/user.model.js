const sql = require("./db");

class User {
    // constructor
    constructor(user) {
        this.id = user.id;
        this.password = user.password;
    }

    // 회원가입한 유저의 정보를 users 테이블에 create하는 함수
    static create(newUser) {
        return new Promise((resolve, reject) => {
            sql.query("INSERT INTO users(id, password) VALUES(?, ?)", [newUser.id, newUser.password], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }
                
                // console.log("Inserted user: ", {id:res.insertId, ...newUser});
                console.log("Inserted user: ", newUser);
                resolve(newUser);
            });
        });
    }

    // 가입한 유저 중 특정 id를 가진 유저를 조회하는 함수
    static findById(id) {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * FROM users WHERE id = ? LIMIT 1", id, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                if (res.length > 0) {
                    console.log("found user: ", res[0]);
                    resolve(res[0]);
                }

                resolve(undefined);
            });
        });
    }

    // 가입한 유저의 id를 모두 조회하는 함수
    static getAll() {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * from users", (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }
    
                console.log("users: ", res);
                resolve(res);
            });
        });
    }

    // 비밀번호 변경을 원하는 유저의 비밀번호를 update하는 함수
    static updateById(id, user) {
        return new Promise((resolve, reject) => {
            sql.query("UPDATE users SET password = ? WHERE id = ?", [user.password, id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }

                if (res.affectedRows == 0) {
                    // 입력받은 id를 가진 튜플이 없는 경우
                    resolve(undefined);
                }
                
                console.log("update user: ", {id:id, ...user});
                resolve(user);
            });
        });
    }

    // 탈퇴를 원하는 유저의 정보를 users 테이블에서 delete하는 함수
    static remove(id) {
        return new Promise((resolve, reject) => {
            sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }
    
                if (res.affectedRows == 0) {
                    // 입력 받은 id를 가진 회원이 없는 경우
                    resolve(undefined);
                }
    
                console.log("Deleted user with id: ", id);
                resolve(id);
            });
        });
    }

    static removeAll() {
        return new Promise((resolve, reject) => {
            sql.query("DELETE FROM users", (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                }
    
                if (res.affectedRows == 0) {
                    // 삭제할 회원이 한 명도 없는 경우
                    resolve(undefined);
                }
    
                console.log(`deleted ${res.affectedRows} users`);
                resolve(res);
            });
        });
    }

    // verify the password of the User documment
    verify(password) {
        return this.password === password;
    }
}

module.exports = User;