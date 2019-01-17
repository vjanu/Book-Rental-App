/* * * * *     Global Variables     * * * * */
let baseUrlLocal = 'http://localhost:3000';
let USER_INFO = 'user_info';
let CURRENT_URL = window.location.href;
let pricePerDay;

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

function initiateDatePickers(){
 $( function() {
    $('#datepicker1').datepicker({ dateFormat: 'yy-mm-dd' ,
     minDate: 0,
     onSelect: function(date){

        var selectedDate = new Date(date);
        var msecsInADay = 86400000;
        var endDate = new Date(selectedDate.getTime() + msecsInADay);

       //Set Minimum Date of EndDatePicker After Selected Date of StartDatePicker
        $("#datepicker2").datepicker( "option", "minDate", endDate );
      
    }

  }).val();
 } );

    $( function() {
        
        $('#datepicker2').datepicker({ dateFormat: 'yy-mm-dd' ,
    
        onSelect: function(date){
        var from = $('#datepicker1').val();
        var to = $('#datepicker2').val();

        // end - start returns difference in milliseconds 
        var diff = new Date(Date.parse(to) - Date.parse(from))
        console.log(diff);
        // get days
        var days = diff/1000/60/60/24;
        $('#days').val(days);
        var pricePerDay = $("#price").val();
        var qty = $("#qty").val();
        $("#tot").val(days*pricePerDay*qty);
        }
    } );
    });
}

function returnDatePicker(){
$( function() {
    $('#returndate').datepicker({ dateFormat: 'yy-mm-dd' ,
    minDate: 0,
    onSelect: function(date){
        var to = $('#todate').val();
        var returnD = $('#returndate').val();
        
        var diff = new Date(Date.parse(returnD) - Date.parse(to))
        console.log(diff);
        // get days
        var days = diff/1000/60/60/24;
        $('#additionaldate').val(days);
        console.log(days)
        var fee = pricePerDay * 0.5 * days;
        $('#latefee').val(fee);
        
    }
  }).val();
});
}



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
    initiateDatePickers();
}

if (CURRENT_URL.includes('returned_books')) {
    returnDatePicker();

}

function paypalIntegration() {

    if($("#qty").val().length == 0 || $("#tot").val().length == 0|| $("#days").val().length == 0
     || $("#price").val().length == 0 || $("#datepicker1").val().length == 0 || $("#datepicker1").val().length == 0 ){
        $.notify("Payment Cannot Process. Please check the details","error");
    }
    else{
        $.notify("You will be directed to payment page","success");
        window.open(
            'https://www.paypal.com',
            '_blank' // <- This is what makes it open in a new window.
          );
       
    }

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
            if(data.userEmail == "admin@gmail.com"){
                window.location.href = "returned_books.html";
            }
            else{
                window.location.href = "user_dashboard.html";
            }
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



// ********* Update with Rented Details*****************

function updateUserWithRentedDetails() {
    console.log("Function called");
    let isbn=''
        if (CURRENT_URL.includes('#')) {
             isbn = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);
            console.log(isbn);
        }
    let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
    let email = userInfo.userData.Email;
   
    let data = {
        ISBN: isbn,
        FromDate: $("#datepicker1").val(),
        ToDate: $("#datepicker2").val(),
        ReturnedDate: "0",
        FeeDate: "0",
        Fee: 0,
        Qty: $("#qty").val()
       
    }

    console.log(data);
    axios.post(baseUrlLocal+'/register/info/'+email,data, {headers: headers})
        .then(response => {
           
        })
        .catch(error => {
            $.notify("Invalid Updation","warn");
        
            console.log(error);
        })
}

function getBookDetailsForFinalRent(){
    var isbn =  $("#isbn").val();
        axios.get(baseUrlLocal+'/register/bookmodel/'+isbn)
       .then(response => {
    if (response.data.success) {
        let form_details = response.data.data;
        $("#qty").append(form_details[0].Qty);  
        $("#fromdate").append(form_details[0].FromDate);  
        $("#todate").val(form_details[0].ToDate);  

    }
    })
}
$(document).ready(function() {   

        $(document).on("change", "#isbn", function() {
      console.log("changing")
            let datax = {
            isbn : $("#isbn").val()
            }
             axios.get(baseUrlLocal+'/register/bookmodel/'+datax.isbn)
             .then(function (response) {
                let form_details = response.data.data;
                console.log(form_details[0].Qty)
                $("#qty").val(form_details[0].Qty);  
                $("#fromdate").val(form_details[0].FromDate);  
                $("#todate").val(form_details[0].ToDate);  
     
             })
             .catch(function (error) {
                 // handle error
                 console.log(error);
             });

             axios.get(baseUrlLocal + '/book/info/'+datax.isbn).then(function (response) {
                if (response.data) {
                    console.log(response);
                   pricePerDay = response.data.data[0].PricePerDay;
                   console.log(pricePerDay);
                }
            }).catch(function (error) {
                console.log(error);
            });
        })
        });
