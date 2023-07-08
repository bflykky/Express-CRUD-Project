const jwt = require('jsonwebtoken');
const User = require("../model/user.model");

exports.login = (req, res) => {
    const {id, password} = req.body;
    const secret = req.app.get('jwt-secret');

    // 이거 어카냐
    const findOneByUserId = (id) => {
        return new Promise((resolve, reject) => {
            User.findById(id, (err, data) => {
                if (!err) {
                    resolve(new User(data.id, data.password));
                } else {
                    reject(new Error("입력 받은 유저의 id 조회 중 문제가 발생하였습니다."));
                }
            });
        });
    };

    // 1. check(user): 유저 정보 확인 후, JWT 생성하는 함수
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('아이디와 비밀번호 입력이 잘못되었습니다.');
        } else {
            // password 확인
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        // payload
                        {
                            id: user.id,
                        },
                        // secret key
                        secret, 
                        // option
                        {
                            algorithm: "HS256",
                            expiresIn: '7d',
                            issuer: 'bfly.com',
                            subject: 'userInfo'
                        }, 
                        // callback
                        (err, token) => {
                            if (err)
                                reject(err);
                            else
                                resolve(token);
                        })
                })
                return p;
            } else {
                throw new Error("비밀번호가 일치하지 않습니다.");
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.status(200).json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    findOneByUserId(id)
    .then(check)
    .then(respond)
    .catch(onError)

}