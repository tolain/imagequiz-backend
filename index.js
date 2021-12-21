const express = require('express');
const cors = require('cors');
const api = require('./api');
require('dotenv').config();
const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const { request, response } = require('express');
const frontEnd = 'http://localhost:3000';

 // making changes
 passport.use(new LocalStrategy(
    { usernameField: 'email'},
    (email, password, done) => {
        console.log('Inside local strategy callback');
        api.login(email, password)
            .then(x => {
                console.log(x);
                if (x.isValid) {
                    let user = { id: x.id, name: x.name, email: email };
                    console.log(user);
                    return done(null, user);
                } else {
                    console.log('The email or password is not valid.');
                    return done(null, false, 'The email or password was invalid');
                }
            })
            .catch(e => {
                console.log(e);
                return done(e);
            });
    }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/return/twitter',
},
    (token, tokenSecret, profile, done) => {
        console.log('Inside passport twitter ...');
        //console.log(profile._json.screen_name);
        //console.log(profile);
        let user = { id: profile.id, name: profile.displayName, username: profile.username };
        return done(null, user);
    }));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is dave to the session file store here')
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = {id: id};
    done(null, user);
});


const application = express();
const port = process.env.PORT || 4003;
application.use(express.json());
application.use(cors({
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // allow session cookie from browser to pass through
}));

application.use(session({
    genid: (request) => {
        //console.log(request);
        console.log('Inside session middleware genud function');
        console.log(`Request object sessionID from client: ${request.sessionID}`);

        return uuid(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'some random string',
    resave: false,
    saveUninitialized: true
}));
application.use(passport.initialize());
application.use(passport.session());


application.get('/add/:n/:m', (request, response) => {
    console.log('in /add');
    console.log(request.user);
    console.log(request.sessionID);
    if (request.isAuthenticated()) {
        console.log('Inside /add - inside isAuthenticated');
        console.log(`req.session.passport: ${JSON.stringify(request.session.passport)}`);
        console.log(`req.user: ${JSON.stringify(request.user)}`);
        let n = Number(request.params.n);
        let m = Number(request.params.m);
        let sum = api.add(m, n);
        response.json({done: true, sum: sum});
    } else {
        response.status(401).json({done: false, message: 'You need to log in first.'})
    }
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
/*
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
*/

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
application.get("/scores", async (req, res) => {
    let scores = await api.getScores();
    res.json(scores);
  });
  
  application.get("/scores/:quiztaker/:quizid", (req, res) => {
    let email = req.params.quiztaker;
    let id = Number(req.params.quizid);
  
    let scores = api.getScore(email, id);
  
    res.json(scores);
  });
  
  application.post("/score", async (req, res) => {
    const email = req.body.email;
    const quizName = req.body.quizName;
    const score = Number(req.body.score);
    api
      .setScore(email, quizName, score)
      .then((x) => res.json({ message: "Your Score Has Been Added" }))
      .catch((e) => {
        console.log(e);
        res.status(500).json({ message: "There is an Error Somewhere" });
      });
  });

application.listen(port, () => console.log('Listening on port' + port));
