FieldsTags = {

	dom: {},

	create: (elem, info) => {
		elem.addEventListener('keydown', ev => {

			if(ev.keyCode == 188) {
				ev.preventDefault();
				FieldsTags.addTag(elem, elem.value);
			}
			else if(ev.keyCode == 13) {
				ev.preventDefault();
				if(info.typeahead) {
					let listElem = elem.parentNode.querySelector('.typeAheadList');
					let marked = listElem.querySelector('.marked');
					if(marked) {
						FieldsTags.addTag( elem, marked.querySelector('div').innerHTML );
					}
				}
			}
			else if(ev.keyCode == 8) {
				if(elem.value == '') {
					FieldsTags.remTag(
						elem,
						elem.parentNode.querySelector('.tagList').querySelector('.tagItem:last-child')
					);
				}
			}
			else if(ev.keyCode == 38) {
				FieldsTags.typeAheadMarkItem(ev.target, -1);
			}
			else if(ev.keyCode == 40) {
				FieldsTags.typeAheadMarkItem(ev.target, 1);
			}
		});

		elem.addEventListener('blur', function(event){
			FieldsTags.addTag(elem, elem.value);
			FieldsTags.withContent(event.target);
		});

		elem.addEventListener('paste', function(event){
			let paste = (event.clipboardData || window.clipboardData).getData('text');
			if(paste.indexOf(',') > -1) {
				setTimeout(() => {
					FieldsTags.appendVal(elem, elem.value);
				}, 100);
			}
		});

		if(info.typeahead) {
			FieldsTags.dom[info.id] = ev => {
				if((info.typeahead == 'json') || (info.typeahead == 'function')) {
					let list, listElem;

					let value = ev.target.value;

					if(typeof info.source == 'string') {
						list = FieldsTags.typeAheadFilterList(eval(info.source), value);
					}
					else if(typeof info.source == 'object') {
						list = FieldsTags.typeAheadFilterList(info.source, value);
					}

					listElem = FieldsTags.typeAheadFormatList(elem, list);

					let destiny = ev.target.parentNode.querySelector('.typeAheadList');
					destiny.innerHTML = '';
					destiny.appendChild(listElem);
				}
			};

			elem.addEventListener('keyup', ev => {
				if((ev.keyCode != 38) && (ev.keyCode != 40)) {
					FieldsTags.dom[ev.target.id](ev);
				}
			});

			elem.addEventListener('blur', ev => {
				setTimeout(() => {
					ev.target.parentNode.querySelector('.typeAheadList').innerHTML = '';
				}, 100);
			});
		}


		return elem;
	},


	typeAheadMarkItem: (elem, direction) => {
		let listElem = elem.parentNode.querySelector('.typeAheadList');
		let marked = listElem.querySelector('.marked');

		if(!marked) {
			let listItem = listElem.querySelector('li:first-child');
			if(listItem) listItem.classList.add('marked');
		}
		else {
			let next;
			if(direction > 0)      next = marked.nextElementSibling;
			else if(direction < 0) next = marked.previousElementSibling;

			if(!next) return;

			listElem.querySelectorAll('ul > li').forEach(item => {
				item.classList.remove('marked');
			});

			next.classList.add('marked');
		}
	},


	typeAheadFilterList: (source, value) => {
		value = value.toLowerCase();

		let ret = source.filter((item) => {
			return (item.label.toLowerCase().indexOf(value) > -1);
		});

		return ret;
	},


	typeAheadFormatList: (elem, list) => {
		let ul = document.createElement('ul');

		list.forEach(function(item){
			ul.appendChild(FieldsTags.typeAheadFormatListItem(item));
		});

		ul.querySelectorAll('li').forEach(li => {
			li.addEventListener('mouseenter', ev => {
				ev.target.parentNode.querySelectorAll('li').forEach(item => {
					item.classList.remove('marked');
				});
				ev.target.classList.add('marked');
			});

			li.addEventListener('click', ev => {
				FieldsTags.addTag( elem, ev.target.parentNode.querySelector('div').innerHTML );
				elem.focus();
			});
		});

		return ul;
	},


	typeAheadFormatListItem: item => {
		let extra;
		let label = document.createElement('div');
		label.innerHTML = item.label;

		if(item.extra) {
			extra = document.createElement('div');
			extra.innerHTML = item.extra;
		}

		let li = document.createElement('li');
		li.setAttribute('value', item.key);

		li.appendChild(label);
		if(extra) {
			li.appendChild(extra);
		}

		return li;
	},


	withContent: elem => {
		if(!elem.parentNode.querySelector('.tagList').querySelectorAll('.tagItem').length) {
			elem.parentNode.classList.remove('withContent');
		} else {
			elem.parentNode.classList.add('withContent');
		}
	},


	addTag: (elem, val) => {
		val = val.trim();

		if(!val) return;

		let vals = FieldsTags.getVal(elem, true);
		for(let k in vals) {
			if(vals[k] == val) {
				k++;
				Effects.blink(elem.parentNode.querySelector('.tagList').querySelector(':nth-child('+ k +')'));
				elem.value = '';
				return;
			}
		}

		let el = document.createElement('div');
		el.classList.add('tagItem');
		el.classList.add('bgPrimary');
		el.classList.add('white');
		el.classList.add('corner');
		el.setAttribute('value', val);

		let txt = document.createTextNode(val);

		let rem = document.createElement('span');
		rem.innerHTML = 'x';
		rem.classList.add('closer');
		rem.addEventListener('click', ev => {
			FieldsTags.remTag(elem, ev.target.parentNode);
		});

		el.appendChild(rem);
		el.appendChild(txt);

		elem.parentNode.querySelector('.tagList').appendChild(el);
		elem.value = '';
	},


	clrTag: elem => {
		elem.parentNode.querySelector('.tagList').innerHTML = '';
		FieldsTags.withContent(elem);
	},


	remTag: (elem, target) => {
		target.remove();
		FieldsTags.withContent(elem);
	},


	setVal: (elem, val) => {
		FieldsTags.clrTag(elem);
		FieldsTags.appendVal(elem, val);
	},


	appendVal: (elem, val) => {
		elem.value = '';
		if(val) {
			if(val.indexOf(',') > -1) {
				let arr = val.split(',');
				arr.forEach(item => {
					FieldsTags.addTag(elem, item);
				});
			} else {
				FieldsTags.addTag(elem, val);
			}
		}
	},


	getVal: (elem, arrFormat) => {
		let ret = [];
		elem.parentNode.querySelector('.tagList').querySelectorAll('.tagItem').forEach(el => {
			ret.push(el.getAttribute('value'));
		});
		if(arrFormat) return ret;
		return ret.join(',');
	}

};