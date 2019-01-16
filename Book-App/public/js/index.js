/* * * * *     Global Variables     * * * * */
let baseUrlLocal = 'http://localhost:3000';
let USER_INFO = 'user_info';
let CURRENT_URL = window.location.href;

/* * * * *     Headers for cross origin issues   * * * * */
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/* * * * *     Event Triggers     * * * * */
$('#btn-login-user').on('click', function () {
    checkBorrowerExists();
}); 
 
$('#btn-register').on('click', function () {
    getRegisterDetails();
});

$('#btn-logout').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('login_info');
	window.location.href = "index.html";
});


if (CURRENT_URL.includes('user_dashboard')) {
    getUser();
}
if (CURRENT_URL.includes('all_books')) {
    loadBooksTable();
}
if (CURRENT_URL.includes('available_books')) {
    loadAvailableBooksTable();
}
if (CURRENT_URL.includes('book_details')) {
    getBookDetails();
}

function checkBorrowerExists() {
    console.log("Function called");
    let data = {
        userEmail: document.getElementById('email').value,
        userPassword: document.getElementById('password').value
    }

    axios.post(baseUrlLocal+'/login',data, {headers: headers})
        .then(response => {
           
            console.log(response.data.info);
            console.log(response.data.info[0]);
            console.log(response.data.info[0].Email);
            if(response.data.success){    
                    let user_info = {
                        userData: response.data.info[0]
                      
                    }
                    console.log(user_info)
                    localStorage.setItem(USER_INFO, JSON.stringify(user_info));  
            
                window.location.href = "user_dashboard.html";
            }else{
                $.notify("Invalid login credentials","warn");
            }
        })
        .catch(error => {
            $.notify("Invalid login credentials","warn");
        
            console.log(error);
        })
}


function getRegisterDetails() {
    let registerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        lno: document.getElementById('lno').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
        
    }   

  

    axios.post(baseUrlLocal + '/register/info/user/' + registerData.lno, registerData, {
            headers: headers
        })
    .then(response => {
        console.log(response);
        if(response.data.success){
            // $.notify("Successfully Registered!","success");
            alert("Successfully Registered!");
            document.getElementById('firstName').value = "";
            document.getElementById('lastName').value = "";
            document.getElementById('lno').value = "";
            document.getElementById('address').value = "";
            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
           
        }else{
            $.notify("User Cannot be Registered!","warn");
            // alert("User Not Registered!")
        }
    })
    .catch(error => {
        console.log(error);
    })

}


function getUser() {
console.log(localStorage.getItem(USER_INFO))
    let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
    let email = userInfo.userData.Email;
    axios.get(baseUrlLocal+'/register/info/user/'+email)
    .then(response => {
        if (response.data.success) {
            let form_details = response.data.data;
            console.log(form_details[0]);
            console.log(form_details[0].FirstName);
            console.log(form_details.length);
            $(document).ready(function () {
                
                var html = "<table  align='center' style='width:1068px' border='1|1' class='table-bordered table-hover'>";
                html+="<head>";
                html+="<tr>";
                html+="<td width='10%'align='center'> "+'<b>'+'First Name'+'</b>'+" </td>";
                html+="<td width='10%'align='center'> "+'<b>'+'Last Name'+'</b>'+" </td>";
                html+="<td width='30%'align='center'> "+'<b>'+'Address'+'</b>'+" </td>";
                html+="<td width='20%'align='center'> "+'<b>'+'License Number'+'</b>'+" </td>";
                html+="<td width='30%'align='center'> "+'<b>'+'Email'+'</b>'+" </td>";
                html+="</tr>";
                html+="</head>";

                html+="<body>";
                html+="<td width='10%'align='center'> "+'<b>'+form_details[0].FirstName+'</b>'+" </td>";
                html+="<td width='10%'align='center'> "+'<b>'+form_details[0].LastName+'</b>'+" </td>";
                html+="<td width='30%'align='center'> "+'<b>'+form_details[0].Address+'</b>'+" </td>";
                html+="<td width='20%'align='center'> "+'<b>'+form_details[0].LicenseNumber+'</b>'+" </td>";
                html+="<td width='30%'align='center'> "+'<b>'+form_details[0].Email+'</b>'+" </td>";

                html+="</body>";

                html+="</table>";
                $("#user-data-table").html(html);
            })
            
        }
    })

    
    .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(JSON.stringify(error));
          console.log(error.response.headers);
        }
    });
}


/***********  View All the Books ******************/

function loadBooksTable() {
    axios.get(baseUrlLocal + '/book/info')
    .then(response => {
        if (response.status == 200) {
            console.log(response.data);
            $('#view-all-books').append(getBookTable('books-table', response.data));
            window.$('#books-table').DataTable();
        }
    })
    .catch(err => {
        console.log(err);
    });
}



function getBookTable(tableId, book) {
        let html =
            '<table class="table table-bordered table-hover" id="'+ tableId +'">' +
            '<thead>' +
            '<tr>' +
            '<th class="text-center" scope="col">ISBN</th>' +
            '<th class="text-center" scope="col">Name of the Book</th>' +
            '<th class="text-center" scope="col">Author</th>' +
            '<th class="text-center" scope="col">Price Per Day</th>' +
            '<th class="text-center" scope="col">Available Date</th>' +
            '<th class="text-center" scope="col">Rented By</th>' +
            '<th class="text-center" scope="col">Status</th>' +
            // '<th class="text-center" scope="col">More Details</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';  
    
        
            book.forEach(request => {
            html +=
                '<tr>'+
                    '<td align="center">' + request.ISBN + '</td>' +
                    '<td align="center">' + request.BookName + '</td>' +
                    '<td align="center">' + request.Author + '</td>' +
                    '<td align="center">' + request.PricePerDay  + '</td>' +
                    '<td align="center">' + request.AvailableDate  + '</td>' +
                    '<td align="center">' + request.RentedBy  + '</td>' +
                    '<td align="center">' + isRented(request.Rented)  + '</td>' +
                    // '<td align="center">' +
                    // '<a href="book_details.html#'+request.ISBN+'"title="" class="btn btn-primary btn-sm">\n' +
                    // '        <span class="far fa-check-square" aria-hidden="true"></span>\n' +
                    // '        <span><strong>View</strong></span></a>'+
                    //  '</a>' +
                    // '</td>' ;
                    
                '</tr>';
        });
    
        html += '</tbody></table>'; 
    
        return html;
    }




    /***********  View Available Books For Rent ******************/

function loadAvailableBooksTable() {
    axios.get(baseUrlLocal + '/book/rent')
    .then(response => {
        if (response.status == 200) {
            console.log(response.data);
            $('#view-available-books').append(getAvailableBookTable('available-books-table', response.data));
            window.$('#available-books-table').DataTable();
        }
    })
    .catch(err => {
        console.log(err);
    });
}



function getAvailableBookTable(tableId, book) {
        let html =
            '<table class="table table-bordered table-hover" id="'+ tableId +'">' +
            '<thead>' +
            '<tr>' +
            '<th class="text-center" scope="col">ISBN</th>' +
            '<th class="text-center" scope="col">Name of the Book</th>' +
            '<th class="text-center" scope="col">Author</th>' +
            '<th class="text-center" scope="col">Price Per Day</th>' +
            '<th class="text-center" scope="col">More Details</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';  
    
        
            book.forEach(request => {
            html +=
                '<tr>'+
                    '<td align="center">' + request.ISBN + '</td>' +
                    '<td align="center">' + request.BookName + '</td>' +
                    '<td align="center">' + request.Author + '</td>' +
                    '<td align="center">' + request.PricePerDay  + '</td>' +
                    '<td align="center">' +
                    '<a href="book_details.html#'+request.ISBN+'"title="" class="btn btn-primary btn-sm">\n' +
                    '        <span class="far fa-check-square" aria-hidden="true"></span>\n' +
                    '        <span><strong>View</strong></span></a>'+
                     '</a>' +
                    '</td>' ;
                    
                '</tr>';
        });
    
        html += '</tbody></table>'; 
    
        return html;
    }

function isRented(request) {
    var badgeClass = '';
    var badgeText = '';

    if(request == 1){
        badgeClass = "badge badge-pill badge-danger";
        badgeText = "Rented";
    }
    
    if(request == 0){
        badgeClass = "badge badge-pill badge-success";
        badgeText = "Available";
    }
  

	return '<h5><span class="' + badgeClass + '"><span style="color:white">' + badgeText + '</span></span></h5>';
}

function getImages() {
        axios.get(baseUrlLocal+'/book/image/'+email)
        .then(response => {
            if (response.data.success) {
                let form_details = response.data.data;
                console.log(form_details[0]);
                console.log(form_details[0].FirstName);
                console.log(form_details.length);
                $(document).ready(function () {
                    
                    var html = "<table  align='center' style='width:1068px' border='1|1' class='table-bordered table-hover'>";
                    html+="<head>";
                    html+="<tr>";
                    html+="<td width='10%'align='center'> "+'<b>'+'First Name'+'</b>'+" </td>";
                    html+="<td width='10%'align='center'> "+'<b>'+'Last Name'+'</b>'+" </td>";
                    html+="<td width='30%'align='center'> "+'<b>'+'Address'+'</b>'+" </td>";
                    html+="<td width='20%'align='center'> "+'<b>'+'License Number'+'</b>'+" </td>";
                    html+="<td width='30%'align='center'> "+'<b>'+'Email'+'</b>'+" </td>";
                    html+="</tr>";
                    html+="</head>";
    
                    html+="<body>";
                    html+="<td width='10%'align='center'> "+'<b>'+form_details[0].FirstName+'</b>'+" </td>";
                    html+="<td width='10%'align='center'> "+'<b>'+form_details[0].LastName+'</b>'+" </td>";
                    html+="<td width='30%'align='center'> "+'<b>'+form_details[0].Address+'</b>'+" </td>";
                    html+="<td width='20%'align='center'> "+'<b>'+form_details[0].LicenseNumber+'</b>'+" </td>";
                    html+="<td width='30%'align='center'> "+'<b>'+form_details[0].Email+'</b>'+" </td>";
    
                    html+="</body>";
    
                    html+="</table>";
                    $("#user-data-table").html(html);
                })
                
            }
        })
    
        
        .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(JSON.stringify(error));
              console.log(error.response.headers);
            }
        });
    }

    // ********** Rent the book************

    function getBookDetails(){
        let isbn=''
        if (CURRENT_URL.includes('#')) {
             isbn = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);
            console.log(isbn);
        }
            axios.get(baseUrlLocal+'/book/info/'+isbn)
           .then(response => {
        if (response.data.success) {
            let form_details = response.data.data;
            console.log(response.data);           
            console.log(form_details[0]);         
            console.log(form_details[0].BookName); 
            console.log(form_details[0].PricePerDay); 
            $("#book-name").append(form_details[0].BookName);  
            $("#description").append(form_details[0].Description);  
            $("#price").val(form_details[0].PricePerDay);  
            $("#ISBN").val(form_details[0].ISBN);  
            $("#author").val(form_details[0].Author);  
        }
        })
    }
