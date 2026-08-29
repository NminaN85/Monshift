import {
  init
} from "./ui.js";


if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("../sw.js")
        .catch(
          error =>
            console.log(
              "Service Worker:",
              error
            )
        );

    }
  );

}


init();
