const mockAPI = async (query) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = {
                movies: ["Inception", "The Dark Knight", "Interstellar"].filter(m => m.toLowerCase().includes(query)),
                actors: ["Leonardo DiCaprio", "Christian Bale", "Anne Hathaway"].filter(a => a.toLowerCase().includes(query)),
                tvShows: ["Breaking Bad", "Stranger Things", "Game of Thrones"].filter(t => t.toLowerCase().includes(query))
            };
            resolve(results);
        }, Math.random() * 500 + 300); // Simulate network delay
    });
};

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchHistory = document.getElementById('search-history');

let debounceTimer;
let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
let selectedIndex = -1;

const updateSearchHistory = () => {
    searchHistory.innerHTML = searchHistoryList.map(query => <div class="search-item">${query}</div>).join('');
    searchHistory.style.display = searchHistoryList.length ? 'block' : 'none';
};

const handleSearch = async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.classList.add('hidden');
        return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const results = await mockAPI(query);
        displayResults(results);
    }, 300);
};

const displayResults = (results) => {
    searchResults.innerHTML = `
        <div class="category">Movies</div>
        ${results.movies.map(m => <div class="search-item">${m}</div>).join('') || '<div class="search-item">No results</div>'}
        <div class="category">Actors</div>
        ${results.actors.map(a => <div class="search-item">${a}</div>).join('') || '<div class="search-item">No results</div>'}
        <div class="category">TV Shows</div>
        ${results.tvShows.map(t => <div class="search-item">${t}</div>).join('') || '<div class="search-item">No results</div>'}
    `;
    
    searchResults.classList.remove('hidden');
};

searchInput.addEventListener('input', handleSearch);

searchInput.addEventListener('keydown', (e) => {
    const items = [...document.querySelectorAll('.search-item')];
    if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((item, index) => item.classList.toggle('selected', index === selectedIndex));
    } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((item, index) => item.classList.toggle('selected', index === selectedIndex));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
        searchInput.value = items[selectedIndex].textContent;
        searchResults.classList.add('hidden');
        searchHistoryList = [...new Set([searchInput.value, ...searchHistoryList])].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));
        updateSearchHistory();
    }
});

updateSearchHistory();