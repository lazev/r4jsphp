const Produtos = {

	codProduto: 0,

	listaOpcoes: [
		{ key: 14, label: 'Joe Gaston'  },
		{ key: 17, label: 'Arpei Rept'  },
		{ key: 1,  label: 'João Silva', extra: 'CPF: 012.031.152-51' },
		{ key: 20, label: 'Peiter Casc' }
	],


	listaIBU: [
		{ id: 1,   tipoBira: 'Standard American Lager',  IBU: '8-15'   },
		{ id: 52,  tipoBira: 'GermanPilsen (Pils)',      IBU: '25-45'  },
		{ id: 4,   tipoBira: 'Traditional Bock',         IBU: '20-27'  },
		{ id: 119, tipoBira: 'Standard EnglishPale Ale', IBU: '25-35'  },
		{ id: 2,   tipoBira: 'IrishRed Ale',             IBU: '17-28'  },
		{ id: 25,  tipoBira: 'American Pale Ale',        IBU: '30-45'  },
		{ id: 11,  tipoBira: 'Brown Porter',             IBU: '18-35'  },
		{ id: 542, tipoBira: 'DryStout',                 IBU: '30-45'  },
		{ id: 343, tipoBira: 'English IPA',              IBU: '40-60'  },
		{ id: 32,  tipoBira: 'American IPA',             IBU: '40-70'  },
		{ id: 19,  tipoBira: 'Imperial IPA',             IBU: '60-120' },
		{ id: 81,  tipoBira: 'Weissbier',                IBU: '8-15'   },
		{ id: 83,  tipoBira: 'Witbier',                  IBU: '10-20'  },
		{ id: 476, tipoBira: 'FruitLambic',              IBU: '0-10'   }
	],


	setPaths: () => {
		Produtos.pathAjax   = _CONFIG.rootURL +'produtos/ajax.php';
		Produtos.pathFields = _CONFIG.rootURL +'produtos/fields.json';
	},


	init: async () => {
		Produtos.setPaths();
		Produtos.initForm();
		Produtos.initFields();
		Produtos.initList();
		Produtos.getInit();


		//Modelo de render
		//*
		let infoElem = $().render($0('#tplProdutosInfoBox'), {
			nomeCerveja: 'SKOL',
			IBU: '-5'
		});

		$0('#infoBox').append(infoElem);
		//*/

		//Modelo de render com lista
		//*
		let tabelaElem = $().render($0('#tplProdutosListaIBU'), Produtos.listaIBU);
		console.log(tabelaElem);
		tabelaElem.forEach(item => {
			console.log(item);
			$0('#listaIBU').append(item);
		});
		//*/
	},


	initForm: async () => {
		await $('#formProdutos').dialog({
			buttons: [
				{
					label: 'Salvar',
					classes: 'bgSuccess white',
					onClick: function(ev) {
						console.log('Salvando produtos...');
						Produtos.save();
					}
				},
				{
					label: 'Fechar',
					classes: 'R4DialogCloser'
				}
			]
		});
	},


	initFields: async () => {
		await Fields.createFromFile(Produtos.pathFields, 'prod');
	},


	initList: () => {

		let head = [
			{ label: 'Cod',   orderBy: 'codigo' },
			{ label: 'Nome',  orderBy: 'nome'   },
			{ label: 'Preco', orderBy: 'preco', type: 'decimal', }
		];

		Table.create({
			idDestiny:    'listaProdutos',
			classes:      'striped',
			arrHead:      head,
			withCheck:    true,
			onLineClick:  value => { Produtos.edit(value);   },
			onOrderBy:    value => { Produtos.filter(value); },
			onPagination: value => { Produtos.filter(value); },
			onRegPerPage: value => { Produtos.filter(value); }
		});
	},


	getInit: () => {
		let params = {
			com: 'getInit'
		};
		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {});
	},


	insert: () => {
		Produtos.codProduto = 0;

		$('#formProdutos').reset();

		$('#formProdutos').dialog('open');
	},


	edit: id => {
		if(!id) return;

		let params = {
			com: 'read',
			codProduto: id
		};

		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {
			Produtos.codProduto = ret.produto.codigo;

			$('#prod_nome').val(       ret.produto.nome       );
			$('#prod_categoria').val(  ret.produto.categoria  );
			$('#prod_preco').val(      ret.produto.preco      );
			$('#prod_comEstoque').val( ret.produto.comEstoque );
			$('#prod_tags').val(       ret.produto.tags       );

			$('#formProdutos').dialog('open');
		})
	},


	save: codProduto => {

		let params = {
			com:        'save',
			codProduto: Produtos.codProduto,
			nome:       $('#prod_nome').val(),
			categoria:  $('#prod_categoria').val(),
			preco:      $('#prod_preco').val(),
			comEstoque: $('#prod_comEstoque').val(),
			tags:       $('#prod_tags').val()
		};

		$().getJSON(Produtos.pathAjax, params)

		.then(ret => {

			Warning.on('Produto cod '+ ret.produto.codigo);

			Produtos.list();

			$('#formProdutos').dialog('close');

		})

		.catch(err => {
			Warning.on('Erro ao salvar o produto');
			console.log(err);
		})
	},


	delete: id => {

		//register id (int) or table html id (str)
		let ids = (isNaN(id)) ? Table.getAllSel(id) : id;

		if(!ids.length) {
			Warning.on('Nenhum código informado para exclusão');
			return;
		}

		let params = {
			com: 'delete',
			ids: ids
		}

		$().getJSON(Produtos.pathAjax, params)

		.then(ret => {
			if(ret.deleted.length) {
				Warning.on('Itens excluidos: '+ ret.deleted.join(', '));
				Produtos.list();
			}

			if(ret.alert) {
				let k;
				for(k in ret.alert) {
					Warning.on('Erro na exclusão do item '+ k, ret.alert[k]);
				}
			}
		});
	},


	filter: () => {
		let filter = {};

		//PEDRINHA: Click no onRegPerPage não tá funcionando

		Produtos.list({
			listParams: Table.getInfo($('#listaProdutos')),
			listFilter: filter
		});
	},


	list: arrFilter => {

		if(!arrFilter) arrFilter = {};

		let params = {
			com: 'list',
			listParams: arrFilter.listParams,
			listFilter: arrFilter.listFilter
		};

		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {

			let goodVal = '';
			let check   = '';
			let body    = [];
			let foot    = [];
			let destiny = $('#listaProdutos');
			let vTotal  = 0.00;

			Table.setInfo(destiny, ret.info);

			if(!ret.list.length) {
				Table.clearBody(destiny);
				return;
			}

			ret.list.forEach(item => {
				goodVal = (item.preco > 20) ? 'success' : '';

				body.push({
					value: item.codigo,
					cells: [
						item.codigo,
						item.nome,
						item.preco
					],
					classes: [
						'nonClickCol',
						'',
						goodVal
					]
				});

				vTotal += parseFloat(item.preco);
			});

			foot.push({
				cells: [
					'',
					'TOTAL',
					$().round(vTotal, 2)
				]
			});

			Table.updateContent(destiny, body, foot);

		})
		.catch(err => {
			console.log(err);
			Warning.on('Erro', err);
		})
	}
};