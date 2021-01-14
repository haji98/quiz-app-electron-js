const { remote } = require('electron');
const path = require('path');
const url = require('url');
const $ = require('jquery');
const ipcRenderer = require('electron').ipcRenderer;
let mainWindow = remote.getCurrentWindow();
let link = document.getElementById('link');
let model = remote.require('./model/model.js');

// decleare event when click to Register
link.addEventListener('click', function() {
    ipcRenderer.send('open-register');
})


//call function checkLogin from model
async function checkLogin(username, password) {
    let users = await model.checkLogin(username, password);
    return users;
}

//call function login from model
async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    //check if userId and password blank
    if (username === "" || password === "") {
        html = `You must enter Username or Password`;
        $('#display').text(html);
    } else {
        let results = await checkLogin(username, password);

        //check if find same userId in database
        if (results.length > 0) {
            //check if that userId has same password
            if (password === results[0].password) {
                //check if that positon is DEV   
                if (results[0].position === 'DEV') {
                    let userId = results[0].id;
                    ipcRenderer.send('open-course', userId)
                } else if (results[0].position === 'AD') {
                    let userId = results[0].id;
                    ipcRenderer.send('open-admin', userId)
                } else {
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, '../html/register.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                }
            } else {
                html = `Wrong Username or Password`;
                $('#display').text(html);
            }

        } else {

            html = `Wrong Username or Password`;
            $('#display').text(html);
        }
    }
}