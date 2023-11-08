/*
Module containg the firebase configuration as well as the
functions used to interact with the database.
*/

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc
} from "firebase/firestore/lite";
import { fetchLibrarySongs } from "../api/library-songs";
import { fetchLibraryPlaylists } from "../api/library-playlists";
import { fetchLibraryAlbums } from "../api/library-albums";
import { fetchLibraryArtists } from "../api/library-artists";
import { userToken, cutToken, firebaseApp } from "../App";

const artworkPlaceholder =
  "https://raw.githubusercontent.com/scarryaa/musicnya/main/src/assets/music_note.png";
const namePlaceholder = "Unknown";

/**
 *  Add a user to the database if they don't already exist
 */
export const addUser = async () => {
  const libRef = collection(getFirestore(firebaseApp), "users");
  const libSnapshot = await getDocs(libRef);

  libSnapshot.docs.map((doc) => doc.data());
  const userDoc = doc(libRef, cutToken);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Document data:", data);
  } else {
    await setDoc(doc(libRef, cutToken), {
      songs: (
        await fetchLibrarySongs({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((song) => ({
        title: song?.attributes?.name || namePlaceholder,
        artist: song?.attributes?.artistName || namePlaceholder,
        album: song?.attributes?.albumName || namePlaceholder,
        duration: new Date(song?.attributes?.durationInMillis)
          .toISOString()
          .substr(15, 4),
        artistCatalogId:
          song.relationships.artists.data[0].relationships.catalog.data[0]
            ?.id || namePlaceholder,
        albumCatalogId:
          song.relationships.albums.data[0].relationships?.catalog.data[0]
            ?.id || namePlaceholder,
        id: song.id
      })),
      playlists: (
        await fetchLibraryPlaylists({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((playlist) => ({
        mediaArt:
          playlist.attributes.artwork ||
          playlist.tracks?.data?.[0]?.attributes?.artwork ||
          playlist.songs?.[0]?.attributes?.artwork ||
          artworkPlaceholder,
        title: playlist.attributes.name || namePlaceholder,
        type: playlist.type,
        id: playlist.id || namePlaceholder
      })),
      albums: (
        await fetchLibraryAlbums({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((album) => ({
        artistCatalogId:
          album.relationships.artists.data[0].relationships.catalog.data[0]
            ?.id || namePlaceholder,
        mediaArt: album.attributes.artwork || artworkPlaceholder,
        title: album.attributes.name || namePlaceholder,
        artists: album.attributes.artistName || namePlaceholder,
        type: album.type,
        id: album.id || namePlaceholder,
        artistIds:
          album.relationships.artists.data.map((artist) => artist.id) ||
          namePlaceholder
      })),
      artists: (
        await fetchLibraryArtists({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((artist) => ({
        mediaArt:
          artist.relationships.catalog.data[0]?.attributes.artwork ||
          artworkPlaceholder,
        title: artist.attributes.name || namePlaceholder,
        type: artist.type,
        id: artist.id || namePlaceholder,
        artistIds:
          artist.relationships.catalog.data.map((artist) => artist.id) ||
          namePlaceholder
      }))
    });
  }
};

/**
 * Get the user's library from the database
 * @returns the user's library
 */

export const getLibrary = async () => {
  const libRef = collection(getFirestore(firebaseApp), "users");
  const libSnapshot = await getDocs(libRef);

  libSnapshot.docs.map((doc) => doc.data());
  const userDoc = doc(libRef, cutToken);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  } else {
    console.log("No such document!");
  }
};

export const refreshLibrary = async () => {
  await setDoc(doc(collection(getFirestore(firebaseApp), "users"), cutToken), {
    songs: (
      await fetchLibrarySongs({
        devToken: MusicKit.getInstance().developerToken,
        musicUserToken: userToken
      })
    ).data.map((song) => ({
      title: song?.attributes?.name || namePlaceholder,
      artist: song?.attributes?.artistName || namePlaceholder,
      album: song?.attributes?.albumName || namePlaceholder,
      duration: new Date(song?.attributes?.durationInMillis)
        .toISOString()
        .substr(15, 4),
      artistCatalogId:
        song.relationships.artists.data[0].relationships.catalog.data[0]?.id ||
        namePlaceholder,
      albumCatalogId:
        song.relationships.albums.data[0].relationships?.catalog.data[0]?.id ||
        namePlaceholder,
      id: song.id
    })),
    playlists: (
      await fetchLibraryPlaylists({
        devToken: MusicKit.getInstance().developerToken,
        musicUserToken: userToken
      })
    ).data.map((playlist) => ({
      mediaArt:
        playlist.attributes.artwork ||
        playlist.tracks?.data?.[0]?.attributes?.artwork ||
        playlist.songs?.[0]?.attributes?.artwork ||
        artworkPlaceholder,
      title: playlist.attributes.name || namePlaceholder,
      type: playlist.type,
      id: playlist.id || namePlaceholder
    })),
    albums: (
      await fetchLibraryAlbums({
        devToken: MusicKit.getInstance().developerToken,
        musicUserToken: userToken
      })
    ).data.map((album) => ({
      artistCatalogId:
        album.relationships.artists.data[0].relationships.catalog.data[0]?.id ||
        namePlaceholder,
      mediaArt: album.attributes.artwork || artworkPlaceholder,
      title: album.attributes.name || namePlaceholder,
      artists:
        album.attributes
          .artistName /*|| album.relationships.artists.data[0].attributes.name*/ ||
        namePlaceholder,
      type: album.type,
      id: album.id || namePlaceholder,
      artistIds:
        album.relationships.artists.data.map((artist) => artist.id) ||
        namePlaceholder
    })),
    artists: (
      await fetchLibraryArtists({
        devToken: MusicKit.getInstance().developerToken,
        musicUserToken: userToken
      })
    ).data.map((artist) => ({
      mediaArt:
        artist.relationships.catalog.data[0]?.attributes.artwork ||
        artworkPlaceholder,
      title: artist.attributes.name || namePlaceholder,
      type: artist.type,
      id: artist.id || namePlaceholder,
      artistIds:
        artist.relationships.catalog.data.map((artist) => artist.id) ||
        namePlaceholder
    }))
  });
};
