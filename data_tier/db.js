const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require("dotenv").config();

const connectionString = 
`postgres://${process.env.DATABASEUSERNAME}:${process.env.DATABASEPASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : connectionString,
    ssl: { rejectUnauthorized: false }
}

const pool = new Pool(connection);

let getCustomers = () => {
    return pool.query(`select * from imagequiz.customer`)
    .then(x => x.rows);
}

let addCustomer = (name, email, password) => {
    const salt = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return pool.query('insert into imagequiz.customer(name, email, password) values ($1, $2, $3)', [name, email.toLowerCase(), hashedPassword]);
}

let login = (email, password) => {
    return pool.query('select password from imagequiz.customer where email = $1', [email.toLowerCase()])
    .then(x => x.rows[0].password)
    .then(x => {
        let result = bcrypt.compareSync(password, x);
        return result;
    });
}

let addQuestion = (picture, choices, answer) => {
    return pool.query('insert into imagequiz.question(picture, choices, answer) values ($1, $2, $3)', [picture, choices, answer]);
}

let addCategory = (name) => {
    return pool.query('insert into imagequiz.category(name) values ($1)', [name]);
}

let addQuiz = (name, category_id) => {
    return pool.query('insert into imagequiz.quiz(name, category_id) values ($1, $2)', [name, category_id]);
}

let getQuiz = (quiz_id) => {
    return pool.query(`select * from imagequiz.quiz where id = $1`, [quiz_id])
    .then(x => x.rows);
}

let getQuizzes = () => {
    return pool.query('select * from imagequiz.quiz')
    .then(x => x.rows);
}

let getFlowers = () => {
    return pool.query('select * from imagequiz.flower')
    .then(x => x.rows);
}

let addQuestionToQuiz = (quiz_id, question_id) => {
    return pool.query('insert into imagequiz.quiz_question(quiz_id, question_id) values ($1, $2)', [quiz_id, question_id]);
}

let addScore = (quizTaker, quizId, score) => {
    return pool.query(`select * from imagequiz.customer where email = $1`, [quizTaker.toLowerCase()])
    .then(x => {
        pool.query(`insert into imagequiz.score(customer_id, quiz_id, score) values ($1, $2, $3)`, [x.rows[0].id, quizId, score])
        .then(x => x.rows);
    });
}

let checkScore = (quizTaker, quizId) => {
    return pool.query(`select * from imagequiz.customer where email = $1`, [quizTaker.toLowerCase()])
    .then(x => {
        return pool.query(`select * from imagequiz.score where (customer_id = $1 and quiz_id = $2)`, [x.rows[0].id, quizId])
        .then(x => {
            return x.rows
        });
    });
}

exports.login = login;
exports.getCustomers = getCustomers;
exports.addCustomer = addCustomer;
exports.addQuestion = addQuestion;
exports.addCategory = addCategory;
exports.addQuiz = addQuiz;
exports.getQuiz = getQuiz;
exports.getQuizzes = getQuizzes;
exports.getFlowers = getFlowers;
exports.addQuestionToQuiz = addQuestionToQuiz;
exports.addScore = addScore;
exports.checkScore = checkScore;