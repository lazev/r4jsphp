var cacheName = 'AppName-v4';

var filesToCache = [
	'index.html',
	'manifest.json',
	'access.js',
	'_r4/js/dialog.class.js',
	'_r4/js/r4.class.js',
	'_r4/js/pop.class.js',
	'_r4/js/table.class.js',
	'_r4/js/warning.class.js',
	'_r4/js/fields.class.js',
	'_r4/js/effects.class.js',
	'_styles/css/warning.css',
	'_styles/css/global.css',
	'_styles/css/grid.css',
	'_styles/css/fields.css',
	'_styles/css/vendor/normalize.css',
	'_styles/css/dialog.css',
	'_styles/css/table.css',
	'_styles/css/buttons.css',
	'_styles/icons/favicon.ico',
	'_styles/icons/icon-128x128.png',
	'_styles/icons/icon-144x144.png',
	'_styles/icons/icon-152x152.png',
	'_styles/icons/icon-16x16.png',
	'_styles/icons/icon-192x192.png',
	'_styles/icons/icon-32x32.png',
	'_styles/icons/icon-384x384.png',
	'_styles/icons/icon-512x512.png',
	'_styles/icons/icon-72x72.png',
	'_styles/icons/icon-96x96.png',
	'newuser/',
	'newuser/newuser.class.js',
	'newuser/fields.json',
	'newuser/index.html',
	'login/',
	'login/login.class.js',
	'login/fields.json',
	'login/index.html',
	'users/',
	'users/style.css',
	'users/users.class.js',
	'users/api.json'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', event => {
	console.log('[ServiceWorker] Fetching');
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
		})
	);
});

//self.addEventListener('activate', event => {
//	event.waitUntil(self.clients.claim());
//});

//self.addEventListener('message', function (event) {
//	if(event.data.action === 'skipWaiting') {
//		self.skipWaiting();
//	}
//});
