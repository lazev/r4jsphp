const Produtos = {
	
	codProduto: 0,

	setPaths: () => {
		Produtos.pathAjax   = _CONFIG.rootURL +'produtos/ajax.php';
		Produtos.pathFields = _CONFIG.rootURL +'produtos/fields.json';
	},


	init: async () => {
		await Produtos.setPaths();
		await Produtos.initForm();
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
		
		await Fields.createFromFile(Produtos.pathFields, 'prod');
		
		await Produtos.getInit();
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


	list: () => {
		
		let params = {
			com: 'list'
		};

		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {
			Produtos.createList(ret.list, ret.info);
		})
	},
	
	
	createList: (list, info) => {
		
		let head = [
			{ label: 'Cod' },
			{ label: 'Nome' },
			{ label: 'Preco', type: 'decimal' },
			{ label: '' }
		];
		
		let goodVal = '';
		let check = '';
		let body = [];
		list.forEach(item => {
			
			goodVal = (item.preco > 20) ? 'success' : '';
			
			check = '<label><input type="checkbox" value="'+ item.codigo +'"> '+ item.codigo +'</label>';
			
			body.push({
				classes: [
					'nonClickCol',
					'',
					goodVal
				],
				value: item.codigo,
				cells: [
					check,
					item.nome,
					item.preco
				]
			});
		});
		
		
		Table.create({
			idDestiny: 'listaProdutos',
			arrHead: head,
			arrBody: body,
			onLineClick: (value, elem) => {
				Produtos.edit(value);
			}
		});
	}
};