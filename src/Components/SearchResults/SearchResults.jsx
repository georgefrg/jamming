import React from "react";
import styles from "./SearchResults.module.css";
import TrackList from "../TrackList/TrackList";
function SearchResults(props) {
  return (
    <div className={styles.SearchResults}>
      <TrackList
        userSearchResults={props.userSearchResults}
        isRemoval={true}
        onAdd={props.onAdd}
      />
    </div>
  );
}

export default SearchResults;
