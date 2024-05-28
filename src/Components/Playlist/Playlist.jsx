import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../TrackList/TrackList";
function Playlist(props) {
  function handleNameChange({ target }) {
    props.onNameChange(target.value);
  }
  return (
    <div className={styles.Playlist}>
      <input defaultValue={"New Playlist"} onChange={handleNameChange} />
      <Tracklist
        userSearchResults={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true}
        onNameChange={props.updatePlaylistName}
      />
      <button className={styles["Playlist-save"]} onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;
