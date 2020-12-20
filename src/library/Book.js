import React from 'react'
import BookShelveChanger from './BookShelveChanger'

function Book(props) {
    var book = props.book;
    return(
        <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage:  `url(${book.coverImage})` }}></div>
          <BookShelveChanger BookShelveChanger={book}></BookShelveChanger>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.author}</div>
      </div>       
    );
}

export default Book;