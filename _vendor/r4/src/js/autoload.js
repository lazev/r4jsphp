let R4ALCounter = 0;
let R4ALFiles   = [
	'_vendor/r4/src/js/main.class.js',
	'_vendor/r4/src/js/dialog.class.js',
	'_vendor/r4/src/js/effects.class.js',
	'_vendor/r4/src/js/fields.class.js',
	'_vendor/r4/src/js/pop.class.js',
	'_vendor/r4/src/js/sbar.class.js',
	'_vendor/r4/src/js/table.class.js',
	'_vendor/r4/src/js/warning.class.js'
];

R4ALFiles.map(file => {
	R4ALCounter++;

	let script    = document.createElement('script');
	script.src    = file;
	script.onload = () => {
		R4ALCounter--;
		if(R4ALCounter === 0) $().init();
	};

	document.head.append(script);
});