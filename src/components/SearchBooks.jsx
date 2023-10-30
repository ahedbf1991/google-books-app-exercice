import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import "../styles/SearchBooks.css";

const SearchBooks = () => {
  const [searchField, setsearchField] = useState("");
  const [books, setBooks] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    if (searchField) {
      const searchBooks = async () => {
        const startIndex = (activePage - 1) * itemsPerPage;
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchField}&startIndex=${startIndex}&maxResults=${itemsPerPage}`;

        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Bad response from server");
          }
          const data = await response.json();
          if (data.items) {
            setTotalItems(data.totalItems);
            setBooks(
              data.items.map((item) => ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors
                  ? item.volumeInfo.authors.join(", ")
                  : "N/A",
                thumbnail: item.volumeInfo.imageLinks
                  ? item.volumeInfo.imageLinks.thumbnail
                  : "",
                price:
                  item.saleInfo && item.saleInfo.listPrice
                    ? item.saleInfo.listPrice.amount
                    : "N/A",
                buyLink:
                  item.saleInfo && item.saleInfo.buyLink
                    ? item.saleInfo.buyLink
                    : "",
              }))
            );
          } else {
            setTotalItems(0);
            setBooks([]);
          }
        } catch (error) {
          console.error(error);
        }
      };

      searchBooks();
    }
  }, [searchField, activePage]);

  return (
    <div className="search-books-container">
      <h1>Recherche de livres</h1>
      <input
        value={searchField}
        onChange={(e) => setsearchField(e.target.value)}
        placeholder="Rechercher des livres..."
        className="search-input"
      />
      <button onClick={() => setActivePage(1)} className="search-button">
        Rechercher
      </button>
      {books.length > 0 ? (
        <div className="books-list">
          <ul>
            {books.map((book) => (
              <li key={book.id} className="book-item">
                {book.thumbnail && (
                  <img src={book.thumbnail} className="book-thumbnail" />
                )}
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p>Auteur(s): {book.authors}</p>
                  <p>Prix: {book.price}</p>
                  {book.buyLink && (
                    <a
                      href={book.buyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="buy-link"
                    >
                      Acheter
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItems}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
            activeClass="active-page"
            activeLinkClass="active-link"
          />
        </div>
      ) : (
        <p>Aucun livre trouvé.</p>
      )}
    </div>
  );
};

export default SearchBooks;
