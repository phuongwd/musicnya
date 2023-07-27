import {
  BiSolidHome,
  BiSolidPlaylist,
  BiSolidAlbum,
  BiSolidMessage,
  BiSolidSearch,
  BiRegularSearch,
  BiRegularLibrary,
} from "solid-icons/bi";
import {
  IoGrid,
  IoRadio,
  IoSettings,
  IoAlbums,
  IoChevronBack,
  IoChevronForward,
} from "solid-icons/io";
import { BsList, BsMusicNote, BsPeopleFill } from "solid-icons/bs";
import { CircleIcon } from "../CircleIcon/CircleIcon";
import styles from "./Drawer.module.scss";
import { A } from "@solidjs/router";
import {
  rightPanelContent,
  rightPanelOpen,
  setRightPanelContent,
  setRightPanelOpen,
} from "../../stores/store";
import { fetchLyrics } from "../Lyrics/Lyrics";
import { Tooltip } from "../Tooltip/Tooltip";

const lightTheme = false;
//matchMedia("(prefers-color-scheme: light)").matches;

export function Drawer() {
  return (
    <div class={styles.drawer}>
      <div class={styles.drawer__top}>
        <CircleIcon style="margin-top: 10px;" />
        <div class={styles.drawer__top__nav_arrows}>
          <Tooltip text="back" position="right">
            <IoChevronBack
              size={25}
              fill={lightTheme ? "#aaa" : "#757575"}
              color={lightTheme ? "#aaa" : "#757575"}
              class={styles.drawer__top__nav_arrows__back}
              onclick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            />
          </Tooltip>
          <Tooltip text="forward" position="right">
            <IoChevronForward
              size={25}
              fill={lightTheme ? "#aaa" : "#757575"}
              color={lightTheme ? "#aaa" : "#757575"}
              class={styles.drawer__top__nav_arrows__forward}
              onclick={(e) => {
                e.preventDefault();
                window.history.forward();
              }}
            />
          </Tooltip>
        </div>
      </div>
      <div class={styles.drawer__middle}>
        <Tooltip text="search" position="right">
          <A href="/search" activeClass="active-route">
            <BiRegularSearch size={25} fill={lightTheme ? "#aaa" : "#757575"} />
          </A>
        </Tooltip>
        <Tooltip text="home" position="right">
          <A href="/home" activeClass="active-route">
            <BiSolidHome size={25} fill={lightTheme ? "#aaa" : "#757575"} />
          </A>
        </Tooltip>
        <Tooltip text="browse" position="right">
          <A href="/browse" activeClass="active-route">
            <IoGrid size={25} fill={lightTheme ? "#aaa" : "#757575"} />
          </A>
        </Tooltip>
        <Tooltip text="radio" position="right">
          <A href="/radio" activeClass="active-route">
            <IoRadio size={25} fill={lightTheme ? "#aaa" : "#757575"} />
          </A>
        </Tooltip>
        <Tooltip text="library" position="right" style={"margin-top: 2rem;"}>
          <A href="/library" activeClass="active-route">
            <BiRegularLibrary
              size={25}
              fill={lightTheme ? "#aaa" : "#757575"}
            />
          </A>
        </Tooltip>
        <Tooltip text="lyrics" position="right" style={"margin-top: 2rem;"}>
          <BiSolidMessage
            size={25}
            class={styles.drawer__bottom__lyrics}
            fill={lightTheme ? "#aaa" : "#757575"}
            onclick={(e) => {
              document.body.style.setProperty(
                "--panel-offset",
                rightPanelOpen.value
                  ? rightPanelContent.value === "queue"
                    ? "18rem"
                    : "4rem"
                  : "18rem",
              );

              rightPanelOpen.value === true &&
              rightPanelContent.value === "lyrics"
                ? setRightPanelOpen({ value: false })
                : setRightPanelOpen({ value: true });

              setRightPanelContent({ value: "lyrics" });
              if (rightPanelOpen.value) {
                fetchLyrics();
              }
            }}
          />
        </Tooltip>
        <Tooltip text="queue" position="right">
          <BsList
            size={25}
            fill={lightTheme ? "#aaa" : "#757575"}
            onclick={() => {
              document.body.style.setProperty(
                "--panel-offset",
                rightPanelOpen.value
                  ? rightPanelContent.value === "lyrics"
                    ? "18rem"
                    : "4rem"
                  : "18rem",
              );

              rightPanelOpen.value === true &&
              rightPanelContent.value === "queue"
                ? setRightPanelOpen({ value: false })
                : setRightPanelOpen({ value: true });

              setRightPanelContent({ value: "queue" });
            }}
          />
        </Tooltip>
      </div>
      <div class={styles.drawer__bottom}>
        <Tooltip text="settings" position="right">
          <A href="/settings" activeClass="active-route">
            <IoSettings size={25} fill={lightTheme ? "#aaa" : "#757575"} />
          </A>
        </Tooltip>
      </div>
    </div>
  );
}
