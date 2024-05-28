let accessToken;
const clientID = "e050e83d45c84eb9bc8c6d9ab3a75ca7"; // Ensure to replace this with your actual client ID
const redirectUrl = "http://localhost:3000";

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenInUrl = window.location.href.match(/access_token=([^&]*)/);
    const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenInUrl && expiryTime) {
      accessToken = tokenInUrl[1];
      const expiresIn = Number(expiryTime[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    }

    const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
    window.location = redirect;
  },

  async search(term) {
    accessToken = Spotify.getAccessToken();
    if (!accessToken) return [];

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((t) => ({
        id: t.id,
        name: t.name,
        artist: t.artists[0].name,
        album: t.album.name,
        uri: t.uri,
      }));
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;
    const aToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${aToken}` };

    try {
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers,
      });
      const jsonResponse = await response.json();
      const userId = jsonResponse.id;

      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        }
      );
      const playlistResponse = await createPlaylistResponse.json();
      const playlistId = playlistResponse.id;

      return fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ uris: trackUris }),
        }
      );
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  },
};

export { Spotify };
