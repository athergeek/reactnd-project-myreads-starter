import React from 'react'
import SearchBooks from './library/SearchBooks'
import ToCamelCase from './Utils'
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
      var books = this.formatResults(response, false);
      var bookShelves = [];
      var currentShelve = {};
      console.log("Books ::: ", books);      
      books.map((currentBook) => {
        if(currentShelve.name !==  currentBook.currentShelve) {
          currentShelve.name = currentBook.currentShelve;
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

  onSearchPerformed = (query) => {

              if(query || query.trim().length > 0) {
                  BooksAPI.search(query).then((data) => {
                    if(data && data.map) { 
                      var searchedBooks = this.formatResults(data, true);

                      this.setState((prevState) => {
                        return {
                          ...prevState,          
                          searchedBooks: [...searchedBooks]
                        }
                      });
                    }       
                  }); 
            } else {
              this.setState((prevState) => {
                return {
                  ...prevState,        
                  searchedBooks: [],
                  searchQuery: ""
                }
              }) 
            }


      this.setState((prevState) => {
        return {
          ...prevState,          
          searchQuery: query
        }
      });
           
  }

  formatResults = (books, searchedBooks) => {

      return books.map((book) => {
        if(searchedBooks) {
            return {
              id: book.id,
              coverImage: book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api" ,
              currentShelve: "None",
              title: book.title,
              author: book.authors && book.authors.length > 0 ? book.authors[0] : 'Unknown',
              onShelveChange: this.changeBookShelve.bind(this)              
          }
        } else {
            return {
              id: book.id,
              coverImage: book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api" ,
              currentShelve: this.startCase(book.shelf),
              title: book.title,
              author: book.authors && book.authors.length > 0 ? book.authors[0] : 'Unknown',
              onShelveChange: this.changeBookShelve.bind(this)              
          }          
        }
      });
  }

  startCase(str) {
    console.log('str :::: ',str);
    if(str) {
      var result = str.replace( /([A-Z])/g, " $1" );
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      return finalResult;
    }
  }

  changeBookShelve = (book, currentShelve, newShelve) => {
    var bookTitle = book.title;
    var bookAuthor = book.author;
    if(newShelve !== 'none') { // Do not allow to switch to 'none' shelve

        BooksAPI.update(book, newShelve).then((response) => {
          console.log('Book shelf changed successfully :::: ', response);          

        }).catch((error)=> {
          console.log('Error while changeing book shelf :::: ', error);
        });

        var currentBookShelve = this.getBookshelve(currentShelve);
        var targetShelve = this.getBookshelve(newShelve);
        var targetShelve = (targetShelve === undefined) ? { shelveTitle: newShelve, books: []} : targetShelve;
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
        



        var updatedBookshelves = this.state.bookShelves.map((shelve) => {
            if(ToCamelCase(shelve.shelveTitle) === currentShelve) {
              return currentBookShelveWithBookRemoved
            } else if(ToCamelCase(shelve.shelveTitle) === newShelve) {
              return targetShelve
            } else {
              return shelve
            }
        });


        this.setState((prevState) => ({
          ...prevState,
          bookShelves: updatedBookshelves
        }));

   }
    console.log("Bookshelves After book removed :::",this.state)  
    console.log("Updated Bookshelves :::",updatedBookshelves)  

  }

  getBookshelve = (shelveName) => {
    return this.state.bookShelves.find(shelve => ToCamelCase(shelve.shelveTitle) === shelveName)
  }

  getBook = (books, title, author) => {
    return books.find(book => book.title===title && book.author===author)
  }
  render() {
    return (
      <div className="app">
          <Route path="/add-book" component={() => (<SearchBooks books={this.state.searchedBooks} searchQuery={this.state.searchQuery} searchBooks={this.onSearchPerformed}></SearchBooks>)} ></Route>
          <Route exact path="/" component ={() => (<BookList bookShelves={this.state.bookShelves}></BookList>)}></Route>
      </div>
    )
  }
}

export default BooksApp
