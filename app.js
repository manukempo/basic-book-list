// Book Constructor
function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;

  // Clear Fields
  Book.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// BookList Constructor
function BookList(){
    // Add Book To List
    BookList.prototype.addBookToList = function(book){
      const list = document.getElementById('book-list');
      // Create tr element
      const row = document.createElement('tr');
      // Insert columns
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#!" class="delete">X</a></td>
      `;
      // Append the row to the list
      list.appendChild(row);
    }

    // Show Message
    BookList.prototype.showMessage = function(message, className) {
      // Create div
      const div = document.createElement('div');
      // Add class
      div.className = `alert ${className}`;
      // Add text
      div.appendChild(document.createTextNode(message));
      // Get parent of div
      const container = document.querySelector('.container');
      // Get form - to insert before it
      const form = document.querySelector('#book-form');
      // Insert Message
      container.insertBefore(div, form);

      // Timeout after 3 secs
      setTimeout(function(){
        document.querySelector('.alert').remove();
      }, 3000);
    }

    // Delete Book From List
    BookList.prototype.deleteBook =  function(target) {
      if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
      }
    }
}

// Local Storage Constructor
function Store(){
  // Get Books
  Store.prototype.getBooks = function(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  // Display Books
  Store.prototype.displayBooks = function(book){
    const books = this.getBooks();
    books.forEach(function(book){
      const bookList = new BookList;
      // Add book to the list
      bookList.addBookToList(book);
    });
  }
  // Add Book
  Store.prototype.addBook = function(book){
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  // Remove Book
  Store.prototype.removeBook = function(isbn, index){
    const books = this.getBooks();
    books.forEach(function(book){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Instantiate Store
const store = new Store();
// DOM Load Event
document.addEventListener('DOMContentLoaded', store.displayBooks());

// Event Listener - Add a book
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  
  // Instantiate Book
  const book = new Book(title, author, isbn);
  // Instantiate BookList
  const bookList = new BookList();

  // Validate
  if(title === '' || author === '' || isbn === '') {
    // Error message
    bookList.showMessage('Please fill in all the fields', 'error');
  } else {
    // Success message
    bookList.showMessage('Book Added!', 'success');
    // Add book to list
    bookList.addBookToList(book);
    // Add book to Local Storage
    store.addBook(book);
    // Clear fields
    book.clearFields();
  }

  e.preventDefault();
});

// Event Listener - Delete a book
document.getElementById('book-list').addEventListener('click', function(e){
  // Instantiate BookList
  const bookList = new BookList();
  // Delete Book
  bookList.deleteBook(e.target);
  // Remove book from Local Storage
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show message
  bookList.showMessage('Booked Removed!', 'success');

  e.preventDefault();
})