module.exports = {
    // HMACSHA256 방식에서 secret key의 사이즈는 상관없다.
    // 다만, 256 bits(64 bytes) 이상의 사이즈를 권장하긴 한다.
    // 아래 키는 문자열 "bfly"의 SHA256 해시값이다.
    secretKey: "5A4E41D5BFB6F2C1106981D2C4BE35E051FF6A805B8BC620DEECCC1B2E3CCD0D",
    validTime: "60s"
};