const { remote } = require('electron');
const $ = require('jquery')
const ipcRenderer = require('electron').ipcRenderer;
let model = remote.require('./model/model.js');
let logout = document.querySelector('.logout');

logout.addEventListener('click', function() {
    ipcRenderer.send('out-course');

});
let ctx = {
    userId: null
}
async function viewHandler(event, userId, courseId) {
    event.preventDefault();
}

//call function getCourse from Model
async function getCourse() {
    let courses = await model.getCourse();
    return courses;
}

//call function getUserCourse from Model
async function getUserCourse(userId, courseId) {
    let userCourses = await model.getUserCourse(userId, courseId);
    return userCourses;
}

//call function insertResult from Model
async function insertResult(userId, courseId, status) {
    let result = await model.insertResult(userId, courseId, status);
    return result;
}

//action when load course page
(async function loadCourse() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let userid = url.searchParams.get("userId");
    ctx.userId = userid;
    console.log(ctx.userId);
    let status = 0;

    // let resultUserCourse = await getUserCourse();
    let results = await getCourse();
    //load course from database
    for (let i = 0; i < results.length; i++) {
        let ul = document.getElementById('content');
        // console.log(results[i].valid);
        let html = "";
        if (results[i].valid === 1) {
            //if course is valid
            html = ` <li>
            <div class="thumbnail">
            <img src="https://i.imgur.com/MQB99sg.jpg" alt="" />
            </div>
            <div class="caption">
            <h2>${results[i].name}</h2>
            <p>${results[i].descript}</p>
            <button id="view-${results[i].id}">View</button>
            </div></li>
            `;
            $('#content').append(html);

            let resultUserCourse = await getUserCourse(ctx.userId, results[i].id);
            let check = resultUserCourse.length;
            document.querySelector(`#view-${results[i].id}`).addEventListener('click', async function(e) {
                viewHandler(e, ctx.userId, results[i].id)
                console.log(resultUserCourse.length);
                if (resultUserCourse.length === 0 && check === 0) {
                    check++;
                    await insertResult(ctx.userId, results[i].id, status);
                }
            });
            console.log('event-added');
        } else {
            //if course is innvalid
            html = ` <li>
            <div class="thumbnail">
            <img src="https://i.imgur.com/MQB99sg.jpg" alt="" />
            </div>
            <div class="caption">
            <h2 class="invalid">${results[i].name}</h2>
            <p>${results[i].descript}</p>
            </div></li>
            `;
            $('#content').append(html);

        }
    }
})();