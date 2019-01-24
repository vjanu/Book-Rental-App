Book Renting Application For the "Swiss Library"
----------------------------------------------------
Initially 5 steps to start the project
1) Import the project into vs code, webstorm or any prefered IDE
2) Open a command line inside the IDE to the folder Book-Application
3) For the 1st time running type npm install and press enter
4) After installing type npm start and press enter
5) After all the initializations, go to localhost:3000 in the browser => Login Page

----------------------------------------------------------------------------------------

Mongo DB Setup
--------------
Address: ds155714.mlab.com
Port: 55714
Database Name: library
Username: admin
Password: admin123

Functions
---------

User
======
1)Registration of the user
2)Login of the user
3)Dashboard of the user
4)View all the books library having
5)View all the books currently available in the library
6)Select particular book for renting
7)Payment Gateway
8)Calculation of late fees
9)Logout of the user(Destroys sessions)


Admin
=======
1)Update the book details after book is returned
2)Adding new book to the library

PS: To login with the admin username is: admin@gmail.com   password is admin

----------------------------------------------------------------------------------------

Note: To add a new book you can use add_book.html and for the image of that particular book, you should save a image inside the image folder with the ISBN of the book. Images should be in .png format.
_____________________________________________________________________________________________________________________________________
2019/01/24 Update

Uploading image
---------------
Go to add books page to add image to the book.
Downloaded images should be having ISBN number of the book that you are adding.
Go to that page click on the browse and browse the image that having same ISBN as the book that is going to add.Click upload
Before typing details of book, Please upload the image and then add the book to db.

------------------
All the books and available books are shown 3 books per row in the pages.
Only available books can be clicked and see their details




