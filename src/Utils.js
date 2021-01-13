
 // Referece: https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
const toCamelCase = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  };


  const formatResults = (books, onChangeBookShelf) => {
          return books.map((book) => {
              return {
                id: book.id,
                coverImage: book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api" ,
                currentShelve: startCase(book.shelf),
                title: book.title,
                author: book.authors && book.authors.length > 0 ? book.authors[0] : 'Unknown',
                onShelveChange: onChangeBookShelf 
            }
          });

      }

  function startCase(str) {
      console.log('str :::: ',str);
      if(str) {
        var result = str.replace( /([A-Z])/g, " $1" );
        var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult;
      }
    }

export { toCamelCase, formatResults }