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

$('#btn-rent-final').on('click', function () {
    updateFee();
});

$('#btn-add').on('click', function () {
    addNewBook();
});

$('#btn-logout').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('login_info');
	window.location.href = "index.html";
});


/****** Function to initialize datepickers with the current date and triggers them for changes*/
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
        if(days<0){days=0;}
        $('#additionaldate').val(days);
        console.log(days)
        var fee = pricePerDay * 0.5 * days;
        $('#latefee').val(fee);
        
    }
  }).val();
 });
}


/****** Loading the methods when page loads ******/ 
if (CURRENT_URL.includes('user_dashboard')) {
    getUser();
    loadRentedBooksTable();
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


//Checking whether user is already registered and if he/she registered redirect user to dashboard
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
//Inserting the registration details of the user to the database
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
            alert("Successfully Registered!");
            document.getElementById('firstName').value = "";
            document.getElementById('lastName').value = "";
            document.getElementById('lno').value = "";
            document.getElementById('address').value = "";
            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
           
        }else{
            $.notify("User Cannot be Registered!","warn");
        }
    })
    .catch(error => {
        console.log(error);
    })

}

//Validating user credentials
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
            $('#first-name').html(form_details[0].FirstName);
            $('#last-name').html(form_details[0].LastName);
            $('#email').html(form_details[0].Email);
            $('#lno').html(form_details[0].LicenseNumber);
           
            
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

function loadBooksTable(){
    let i=0;
    axios.get(baseUrlLocal + '/book/info')
.then(function (response) {
    console.log(response)
    console.log(response.data)
    html = ''
    response.data.forEach(request => {
        
        if(i % 3 === 0 || i === 0){
            html += '<tr style="width:25%">'
        }
        i=i+1;
        html +='<td align="center">'+'<img id="thumb" style="width:150px;height:200px" src="./images/'+ request.ISBN +'.png"/>'+'</br>' ;
        html +='<b>'+request.ISBN+'</b></br>' ;
        html +='<b>'+request.BookName+'</b></br>' ;
        html +='<b>'+request.Author+'</b></br>' ;

        html +='<b>'+"$"+request.PricePerDay + '</b></br>';
        html +=isRented(request.Rented) + '</br>';
       '</td>' ;
       if(i % 3 === 0 || i === 0){
            html += '</tr>'
        }
    });
    $('#view-all-books tbody').append(html);
})
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}


/***********  View Available Books For Rent ******************/


function loadAvailableBooksTable() {
    let i=0;
    axios.get(baseUrlLocal + '/book/rent')
 .then(function (response) {
    console.log(response)
    console.log(response.data)
    html = ''
    response.data.forEach(request => {
        
        if(i % 3 === 0 || i === 0){
            html += '<tr style="width:25%">'
        }
        i=i+1;
        html +='<td align="center">'+'<a href="book_details.html#'+request.ISBN+'"title="">'+'<img id="thumb" style="width:150px;height:200px" src="./images/'+ request.ISBN +'.png"/>'+'</a>'+'</br>' ;
        html +='<b>'+request.ISBN+'</b></br>' ;
        html +='<b>'+request.BookName+'</b></br>' ;
        html +='<b>'+request.Author+'</b></br>' ;

        html +='<b>'+"$"+request.PricePerDay + '</b></br>';
       
       '</td>' ;
       if(i % 3 === 0 || i === 0){
            html += '</tr>'
        }
    });
    $('#view-available-books tbody').append(html);
 })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
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

// ********** Rent the book************

function getBookDetails(){
        let isbn=''
        let form_details;
        if (CURRENT_URL.includes('#')) {
             isbn = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);
            console.log(isbn);
        }
            axios.get(baseUrlLocal+'/book/info/'+isbn)
           .then(response => {
        if (response.data.success) {
             form_details = response.data.data;
            console.log(response.data);           
            console.log(form_details[0]);         
            console.log(form_details[0].BookName); 
            console.log(form_details[0].PricePerDay); 
            $("#book-name").append(form_details[0].BookName);  
            $("#description").append(form_details[0].Description);  
            $("#price").val(form_details[0].PricePerDay);  
            $("#ISBN").val(form_details[0].ISBN);  
            $("#author").val(form_details[0].Author);  
            document.getElementById('image').src = "./images/" + form_details[0].ISBN + ".png";
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

    axios.post(baseUrlLocal+'/book/'+data.ISBN,data, {headers: headers})
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
   
//Triggering to any change in the ISBN
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


// ************ Updating returned books*******************

function updateFee() {
    let isbn = $("#isbn").val()
   
    let data = {
       
        ReturnedDate: $("#returndate").val(),
        FeeDate: $("#additionaldate").val(),
        Fee: $("#latefee").val()
       
    }

    console.log(data);

    if(isbn.length != 0||data.ReturnedDate.length != 0||data.FeeDate.length != 0||data.Fee.length != 0){
    axios.post(baseUrlLocal+'/register/info/returned/'+isbn,data, {headers: headers})
    .then(response => {
        if (response.data.success) {
        $.notify("Successfully Updated with the details", "success");
    }
        })
        .catch(function (error) {
            $.notify("Please fill all the details","warn");
        });
    }
    else{
        $.notify("Please fill all the details","warn");
    }
    axios.post(baseUrlLocal+'/book/returned/'+isbn,data, {headers: headers})
        .then(response => {
       
        })
        .catch(error => {
            $.notify("Invalid Updation","warn");
        
            console.log(error);
        })

    axios.post(baseUrlLocal+'/rent/book/'+isbn,data, {headers: headers})
    .then(response => {
    
    })
    .catch(error => {
        $.notify("Invalid Updation","warn");
    
        console.log(error);
    })
}


function insertEachUserRent() {
    let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
    let email = userInfo.userData.Email;
    let rentData = {
        Email:email,
        ISBN: $("#ISBN").val(),
        BookName: $("#book-name").text(),
        Author: $("#author").val(),
        Fee: 0   
    }   


    axios.post(baseUrlLocal + '/rent/' + rentData.ISBN, rentData, {
            headers: headers
        })
    .then(response => {
        console.log(response);
        if(response.data.success){
          
        }else{
         
        }
    })
    .catch(error => {
        console.log("No Rented Books");
    })

}

/***********  View Available Books For Rent ******************/

function loadRentedBooksTable() {
        let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
        let email = userInfo.userData.Email;
        console.log(userInfo)
        axios.get(baseUrlLocal + '/rent/'+email)
        .then(response => {
            if (response.status == 200) {
                console.log(response.data);
                $('#view-rented-books-user').append(getRentedBookTable('rented-books', response.data));
                window.$('#rented-books').DataTable();
            }
        })
        .catch(err => {
            console.log("No Rented Books");
        });
    }
    
    
    
    function getRentedBookTable(tableId, book) {
            let html =
                '<table class="table table-bordered table-hover" id="'+ tableId +'">' +
                '<thead>' +
                '<tr>' +
                '<th class="text-center" scope="col">ISBN</th>' +
                '<th class="text-center" scope="col">Name of the Book</th>' +
                '<th class="text-center" scope="col">Author</th>' +
                '<th class="text-center" scope="col">Late Fees Paid($)</th>' +
              
                '</tr>' +
                '</thead>' +
                '<tbody>';  
        
            
                book.forEach(request => {
                html +=
                    '<tr>'+
                        '<td align="center">' + request.ISBN + '</td>' +
                        '<td align="center">' + request.BookName + '</td>' +
                        '<td align="center">' + request.Author + '</td>' +
                        '<td align="center">' + request.Fee  + '</td>' +
               
                        
                        
                    '</tr>';
            });
        
            html += '</tbody></table>'; 
        
            return html;
}
    
       
// ******************* Add New Book***********************

function addNewBook() {
     
    let data = {
        ISBN : $("#isbn-b").val(),
        BookName: $("#b-name").val(),
        Author: $("#author-name").val(),
        PricePerDay: $("#ppday").val(),
        AvailableDate: null,
        RentedBy: null,
        Rented: 0,
        Description: $("#desc").val()
       
    }

    console.log(data);

    if(data.ISBN.length != 0||data.BookName.length != 0||data.Author.length != 0||data.PricePerDay.length != 0||data.Description.length != 0){
    axios.post(baseUrlLocal+'/book',data, {headers: headers})
    .then(response => {
        if (response.data.success) {
        $.notify("New Book is Added to your Library", "success");
        $("#isbn-b").val(''),
        $("#b-name").val(''),
        $("#author-name").val(''),
        $("#ppday").val(''),
        $("#desc").val('')
    }
        })
        .catch(function (error) {
            $.notify("Please check all the details","warn");
        });
    }
    else{
        $.notify("Please check all the details","warn");
    }
    
}


    $('#frmUploader').submit(function(){
       
        $.ajax({
            url:'/book/api/Upload/',
            type:'post',
            data:$('#frmUploader').serialize(),
            
            success:function(){
               

            },
        });
    });
