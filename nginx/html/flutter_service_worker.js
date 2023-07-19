'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon-16x16.png": "5ff66f03aa3fb6aa9c270be58b714ae9",
"version.json": "7204a4bb700de6e67a72f1568a893912",
"favicon.ico": "63bfde0da3c9e3febf5e1efb2faf9d4f",
"index.html": "bb3387b90ab94ffc7a2d44a475ecfd79",
"/": "bb3387b90ab94ffc7a2d44a475ecfd79",
"apple-icon.png": "38ee2804685b27a2a653a702ed7eb403",
"apple-icon-144x144.png": "323689c7c7d9f4cd3ffb50080f421079",
"android-icon-192x192.png": "0522fe6a068845d0fe55ef7346d20b91",
"apple-icon-precomposed.png": "38ee2804685b27a2a653a702ed7eb403",
"apple-icon-114x114.png": "cd528e0e6479f5758860308e2e20863b",
"main.dart.js": "a08dddb99ce27a7e0a3df9e26138e0d3",
"ms-icon-310x310.png": "bf23cf58d712d4f700fb20761049af0e",
"ms-icon-144x144.png": "323689c7c7d9f4cd3ffb50080f421079",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"apple-icon-57x57.png": "44bf0b93c91b7b2ef3ced2811b4fc6d2",
"apple-icon-152x152.png": "9817fe1d86fddcafdb3946da80d4c727",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"ms-icon-150x150.png": "7b78889432073008fcddfba1141435dd",
"android-icon-72x72.png": "b43260fc0193a0c4cebe65bd34fc43f1",
"android-icon-96x96.png": "4aa3f073c2ec7e53619a4a3edabbdfe0",
"android-icon-36x36.png": "0875632857317bc335f0fb31f0ce0149",
"apple-icon-180x180.png": "8ad206399bf9431ebf253e6ed5b21ddc",
"favicon-96x96.png": "4aa3f073c2ec7e53619a4a3edabbdfe0",
"icons/Icon-192.png": "757c44629b1d1fb7064c00f9d1713d27",
"icons/Icon-maskable-192.png": "757c44629b1d1fb7064c00f9d1713d27",
"icons/Icon-maskable-512.png": "b64142107290cb8191a3d9bf3bdd6e4e",
"icons/Icon-512.png": "b64142107290cb8191a3d9bf3bdd6e4e",
"manifest.json": "b6703fa17077e9cb1b80a7f1bf2a7e4e",
"android-icon-48x48.png": "fc4cb47fa33988816d1820ee8c1127bc",
"apple-icon-76x76.png": "030711b2856ede42ba3993f06807c528",
"apple-icon-60x60.png": "3f98b8cc9230d60815364f19bc3705dc",
"assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/NOTICES": "ecc5d630dc41e6336d8e6bd2e4bbbe0d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "693635b5258fe5f1cda720cf224f158c",
"assets/fonts/MaterialIcons-Regular.otf": "e16c99f490180432124e9ec0193d5bcd",
"browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"android-icon-144x144.png": "323689c7c7d9f4cd3ffb50080f421079",
"apple-icon-72x72.png": "b43260fc0193a0c4cebe65bd34fc43f1",
"apple-icon-120x120.png": "1799cfa694da4e9941b4cd3ab8ae00d0",
"favicon-32x32.png": "e4902751fdb998a407a04a57299522c9",
"ms-icon-70x70.png": "e74403a6c69177368d925b8b093387c0",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
