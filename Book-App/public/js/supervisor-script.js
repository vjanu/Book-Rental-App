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




if (CURRENT_URL.includes('supervisor-student-list')) {
    loadSupervisorStudentList();
}


function loadSupervisorStudentList() {
    if (!(USER_INFO in localStorage)) {
        window.location.href = "index.html";
    } else {
        let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];

        axios.get(baseUrl + '/supervisor/form-i-1/' + userInfo.userData.SupervisorEmail)
            .then(function (response) {
                // handle success
                // console.log(response.data);

                $("#form-i-1-submitted-students tbody").empty();

                response.data.data.forEach(item => {
                    var html = '<tr>';
                    html += '<td class="text-center">' + item.StudentId + '</td>';
                    html += '<td class="text-center">' + item.StudentName + '</td>';
                    html += '<td class="text-center">' + item.StudentAddress + '</td>';
                    html += '<td class="text-center">' + item.StudentMobilePhone + '</td>';
                    html += '<td class="text-center">' + generateFormI1UpdatedStatus(item.hasOwnProperty('EmployerName')) + '</td>';
                    html += '<td class="text-center">';
                    html += '<a href="supervisor-submission-form.html#' + item.StudentId + '" title="View ' + item.StudentId + '\'s Form I-1" class="btn btn-primary btn-sm">\n';
                    html += '        <span class="far fa-eye" aria-hidden="true"></span>\n';
                    html += '        <span><strong>View</strong></span></a>';
                    html += '</td>';
                    html += '</tr>';

                    $('#form-i-1-submitted-students tbody').append(html);
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
}


/* * * * *     COMMON FUNCTION     * * * * */

function generateFormI1UpdatedStatus(isSubmitted) {
    var badgeClass = (isSubmitted) ? "badge badge-pill badge-success" : "badge badge-pill badge-danger";
    var badgeText = (isSubmitted) ? "Submitted" : "Pending";

    return '<h5><span class="' + badgeClass + '"><span style="color:white">' + badgeText + '</span></span></h5>';
}