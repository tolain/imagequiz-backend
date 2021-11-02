const express = require('express');
const api = require('./api');



const application = express();
const port = process.env.PORT || 4002;

application.get('/add/:n/:m', (request, response) => {
    let n = Number(request.params.n);
    let m = Number(request.params.m);
    let sum = api.add(m, n);
    response.send('${n} +  ${m} = ${sum}.');

});


application.listen(port, () => console.log('Listening on port' + port));

