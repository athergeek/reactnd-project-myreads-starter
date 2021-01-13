import React from 'react'
import Book from './Book'
import { toCamelCase, formatResults } from '../Utils'
import { withRouter } from 'react-router-dom';
import * as BooksAPI from '../BooksAPI'

class SearchBooks  extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        query : props.searchQuery,
        bookShelves : props.bookShelves,        
        books : [],
        delay : undefined
      };

      this.history = props.history;
    }

    componentDidMount() {
      document.getElementById("search").focus();
    }

    onValueChanged(e) {
      var query =  e.target && e.target.value ? e.target.value : '';  
      if(this.state.delay) {
        clearTimeout(this.state.delay);
      }

      this.setState((previousState) => {
        return {
          ...previousState,
          delay: setTimeout(() => {
            this.searchBooks(query);
        }, 1000)
        }
      });

      this.setState((previousState) => {
        return {
          ...previousState,
          query: query,
        }
      });      

    }


    searchBooks = (query) => {

        if(query || query.trim().length > 0) {
            BooksAPI.search(query).then((books) => {
              if(books && books.map) { 

                books.map((book) => {
                  var allBooks = this.getAllBooksInShelves();
                  var bookInShelf = allBooks.find((b) => { return b.id === book.id });
                                    
                  if(bookInShelf) {
                    book.shelf = toCamelCase(bookInShelf.currentShelve);
                  } else {
                    book.shelf = "none"
                  }

                  return book;
                });


                var searchedBooks = formatResults(books, this.props.onChangeBookShelf);

                this.setState((prevState) => {
                  return {
                    ...prevState,          
                    books: [...searchedBooks]
                  }
                });
              }       
            }); 
      } else {
        this.setState((prevState) => {
          return {
            ...prevState,        
            books: [],
            query: ""
          }
        }) 
      }
  }    

    onSearchClosed() {
        this.history.push("/");
    }

    render() {
        return(
          <div className="search-books">
          <div className="search-books-bar">
          <button className="close-search" onClick={() => this.onSearchClosed()}>Close</button>
            
            <div className="search-books-input-wrapper">
              {/*
                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                You can find these search terms here:
                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                you don't find a specific author or title. Every search is limited by search terms.
              */}
              <input id="search" type="text" placeholder="Search by title or author" value={this.state.query || ''}  onChange={(e) => this.onValueChanged(e)} ref={(input)=> this.seach = input}/>

            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {this.state.books && this.state.books.map ? this.state.books.map((book, index) => (
                  <li key={index}>
                      <Book book={book} isFromSearchPage={true}></Book>
                  </li>
              )) : ''}
            </ol>
          </div>
        </div>
      );
    }


    getAllBooksInShelves() {
      var allBooks = [];
      this.props.bookShelves.forEach((shelf) => {
        allBooks.push(...shelf.books);
      });
  
      return allBooks;
    }    
}



export default withRouter(SearchBooks);