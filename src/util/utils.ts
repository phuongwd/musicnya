import { FastAverageColor } from "fast-average-color";
import {
  isPlaying,
  setCurrentMediaItem,
  setIsPlaying,
  setPlaybackDuration,
  setPlaybackTime,
} from "../stores/store";

export const replaceSrc = (
  src: string | undefined,
  width: number,
  height: number = width,
  format = "webp",
) => {
  if (src === undefined) return;
  return src
    .replace("{w}x{h}", `${Math.floor(width)}x${Math.floor(height)}`)
    .replace("{f}", format)
    .replace("{c}", "");
};

export const splitArtists = (artists: string) => {
  if (artists === undefined) return [];
  return artists.split("&").map((artist) => artist.trim());
};

export const getArtworkColor = (src: string) => {
  const fac = new FastAverageColor();
  const color = fac.getColorAsync(src);
  return color.then((color) => color.hex);
};

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toFixed(0);
  return `${minutes}:${seconds.length === 1 ? "0" + seconds : seconds}`;
};

export const constructLink = (type: string, id: string) => {
  if (id === undefined) return "";

  switch (type) {
    case "library-albums":
      return `/library/album/${id}`;
    case "library-artists":
      return `/library/artist/${id}`;
    case "library-playlists":
      return `/library/playlist/${id}`;
    case "albums":
      return `/album/${id}`;
    case "apple-curators":
      return `/curator/${id}`;
    case "artists":
      return `/artist/${id}`;
    case "playlists":
      return `/playlist/${id}`;
    case "songs":
    case "stations":
    case "library-songs":
    case "music-videos":
      return "";
    default:
      return "";
  }
};

export const getAlbumIdFromUrl = (url: string) => {
  if (url === undefined) return "";

  const splitUrl = url.split("/");
  return splitUrl[splitUrl.length - 1];
};

export const setupEvents = () => {
  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackStateDidChange,
    () => {
      setIsPlaying({ value: MusicKit.getInstance().isPlaying });
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.nowPlayingItemDidChange,
    () => {
      setCurrentMediaItem(MusicKit.getInstance().nowPlayingItem || {});
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queueItemsDidChange,
    () => {
      console.log("queueItemsDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queuePositionDidChange,
    () => {
      console.log("queuePositionDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.mediaItemStateDidChange,
    () => {
      console.log("mediaItemStateDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackDurationDidChange,
    () => {
      setPlaybackDuration({
        value: MusicKit.getInstance().currentPlaybackDuration,
      });
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackTimeDidChange,
    () => {
      setPlaybackTime({
        value: MusicKit.getInstance().currentPlaybackTime,
      });
    },
  );
};
