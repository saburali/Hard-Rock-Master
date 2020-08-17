"use strict";
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const songContainer = document.getElementById("songContent");
const getLyricsButtons = document.getElementsByClassName("lyricsButtons");
const scroll = document.getElementById("scrollOff");
let previousSongId = "";

// It will fetch the songs data and lyrics from the given api and,
// Create dom for the songs

const searchSong = (searchKey) => {
  songContainer.innerHTML = "";
  fetch(`https://api.lyrics.ovh/suggest/${searchKey.toLowerCase().trim()}`) // Calling the songs
    .then((response) => response.json())
    .then((data) => {
      const songs = data.data;

      songs.slice(0, 10).map((song) => {
        let songlyrics = "";
        const songElement = document.createElement("div");
        const lyricsContainer = document.createElement("div");
        fetch(
          `https://api.lyrics.ovh/v1/${song.artist.name.toLowerCase()}/${song.title.toLowerCase()}` // Getting the lyrics
        )
          .then((response) => response.json())
          .then((lyrics) => {
            songlyrics = lyrics.lyrics;
          })
          .then(() => {
            songElement.setAttribute(
              "class",
              "single-result row align-items-center my-3 p-3"
            );
            lyricsContainer.setAttribute(
              "class",
              "d-none text-center song-container"
            );
            lyricsContainer.setAttribute("id", song.id);
            songElement.innerHTML = `
              <div class="col-md-9 d-flex align-items-center">
                <img src="${song.album.cover_small}" />
                <div class='ml-2'>
                   <h3 class="lyrics-name">${song.title}</h3>
                   <p class="author lead">Album by <span>${song.artist.name}</span></p>
                </div>
              </div>
              <div class="col-md-3 text-md-right text-center lyricsButtons">
                <button class="btn btn-success" song-id=${song.id}>Get Lyrics</button>
              </div>
              `;

            lyricsContainer.innerHTML = `
            <h2 class="text-success mb-4">${song.title}</h2>
            <pre class='text-white' >${
              songlyrics ? songlyrics : "Sorry!! Lyrics not found..."
            }</pre>`;

            songContainer.appendChild(songElement);
            songContainer.appendChild(lyricsContainer);
          })
          .catch((error) => console.log(error));
      });
    })
    .catch((error) => console.log(error));
};

// Functionality after pressing a search key word
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  previousSongId = "";
  if (searchInput.value) {
    searchSong(searchInput.value);
  }
    else {
        alert("Please Input 'Song Name'");
    }
});

// Show or Hide the lyrics after clicking the Get lyrics button
songContainer.addEventListener("click", async (e) => {
  let songId = e.target.getAttribute("song-id");
  if (previousSongId) {
    document.getElementById(previousSongId).classList.add("d-none");
      scroll.classList.remove("overflow-hidden");
      // Off the previously opened lyrics
  }
  document.getElementById(songId).classList.toggle("d-none");
  previousSongId = songId;
    
  scroll.classList.add("overflow-hidden");
});