const User = require("../model/user.model");

exports.checkIdDuplication = async (req, res, next) => {
    const userIdArr = []
    try {
        const users = await User.getAll();

        let userIdArr = [];
        for (let user of users) {
            userIdArr.push(user.id);
        }

        if (userIdArr.includes(req.body.id) == true) {
            console.log(`생성하려는 id ${req.body.id}를 다른 사용자가 사용하고 있어 중복됩니다.`);
            res.status(409).send({message: "생성하려는 아이디가 중복됩니다. 다시 입력해 주세요."});
        } else {
            next();
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving the users."
        });
    }
};

// 새 객체 생성
exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const user = new User({
        id: req.body.id,
        password: req.body.password
    });

    
    try {
        const newUser = await User.create(user);
        res.status(201).json({result: "저장에 성공하였습니다."});
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occured while creating the user."});
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(206).send(users);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving the users."
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        // undefined일 때 if-else처리 추가하기
        if (user === undefined) {
            res.status(404).send({
                message: `${req.params.userId} 라는 아이디를 가진 유저를 찾지 못했습니다. 다시 확인해 주세요.`
            });
        } else {
            res.status(206).json(user);
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    }
};

exports.updatePassword = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const updatedUser = await User.updateById(req.params.userId, new User(req.body));
        if (updatedUser === undefined) {
            res.status(404).send({message: `${req.params.userId} 라는 아이디를 가진 유저를 찾지 못했습니다. 다시 확인해 주세요.`});
        } else {
            res.status(201).send(updatedUser);
        }
    } catch (err) {
        res.status(500).send({message: `Error updating user with id ${req.params.userId}.`});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUserId = await User.remove(req.params.userId);
        
        if (deletedUserId === undefined) { // 삭제한 유저가 없는 경우
            res.status(404).send({message: `${req.params.userId} 라는 아이디를 가진 유저를 찾지 못했습니다. 다시 확인해 주세요.`});
        } else {
            res.status(200).send({message: "User was deleted successfully!"});
        }
    } catch (err) {
        res.status(500).send({message: `Could not delete user with id ${req.params.userId}.`});
    }
};

exports.deleteUserAll = async (req, res) => {
    try {
        const deletedUsers = await User.removeAll();

        if (deletedUsers === undefined) {
            res.status(404).send({message: "삭제할 유저가 1명도 존재하지 않습니다."});
        } else {
            res.status(200).send({message: "All users were deleted successfully!"});
        }
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while removing all."});
    }
};

