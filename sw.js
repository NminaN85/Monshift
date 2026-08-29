const CACHE_NAME =
  "monshift-v1";


const FILES = [

  "./",

  "./index.html",

  "./css/style.css",

  "./js/app.js",

  "./js/ui.js",

  "./js/storage.js",

  "./js/calculations.js",

  "./js/calendar.js",

  "./js/stats.js",

  "./js/translations.js",

  "./manifest.webmanifest",

  "./assets/icon.svg"

];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          cache =>
            cache.addAll(FILES)
        )

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      self.clients.claim()
    );

  }
);


self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }


    event.respondWith(

      caches
        .match(event.request)
        .then(cached => {

          if (cached) {
            return cached;
          }


          return fetch(
            event.request
          )

          .then(response => {

            const copy =
              response.clone();


            caches
              .open(CACHE_NAME)
              .then(
                cache =>
                  cache.put(
                    event.request,
                    copy
                  )
              );


            return response;

          })

          .catch(
            () =>
              caches.match(
                "./index.html"
              )
          );

        })

    );

  }
);
