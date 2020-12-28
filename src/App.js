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
      /**
       * TODO: Instead of using this state variable to keep track of which page
       * we're on, use the URL in the browser's address bar. This will ensure that
       * users can use the browser's back and forward buttons to navigate between
       * pages, as well as provide a good URL they can bookmark and share.
       */
      bookShelves: [
        {
          shelveTitle: "Currently Reading",
          books: [
              {
                coverImage: "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api",
                currentShelve: "Currently Reading",
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                onShelveChange: this.changeBookShelve.bind(this)              
              },
              {
                coverImage: "http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api",
                currentShelve: "Currently Reading",
                title: "Ender's Game",
                author: "Orson Scott Card",
                onShelveChange: this.changeBookShelve.bind(this)              
              }				
          ]
        },
        {
          shelveTitle: "Want to Read",
          books: [
              {
                coverImage: "http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api",
                currentShelve: "Want to Read",
                title: "1776",
                author: "David McCullough",
                onShelveChange: this.changeBookShelve.bind(this)              
              },
              {
                coverImage: "http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api",
                currentShelve: "Want to Read",
                title: "Harry Potter and the Sorcerer's Stone",
                author: "J.K.Rowling",
                onShelveChange: this.changeBookShelve.bind(this)
              }				
          ]
        },
        {
          shelveTitle: "Read",
          books: [
              {
                coverImage: "http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api",
                currentShelve: "Read",
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                onShelveChange: this.changeBookShelve.bind(this)
              },
              {
                coverImage: "http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api",
                currentShelve: "Read",
                title: "Oh, the Places You'll Go!",
                author: "Seuss",
                onShelveChange: this.changeBookShelve.bind(this)
              },
              {
                coverImage: "http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api",
                currentShelve: "Read",
                title: "The Adventures of Tom Sawyer",
                author: "Mark Twain",
                onShelveChange: this.changeBookShelve.bind(this)
              }				
  
          ]
        }             
      ],
      searchedBooks: [],
      searchQuery: ""   
    }

  }

  onSearchPerformed = (query) => {
    if(query) {
      var delayTimer = setTimeout(() => {

        BooksAPI.search(query).then((data) => {
          if(data && data.map) { 
            var searchedBooks = this.formatResults(data);
            clearTimeout(this.delayTimer);
            this.setState((prevState) => {
              return {
                searchedBooks: [...searchedBooks]
              }
            });
          }       
        });
  
      }, 1000); 

      this.setState((prevState) => {
        return {
          searchQuery: query
        }
      })      

   } else {
    this.setState((prevState) => {
      return {
        searchedBooks: [],
        searchQuery: ""
      }
    }) 
   }
  }

  formatResults = (searchedBooks) => {

      return searchedBooks.map((book) => {
        return {
            coverImage: book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api" ,
            currentShelve: "None",
            title: book.title,
            author: book.authors && book.authors.length > 0 ? book.authors[0] : 'Unknown',
            onShelveChange: this.changeBookShelve.bind(this)              
        }
      });
  }

  changeBookShelve = (book, currentShelve, newShelve) => {
    var bookTitle = book.bookTitle;
    var bookAuthor = book.bookAuthor;
    
    var currentBookShelve = this.getBookshelve(currentShelve);
    var targetShelve = this.getBookshelve(newShelve);
    var currentBookShelveWithBookRemoved = undefined;
    if(currentBookShelve) { // if currentShelve != None
      var currentBook = this.getBook(currentBookShelve.books,bookTitle, bookAuthor);
      targetShelve.books.push(currentBook)
      var filteredBooks = currentBookShelve.books.filter((book)=> (book.title !== bookTitle && book.author !== bookAuthor ))      
      currentBookShelveWithBookRemoved = { shelveTitle: currentBookShelve.shelveTitle, books: [...filteredBooks] }      
    } else { // if currentShelve == None
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
