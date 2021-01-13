import React from 'react'
import SearchBooks from './library/SearchBooks'
import { toCamelCase, formatResults } from './Utils'
import BookList from './library/BookList'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookShelves: [],
      searchedBooks: [],
      searchQuery: ""   
    }

  }

  componentDidMount() {
    BooksAPI.getAll().then((response) => {
      console.log('Response ::: ', response);
      var books = formatResults(response, this.changeBookShelve.bind(this));
      var bookShelves = [];
      var currentShelve = {};
      console.log("Books ::: ", books);      
      books.forEach((currentBook) => {
        if(currentShelve.name !==  currentBook.currentShelve) {
          currentShelve.name = currentBook.currentShelve;
          currentBook.onShelveChange= this.changeBookShelve.bind(this)   
          bookShelves.push({
            shelveTitle: currentBook.currentShelve,
            books: books.filter((book) => book.currentShelve === currentBook.currentShelve)
          });
        }
      });

      this.setState((previousState) => {
        return {
          ...previousState,
          bookShelves: [...bookShelves]
        }
      });
    });
  }

  changeBookShelve = (book, currentShelve, newShelve, isFromSearchPage) => {
    var bookTitle = book.title;
    var bookAuthor = book.author;
    var updatedBookshelves = [];
    
    BooksAPI.update(book, newShelve).then((response) => {
      console.log('Book shelf changed successfully :::: ', response);          

            if(newShelve !== 'none') { // Do not allow to switch to 'none' shelve
            var currentBookShelve = this.getBookshelve(currentShelve);
            var targetShelve = this.getBookshelve(newShelve);
            targetShelve = (targetShelve === undefined) ? { shelveTitle: newShelve, books: []} : targetShelve;
            var currentBookShelveWithBookRemoved = undefined;
            if(currentBookShelve) { // if currentShelve != None
              var currentBook = this.getBook(currentBookShelve.books,bookTitle, bookAuthor);
              currentBook.currentShelve = newShelve;
              targetShelve.books.push(currentBook)
              var filteredBooks = currentBookShelve.books.filter((book)=> (book.title !== bookTitle && book.author !== bookAuthor ))      
              currentBookShelveWithBookRemoved = { shelveTitle: currentBookShelve.shelveTitle, books: [...filteredBooks] }      
            } else { // if currentShelve == None
              book.currentShelve = newShelve;
              targetShelve.books.push({...book})
            }

            updatedBookshelves = this.state.bookShelves.map((shelve) => {
                if(toCamelCase(shelve.shelveTitle) === currentShelve) {
                  return currentBookShelveWithBookRemoved
                } else if(toCamelCase(shelve.shelveTitle) === newShelve) {
                  return targetShelve
                } else {
                  return shelve
                }
            });

      } else { // Remove  book from current shelf if newShelve === none
        var currentBookShelve = this.getBookshelve(currentShelve);
        var filteredBooks = currentBookShelve.books.filter((book)=> (book.title !== bookTitle && book.author !== bookAuthor ))      
        currentBookShelveWithBookRemoved = { shelveTitle: currentBookShelve.shelveTitle, books: [...filteredBooks] }       
        updatedBookshelves = this.state.bookShelves.map((shelve) => {
          if(toCamelCase(shelve.shelveTitle) === currentShelve) {
            return currentBookShelveWithBookRemoved
          } else {
            return shelve
          }
      });
      }


        if(!isFromSearchPage) {
          this.setState((prevState) => ({
            ...prevState,
            bookShelves: updatedBookshelves
          }));
        }   
        console.log("Bookshelves After book removed :::",this.state)  
        console.log("Updated Bookshelves :::",updatedBookshelves)  


    }).catch((error)=> {
      console.log('Error while changeing book shelf :::: ', error);
    });

  }

  getBookshelve = (shelveName) => {
    return this.state.bookShelves.find(shelve => toCamelCase(shelve.shelveTitle) === shelveName)
  }

  getBook = (books, title, author) => {
    return books.find(book => book.title===title && book.author===author)
  }
  render() {
    return (
      <div className="app">
          <Route path="/add-book" component={() => (<SearchBooks bookShelves={this.state.bookShelves} onChangeBookShelf={ this.changeBookShelve.bind(this) }></SearchBooks>)} ></Route>
          <Route exact path="/" component ={() => (<BookList bookShelves={this.state.bookShelves}></BookList>)}></Route>
      </div>
    )
  }
}

export default BooksApp
