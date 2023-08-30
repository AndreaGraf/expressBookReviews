const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Get the book list available in the shop--Task 10
public_users.get('/',function (req, res) {

    const fetch_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      fetch_books.then(() => console.log("all books retrieved"));

  });

// Get book details based on ISBN - Task 11
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  const fetch_book = new Promise((resolve,reject)=>{
    if (books[isbn]) {
        resolve(res.send(JSON.stringify(books[isbn])));
    } else{
        reject("Book not found");
    }
  });
  fetch_book.then(() => console.log('book retrieval complete'))
  .catch(error=>{
      console.error('Error', error);
      res.status(404).send("isbn not found")
  }); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
 
    const fetch_book = new Promise((resolve,reject)=>{
        let matchingBooks = [];
        for (const key in books) {
            bookAuthor = books[key].author.toLowerCase()
            if (books.hasOwnProperty(key) && bookAuthor.includes(author)) {
                matchingBooks.push(books[key]);
            }
        }
        resolve(res.send(JSON.stringify(matchingBooks)));
    });
    fetch_book.then(() => console.log('book retrieval complete'))

});

// Get all books based on title - Task 13 
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();

    const fetch_book = new Promise((resolve,reject)=>{
        let matchingBooks = [];
  
        for (const key in books) {
            booktitle = books[key].title.toLowerCase();
            if (books.hasOwnProperty(key) && booktitle.includes(title)) {
                matchingBooks.push(books[key]);
            }
        }
        resolve(res.send(JSON.stringify(matchingBooks)));
    });
    fetch_book.then(() => console.log('book retrieval complete'))
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

