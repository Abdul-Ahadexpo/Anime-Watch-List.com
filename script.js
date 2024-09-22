let animeList = JSON.parse(localStorage.getItem("animeList")) || [];

function addAnime() {
  const animeName = document.getElementById("animeName").value.trim();
  if (!animeName) return;

  const correctedName = correctAnimeSpelling(animeName);
  animeList.push({ name: correctedName, watched: false, favorite: false });
  saveAnimeList();
  displayAnime();
  document.getElementById("animeName").value = "";
}

function correctAnimeSpelling(name) {
  // Add basic corrections here
  const corrections = {
    narutoe: "Naruto",
    "one pece": "One Piece",
    "attack of titan": "Attack on Titan",
  };
  return corrections[name.toLowerCase()] || name;
}

function displayAnime() {
  const list = document.getElementById("animeList");
  list.innerHTML = "";

  animeList.forEach((anime, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="anime-details" ontouchstart="touchStart(${index}, event)" ontouchend="touchEnd(${index}, event)">
        <input type="checkbox" class="checkbox" ${
          anime.watched ? "checked" : ""
        } 
          onclick="toggleWatched(${index})"> ${anime.name}
        <span class="favorite" onclick="toggleFavorite(${index})">
          ${anime.favorite ? "★" : "☆"}
        </span>
      </div>
      <button class="delete-btn" onclick="deleteAnime(${index})">🗑</button>
    `;
    list.appendChild(listItem);
  });
}

function toggleWatched(index) {
  animeList[index].watched = !animeList[index].watched;
  saveAnimeList();
  displayAnime();
}

function toggleFavorite(index) {
  animeList[index].favorite = !animeList[index].favorite;
  saveAnimeList();
  displayAnime();
}

function deleteAnime(index) {
  animeList.splice(index, 1);
  saveAnimeList();
  displayAnime();
}

function saveAnimeList() {
  localStorage.setItem("animeList", JSON.stringify(animeList));
}

function sortAnimeList() {
  animeList.sort((a, b) => a.name.localeCompare(b.name));
  displayAnime();
}

function filterFavorites() {
  const filter = document.getElementById("favoritesFilter").checked;
  const filteredList = filter
    ? animeList.filter((anime) => anime.favorite)
    : animeList;
  const list = document.getElementById("animeList");
  list.innerHTML = "";

  filteredList.forEach((anime, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="anime-details" ontouchstart="touchStart(${index}, event)" ontouchend="touchEnd(${index}, event)">
        <input type="checkbox" class="checkbox" ${
          anime.watched ? "checked" : ""
        } 
          onclick="toggleWatched(${index})"> ${anime.name}
        <span class="favorite" onclick="toggleFavorite(${index})">
          ${anime.favorite ? "★" : "☆"}
        </span>
      </div>
      <button class="delete-btn" onclick="deleteAnime(${index})">🗑</button>
    `;
    list.appendChild(listItem);
  });
}

function exportAnimeList() {
  const data = JSON.stringify(animeList);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "animeList.json";
  a.click();
}

function importAnimeList() {
  const file = document.getElementById("fileInput").files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const importedList = JSON.parse(e.target.result);
    animeList = [...animeList, ...importedList];
    saveAnimeList();
    displayAnime();
  };
  reader.readAsText(file);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.querySelector(".container").classList.toggle("dark");
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => button.classList.toggle("dark"));
}

/* Swipe Gestures for Mobile */
let touchStartX = 0;
let touchEndX = 0;

function touchStart(index, event) {
  touchStartX = event.touches[0].clientX;
}

function touchEnd(index, event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe(index);
}

function handleSwipe(index) {
  if (touchEndX < touchStartX) {
    // Swiped left - mark as watched
    animeList[index].watched = true;
  } else if (touchEndX > touchStartX) {
    // Swiped right - mark as unwatched
    animeList[index].watched = false;
  }
  saveAnimeList();
  displayAnime();
}

window.onload = function () {
  displayAnime();
};
