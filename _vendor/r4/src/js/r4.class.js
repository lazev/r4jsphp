const R4SWorkerPath = 'sworker.js';

document.addEventListener('DOMContentLoaded', function() {
	$().init((typeof R4Init === 'function') ? R4Init : null);
});


$.methods = {

	//PURE FUNCTIONS

	init: function(R4Init) {
		$().listeners()

		if(typeof R4Init === 'function') R4Init()

		//$().sWorker();
	},


	listeners: function() {
		//mobile debuger
		window.onerror = function (msg, url, lineNo, columnNo, error) {
			Warning.on(msg, url +': '+ lineNo +':'+columnNo+':'+error)
		};

		document.addEventListener('keydown', function(event) {
			if (event.keyCode == 27) {
				if (typeof Dialog === 'object') {
					Dialog.closeLastOpen()
				}
			}
		});

		document.addEventListener('mousedown', function(event) {
			Pop.destroyAll()
		});
	},


	sWorker: function() {

		window.isUpdateAvailable = new Promise(function(resolve, reject) {
			console.log('Worker init')

			if('serviceWorker' in navigator) {
				navigator.serviceWorker.register(R4SWorkerPath)

				.then(function(reg) {

					reg.onupdatefound = function() {

						console.log('Update found')

						newWorker = reg.installing;

						newWorker.onstatechange = function(){
							if(newWorker.state == 'installed') {
								resolve(navigator.serviceWorker.controller)
							}
						}
					}
				})

				.catch(err => console.error('[SW ERROR]', err))
			}
		});

		window['isUpdateAvailable']
		.then(function(isAvailable) {
			if (isAvailable) {
				if(confirm('New version found. Update?')) {
					window.location.reload()
				}
			}
		});

	},


	uniqid: function() {
		return (
			Math.random()
				.toString()
				.substr(-5) +
			Math.random()
				.toString()
				.substr(-5)
		)
	},


	getJSON: function(url, params, opts) {
		if (!opts) opts = {};
		if (!params) params = {};

		return new Promise(function(resolve, reject) {
			let method = opts.method || 'POST';

			let xhr = new XMLHttpRequest();

			var strParams;

			xhr.open(method, url, true);

			if (typeof params === 'object') {
				strParams = new FormData();
				for (var key in params) strParams.append(key, params[key]);
			} else {
				strParams = params;
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var resp = xhr.responseText;
						try {
							var jResp = JSON.parse(resp);

							if(jResp.error === 1) {
								Warning.on(jResp.errMsg, jResp.errObs);
								reject(jResp);
							} else {
								resolve(jResp);
							}
						} catch(err) {
							Warning.on(xhr.status);
							reject(xhr.status);
						}
					} else {
						Warning.on(xhr.status);
						reject(xhr.status);
					}
				}
			};

			xhr.send(strParams);
		});
	},


	getScript: function(files) {
		return new Promise((resolve, reject) => {
			let arrFiles = [];

			if(typeof files === 'string') arrFiles = [files]
			else arrFiles = files

			arrFiles.map(file => {
				let script   = document.createElement('script')
				script.src   = file
				script.async = 1
				document.head.append(script)
			})

			resolve()
		})
	},


	//JQUERY FUNCTIONS
	each: function(func) {
		Array.prototype.forEach.call(this, func);
	},

	find: function(selector) {
		var seen = new Set();
		var results = [];

		this.each(el => {
			Array.prototype.forEach.call(el.querySelectorAll(selector), child => {
				if (!seen.has(child)) {
					seen.add(child);
					results.push(child);
				}
			});
		});

		return $(results);
	},

	closest: function(selector) {
		var closest = [];

		this.each(el => {
			let curEl = el;

			while (curEl.parentElement && !curEl.parentElement.matches(selector)) {
				curEl = curEl.parentElement;
			}
			if (curEl.parentElement) {
				closest.push(curEl.parentElement);
			}
		});

		return $(closest);
	},

	toggleClass: function(className) {
		this.each(el => {
			el.classList.toggle(className);
		});
	},

	addClass: function(className) {
		this.each(el => {
			el.classList.add(className);
		});
	},

	removeClass: function(className) {
		this.each(el => {
			el.classList.remove(className);
		});
	},

	text: function(t) {
		if (arguments.length === 0) {
			return this[0].innerText;
		} else {
			this.each(el => (el.innerText = t));
		}
	},

	val: function(t) {
		if (arguments.length === 0) {
			return this[0].value;
		} else {
			this.each(el => {
				if(el.getAttribute('R4Type') == 'switch') {
					if(t) {
						el.checked = true;
					} else {
						el.checked = false;
					}
				}
				let ev = new Event('blur');
				el.value = t;
				el.dispatchEvent(ev);
			});
		}
	},

	html: function(t) {
		if (arguments.length === 0) {
			return this[0].innerHTML;
		} else {
			this.each(el => (el.innerHTML = t));
		}
	},

	dateMask: function(dt) {
		if(!dt) return '';

		return dt.substr(8, 2) +'/'
		     + dt.substr(5, 2) +'/'
		     + dt.substr(0, 4);
	},

	attr: function(name, value) {
		if (typeof value === 'undefined') {
			return this[0].getAttribute(name);
		} else {
			this.each(el => el.setAttribute(name, value));
		}
	},

	removeAttr: function(name) {
		this.each(el => el.removeAttribute(name));
	},

	css: function(style, value) {
		if (typeof style === 'string') {
			if (typeof value === 'undefined') {
				return getComputedStyle(this[0])[style];
			} else {
				this.each(el => (el.style[style] = value));
			}
		} else {
			this.each(el => Object.assign(el.style, style));
		}
	},

	on: function(event, cb) {
		this.each(el => {
			el.addEventListener(event, cb);
		});
	},

	off: function(event, cb) {
		this.each(el => {
			el.removeEventListener(event, cb);
		});
	},

	click: function(cb) {
		this.each(el => {
			el.addEventListener('click', cb);
		});
	},

	submit: function(cb) {
		this.each(el => {
			el.addEventListener('submit', cb);
		});
	},

	append: function(content) {
		if (typeof content === 'string') {
			this.each(el => (el.insertAdjacentHTML('beforeend', content)));
		} else if (content instanceof Element) {
			this.each(el => el.appendChild(content.cloneNode(true)));
		} else if (content instanceof Array) {
			content.forEach(each => this.append(each));
		}
	},

	prepend: function(content) {
		if (typeof content === 'string') {
			this.each(el => (el.insertAdjacentHTML('afterbegin', content)));
		} else if (content instanceof Element) {
			this.each(el => el.parentNode.insertBefore(content.cloneNode(true), el));
		} else if (content instanceof Array) {
			content.forEach(each => this.prepend(each));
		}
	},

	clone: function() {
		return $(Array.prototype.map.call(this, el => el.cloneNode(true)));
	},

	focus: function() {
		this.each(el => {
			el.focus();
			return;
		});
	},


	//EFFECTS FUNCTION
	slideUp: function(callback) {
		this.each(el => {
			Effects.slideUp(el, callback);
		});
	},


	slideDown: function(callback) {
		this.each(el => {
			Effects.slideDown(el, callback);
		});
	},


	fadeIn: function(callback, duration, display) {
		this.each(el => {
			Effects.fadeIn(el, callback, duration, display);
		});
	},


	fadeOut: function (callback, duration) {
		this.each(el => {
			Effects.fadeOut(el, callback, duration);
		});
	},


	fadeIn: function(callback, duration, display) {
		this.each(el => {
			Effects.fadeIn(el, callback);
		});
	},


	//R4 FUNCTIONS
	dialog: function(opts) {

		if(opts === 'close') {
			Dialog.close(this[0].getAttribute('id'));
		} else {

			if(opts === 'open') {
				let open = true;
				opts = {};
			} else if(!opts) {
				opts = {};
			}

			this.each(el => {
				opts.elem = el;
				let title = el.getAttribute('title');
				if((title) && (!opts.title)) {
					opts.title = title;
				}
				if(open) {
					Dialog.open(opts);
				} else {
					Dialog.create(opts);
				}
			});
		}
	},

	pop: function(opts) {
		this.each(el => {
			el.addEventListener('click', function(event){
				if(opts.preventDefault) event.preventDefault();
				opts.destiny = el;
				Pop.create(opts);
			});
		});
	},

	hint: function(txt) {
		Pop.hint(this, txt);
	}
};


//https://www.caktusgroup.com/blog/2017/02/08/how-make-jquery/

function $0(arg) {
	return document.querySelector(arg);
}

function $(arg) {
	let results;

	if (typeof arg === 'undefined') {
		results = [];
	} else if (arg instanceof Element) {
		results = [arg];
	} else if (typeof arg === 'string') {
		// If the argument looks like HTML, parse it into a DOM fragment
		if (arg.startsWith('<')) {
			let fragment = document.createRange().createContextualFragment(arg);
			results = [fragment];
		} else {
			// Convert the NodeList from querySelectorAll into a proper Array
			results = Array.prototype.slice.call(document.querySelectorAll(arg));
		}
	} else {
		// Assume an array-like argument and convert to an actual array
		results = Array.prototype.slice.call(arg);
	}

	results.__proto__ = $.methods;

	return results;
}