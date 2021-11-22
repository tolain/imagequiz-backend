


let add = (n, m) => {
    return n + m;
}

let getCustomers = () => {
    return customers;
}

let sub = (n, m) => {
    return n - m;
}

let getFlowers = () => {
    let flowerName=[];
    for(let i = 0; i < flowers.length; i++){
        flowerName.push(flowers[i].name);
    }
    return flowerName;

}

let addCustomer = (name, email, password) => {
    let alreadyExists = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(alreadyExists) {
        return true;
    }
    customers.push({id: customers.length + 1, name: name, email: email, password: password});
    return false;
}

let getQuizID = (id) => {
    return quizzes[id];
}


let customerLogin = ( email, password) => {
    let isValid = customers.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password == password);
    if(isValid){
        return true;
    }
    return false;
}

let addScore = (quizTaker, quizID, score) => {
    scores.push({quizTaker, quizID, score});
}

let checkUserScore = (quizTaker, quizID) => {
    for(let i = 0; i < scores.length; i++ ){
        if(scores[i] === quizTaker && scores[i].quizID === quizID) {
            return scores[i].score;
        }
    }
    return -1;
}


exports.add = add;
exports.getFlowers = getFlowers;
exports.getCustomers = getCustomers;
exports.sub = sub;
exports.addCustomer = addCustomer;
exports.getQuizID = getQuizID;
exports.customerLogin = customerLogin;
exports.addScore = addScore;
exports.checkUserScore = checkUserScore;