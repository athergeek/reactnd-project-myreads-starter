import React from 'react'
import BookShelve from './BookShelve'

function BookList(props) {
    var bookShelves = props.bookShelves;
    var onAddBookClick = props.onAddBookClick;
    return(
     <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
              {bookShelves.map((bookShelve, index)=> (
                <BookShelve key={index} bookShelve={bookShelve}></BookShelve>
              ))}
          </div>
        </div>
        <div className="open-search">
          <button onClick={() => addBookClicked(onAddBookClick)}>Add a book</button>
        </div>
      </div>
    );
}

function addBookClicked(onAddBookClick) {
    onAddBookClick({showSearchPage: true})
}

export default  BookList