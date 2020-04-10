const express = require('express');
const router = express.Router();
const pug = require('pug');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const json_books = fs.readFileSync('./books.json', 'utf-8');

var today = new Date();
let books = JSON.parse(json_books);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', books: books});
});

router.post('/filter', function(req, res) {
  
  books = JSON.parse(json_books);

  let filteredBooks = []
  let dueDate = req.body.dueDate

    for (let index = 0; index < Object.keys(books).length; index++) {
        let book = books[index]
        let bookDueDate = new Date(book['inLibrary']['due']);
  
        if (bookDueDate < new Date(dueDate)) {
          filteredBooks.push(books[index])
        }  
      }
  
      books = filteredBooks
  
  
  res.redirect('/')
});

router.post('/showAll', function(req, res) {
  books = JSON.parse(json_books);
  res.redirect('/')
});

router.post('/inStock', function(req, res) {
  
  books = JSON.parse(json_books);

  let filteredBooks = []
  let inStock = req.body.inLibrary == 'on'

  if (inStock) {
    
    for (let index = 0; index < Object.keys(books).length; index++) {
        let book = books[index]

        if (book['inLibrary']['status'] == true) {
          filteredBooks.push(books[index])
        }
    }
  
      books = filteredBooks
  }
  
  res.redirect('/')
});

router.post('/add-book', (req, res) => {

  const { title, author, cover, year, country } = req.body;

  if (!title || !author || !cover || !year || !country) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newBook = {
    id: uuidv4(),
    title,
    author,
    cover,
    year,
    country,
    inLibrary: {
      status: true
    }
  };

  // add a new book to the array
  books.push(newBook);

  // saving the array in a file
  const json_books = JSON.stringify(books);
  fs.writeFileSync('./books.json', json_books, 'utf-8');

  res.redirect('/');
});

module.exports = router;
