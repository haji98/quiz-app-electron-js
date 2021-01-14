// Trang này để gọi những hàm liên quan đến database
// Các ông viết các hàm database vô đây
// Rồi sang các trang js của phần views chỉ việc gọi lại là được
// Thống nhất một số cách gọi tên function để đặt tên cho thống nhất
// ---> Lấy dữ liệu getData VD: getUser
// ---> Thêm dữ liệu insertData VD: insertUser
// ---> Sửa dữ liệu updateData VD: updateUser
// ---> Xóa dữ liệu deleteData VD: deleteUser
// ---> Tìm kiếm dữ liệu searchData VD: searchUser

const mysql = require('mysql');

class Model {
    constructor() {
        this.connection = null;
    }

    initialize = async() => {
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: null,
            database: 'my_db',
            charset: 'utf8_unicode_ci'
        });
        this.connection = con;
    };

    // ********* USER *********//
    // ---> get username
    // ---> Login
    checkLogin = async(username, password) => {
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`SELECT * FROM users where username='${username}' and password='${password}'`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get username
    getUserName = async(username) => {
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`SELECT username  FROM users where username = '${username}' `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get user by ID
    getUserByID = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT *  FROM users where id = '${id}' `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> insert user
    insertUser = async(username, password, email, fullName, pos) => {
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`INSERT INTO users(username,password,email,fullname,position) VALUES('${username}','${password}','${email}','${fullName}','${pos}')`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };
    // ---> get userCourse
    getUserCourse = async(userId, courseId) => {
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`SELECT * FROM users_courses WHERE userId = '${userId}' and courseId = '${courseId}'`, function(error, results) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get course
    getCourse = async() => {
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`SELECT id, name, descript, valid, total_time FROM courses`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> insert result
    insertResult = async(userId, courseId, status) => {
        console.log(`${userId} ${courseId} ${status}`);
        console.log(this.connection);
        return new Promise((resolve, reject) => {
            console.log(this.connection);
            this.connection.query(`INSERT INTO users_courses(userId, courseId, status) VALUES ('${userId}', '${courseId}', '${status}')`, function(error, results, fields) {
                if (error) return reject(error);
                console.log(`${userId} ${courseId} ${status}`);
                resolve(results);
            });
        });
    };
    // ========= END USER =========//

    // ********* COURSES *********//
    // ---> get all courses
    getAllCourse = async() => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM \`courses\``, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get course by name
    getCoursebyName = async(name) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM \`courses\` WHERE \`name\` LIKE  '${name}' `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get course by id
    getCoursebyID = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM \`courses\` WHERE \`id\` = ${id} `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get course time by course id 
    getCourseTimebyID = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT \`total_time\` FROM \`courses\` WHERE \`id\` = ${id} `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> insert course
    insertCourse = async(name, descript, valid, total_time) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO \`courses\`(\`name\`, \`descript\`, \`valid\`, \`total_time\`) VALUES ('${name}', '${descript}', ${valid}, ${total_time})`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> update course
    updateCourse = async(name, descript, valid, total_time, id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE \`courses\` SET \`name\`= '${name}', \`descript\`= '${descript}', \`valid\`= ${valid}, \`total_time\`= ${total_time} WHERE \`id\` = ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> delete course
    deleteCourse = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`DELETE FROM \`courses\` WHERE \`id\` = ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ========= END COURSES =========//

    // ********* QUESTION *********//
    // ---> get all question
    getAllQuestion = async(name) => {
        return new Promise((resolve, reject) => {
            let query = "";
            if (name === "" || name === "All") {
                query = 'SELECT `id`, `content`, `category`, `type` FROM `questions`';
            } else {
                query = 'SELECT q.`id`, q.`content`, q.`category`, q.`type` FROM `questions` as q JOIN `courses` as c ON q.`courseId` = c.`id` WHERE c.`name` = \'' + name + '\'';
            }
            this.connection.query(query, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> insert question
    insertQuestion = async(category, type, content, courseID) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO \`questions\`(\`category\`, \`type\`, \`content\`,\`courseId\`) VALUES ('${category}','${type}','${content}',${courseID})`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> update question
    updateQuestion = async(category, type, content, courseId, id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE \`questions\` SET \`category\`= '${category}', \`type\`= '${type}',\`content\`= '${content}', \`courseId\` = ${courseId} WHERE \`id\` = ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> delete question
    deleteQuestion = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`DELETE FROM \`questions\` WHERE \`id\` =  ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    //---> get question by course id (quiz view)
    getQuestionByCourseId = async(courseID) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM \`questions\` as q  WHERE q.\`courseId\` = ${courseID}`, function(error, results, fields) {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    // ========= END QUESTION =========//

    // ********* ANSWER *********//
    // ---> get all answer by question
    getAnswers = async(idQuestion) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT a.\`id\`,a.\`content\` AS \`answer\`, q.\`content\` AS \`question\`, q.\`category\`, q.\`courseId\`, q.\`type\` FROM \`answers\` AS a RIGHT JOIN \`questions\` AS q ON a.\`questionId\` = q.\`id\` WHERE q.\`id\` = ${idQuestion}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get correct answer by question
    getCorrectAnswers = async(idQuestion) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT \`correctId\` FROM \`questions\` WHERE \`id\` = ${idQuestion}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> get answer by id
    getAnswerbyID = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM \`answers\` WHERE \`id\` = ${id} `, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> insert anwser
    insertAnswer = async(content, questionId) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO \`answers\`(\`content\`, \`questionId\`) VALUES ('${content}', ${questionId})`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);

            });
        });
    };

    // ---> update answer
    updateAnswer = async(content, id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE \`answers\` SET \`content\`= '${content}' WHERE \`id\`= ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> update correct answer of question
    updateCorrectAnswer = async(correctId, id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE \`questions\` SET \`correctId\`= '${correctId}' WHERE \`id\` = ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> delete answer
    deleteAnswer = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`DELETE FROM \`answers\` WHERE \`id\` = ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };
    // ========= END ANSWER =========//

    // ********* REPORT *********//
    // ---> getCountCourse
    getCountCourse = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT *, COUNT(*) AS \`count\` FROM \`users_courses\` WHERE \`courseId\` =  ${id}`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> getCountPassed
    getCountPass = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT *, COUNT(*) AS \`count\` FROM \`users_courses\` WHERE \`courseId\` =  ${id}  AND \`status\` = 1`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };

    // ---> getUserPassed
    getUserPassed = async(id) => {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT u.fullname FROM users_courses AS uc JOIN users AS u ON uc.userId = u.id WHERE uc.courseId = ${id}  AND status = 1`, function(error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    };
    // ========= END REPORT =========//
}

let model = new Model();
module.exports = model;