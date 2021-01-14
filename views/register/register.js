const { remote } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
let link = document.getElementById('link');
let model = remote.require('./model/model.js');
let register = document.getElementById('register');

link.addEventListener('click', function() {
    ipcRenderer.send('back-to-login');
})

class Validate {
    static validateFullname(fullName) {
        if (!fullName) {
            const error = new Error('Please enter a your full name');
            error.type = 'Empty';
            throw error;
        }
    }

    static validateUsername(userName) {
        if (!userName) {
            const error = new Error('Please enter your username');
            error.type = 'Empty';
            throw error;
        }
    }

    static validatePassword(password) {
        if (!password) {
            const error = new Error('Please enter your password');
            error.type = 'Empty';
            throw error;
        }
    }

    static validateConfirm(password, confirm) {
        if (confirm !== password) {
            const error = new Error('Confirm password must equal to password');
            error.type = 'Invalid';
            throw error;
        }

        if (!confirm) {
            const error = new Error('Please enter your username');
            error.type = 'Empty';
            throw error;
        }

    }

    static validateEmail(email) {
        if (!email) {
            const error = new Error('Please enter your email');
            error.type = 'Empty';
            throw error;
        }

        if (!(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(email))) {
            const error = new Error('Wrong email format');
            error.type = 'Invalid';
            throw error;
        }
    }
}

async function getUserName(username) {
    let users = await model.getUserName(username);

    return users;
}
async function insertUser(userName, password, email, fullName, pos) {
    let users = await model.insertUser(userName, password, email, fullName, pos);
    return users;
}


register.addEventListener('click', async function() {

    try {
        const fullName = document.getElementById("fullName").value;
        Validate.validateUsername(fullName);
        const userName = document.getElementById("userName").value;
        Validate.validateUsername(userName);
        const password = document.getElementById("password").value;
        Validate.validatePassword(password);
        const confirm = document.getElementById("confirm").value;
        Validate.validateConfirm(password, confirm);
        const email = document.getElementById("email").value;
        Validate.validateEmail(email);

        let results = await getUserName(userName);

        if (results.length > 0) {
            alert("Already exist this user name!!");
            return false;
        } else {
            let pos = "DEV";
            await insertUser(userName, password, email, fullName, pos);
            alert("Register Successed!!!");
            ipcRenderer.send('out-register');
        }
    } catch (error) {
        switch (error.type) {
            case 'Empty':
                alert(error.message);
                break;
            case 'Invalid':
                alert(error.message);
                break;
        }
    }
})