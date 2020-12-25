import React from 'react'
import Book from './Book'
import BookShelveHeader from './BookShelvesHeader'

function BookShelve(props) {
    var bookShelve =props.bookShelve;
    return(
        <div className="bookshelf">
        <BookShelveHeader title={bookShelve.shelveTitle}></BookShelveHeader>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {bookShelve.books.map((book, index) => (
                <li key={index}>
                    <Book book={book}></Book>
                </li>
            ))}
          </ol>
        </div>
      </div>        
    );
}

export default BookShelve;