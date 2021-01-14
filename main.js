const { app } = require('electron')
const window = require('./lib/window_set');
const { ipcMain } = require('electron');
const init = require('./model/model.js');
let mainWindow


app.on('ready', async function() {
    await init.initialize();
    window.OpenLogin();
})

//action open register from login page
ipcMain.on('open-register', function() {
    window.OpenRegister()
    window.CloseLogin()
})

//action back to login from register
ipcMain.on('back-to-login', function() {
    window.OpenLogin()
    window.CloseRegister()
})

//action open course when login success
ipcMain.on('open-course', (event, userId) => {
    window.OpenCourse(userId)
    window.CloseLogin()
})

//action open admin when login success
ipcMain.on('open-admin', (event, userId) => {
    window.OpenAdmin(userId)
    window.CloseLogin();
})

//action logout from course page
ipcMain.on('out-course', function() {
    window.OpenLogin()
    window.closeCourse()
})

//action logout from admin page
ipcMain.on('out-admin', function() {
    window.OpenLogin()
    window.closeAdmin()
})

//aciton logout from regiser
ipcMain.on('out-register', function() {
    window.OpenLogin()
    window.CloseRegister()
})


ipcMain.on('userid', (event, userId) => {
    event.reply('userid', userId);
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) window.OpenLogin // Sửa luon cả phần này
})