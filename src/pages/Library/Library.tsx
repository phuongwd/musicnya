import { BsMusicNote, BsMusicNoteList, BsPeopleFill } from "solid-icons/bs";
import { Chip } from "../../components/Chip/Chip";
import styles from "./Library.module.scss";
import { IoAlbums, IoRefreshCircle } from "solid-icons/io";
import { Albums } from "./Albums/Albums";
import { Match, Switch, createSignal } from "solid-js";
import { Playlists } from "./Playlists/Playlists";
import { Artists } from "./Artists/Artists";
import { Songs } from "./Songs/Songs";
import { refreshLibrary } from "../../util/firebase";

// Removed from library function to retain state
const [selectedPage, setSelectedPage] = createSignal("playlists");
const [refreshing, setRefreshing] = createSignal(false);

export function Library() {
  const ACTIVE_PAGE_CLASS = "library__header--chip--selected";

  return (
    <div class={styles.library}>
      <div class={styles.library__header}>
        <h1 class={styles.library__title}>library</h1>
        <button
          class={styles.library__header__button}
          onclick={async () => {
            setRefreshing(true);
            await refreshLibrary().then(() => setRefreshing(false));
          }}
        >
          <IoRefreshCircle size={32} />
        </button>
        <Chip
          class={
            selectedPage() === "playlists" ? styles[ACTIVE_PAGE_CLASS] : ""
          }
          style="margin-left: 2rem;"
          label="playlists"
          icon={BsMusicNoteList({
            size: 22
          })}
          onClick={() => {
            setSelectedPage("playlists");
          }}
        />
        <Chip
          class={selectedPage() === "albums" ? styles[ACTIVE_PAGE_CLASS] : ""}
          label="albums"
          icon={IoAlbums({
            size: 22
          })}
          onClick={() => {
            setSelectedPage("albums");
          }}
        />
        <Chip
          class={selectedPage() === "artists" ? styles[ACTIVE_PAGE_CLASS] : ""}
          label="artists"
          onClick={() => {
            setSelectedPage("artists");
          }}
          icon={BsPeopleFill({
            size: 22
          })}
        />
        <Chip
          class={selectedPage() === "songs" ? styles[ACTIVE_PAGE_CLASS] : ""}
          label="songs"
          icon={BsMusicNote({
            size: 22
          })}
          onClick={() => {
            setSelectedPage("songs");
          }}
        />
      </div>
      <div class={styles.library__content}>
        <Switch fallback={<div>Not found</div>}>
          <Match when={refreshing()}>
            <div class={styles.refreshing}>Refreshing...</div>
          </Match>
          <Match when={selectedPage() === "albums"}>
            <Albums />
          </Match>
          <Match when={selectedPage() === "artists"}>
            <Artists />
          </Match>
          <Match when={selectedPage() === "songs"}>
            <Songs />
          </Match>
          <Match when={selectedPage() === "playlists"}>
            <Playlists />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
