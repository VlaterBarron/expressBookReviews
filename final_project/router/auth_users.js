const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (user)=>{ //returns boolean
  const unique_user = users.filter(u => u.username === user.username);
  return unique_user.length > 0;
}

const authenticatedUser = (user)=>{ //returns boolean
  const auth_user = users.filter(u => u.username === user.username && u.password === user.password);
  return auth_user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) return res.status(400).send("Username or password not provided correctly");
  if(authenticatedUser({ "username":username, "password":password })) {
    const accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfuly logged in!");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if(!book) return res.status(400).send("The ISBN doesn't exist in the database");
  const review = req.query.review;
  if(!review) return res.status(400).send("Send a valid review");

  book["reviews"][req.user.data] = review;
  books[req.params.isbn] = book;
  return res.status(200).send(JSON.stringify(book));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if(!book) return res.status(400).send("The ISBN doesn't exist in database");
  const user = req.user.data;
  for(let [key, value] of Object.entries(book["reviews"])) {
    if(key === user) delete book["reviews"][key];
  }
  return res.status(200).send(JSON.stringify(book));
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
