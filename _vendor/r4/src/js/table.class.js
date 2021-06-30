const Table = {

	head: [],
	body: [],
	foot: [],

	onOrderBy: {},
	onPagination: {},
	onRegPerPage: {},


	clear: function(){
		Table.head = [];
		Table.body = [];
		Table.foot = [];
	},


	create: function(opts){

		if(!opts) opts = {};

		let arrHead      = opts.arrHead;
		let arrBody      = opts.arrBody;
		let arrFoot      = opts.arrFoot;
		let idDestiny    = opts.idDestiny;
		let onOrderBy    = opts.onOrderBy;
		let onRegPerPage = opts.onRegPerPage;
		let onPagination = opts.onPagination;
		let classes      = [];

		let destiny = document.getElementById(idDestiny);

		if(opts.classes) classes.push(opts.classes);
		classes.push('R4Table');

		let table = document.createElement('table');
		let tbody = Table.createBody(arrBody);
		let head  = Table.createHead(idDestiny, arrHead);
		let foot  = Table.createFoot(arrFoot);

		table.setAttribute('class', classes.join(' '));

		if(head) table.appendChild(head);
		table.appendChild(tbody);
		if(foot) table.appendChild(foot);

		let aftertbl = document.createElement('div');
		aftertbl.setAttribute('class', 'row clearfix');

		if(onPagination) {
			Table.onPagination[idDestiny] = onPagination;
			let pgntn = Table.createPagination(destiny);
			if(pgntn) aftertbl.appendChild(pgntn);

			let rowspg = Table.createRegPerPage(destiny);
			if(rowspg) aftertbl.appendChild(rowspg);
		}

		destiny.appendChild(table);
		destiny.appendChild(aftertbl);

		if(onOrderBy) Table.onOrderBy[idDestiny] = onOrderBy;

		if(onRegPerPage) Table.onRegPerPage[idDestiny] = onRegPerPage;
	},


	setInfo: function(elem, params) {

		let destiny = elem[0] || elem;

		let table = destiny.querySelector('table');

		let orderBy = params.orderBy.trim();

		if(params.orderBy)    table.setAttribute('orderBy',    orderBy           );
		if(params.nowPage)    table.setAttribute('nowPage',    params.nowPage    );
		if(params.regPerPage) table.setAttribute('regPerPage', params.regPerPage );
		if(params.totalReg)   table.setAttribute('totalReg',   params.totalReg   );

		Table.updateOrderBy(table, orderBy);
		Table.updatePagination(destiny, params.regPerPage, params.totalReg, params.nowPage);
		Table.updateRegPerPage(destiny, params.regPerPage);
	},


	getInfo: function(elem) {
		let arr = [];
		let destiny = elem[0] || elem;
		let table = destiny.querySelector('table');

		arr.orderBy  = table.getAttribute('orderBy')  || '';
		arr.nowPage  = table.getAttribute('nowPage')  || 1;
		arr.rowsPage = table.getAttribute('rowsPage') || 15;
		arr.totalReg = table.getAttribute('totalReg') || 0;

		return arr;
	},


	updateOrderBy: function(table, orderBy){

		if(!orderBy) return;

		let todie, icon, asc;

		if(orderBy.substr(-5) == ' desc') {
			icon    = '&#8593;';
			asc     = '';
			orderBy = orderBy.substr(0, orderBy.length-5);
		} else {
			icon    = '&#8595;';
			asc     = 'desc';
		}

		let cleaner = table.querySelectorAll('thead > tr > th');

		Array.prototype.forEach.call(cleaner, function(item){
			todie = item.querySelector('span.R4OrderArrow');
			if(todie) todie.remove();
		});

		let th = table.querySelector('[orderBy="'+ orderBy +'"]');

		if(th) {
			let orderer = document.createElement('span');
			orderer.classList.add('R4OrderArrow');
			orderer.setAttribute('direction', asc);
			orderer.innerHTML = icon;

			th.appendChild(orderer);
		}
	},


	createPagination: function(destiny) {

		let table = destiny.querySelector('table');

		let first = document.createElement('div');
		let prev  = document.createElement('div');
		let pgntn = document.createElement('div');
		let next  = document.createElement('div');
		let last  = document.createElement('div');

		pgntn.setAttribute('class', 'col-4   onRight R4TablePgntn'     );
		first.setAttribute('class', 'col-xs-3 center R4TablePageFirst' );
		prev.setAttribute('class',  'col-xs-3 center R4TablePagePrev'  );
		next.setAttribute('class',  'col-xs-3 center R4TablePageNext'  );
		last.setAttribute('class',  'col-xs-3 center R4TablePageLast'  );

		first.innerHTML = '&#x219E';
		prev.innerHTML  = '&#x21BC';
		next.innerHTML  = '&#x21C0';
		last.innerHTML  = '&#x21A0';

		pgntn.appendChild(first);
		pgntn.appendChild(prev);
		pgntn.appendChild(next);
		pgntn.appendChild(last);

		return pgntn;
	},


	updatePagination: function(destiny, regPerPage, totalReg, nowPage){

		regPerPage  = parseInt(regPerPage);
		totalReg    = parseInt(totalReg);
		nowPage     = parseInt(nowPage);

		let lastreg = (nowPage + 1) * regPerPage;
		let lastpg  = Math.ceil(totalReg/regPerPage)-1;

		let pgntn = destiny.querySelector('.R4TablePgntn');

		let idDestiny = destiny.id;

		let hasPgs = false;

		if(nowPage <= 0) {

			pgntn.querySelector('.R4TablePageFirst').innerHTML = '&#x219E';
			pgntn.querySelector('.R4TablePagePrev').innerHTML = '&#x21BC';

		} else {

			let lnkFirst = document.createElement('button');
			lnkFirst.setAttribute('class',  'R4Buttons bgWhite primary flat');
			lnkFirst.setAttribute('numPage', 0);
			lnkFirst.innerHTML = '&#x219E';

			let boxFirst = pgntn.querySelector('.R4TablePageFirst');
			boxFirst.innerHTML = '';
			boxFirst.appendChild(lnkFirst);

			let lnkPrev = document.createElement('button');
			lnkPrev.setAttribute('class',  'R4Buttons bgWhite primary flat');
			lnkPrev.setAttribute('numPage', nowPage-1);
			lnkPrev.innerHTML = '&#x21BC';

			let boxPrev = pgntn.querySelector('.R4TablePagePrev');
			boxPrev.innerHTML = '';
			boxPrev.appendChild(lnkPrev);

			hasPgs = true;
		}

		if(lastreg >= totalReg) {

			pgntn.querySelector('.R4TablePageNext').innerHTML = '&#x21C0';
			pgntn.querySelector('.R4TablePageLast').innerHTML = '&#x21A0';

		} else {

			let lnkNext = document.createElement('button');
			lnkNext.setAttribute('class',  'R4Buttons bgWhite primary flat');
			lnkNext.setAttribute('numPage', nowPage+1);
			lnkNext.innerHTML = '&#x21C0';

			let boxNext = pgntn.querySelector('.R4TablePageNext');
			boxNext.innerHTML = '';
			boxNext.appendChild(lnkNext);

			let lnkLast = document.createElement('button');
			lnkLast.setAttribute('class',  'R4Buttons bgWhite primary flat');
			lnkLast.setAttribute('numPage', lastpg);
			lnkLast.innerHTML = '&#x21A0';

			let boxLast = pgntn.querySelector('.R4TablePageLast');
			boxLast.innerHTML = '';
			boxLast.appendChild(lnkLast);

			hasPgs = true;
		}

		if(hasPgs) {
			let lnks = pgntn.querySelectorAll('button');
			if(lnks.length) {
				Array.prototype.map.call(lnks, function(item){
					let gotopg = item.getAttribute('numPage');
					item.addEventListener('click', function(){
						if(typeof Table.onPagination[idDestiny] === 'function') {
							Table.onPagination[idDestiny](gotopg);
						}
					});
				});
			}
		}
	},


	createRegPerPage: function(destiny) {
/* -----
SVG Icons - svgicons.sparkk.fr
-----

.svg-icon {
  width: 1em;
  height: 1em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #4691f6;
}

.svg-icon circle {
  stroke: #4691f6;
  stroke-width: 1;
}
*/

		let li;
		let ul = document.createElement('ul');

		let idDestiny = destiny.id;

		[10, 15, 25, 50, 100, 500].forEach(function(item){
			li = document.createElement('li');
			li.setAttribute('numRegs', item);
			li.innerHTML = item + ' reg/<svg class="svg-icon" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"></path></svg>';

			li.addEventListener('click', function(){
				if(typeof Table.onRegPerPage[idDestiny] === 'function') {
					Table.onRegPerPage[idDestiny](item);
				}
			});

			ul.appendChild(li);
		});

		let btnSel = document.createElement('button');
		btnSel.setAttribute('class', 'R4Buttons bgWhite grey');
		btnSel.innerHTML = 'reg/<svg class="svg-icon" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"></path></svg>';
		$(btnSel).pop({ html: ul });

		let rcpt = document.createElement('div');
		rcpt.setAttribute('class', 'col-2 R4TableRegPerPage')
		rcpt.appendChild(btnSel);

		return rcpt;
	},


	updateRegPerPage: function(destiny, numPage) {

		let regbtn = destiny.querySelector('.R4TableRegPerPage > button');

		regbtn.innerHTML = numPage +' reg/<svg class="svg-icon" viewBox="0 0 20 20" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"></path></svg>';

	},


	createHead: function(idDestiny, arrHead) {

		if(!arrHead.length) return false;

		let thead = document.createElement('thead');
		let tr    = document.createElement('tr');
		let th;

		arrHead.forEach(function(cell){
			th = document.createElement('th');
			th.innerHTML = cell.label;

			if(cell.orderBy) {
				th.setAttribute('orderBy', cell.orderBy);
				th.addEventListener('click', function(event) {
					if(typeof Table.onOrderBy[idDestiny] === 'function') {

						let direction = '';
						let arrow = this.querySelector('.R4OrderArrow');

						if(arrow) direction = arrow.getAttribute('direction') || '';

						Table.onOrderBy[idDestiny](this.getAttribute('orderBy') +' '+ direction);
					}
				});
			}

			tr.appendChild(th);
		});

		thead.appendChild(tr);
		return thead;
	},


	createBody: function(arrBody) {
		let tr;
		let tbody = document.createElement('tbody');

		if(!arrBody) return tbody;

		if(!arrBody.length) return tbody;

		arrBody.forEach(function(line){
			tr = Table.createLine(line);
			tbody.appendChild(tr);
		});

		return tbody;
	},


	clearBody: function(elem) {
		let destiny = elem[0] || elem;
		let tbody = destiny.querySelector('table > tbody');
		if(!tbody) return false;
		tbody.innerHTML = '';
	},


	insertBody: function(elem, arrBody) {
		Table.clearBody(elem);
		Table.appendBody(elem, arrBody);
	},


	appendBody: function(elem, arrBody) {

		if(!arrBody.length) return false;

		let tr;
		let destiny = elem[0] || elem;
		let tbody = destiny.querySelector('table > tbody');

		if(!tbody) return false;

		arrBody.forEach(function(line){
			tr = Table.createLine(line);
			tbody.appendChild(tr);
		});
	},


	createLine: function(line) {

		let tr, td;

		tr = document.createElement('tr');
		tr.setAttribute('value', line.value);

		line.cells.forEach(function(cell, position){
			td = document.createElement('td');

			td.innerHTML = cell;

			if(line.classes) {
				if(line.classes[position]) td.setAttribute('class', line.classes[position]);
			}

			tr.appendChild(td);
		});

		return tr;
	},


	createFoot: function(arrFoot) {

		if(!arrFoot) return false;

		if(!arrFoot.length) return false;

		let tfoot = document.createElement('tfoot');
		let tr    = document.createElement('tr');
		let td;

		arrFoot.forEach(function(cell){
			td = document.createElement('td');
			td.innerHTML = cell.label;
			tr.appendChild(td);
		});

		tfoot.appendChild(tr);
		return tfoot;
	}
};