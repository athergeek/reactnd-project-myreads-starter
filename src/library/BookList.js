import React from 'react'
import BookShelve from './BookShelve'
import { withRouter } from 'react-router-dom';

function BookList(props) {
    var bookShelves = props.bookShelves;
    var history = props.history;
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
            <button onClick={() => addBookClicked(history)}>Add a book</button>
        </div>
      </div>
    );
}

function addBookClicked(history) {
    history.push("/add-book");
}

export default  withRouter(BookList)