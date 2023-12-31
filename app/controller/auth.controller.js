const jwt = require('jsonwebtoken');
const User = require("../model/user.model");

exports.login = (req, res) => {
    const {id, password} = req.body;
    const secret = req.app.get('jwt-secret');

    // 1. check(user): 유저 정보 확인 후, JWT 생성하는 함수
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('아이디와 비밀번호 입력이 잘못되었습니다.');
        } else {
            // password 확인
            const tmpUser = new User(user);
            if(tmpUser.verify(password)) {
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
                            expiresIn: req.app.get("jwt-validTime"),
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
    User.findById(id)
    .then(check)
    .then(respond)
    .catch(onError)

}


exports.check = async (req, res, next) => {
    // request 헤더의 x-access-token 값 또는 url 파라미터의 token 값을 읽어온다.
    const token = req.headers['x-access-token'] || req.query.token;

    if (token === undefined) {
        res.status(403).json({
            success: false,
            message: "로그인되어 있지 않습니다. 로그인해 주세요."
        });
    }

    try {
        const decoded = jwt.verify(token, req.app.get('jwt-secret'));
        console.log("저장 전 req.deocded:", req.decoded);
        req.decoded = decoded;
        console.log("저장 후 req.deocded:", req.decoded);
        next();
    } catch (err) {
        res.status(403).json({
            success: false,
            message: err.message
        });
    }
};