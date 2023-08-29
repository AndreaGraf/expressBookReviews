const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//Function to check if the user exists
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

regd_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
      
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,username
        }
        req.session.username = username
        console.log(req.session.authorization)
        return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    });


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
let isbn = req.params.isbn

const username = req.session.username
let review = req.query.review
console.log(username)
console.log(review)

let curr_reviews = books[isbn].reviews
curr_reviews[username]=review
books[isbn].reviews = curr_reviews

return res.status(201).send("review added");
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
const isbn = req.params.isbn;
const username = req.session.username
if (books[isbn]){
    if (books.isbn.reviews.hasOwnProperty(username))
    delete books.isbn.reviews[username]
} else{
    return res.status(410).send('isbn not found')
}
res.send(`review from  ${username} deleted.`);

})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;