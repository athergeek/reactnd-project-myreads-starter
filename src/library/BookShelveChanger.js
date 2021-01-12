import React from 'react'
import ToCamelCase from '../Utils'

class BookShelveChanger extends React.Component {
    constructor(props) {
        super(props);
        
        this.currentShelve = props.book.currentShelve;
        this.onShelveChange = props.book.onShelveChange;
        this.bookTitle = props.book.title;
        this.bookAuthor = props.book.author;
        this.state = {
            options : [
                {
                  label: "Move to...",
                  value: "move",
                },
                {
                  label: "Currently Reading",
                  value: "currentlyReading",
                },
                {
                  label: "Want to Read",
                  value: "wantToRead",
                },
                {
                  label: "Read",
                  value: "read",
                },
                {
                    label: "None",
                    value: "none",
                },            
              ],
              shelve: ToCamelCase(this.currentShelve)   
        };
    
        console.log("BookShelveChanger.this.state ::: ", this.state);
        this.handleChange = this.handleChange.bind(this);
      }    

    handleChange(e) {
        console.log(`Changing Bookshelve from ${this.state.shelve} To ${e.target.value} `);        
        this.onShelveChange(this.props.book, this.state.shelve,e.target.value)
    };

    render() {
        return(
            <div className="book-shelf-changer">
                <select value={this.state.shelve} onChange={this.handleChange}>
                    {this.state.options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
          </div>
        );
    }  

}


export default BookShelveChanger;