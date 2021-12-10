const express = require('express');
const cors = require('cors');
const api = require('./api');

 // making cjanges


const application = express();
const port = process.env.PORT || 4003;
application.use(cors());
application.use(express.json());

application.get('/add/:n/:m', (request, response) => {
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(m, n);
    response.send(`${n} +  ${m} = ${sum}.`);

});

application.get('/customers', (request, response) => {
    response.json(api.getCustomers());

});

application.post('/register', (request, response) => {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    console.log(name, email, password)
    let alreadyExists = api.addCustomer(name, email, password);
    if(alreadyExists) {
        response.status(403).json({message: 'A customer with the same email already exists.'})
    } else {
        response.json({message: 'The customer added.'});
    }
});

application.post('/login', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    let isValid = api.customerLogin(email, password);
    if(isValid) {
        response.json({message: 'Login successful'});
    } else {
        response.status(404).json({message: 'User not found'});
    }

});

application.get('/flowers', (request, response) => {
    let flowerName = api.getFlowers();
    response.send(JSON. stringify(flowerName));
});

application.get('/quizzes', (request, response) => {
    let quizQuestions = api.getQuizzes();
    response.send(JSON. stringify(quizQuestions));
});

application.post('/score', (request, response) => {
    let quizTaker = request.body.quizTaker;
    let quizId = request.body.quizId;
    let score = request.body.score;
    api.addScore(quizTaker, quizId, score)
    .then(x => {
        response.json({message: 'Score has been updated.'});
    })
    .catch(e => {
        console.log(e);
        response.status(e).json({message: 'ERROR'});
    });
});

application.get('/scores/:quiztaker/:quizid', (request, response) => {
    let quizTaker = request.params.quiztaker;
    let quizId = request.params.quizid;
    api.checkScore(quizTaker, quizId)
    .then(x => {
        response.json(x);
    })
    .catch(e => {
        console.log(e);
        response.status(e).json({message: 'ERROR'});
    });
});




application.get('/quiz/:id', (request, response) => {
    let quizID = api.getQuizID(request.params.id);
    response.send(JSON. stringify(quizID));
});
/*
application.post('/score', (request, response) => {
    api.addScore(request.body.quizTaker, request.body.quizID, request.body.score);
    response.send(JSON. stringify({message: "Score was added"}));
});

application.get('/scores/:quiztaker/:quizid', (request, response) => {
    let quizScore = api.checkUserScore(request.body.quizTaker, request.body.quizID);
    if(quizScore == -1) {
        response.status(404).json({message: 'User not found'});
    } else {
        response.send(JSON. stringify(quizScore));
    }
});
*/

application.listen(port, () => console.log('Listening on port' + port));
