import React from 'react'
import Book from './Book'
import { withRouter } from 'react-router-dom';

class SearchBooks  extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        query : props.searchQuery,
        delay : undefined
      };

      this.history = props.history;
      this.books = props.books;
      this.searchBooks = props.searchBooks;
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
              <input id="search" type="text" placeholder="Search by title or author" value={this.state.query}  onChange={(e) => this.onValueChanged(e)}/>

            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {this.books && this.books.map ? this.books.map((book, index) => (
                  <li key={index}>
                      <Book book={book}></Book>
                  </li>
              )) : ''}
            </ol>
          </div>
        </div>
      );
    }
}



export default withRouter(SearchBooks);