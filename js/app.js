const cardsContainer = document.getElementById('cards-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function createCard(imageURL, title, description) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const cardImage = document.createElement('img');
    cardImage.className = 'card-image';
    cardImage.src = imageURL;
    cardImage.alt = title;

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const cardTitle = document.createElement('h3');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;

    const cardDescription = document.createElement('p');
    cardDescription.className = 'card-description';
    cardDescription.textContent = description;

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const cardButton = document.createElement('button');
    cardButton.className = 'card-btn';
    cardButton.textContent = 'Read More';

    cardFooter.append(cardButton);
    cardContent.append(cardTitle, cardDescription);
    cardElement.append(cardImage, cardContent, cardFooter);

    cardsContainer.appendChild(cardElement);
}

async function fetchBooks(query = '') {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query.trim())}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const booksList = data.docs || [];
        const top10Books = booksList.slice(0, 10);

        if (cardsContainer) {
            cardsContainer.innerHTML = '';
        }

        top10Books.forEach(book => {
            const bookTitle = book.title || 'Untitled';
            const author = book.author_name ? book.author_name[0] : 'Unknown Author';
            const year = book.first_publish_year || 'Unknown Year';
            const bookDescription = `Written by ${author}. First published in ${year}.`;

            let bookCoverURL = 'assets/images/img_placeholder.png';
            if (book.cover_i) {
                bookCoverURL = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }

            createCard(bookCoverURL, bookTitle, bookDescription);
        });
    } catch (error) {
        console.error('Error fetching data from Open Library:', error);
    }
}

if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userSearchQuery = searchInput.value;
        fetchBooks(userSearchQuery);
    });
}

fetchBooks();