const User = require("../model/user.model");

exports.checkIdDuplication = (req, res, next) => {
    User.getAll((err, data) => {
        let userIdArr = [];
        for (let user of data) {
            console.log(user);
            userIdArr.push(user.id);
        }

        if (userIdArr.includes(req.body.id) == true) {
            console.log(`생성하려는 id ${req.body.id}를 다른 사용자가 사용하고 있어 중복됩니다.`);
            // 에러를 던져서 에러 핸들러에서 send()하도록 해야 하나?
            // throw new Error();
            res.status(409).send({message: "생성하려는 아이디가 중복됩니다. 다시 입력해 주세요."});
        } else {
            next();
        }
    });
};

// 새 객체 생성
exports.register = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const user = new User({
        id: req.body.id,
        password: req.body.password
    });

    
    User.create(user, (err, data) => {
        if (err) {
            /*
            if (data != null) {
                res.status(409).send({
                    message: data
                });
            }
            */
            res.status(500).send({
                message: err.message || "Some error occured while creating the user."
            });
        } else {
            res.status(201).json({
                result: "저장에 성공하였습니다."
            });
        }
    });
};

exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving the users."
            });
        } else {
            res.status(206).send(data);
        }
    });
};

exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.userId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with id " + req.params.userId
                });
            }
        } else {
            res.status(206).send(data);
        }
    });
};

exports.updatePassword = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateById(req.params.userId, new User(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.userId}.`
                });
            } else {
                res.status(500).send({
                message: `Error updating user with id ${req.params.userId}.`
                });
            }
        } else {
            res.status(201).send(data);
        }
    });
};

exports.deleteUser = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.userId}.`
                });
            } else {
                res.status(500).send({
                message: `Could not delete user with id ${req.params.userId}.`
                });
            }
        } else {
            res.status(200).send({message: "User was deleted successfully!"});
        }
    });
};

exports.deleteUserAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all "
            });
        } else {
            res.status(200).send({message: "All users were deleted successfully!"});
        }
    });
};

