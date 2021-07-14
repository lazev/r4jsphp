const Table = {

	onOrderBy:    {},
	onPagination: {},
	onRegPerPage: {},
	onLineClick: null,

	head: [],
	body: [],
	foot: [],

	create: function(opts){

		if(!opts) opts = {};

		Table.idDestiny   = opts.idDestiny;
		Table.head        = opts.arrHead;
		Table.body        = opts.arrBody;
		Table.foot        = opts.arrFoot;
		Table.onLineClick = opts.onLineClick;

		let arrInfo       = opts.arrInfo;
		let onOrderBy     = opts.onOrderBy;
		let onRegPerPage  = opts.onRegPerPage;
		let onPagination  = opts.onPagination;

		let classes       = [];
		if(opts.classes) classes.push(opts.classes);

		let destiny = document.getElementById(Table.idDestiny);
		let table   = document.createElement('table');
		let body    = Table.createBody();
		let head    = Table.createHead();
		let foot    = Table.createFoot();

		classes.push('R4');
		table.setAttribute('class', classes.join(' '));

		if(head) table.appendChild(head);
		table.appendChild(body);
		if(foot) table.appendChild(foot);

		destiny.innerHTML = '';
		destiny.appendChild(table);

		if(arrInfo)      Table.setInfo(destiny, arrInfo);
		if(onOrderBy)    Table.onOrderBy[Table.idDestiny]    = onOrderBy;
		if(onRegPerPage) Table.onRegPerPage[Table.idDestiny] = onRegPerPage;
		if(onPagination) {
			let aftertbl = document.createElement('div');
			aftertbl.setAttribute('class', 'row clearfix');

			Table.onPagination[Table.idDestiny] = onPagination;
			let pgntn = Table.createPagination(destiny);
			if(pgntn) aftertbl.appendChild(pgntn);

			let rowspg = Table.createRegPerPage(destiny);
			if(rowspg) aftertbl.appendChild(rowspg);

			destiny.appendChild(aftertbl);
		}
	},


	setInfo: function(elem, params, clicked) {

		let destiny = elem[0] || elem;

		let info = Table.getInfo(destiny);

		if(params.orderBy)    {
			info.orderBy = params.orderBy.trim();
		}
		if(params.nowPage)    info.nowPage    = params.nowPage;
		if(params.regPerPage) info.regPerPage = params.regPerPage;
		if(params.totalReg)   info.totalReg   = params.totalReg;

		destiny.setAttribute('orderBy',    info.orderBy    );
		destiny.setAttribute('nowPage',    info.nowPage    );
		destiny.setAttribute('regPerPage', info.regPerPage );
		destiny.setAttribute('totalReg',   info.totalReg   );

		Table.updateOrderBy(destiny,    info.orderBy, clicked);
		Table.updatePagination(destiny, info.regPerPage, info.totalReg, info.nowPage);
		Table.updateRegPerPage(destiny, info.regPerPage);
	},


	getInfo: function(elem) {
		let arr = [];
		let destiny = elem[0] || elem;

		arr.orderBy    = destiny.getAttribute('orderBy')    || '';
		arr.nowPage    = destiny.getAttribute('nowPage')    || 1;
		arr.regPerPage = destiny.getAttribute('regPerPage') || 15;
		arr.totalReg   = destiny.getAttribute('totalReg')   || 0;

		return arr;
	},


	createHead: function() {

		if(!Table.head.length) return false;

		let thead = document.createElement('thead');
		let tr    = document.createElement('tr');
		let th;

		Table.head.forEach(function(cell){
			th = document.createElement('th');
			th.innerHTML = cell.label;

			if(cell.orderBy) {
				th.setAttribute('orderBy', cell.orderBy);
				th.addEventListener('click', function(event) {
					if(typeof Table.onOrderBy[Table.idDestiny] === 'function') {

						let direction = '';

						let arrow = this.querySelector('.R4OrderArrow');

						if(arrow) direction = arrow.getAttribute('direction') || '';

						let orderBy = this.getAttribute('orderBy') +' '+ direction;

						let tblElem = document.getElementById(Table.idDestiny);

						Table.setInfo(tblElem, { orderBy: orderBy }, true );

						Table.onOrderBy[Table.idDestiny](this.getAttribute('orderBy') +' '+ direction);
					}
				});
			}

			tr.appendChild(th);
		});

		thead.appendChild(tr);
		return thead;
	},


	createFoot: function() {

		if(!Table.foot) return false;

		if(!Table.foot.length) return false;

		let tfoot = document.createElement('tfoot');
		let tr    = document.createElement('tr');
		let td;

		Table.foot.forEach(function(cell){
			td = document.createElement('td');
			td.innerHTML = cell.label;
			tr.appendChild(td);
		});

		tfoot.appendChild(tr);
		return tfoot;
	},


	createBody: function() {
		let tr;
		let tbody = document.createElement('tbody');

		if(!Table.body) return tbody;

		if(!Table.body.length) return tbody;

		Table.body.forEach(function(line){
			tr = Table.createLine(line);
			tbody.appendChild(tr);
		});

		return tbody;
	},


	createLine: function(line) {

		let tr, td;

		tr = document.createElement('tr');
		tr.setAttribute('value', line.value);

		if(typeof Table.onLineClick === 'function') {
			tr.classList.add('clickable');
			tr.addEventListener('click', (event, elem) => {
				if(!event.target.classList.contains('nonClickCol')) {
					Table.onLineClick(
						event.target.parentNode.getAttribute('value'),
						event.target.parentNode
					);
				}
			});
		}

		line.cells.forEach(function(value, position){

			if(Table.head[position].type == 'decimal') {
				value = $().toEUNumber(value);
			}

			td = document.createElement('td');

			td.innerHTML = value;

			if(line.classes) {
				if(line.classes[position]) td.setAttribute('class', line.classes[position]);
			}

			tr.appendChild(td);
		});

		return tr;
	},


	updateBody: function(elem, body) {
		Table.clearBody(elem);
		Table.appendBody(elem, body);
	},


	clearBody: function(elem) {
		let destiny = elem[0] || elem;
		let tbody = destiny.querySelector('table > tbody');
		if(!tbody) return false;
		tbody.innerHTML = '';
	},


	appendBody: function(elem, body) {

		if(!body) return false;

		let tr;
		let destiny = elem[0] || elem;
		let tbody = destiny.querySelector('table > tbody');

		if(!tbody) return false;

		body.forEach(function(line){
			tr = Table.createLine(line);
			tbody.appendChild(tr);
		});
	},


	updateOrderBy: function(table, orderBy, clicked){

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

		if(clicked) {
			icon = '<span class="spinning">&#8597;</span>';
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

		let lastreg = (nowPage) * regPerPage;
		let lastpg  = Math.ceil(totalReg/regPerPage)-1;

		let pgntn = destiny.querySelector('.R4TablePgntn');
		if(!pgntn) return;

		let idDestiny = destiny.id;

		let hasPgs = false;

		if(nowPage <= 1) {

			pgntn.querySelector('.R4TablePageFirst').innerHTML = '&#x219E';
			pgntn.querySelector('.R4TablePagePrev').innerHTML = '&#x21BC';

		} else {

			let lnkFirst = document.createElement('button');
			lnkFirst.setAttribute('class',  'R4 bgWhite primary flat');
			lnkFirst.setAttribute('numPage', 0);
			lnkFirst.innerHTML = '&#x219E';

			let boxFirst = pgntn.querySelector('.R4TablePageFirst');
			boxFirst.innerHTML = '';
			boxFirst.appendChild(lnkFirst);

			let lnkPrev = document.createElement('button');
			lnkPrev.setAttribute('class',  'R4 bgWhite primary flat');
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
			lnkNext.setAttribute('class',  'R4 bgWhite primary flat');
			lnkNext.setAttribute('numPage', nowPage+1);
			lnkNext.innerHTML = '&#x21C0';

			let boxNext = pgntn.querySelector('.R4TablePageNext');
			boxNext.innerHTML = '';
			boxNext.appendChild(lnkNext);

			let lnkLast = document.createElement('button');
			lnkLast.setAttribute('class',  'R4 bgWhite primary flat');
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

							Table.setInfo(destiny, { nowPage: gotopg } );

							Table.onPagination[idDestiny](gotopg);
						}
					});
				});
			}
		}
	},


	createRegPerPage: function(destiny) {
		let li;
		let ul = document.createElement('ul');

		let idDestiny = destiny.id;

		[10, 15, 25, 50, 100, 500].forEach(function(item){
			li = document.createElement('li');
			li.setAttribute('numRegs', item);
			li.innerHTML = item + ' reg/pag';
			li.classList.add('clickable');

			li.addEventListener('click', function(){
				if(typeof Table.onRegPerPage[idDestiny] === 'function') {
					Table.setInfo(
						document.getElementById(Table.idDestiny),
						{ regPerPage: item }
					);

					Table.onRegPerPage[idDestiny](item);
				}
			});

			ul.appendChild(li);
		});

		let btnSel = document.createElement('button');
		btnSel.setAttribute('class', 'R4 bgWhite grey');
		btnSel.innerHTML = 'reg/pag';
		$(btnSel).pop({ html: ul });

		let rcpt = document.createElement('div');
		rcpt.setAttribute('class', 'col-2 R4TableRegPerPage')
		rcpt.appendChild(btnSel);

		return rcpt;
	},


	updateRegPerPage: function(destiny, numPage) {

		let regbtn = destiny.querySelector('.R4TableRegPerPage > button');
		if(!regbtn) return;

		regbtn.innerHTML = numPage +' reg/pag';
	},


	getAllSel: function(idElem) {
		let ret = [];
		document.querySelectorAll('#'+ idElem +' input:checked').forEach(elem => {
			ret.push(elem.value);
		});
		return ret;
	}
};