const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Get the book list available in the shop
  public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
});

public_users.get('/books',function (req, res) {

  const fetch_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    fetch_books.then(() => console.log("all books retrieved"));

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if (!books[isbn]) {
    res.status(404).send("Book not found")
  }
  res.send(JSON.stringify(books[isbn]))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  
   for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].author.includes(author)) {
      matchingBooks.push(books[key]);
    }
    res.send(JSON.stringify(matchingBooks));
  }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  let matchingBooks = [];
  
   for (const key in books) {
    booktitle = books[key].title.toLowerCase();
    if (books.hasOwnProperty(key) && booktitle.includes(title)) {
      matchingBooks.push(books[key]);
    }
    res.send(JSON.stringify(matchingBooks));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if (!books[isbn]) {
    res.status(404).send("isbn not found")
  }
  res.send(JSON.stringify(books[isbn].reviews))
});

module.exports.general = public_users;
