const express = require('express');
const router = express.Router();
const pug = require('pug');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const json_books = fs.readFileSync('./books.json', 'utf-8');
let books = JSON.parse(json_books);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', books: books});
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