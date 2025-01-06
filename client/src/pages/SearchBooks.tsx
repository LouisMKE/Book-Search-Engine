import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API'; // Replace with actual API search logic
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import Auth from '../utils/auth';

function SearchBooks() {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput); // API call for books

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author available'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!bookToSave) {
      return;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      saveBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for books"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchedBooks.length > 0 && (
          <h2>Viewing {searchedBooks.length} results:</h2>
        )}

        {searchedBooks.map((book) => (
          <div key={book.bookId}>
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <p>Authors: {book.authors.join(', ')}</p>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              More Info
            </a>
            {Auth.loggedIn() && (
              <button
                disabled={savedBookIds?.some((id) => id === book.bookId)}
                onClick={() => handleSaveBook(book.bookId)}
              >
                {savedBookIds?.some((id) => id === book.bookId)
                  ? 'Book Saved!'
                  : 'Save Book'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBooks;
