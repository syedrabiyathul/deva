const actors = [
    { id: 1, name: "Leonardo DiCaprio", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Christian Bale", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Anne Hathaway", image: "https://via.placeholder.com/150" }
];

const actorsContainer = document.getElementById("actors-container");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const renderActors = () => {
    actorsContainer.innerHTML = "";
    actors.forEach(actor => {
        const isFavorited = favorites.includes(actor.id);
        const actorCard = document.createElement("div");
        actorCard.classList.add("actor-card");
        actorCard.innerHTML = `
            <img src="${actor.image}" alt="${actor.name}">
            <h3>${actor.name}</h3>
            <span class="heart-icon ${isFavorited ? 'favorited' : ''}" data-id="${actor.id}">❤</span>
        `;
        actorsContainer.appendChild(actorCard);
    });

    document.querySelectorAll(".heart-icon").forEach(icon => {
        icon.addEventListener("click", toggleFavorite);
    });
};

const toggleFavorite = (e) => {
    const actorId = parseInt(e.target.getAttribute("data-id"));
    if (favorites.includes(actorId)) {
        favorites = favorites.filter(id => id !== actorId);
    } else {
        favorites.push(actorId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderActors();
};

renderActors();