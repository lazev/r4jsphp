Fields.TypeAhead = {

	create: elem => {
		elem.addEventListener('keydown', ev => {
			if(ev.keyCode == 188) {
				ev.preventDefault();
				Fields.TypeAhead.addTag(elem);
				console.log('virgula');
			}
			else if(ev.keyCode == 8) {
				if(elem.value == '') {
					Fields.TypeAhead.remTag(
						elem,
						elem.parentNode.querySelector('.tagList').querySelector('.tagItem:last-child')
					);

				}
			}

			console.log(ev.keyCode);
		});

		elem.addEventListener('blur', function(event){
			Fields.TypeAhead.addTag(elem);
			Fields.TypeAhead.withContent(event.target);
		});

		return elem;
	},


	withContent: elem => {
		console.log(elem.parentNode.querySelector('.tagList').querySelectorAll('.tagItem').length);
		if(!elem.parentNode.querySelector('.tagList').querySelectorAll('.tagItem').length) {
			elem.parentNode.classList.remove('withContent');
		} else {
			elem.parentNode.classList.add('withContent');
		}
	},


	addTag: elem => {
		let val = elem.value.trim();
		if(val) {
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
				Fields.TypeAhead.remTag(elem, ev.target.parentNode);
			});

			el.appendChild(rem);
			el.appendChild(txt);

			elem.closest('.R4Fields.tags').querySelector('.tagList').appendChild(el);
			elem.value = '';
		}
	},


	remTag: (elem, target) => {
		target.remove();
		Fields.TypeAhead.withContent(elem);
	},


	setVal: (elem, val) => {
		if(val) {
			elem
		}
	},


	getVal: elem => {
		let ret = [];
		elem.parentNode.querySelector('.tagList').querySelectorAll('.tagItem').forEach(el => {
			ret.push(el.getAttribute('value'));
		});
		return ret.join(',');
	}

};