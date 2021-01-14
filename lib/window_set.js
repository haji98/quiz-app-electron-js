// Trang này dùng để chuyển của sổ
// Thay vì viết hết vào trang main.js thì viết vô trang này

const { BrowserWindow } = require('electron')
const path = require('path');
const url = require('url');

ctx = {
    loginWindow: null,
    registerWindow: null,
    courseWindow: null,
    questionWindow: null,
    adminWindow: null
}

module.exports = {
    OpenLogin() {
        ctx.loginWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Login",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.loginWindow.setMenu(null)

        ctx.loginWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/login/login.html'),
            protocol: 'file',
            slashes: true
        }));

        ctx.loginWindow.on('closed', function() {
            mainWindow = null
        })

        ctx.loginWindow.openDevTools();
    },

    OpenCourse(userId) {
        ctx.courseWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Courses",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.courseWindow.setMenu(null)
        let appDir = __dirname.substring(0, __dirname.length - 4);
        ctx.courseWindow.loadURL(`${appDir}/views/course/course.html?userId=${userId}`);

        ctx.courseWindow.on('closed', function() {
            mainWindow = null
        })

        ctx.courseWindow.openDevTools();
    },

    OpenRegister() {
        ctx.registerWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Resgister",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.registerWindow.setMenu(null)

        ctx.registerWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/register/register.html'),
            protocol: 'file',
            slashes: true
        }));

        ctx.registerWindow.on('closed', function() {
            mainWindow = null
        })

        ctx.registerWindow.openDevTools();
    },

    OpenQuestion() {
        ctx.questionWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Question",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.questionWindow.setMenu(null)

        ctx.questionWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/question/index.html'),
            protocol: 'file',
            slashes: true
        }));

        ctx.questionWindow.on('closed', function() {
            ctx.questionWindow = null
        })

        ctx.questionWindow.openDevTools();
    },


    OpenAdmin(userId) {
        ctx.adminWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Admin System",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.adminWindow.setMenu(null)
        let appDir = __dirname.substring(0, __dirname.length - 4);
        ctx.adminWindow.loadURL(`${appDir}/views/admin/index.html?userId=${userId}`);

        ctx.adminWindow.on('closed', function() {
            ctx.adminWindow = null
        })

        ctx.adminWindow.openDevTools();
    },

    OpenTest() {
        ctx.adminWindow = new BrowserWindow({
            width: 1200,
            center: true,
            resizable: false,
            title: "Admin System",
            webPreferences: {
                nodeIntegration: true
            }
        })

        ctx.adminWindow.setMenu(null)
        ctx.adminWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../views/admin/index.html'),
            protocol: 'file',
            slashes: true
        }));

        ctx.adminWindow.on('closed', function() {
            ctx.adminWindow = null
        })

        ctx.adminWindow.openDevTools();
    },

    CloseLogin() {
        ctx.loginWindow.close();
    },

    CloseRegister() {
        ctx.registerWindow.close();
    },

    closeCourse() {
        ctx.courseWindow.close();
    },

    closeAdmin() {
        ctx.adminWindow.close();
    },
}