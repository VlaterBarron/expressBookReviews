const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const new_user = {
    "username" : req.body.username,
    "password" : req.body.password
  };
  if(!new_user.username || !new_user.password) return res.status(400).send("Username or password not provided correctly");
  if(isValid(new_user)) return res.status(400).send("Username already exists");

  users.push(new_user);
  res.status(200).send("User was created successfully");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books));
});

const getBooks = async () => {
  return await axios.get('/', (req, res) => {
    res.status(200).send(JSON.stringify(books));
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if(!book) return res.status(400).send("The ISBN doesn't exist in the database");
  res.status(200).send(JSON.stringify(book));
});

const getBookByISBN = async (isbn) => {
  return await axios.get(`/isbn/${isbn}`, (req, res) => {
    const book = books[req.params.isbn];
    if(!book) return res.status(400).send("The ISBN doesn't exist in the database");
    res.status(200).send(JSON.stringify(book));
  });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_books = [];
  for(let [key, value] of Object.entries(books)) {
    if(value["author"] === req.params.author){
      author_books.push(value);
    }
  }
  return res.status(200).send(JSON.stringify(author_books));
});

const getBookByAuthor = async (author) => {
  return await axios.get(`/author/${author}`, (req, res) => {
    const author_books = [];
    for(let [key, value] of Object.entries(books)) {
    if(value["author"] === req.params.author){
      author_books.push(value);
    }
  }
  return res.status(200).send(JSON.stringify(author_books));
  });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title_books = [];
  for(let [key, value] of Object.entries(books)) {
    if(value["title"] === req.params.title) {
      title_books.push(value);
    }
  }
  return res.status(200).send(JSON.stringify(title_books));
});

const getBookByTitle = async (title) => {
  return await axios.get(`/title/${title}`, (req, res) => {
    const title_books = [];
    for(let [key, value] of Object.entries(books)) {
    if(value["title"] === req.params.title) {
      title_books.push(value);
    }
  }
  return res.status(200).send(JSON.stringify(title_books));
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = books[req.params.isbn]["reviews"];
  if(!review) return res.status(300).send("The ISBN doens't exist in the database");
  res.status(200).json({"ISBN Book" : req.params.isbn, "review" : JSON.stringify(review)});
});

module.exports.general = public_users;
