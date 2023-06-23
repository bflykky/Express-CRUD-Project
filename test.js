const testData = {
    "id": "bfly",
    "password": "20203085"
};

const testStr = "Hello World!";

// 10개 => 88bits
// 80bits / 6 = 13 + 4

const encodedTestStr = new Buffer(JSON.stringify(testStr))
                        .toString("base64");
                        //.replace('=', '');

const encodedTestData = new Buffer(JSON.stringify(testData))
                        .toString("base64")
                        //.replace('=', '');

console.log("encodedTestData:", encodedTestData);
console.log(`eoncodedTestData: ${encodedTestData}`);
console.log("====================================================");
console.log(`eoncodedTestStr: ${encodedTestStr}`);
console.log("encodedTestStr:", encodedTestStr);

/* Result:
header: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9

{"id":"bfly","password":"20203085"}
280bits

46개 글자 + 4bits => 47개 글자
*/