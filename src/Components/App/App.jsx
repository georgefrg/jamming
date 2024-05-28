import React, { useState } from "react";
import styles from "./App.module.css";
import SearchBar from "../SearchBAr/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { Spotify } from "../../util/spotify";
function App() {
  const [searchResult, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("Example Playlist Name");
  const [playlistTrackName, setPlaylistTrackName] = useState([]);

  function addTrack(track) {
    if (playlistTrackName.find((t) => t.id === track.id)) {
      console.log("Track already exists");
    } else {
      setPlaylistTrackName([...playlistTrackName, track]);
    }
  }

  function removeTrack(track) {
    const updatedTracks = playlistTrackName.filter((t) => t.id !== track.id);
    setPlaylistTrackName(updatedTracks);
  }

  function updatePlaylistName(playlistName) {
    setPlaylistName(playlistName);
  }

  function savePlaylist() {
    const trackURIs = playlistTrackName.map((t) => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTrackName([]);
    });
  }

  function search(searchTerm) {
    Spotify.search(searchTerm).then((result) => setSearchResults(result));
    console.log(searchTerm);
  }

  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>
      <div className={styles.App}>
        <SearchBar onSearch={search} />

        <div className={styles["App-playlist"]}>
          <SearchResults userSearchResults={searchResult} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTrackName}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
