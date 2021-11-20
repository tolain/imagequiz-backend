var { customers } = require('./data_tier/customers');

let add = (n, m) => {
    return n + m;
}

let getCustomers = () => {
    return customers;
}

let addCustomer = (name, email, password) => {
    let alreadyExists = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(alreadyExists) {
        return true;
    }
    customers.push({id: customers.length + 1, name: name, email: email, password: password});
    return false;
}

exports.add = add;
exports.addCustomer = addCustomer;
exports.getCustomers = getCustomers;