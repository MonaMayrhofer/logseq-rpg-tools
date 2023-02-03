import React, { FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { KeyboardEventHandler } from "react";
import * as ReactDOM from "react-dom/client";
import { DatePicker } from "./DatePicker";
import "./Modal.css";

let currentApp: ReactDOM.Root | undefined = undefined;

export function closeCurrentApp() {
  if (currentApp) {
    console.log("Destroy old hi");
    currentApp.unmount();
    currentApp = undefined;
  }
  logseq.hideMainUI();
  logseq.Editor.restoreEditingCursor();
}

type ModalWrapperProps = {
  children?: ReactNode;
};
export const ModalWrapper: FunctionComponent<ModalWrapperProps> = ({
  children,
}) => {
  console.log("Hi from dp");

  const close = () => {
    console.log("Bye from dp");
    closeCurrentApp();
  };

  const key: KeyboardEventHandler = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    if (e.code === "Escape") {
      close();
    }
  };

  const prevent: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="rpg-calendar--modal-wrapper"
      style={{
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
      }}
      onClick={() => close()}
      onKeyDown={key}
    >
      <div className="rpg-calendar--modal" onClick={prevent}>
        {children}
      </div>
    </div>
  );
};

export function showDatePicker() {
  closeCurrentApp();
  const rootElem = document.getElementById("app");
  if (rootElem == undefined) {
    return;
  }

  const old = document.getElementById("rpg-calendar-modal");
  if (old) {
    console.warn("Found zombie react root element");
    old.remove();
  }
  const reactRoot = document.createElement("div");
  reactRoot.id = "rpg-calendar-modal";
  rootElem.appendChild(reactRoot);
  console.log(reactRoot);
  const root = ReactDOM.createRoot(reactRoot);
  currentApp = root;
  root.render(
    <ModalWrapper>
      <DatePicker></DatePicker>
    </ModalWrapper>
  );
  console.log("Hii");
  logseq.showMainUI();
}
