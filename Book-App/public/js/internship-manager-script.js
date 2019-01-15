/* * * * *     Global Variables     * * * * */

let BASE_URL_LOCAL = 'http://localhost:3000';
// let BASE_URL_PROD = 'http://ec2-18-209-163-192.compute-1.amazonaws.com:3000';
let USER_INFO = 'user-info';
let CURRENT_URL = window.location.href;


// change this to baseUrl = baseUrlLocal if you are developing.
let baseUrl = BASE_URL_LOCAL;

/* * * * *     Headers for cross origin issues   * * * * */
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};


/* * * * *     Event Triggers     * * * * */

$('#btn-logout').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem(USER_INFO);
    window.location.href = "index.html";
});




if (CURRENT_URL.includes('internship-manager')) {
    getAllInternships();
}

/**
 * When we come to 
 *          internship-manager-form-i-1.html 
 *          internship-manager-form-i-3.html 
 *          internship-manager-form-i-5.html 
 * following condition satisty and get forms  submitted student
 * @author Tharindu
 */
if (CURRENT_URL.includes('internship-manager-form-i-1')) {
    getFormI1SubmittedStudentList();
}
if (CURRENT_URL.includes('internship-manager-form-i-3')) {
    getFormI3SubmittedStudentList();
}
if (CURRENT_URL.includes('internship-manager-form-i-5')) {
    getFormI5SubmittedStudentList();
}


/**
 * View full detail about student
 */
if (CURRENT_URL.includes('internship-manager-view-form-i-1')) {
    viewFormI1Details();
}
if (CURRENT_URL.includes('internship-manager-view-form-i-3')) {
    viewFormI3Details();
}
if (CURRENT_URL.includes('internship-manager-view-form-i-5')) {
    viewFormI5Details();
}



/* * * * * * * Dashboards * * * * * * */

function getAllInternships() {
    let headerMap = new Map();

    // setting headers and their corresponding json keys.
    headerMap.set('Student ID', 'StudentId');
    headerMap.set('Student Name', 'StudentName');
    headerMap.set('Internship Start', 'InternshipStart');
    headerMap.set('Internship End', 'InternshipEnd');
    headerMap.set('Forms', '-');

    axios.get(baseUrl + '/forms/form-i-1')
        .then(response => {
            if (response.data.success) {
                console.log(response.data.data);
                let table = renderInternshipsTable(response.data.data);
                $('#internships-table').append(table);
            }
        })
}

/*
 * this will render the internships manager's dashboard.
 * 
 * @param columnMap:
 *      a map where the key is the column name and the value is the key of the json data,
 *      that is relevant to the column.
 *      
 */
function renderInternshipsTable(jsonData) {

    let table = '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '<th> Student ID </th>' +
        '<th> Student Name </th>' +
        '<th> Internship Start </th>' +
        '<th> Internship End </th>' +
        '<th> Forms </th>' +
        '<tr>' +
        '<thead>' +
        '<tbody>';

    // iterate through each student's form i-1.
    jsonData.forEach(form => {
        table += '<tr>' +
            '<td>' + form.StudentId + '</td>' +
            '<td>' + form.StudentName + '</td>' +
            '<td>' + (form.InternshipStart == undefined ? '<span class="badge badge-danger">Pending Form I-1 | Supervisor</span>' : form.InternshipStart.split('T')[0]) + '</td>' +
            '<td>' + (form.InternshipEnd == undefined ? '<span class="badge badge-danger">Pending Form I-1 | Supervisor</span>' : form.InternshipEnd.split('T')[0]) + '</td>' +
            // the reason dates are split by 'T' is that the full date we get looks like 2018-09-10T00:00:00 but we only need the date and not the time.
            '<td>' +
            '<a href="form-i-1.html#' + form.StudentId + '">Form I-1</a> <br>' +
            '<a href="form-3.html#' + form.StudentId + '">Form I-3</a> <br>' +
            '<a href="form-5.html#' + form.StudentId + '">Form I-5</a> <br>' +
            '</td>' +
            '<tr>';
    });
    table += '</tbody></table>';

    return table;
}



/**
 * Form Loading functions
 * @author Tharindu
 */
function getFormI1SubmittedStudentList() {
    axios.get(baseUrl + '/forms/form-i-1')
        .then(response => {
            if (response.data.success) {
                let form_details = response.data.data;
                console.log(form_details);

                $("#form-i-1-submitted-students-list tbody").empty();
                form_details.forEach(item => {
                    var html = '<tr>';
                    html += '<td class="text-center">' + item.StudentId + '</td>';
                    html += '<td class="text-center">' + item.StudentName + '</td>';
                    html += '<td class="text-center">' + item.StudentAddress + '</td>';
                    html += '<td class="text-center">' + item.StudentMobilePhone + '</td>';
                    html += '<td class="text-center">' + generateFormI1UpdatedStatus(item.hasOwnProperty('EmployerName')) + '</td>';
                    html += '<td class="text-center">';
                    html += '<a href="internship-manager-view-form-i-1.html#' + item.StudentId + '" title="View ' + item.StudentId + '\'s Form I-1" class="btn btn-primary btn-sm">\n';
                    html += '        <span class="far fa-eye" aria-hidden="true"></span>\n';
                    html += '        <span><strong>View</strong></span></a>';
                    html += '</td>';
                    html += '</tr>';


                    $('#form-i-1-submitted-students-list tbody').append(html);


                });
            }
        }).catch(function (error) {
            if (error.response) {
                console.log(JSON.stringify(error));
            }
        });
}

/**
 * This function get the details about form i 3
 * submitted student details
 * @author Tharindu 
 */
function getFormI3SubmittedStudentList() {
    axios.get(baseUrl + '/form3/all')
        .then(response => {
            if (response.data.success) {
                let form_details = response.data.data;
                console.log(form_details);

                $("#form-i-3-submitted-students-list tbody").empty();
                form_details.forEach(item => {
                    var html = '<tr>';
                    html += '<td class="text-center">' + item.StudentId + '</td>';
                    html += '<td class="text-center">' + item.StudentName + '</td>';
                    html += '<td class="text-center">' + item.StudentAddress + '</td>';
                    html += '<td class="text-center">' + item.StudentPhone + '</td>';
                    html += '<td class="text-center">';
                    html += '<a href="internship-manager-view-form-i-3.html#' + item.StudentId + '" title="View ' + item.StudentId + '\'s Form I-1" class="btn btn-primary btn-sm">\n';
                    html += '        <span class="far fa-eye" aria-hidden="true"></span>\n';
                    html += '        <span><strong>View</strong></span></a>';
                    html += '</td>';
                    html += '</tr>';

                    $('#form-i-3-submitted-students-list tbody').append(html);
                });
            }
        }).catch(function (error) {
            if (error.response) {
                console.log(JSON.stringify(error));
            }
        });
}


/**
 * Here we get form i-5 sumbitted student details
 * @author Tharindu
 */
function getFormI5SubmittedStudentList() {
    axios.get(baseUrl + '/form5/all')
        .then(response => {
            if (response.data.success) {
                let form_details = response.data.data;
                console.log(form_details);

                $("#form-i-5-submitted-students-list tbody").empty();
                form_details.forEach(item => {
                    var html = '<tr>';
                    html += '<td class="text-center">' + item.StudentId + '</td>';
                    html += '<td class="text-center">' + item.StudentName + '</td>';
                    html += '<td class="text-center">' + item.EmployerName + '</td>';
                    html += '<td class="text-center">' + item.SupervisorName + '</td>';
                    html += '<td class="text-center">';
                    html += '<a href="internship-manager-view-form-i-5.html#' + item.StudentId + '" title="View ' + item.StudentId + '\'s Form I-1" class="btn btn-primary btn-sm">\n';
                    html += '        <span class="far fa-eye" aria-hidden="true"></span>\n';
                    html += '        <span><strong>View</strong></span></a>';
                    html += '</td>';
                    html += '</tr>';

                    $('#form-i-5-submitted-students-list tbody').append(html);
                });
            }
        }).catch(function (error) {
            if (error.response) {
                console.log(JSON.stringify(error));
            }
        });
}



/**
 * Display form I-3 Basic details and
 * Internship details
 * And also you can see daily diary details
 * @author Tharindu 
 */
function viewFormI1Details() {
    if (CURRENT_URL.includes('#')) {
        let studentId = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);

        axios.get(baseUrl + '/forms/form-i-1/student/' + studentId)
            .then(response => {
                if (response.data.success) {
                    let form_details = response.data.data;
                    console.log(form_details);
                    console.log(form_details['StudentName']);

                    $('#name-student').val(form_details['StudentName']);
                    $('#id-student').val(form_details['StudentId']);
                    $('#address-student').val(form_details['StudentAddress']);
                    $('#home-phone-student').val(form_details['StudentHomePhone']);
                    $('#mobile-phone-student').val(form_details['StudentMobilePhone']);
                    $('#cgpa-student').val(form_details['CGPA']);
                    $('#emails-student').val(form_details['StudentEmails'].join(', ').replace('[').replace(']'));
                    $('#year-student').val(form_details['Year']);
                    $('#semester-student').val(form_details['Semester']);

                    $("#header-studentId").text(form_details['StudentId']);

                    // iterate through each input element and feed the above data, but keep the text boxes disabled.let elems = $('#form-i-1-student').find(':input');
                    let elems = $('#form-i-1-student').find(':input');
                    for (let i = 0; i < elems.length; i++) {
                        elems[i].innerHTML
                        elems[i].disabled = true;
                    }

                    if (form_details.hasOwnProperty('EmployerName')) {
                        $('#name-employer').val(form_details['EmployerName']);
                        $('#address-employer').val(form_details['EmployerAddress']);
                        $('#name-supervisor').val(form_details['SupervisorName']);
                        $('#title-supervisor').val(form_details['SupervisorTitle']);
                        $('#phone-supervisor').val(form_details['SupervisorPhone']);
                        $('#email-supervisor').val(form_details['SupervisorEmail']);
                        $('#internship-start-date').val(formatDate(form_details['InternshipStart']));
                        $('#internship-end-date').val(formatDate(form_details['InternshipEnd']));
                        $('#no-of-hours').val(form_details['WorkHoursPerWeek']);

                        let inputElems = $('#form-i-1-supervisor').find(':input');

                        for (let j = 0; j < inputElems.length; j++) {
                            inputElems[j].innerHTML
                            inputElems[j].disabled = true;
                        }
                    } else {
                        $("#supervisor-card-view").hide();
                    }
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(JSON.stringify(error));
                }
            });
    }
}



function viewFormI3Details() {
    if (CURRENT_URL.includes('#')) {
        let studentId = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);

        /**
         * Display basic details of form i-3
         */
        axios.get(baseUrl + '/form3/form-i-3/' + studentId)
            .then(response => {
                if (response.data.success) {
                    let form_details = response.data.data[0];
                    console.log(form_details);
                    $("#form-i3-student-details tbody").empty();
                    $("#form-i3-intern-details tbody").empty();
                    $("#header-studentId").text(form_details.StudentId);

                    var html = '<tr class="table-info">';
                    html += '<td class="text-center">' + form_details.StudentId + '</td>';
                    html += '<td class="text-center">' + form_details.StudentName + '</td>';
                    html += '<td class="text-center">' + form_details.StudentAddress + '</td>';
                    html += '<td class="text-center">' + form_details.StudentPhone + '</td>';
                    html += '<td class="text-center">' + form_details.StudentEmails.join(', ').replace('[').replace(']') + '</td>';
                    html += '</tr>';

                    var internHtml = '<tr class="table-info">';
                    internHtml += '<td class="text-center">' + form_details.Specialization + '</td>';
                    internHtml += '<td class="text-center">' + form_details.InternshipTitle + '</td>';
                    internHtml += '<td class="text-center">' + form_details.From + '</td>';
                    internHtml += '<td class="text-center">' + form_details.To + '</td>';
                    internHtml += '</tr>';

                    $('#form-i3-student-details tbody').append(html);
                    $('#form-i3-intern-details tbody').append(internHtml);
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(JSON.stringify(error));
                }
            });

        /**
         * Dispaly daily diary details about student
         */
        axios.get(baseUrl + '/form3/data/' + studentId)
            .then(response => {
                if (response.data.success) {
                    let form_details = response.data.data;
                    console.log(form_details);
                    $("#daily-diary-details tbody").empty();
                    form_details.forEach(item => {
                        var html = '<tr>';
                        html += '<td class="text-center">' + item.TrainingParty + '</td>';
                        html += '<td class="text-center">' + item.TrainingDescription + '</td>';
                        html += '<td class="text-center">' + item.From + '</td>';
                        html += '<td class="text-center">' + item.To + '</td>';
                        html += '</tr>';

                        $('#daily-diary-details tbody').append(html);
                    });


                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(JSON.stringify(error));
                }
            });
    }
}





function viewFormI5Details() {
    if (CURRENT_URL.includes('#')) {
        let studentId = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);
        axios.get(baseUrl + '/form5/data/' + studentId)
            .then(response => {
                if (response.data.success) {
                    let form_details = response.data.data[0];
                    console.log(form_details);

                    let inputElems = $('#form-i5-body').find(':input');

                    for (let j = 0; j < inputElems.length; j++) {
                        inputElems[j].innerHTML
                        inputElems[j].disabled = true;
                    }


                    $('#id-student').val(form_details.StudentId);
                    $('#name-student').val(form_details.StudentName);
                    $('#employee-name').val(form_details.EmployerName);
                    $('#supervisor-name').val(form_details.SupervisorName);
                    // $('#diff').val(form_details.StudentId);

                    $('#volume-of-work').append(getPerformance(form_details.VolumeOfWork));
                    $('#analytical-ability').append(getPerformance(form_details.AnalyticalAbility));
                    $('#resolve-problem').append(getPerformance(form_details.AbilityToResolve));

                    $('#accuracy').append(getPerformance(form_details.Accuracy));
                    $('#pressure').append(getPerformance(form_details.Pressure));
                    $('#oral-communication').append(getPerformance(form_details.Oral));

                    $('#Written-communication').append(getPerformance(form_details.Written));
                    $('#critical-thinking').append(getPerformance(form_details.Thinking));
                    $('#ability-to-learn').append(getPerformance(form_details.Learn));


                    $('#tt').val(form_details.Positive);
                    $('#rr').val(form_details.Personal);
                    $('#ee').val(form_details.Needs);
                    $('#ww').val(form_details.Suggest);
                    $('#qq').val(form_details.Appropriateness);
                    $('#aa1').val(form_details.Other);

                    $('#overall-performance').append(getOverallPerformance(form_details.Overall));

                    $('#sup-name').val(form_details.External);
                    $('#date1').val(formatDate(form_details.Date));




                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(JSON.stringify(error));
                }
            });
    }
}



/*** REUSABLE FUNCTION ****/

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function generateFormI1UpdatedStatus(isSubmitted) {
    var badgeClass = (isSubmitted) ? "badge badge-pill badge-success" : "badge badge-pill badge-danger";
    var badgeText = (isSubmitted) ? "Fully Submitted" : "Supervisor Not Updated";

    return '<h5><span class="' + badgeClass + '"><span style="color:white">' + badgeText + '</span></span></h5>';
}

function getPerformance(value) {
    let badgeText;
    let badgeClass;
    if (value == 3) {
        badgeText = 'Above Average';
        badgeClass = 'badge badge-pill badge-success';
    } else if (value == 2) {
        badgeText = 'Average';
        badgeClass = 'badge badge-pill badge-primary';
    } else if (value == 1) {
        badgeText = 'Below Average';
        badgeClass = 'badge badge-pill badge-danger';
    }

    return '<h5><span class="' + badgeClass + '"><h6>' + badgeText + '</h6></span></h5>';
}


function getOverallPerformance(value) {
    let badgeText;
    let badgeClass;
    if (value == 5) {
        badgeText = 'Outstanding';
        badgeClass = 'badge badge-pill badge-success';
    } else if (value == 4) {
        badgeText = 'Very Good';
        badgeClass = 'badge badge-pill badge-success';
    } else if (value == 3) {
        badgeText = 'Good';
        badgeClass = 'badge badge-pill badge-primary';
    } else if (value == 2) {
        badgeText = 'Marginal';
        badgeClass = 'badge badge-pill badge-primary';
    } else if (value == 1) {
        badgeText = 'Unsatisfactory';
        badgeClass = 'badge badge-pill badge-danger';
    }
    return '<h5><span class="' + badgeClass + '"><h4>' + badgeText + '</h4></span></h5>';
}