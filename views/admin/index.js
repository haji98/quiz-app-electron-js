const { remote } = require('electron');
const $ = require('jquery');
let model = remote.require('./model/model.js');
const ipcRenderer = require('electron').ipcRenderer;

var ctx = {
    courseId: null,
    questionId: null,
    answerId: null,
    userId: null,
}

// Tab Link
$(function() {
    var active = "tabLink",
        wrapper = ".tabMn",
        heading = "tabTh";
    $('<h2></h2>', {
        class: heading + ' tabmobile',
    }).insertBefore(wrapper);
    $(".tabList a").each(function() {
        var tab = $(this).attr("href");
        $(this).clone().appendTo($(tab).prev($('.' + heading)));
    });
    $(".tabList a").click(function(event) {
        event.preventDefault();
        $(this).addClass(active);
        $(this).parent().siblings().children().removeClass(active);
        var tab = $(this).attr("href");
        $(wrapper).not(tab).css("display", "none").removeClass('active');
        $(tab).fadeIn().addClass('active');

        $(".tabList a").each(function() {
            var tab = $(this).attr("href");
            $(this).clone().appendTo($(tab).prev($('.' + heading)));
        });
        $('.' + heading + ' a').prev().remove();
    });
    $(document).on('click', '.tabTh a', function(e) {
        e.preventDefault();
        if (!$(this).hasClass(active)) {
            $(this).addClass(active);
            $(this).parent().siblings('.' + heading).children().removeClass(active);
            $(this).parent().next().slideDown();
            $(this).parent().next().siblings(wrapper).slideUp();
        } else {
            $(this).removeClass(active);
            $(this).parent().next().slideUp();
        }
    });
    if ($(window).width() >= 768) {
        $(".tabList  a.tabLink").each(function() {
            var tab = $(this).attr("href");
            $(tab).fadeIn();
            $(tab).siblings().hide();
        });
    }
    $(".alert").hide();
    admin();
    load();
    search();
    combobox();
    showAnswer();
});

// Get information of admin
async function admin() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let userid = url.searchParams.get("userId");
    ctx.userId = userid;
    let results = await model.getUserByID(ctx.userId);
    if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            $('.main-name').text(results[i].username);
            $('.second-name').text(results[i].email);
        }
    }
}

// -------------Courses Page------------- //
// Get all course
async function load() {
    let results = await model.getAllCourse();
    let html = '';
    if (results.length > 0) {
        $(".data").html("");
        for (let i = 0; i < results.length; i++) {
            if (results[i].valid == 1) {
                results[i].valid = "Active";
            } else {
                results[i].valid = "Inactive";
            }
            html += `<tr ng-repeat="user in users"><td hidden>${results[i].id}</td><td>${results[i].name}</td><td>${results[i].descript}</td>
                        <td>${results[i].valid}</td><td>${results[i].total_time}</td>
                        <td><button class="editb" data-toggle="modal" data-target="#editModal">&#9783</button></td>
                        <td><button class="deleteb" data-toggle="modal" data-target="#deleteModal">&#x232b</button></td>`;
        }
    }
    $(".data").append(html);

    // Delete button
    $(".data tr").click(function() {
        ctx.courseId = $(this).find('td:first').text();
        $("#deletebtn").click(function() {
            Delete();
        });
    });

    // Update button
    $(".editb").click(function() {
        ctx.courseId = $(this).closest("tr").find('td:first').text();
        getdata();
    });
}

// Search courses
function search() {
    $('.open-button').click(function() {
        $('.search').addClass('active');
        $('.overlay').removeClass('hidden');
        $('input').focus();
    });

    $('.overlay').click(function() {
        $('.search').removeClass('active');
        $(this).addClass('hidden');
    });
    $(".search-bar").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".data tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}

// Create a new course
async function save() {
    let name = $("#name").val();
    let descript = $("#descript").val();
    let valid;
    if ($('#valid').is(":checked")) {
        valid = 1;
    } else {
        valid = 0;
    }
    let total_time = $("#total_time").val();
    let result = await model.getCoursebyName(name);
    if (result.length > 0) {
        $("#alertCourse").text("Username already exists");
        $(".alert").hide().slideDown().delay(5000).fadeOut();
    } else {
        await model.insertCourse(name, descript, valid, total_time);
        load();
        $("#alertCourse").text("Create successful!");
        $(".alert").hide().slideDown().delay(5000).fadeOut();
    }
    combobox();
}

// Update a course
async function getdata() {
    let result = await model.getCoursebyID(ctx.courseId);
    if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            $("#nname").val(result[i].name);
            $("#ndescript").val(result[i].descript);
            if (result[i].valid == 1) {
                $('#nvalid').prop("checked", true);
            } else {
                $('#nvalid').prop("checked", false);
            }
            $("#ntotal_time").val(result[i].total_time);
        }
    }
    $("#updatebtn").click(function() {
        update(ctx.courseId);
        combobox();
    });
}

async function update() {
    let name = $("#nname").val();
    let descript = $("#ndescript").val();
    let valid;
    if ($('#nvalid').is(":checked")) {
        valid = 1;
    } else {
        valid = 0;
    }
    let total_time = $("#ntotal_time").val();

    await model.updateCourse(name, descript, valid, total_time, ctx.courseId);
    load();
    $("#alertCourse").text("Update Success!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}

// Delete a course
async function Delete() {
    await model.deleteCourse(ctx.courseId);
    load();
    combobox();
    $("#alertCourse").text("Delete Success!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}
// ============= END Courses Page ============= //

// ------------- Question Page ------------- //

// Load combobox
async function combobox() {
    let results = await model.getAllCourse();
    if (results.length > 0) {
        $('.course').html('<li data-value="All">All</li>');
        $('#course').text("");
        $('#ncourse').text("");
        for (let i = 0; i < results.length; i++) {
            $('.course').append('<li data-value="' + results[i].name + '">' + results[i].name + '</li>');
            $('#course').append('<option value="' + results[i].id + '">' + results[i].name + '</option>');
            $('#ncourse').append('<option value="' + results[i].id + '">' + results[i].name + '</option>');
        }
    }
    $('.combobox').each(function() {
        var $ul = $(this).find('ul'),
            $li = $(this).find('li'),
            $input = $(this).find('input[type="text"]'),
            $value = 'All';
        $input.val($value);
        loadQuestion($value);
        $ul.hide();
        $li.click(function() {
            $value = $(this).data('value');
            $input.val($value);
            $ul.slideToggle();
            loadQuestion($value);
        });
    });
}

$('.combobox').each(function() {
    var $ul = $(this).find('ul'),
        $button = $(this).find('button');
    $ul.hide();
    $button.click(function() {
        $ul.slideToggle();
    });
});

// Show question
async function loadQuestion(value) {
    let results = await model.getAllQuestion(value);
    let html = '';
    $(".question").html("");
    if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            html += `<tr ng-repeat="user in users" data-toggle="modal" data-target="#answerModel"><td>${results[i].id}</td><td>${results[i].content}</td>
                <td>${results[i].category}</td><td>${results[i].type}</td></tr>`;
        }
    }
    $(".question").append(html);

    // Show answer
    $(".question tr").click(function() {
        ctx.questionId = $(this).find('td:first').text();
        showAnswer();

        //Add answer of the question
        $("#addAnswerbtn").click(function() {
            addAnswer();
        });
        // Delete button
        $("#deletequestionbtn").click(function() {
            deleteQuestion();
        });
        // Update button
        $("#edit-question-btn").click(function() {
            getQuestion();
            $("#updatequestionbtn").click(function() {
                updateQuestion();
            });
        });
        // Set correct answer
        $("#correctanswer").click(function() {
            setCorrectAnswer();
        })
    });
}

// Create question
async function createQuestion() {
    let content = $("#qcontent").val();
    let category = $("#qcategory").val();
    let type = $("#type option:selected").val();
    let courseID = $("#course option:selected").val();
    let course = $("#course option:selected").text();
    await model.insertQuestion(category, type, content, courseID);
    loadQuestion(course);
    $('.combobox input[type="text"]').val(course);
    $("#alertQuestion").text("Create successful!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}

// Get Answer 
async function getAnswers() {
    let results = await model.getAnswers(ctx.questionId);
    let question;
    let html = '';
    if (results.length > 0) {
        $(".theAnswer").html("");
        for (let i = 0; i < results.length; i++) {
            // Correct answer
            question = results[i].question;
            let result = await model.getCorrectAnswers(ctx.questionId);
            var correctId = result[0]["correctId"].split(',')
            console.log("correctId[i] = " + correctId[i]);
            console.log("results[i].id = " + results[i].id);
            if (results[i].id == null) {
                html = `<div class="form-group"><label class="control-label col-sm-2"></label>
            <div><span class="selected-wrong"><strong>No answer yet. Add answers to questions!</strong></span></div></div>`;
            } else {
                if (correctId[i] == results[i].id) {
                    html += `<tr><td><div class="form-check"><label class="form-check-label">
                        <input type="checkbox" class="form-check-input" name="checkbox" value="${results[i].id}"><span hidden>${results[i].id}</span></label></div></td>
                        <td><span class="selected-correct"><i class="fa fa-check"></i></span></td>
                        <td><span class="selected-correct">${results[i].answer}</span></td>
                        <td><button class="btn btn-primary" data-toggle="modal" type="button" data-target="#editAnswer">Edit</button></td>
                        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#deleteAnswer">Delete</button></td></tr>`;
                    console.log("results[i].id correct = " + results[i].id)
                } else {
                    console.log("results[i].id wrong = " + results[i].id)
                    html += `<tr><td><div class="form-check"><label class="form-check-label">
                        <input type="checkbox" class="form-check-input" name="checkbox" value="${results[i].id}"><span hidden>${results[i].id}<span></label></div></td>
                        <td><span class="selected-wrong"><i class="fa fa-times"></i></span></td>
                        <td><span class="selected-wrong">${results[i].answer}</span></td>
                        <td><button class="btn btn-primary" data-toggle="modal" type="button" data-target="#editAnswer">Edit</button></td>
                        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#deleteAnswer">Delete</button></td></tr>`;
                }
            }
        }
    }
    $("#question").text(question);
    $(".theAnswer").append(html);

    // Edit the answer
    $(".theAnswer tr").click(function() {
        ctx.answerId = $(this).find('td:first').text();
        editAnswer();
    });
}


// Show answer
async function showAnswer() {
    getAnswers();

    // Delete the answer
    $("#deleteanswerbtn").click(function() {
        deleteAnswer();
    });
}

// Delete a question
async function deleteQuestion() {
    await model.deleteQuestion(ctx.questionId);
    loadQuestion("");
    $("#alertQuestion").text("Delete this Question is Success!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}

// Get data of Question to edit
async function getQuestion() {
    let results = await model.getAnswers(ctx.questionId);
    if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            $("#nqcontent").val(results[i].question);
            $("#nqcategory").val(results[i].category);
            $("#ntype").val(results[i].type);
            $("#ncourse").val(results[i].courseId);
        }
    }
}

// Update Question
async function updateQuestion() {
    let content = $("#nqcontent").val();
    let category = $("#nqcategory").val();
    let type = $("#ntype option:selected").val();
    let courseID = $("#ncourse option:selected").val();

    await model.updateQuestion(category, type, content, courseID, ctx.questionId);
    let course = $("#ncourse option:selected").text();
    loadQuestion(course);
    $('.combobox input[type="text"]').val(course);
    $("#alertQuestion").text("Update Success!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}

// Add the answer for question
async function addAnswer() {
    let content = $('#addanswer').val();
    await model.insertAnswer(content, ctx.questionId);
    getAnswers();
    $("#alertQuestion").text("Add a successful answer!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();

}

// Edit the answer for question
async function editAnswer() {
    // Get data to input
    let results = await model.getAnswerbyID(ctx.answerId);
    $('#answer').val(results[0].content);
}

$('#saveAnswer').on('click', async() => {
    let content = $('#answer').val();
    await model.updateAnswer(content, ctx.answerId);
    getAnswers();
    $("#alertQuestion").text("Update a successful answer!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
});
// Delete the answer
async function deleteAnswer() {
    await model.deleteAnswer(ctx.answerId);
    getAnswers();
    $("#alertQuestion").text("Delete the answer is successful!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}

// Set correct answer for question
async function setCorrectAnswer() {
    var correct = [];
    $.each($("input[name='checkbox']:checked"), function() {
        correct.push($(this).val());
    });
    correct = correct.join(",");
    await model.updateCorrectAnswer(correct, ctx.questionId);
    getAnswers();
    $("#alertQuestion").text("Update correct answer is successful!");
    $(".alert").hide().slideDown().delay(5000).fadeOut();
}
// ============= END Question Page ============= //

// ------------- Report Page ------------- //
async function getUserPassed(id) {
    let users = '';
    let user = await model.getUserPassed(id);
    for (let i = 0; i < user.length; i++) {
        if (i == (user.length - 1)) {
            users += `${i + 1}: ${user[i].fullname}`;
        } else {
            users += `${i + 1}: ${user[i].fullname}\n`;
        }
    }
    return users;
}
async function barChart() {
    let course = await model.getAllCourse();
    let label = '';
    let data = '';
    let users = '';
    if (course.length > 0) {
        for (let i = 0; i < course.length; i++) {
            let report = await model.getCountCourse(course[i].id);
            let pass = await model.getCountPass(course[i].id);
            let percent = pass[0].count / report[0].count * 100;
            if (isNaN(percent)) {
                percent = 0;
            }

            getUserPassed(course[i].id).then(function(value) {
                users += value + '\n ';
            });
            if (i == (course.length - 1)) {
                label += `${course[i].name}`;
                data += `${percent.toFixed(2)}`
            } else {
                label += `${course[i].name},`;
                data += `${percent.toFixed(2)},`
            }
        }
        label = label.split(",");
        data = data.split(",");
        users = users.split("\n ");

        var chart = $("#barChart")[0].getContext('2d');
        var chartData = {
            labels: label,
            datasets: [{
                label: '# % of people have passed the course',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                infor: users,
            }],

        };

        if (chart) {
            new Chart(chart, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    tooltips: {
                        mode: 'label',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = ' Passed';
                                if (label) {
                                    label += ': ';
                                }
                                label += Math.round(tooltipItem.yLabel * 100) / 100 + '%';
                                return label;
                            },
                            afterLabel: function(tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].infor[tooltipItem.index];
                                return label;
                            },
                        }
                    }
                }
            });
        }
    }
}

$(".report").click(function() {
    barChart();
});


// ============= END Report Page ============= //

// ------------- Logout ------------- //

$(".logout").click(function() {
    ipcRenderer.send('out-admin');
});

// ============= END Logout ============= //