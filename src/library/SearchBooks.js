import React from 'react'
import Book from './Book'
import * as BooksAPI from '../BooksAPI'

class SearchBooks  extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history : props.history,
        books: [],
        searchedBooks: []
      }
    }

    onValueChanged(e) {
      var query = e.target.value ? e.target.value.trim() : '';
      console.log("All Books ::::: this.state.books ", this.state.books);      
      console.log("query ::: ",query);
      if(query) {
        BooksAPI.search(query).then((data) => {
          var searchedBooks = this.formatResults(data);
          console.log("searchedBooks ::: ",searchedBooks);
          this.setState((prevState) => {
            prevState.searchedBooks = [...searchedBooks]
          })          
        });
     }
    }
    
    formatResults(searchedBooks) {
      return searchedBooks.map((book) => {
        return {
            coverImage: book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api" ,
            currentShelve: "None",
            title: book.title,
            author: book.authors && book.authors.lenght > 0 ? book.authors[0] : 'Unknown',
            onShelveChange: this.changeBookShelve.bind(this)              
        }
      });
    }


    onSearchClosed() {
        this.state.history.push("/");
    }

    // lifecycle event which executes once the component is loaded, makeing API call here
    // to make sure component is loaded completley.
    componentDidMount(){
      BooksAPI.getAll().then((data) => {
        // once the api returns the data, update the state.
        this.setState((prevState) => {
          prevState.books = [...data]
        })
  
      });
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
              <input type="text" placeholder="Search by title or author" onChange={(e) => this.onValueChanged(e)}/>

            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {this.state.searchedBooks.map((book, index) => (
                  <li key={index}>
                      <Book book={book}></Book>
                  </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }
}



export default SearchBooks;