import React from 'react'
import Book from './Book'

function BookShelve(props) {
    return(
        <div className="bookshelf">
        <h2 className="bookshelf-title">{props.bookShelve.shelveTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {props.bookShelve.books.map((book) => (
                <li>
                    <Book book={book}></Book>
                </li>
            ))}
          </ol>
        </div>
      </div>        
    );
}

export default BookShelve;