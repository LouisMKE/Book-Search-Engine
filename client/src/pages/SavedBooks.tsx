import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import Auth from '../utils/auth';

function SavedBooks() {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });

      // Remove book from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!Auth.loggedIn()) {
    return <h2>You must be logged in to view this page.</h2>;
  }

  return (
    <div>
      <h1>Viewing {userData.username}'s Saved Books!</h1>
      <div>
        {userData.savedBooks?.length ? (
          userData.savedBooks.map((book) => (
            <div key={book.bookId}>
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              <p>Authors: {book.authors.join(', ')}</p>
              <a href={book.link} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
              <button onClick={() => handleDeleteBook(book.bookId)}>
                Delete this Book
              </button>
            </div>
          ))
        ) : (
          <h2>No saved books yet!</h2>
        )}
      </div>
    </div>
  );
}

export default SavedBooks;
