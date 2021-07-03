const Produtos = {

	userNome: '',
	setNomePop: null,

	setPaths: function() {
		Produtos.pathAjax   = _CONFIG.rootURL +'produtos/ajax.php';
		Produtos.pathFields = _CONFIG.rootURL +'produtos/fields.json';
	},


	iniciar: function(){
		Produtos.setPaths();
		Produtos.getInit();
	},


	getInit: function(){
		let params = {
			com: 'getInit'
		};
		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {
			Produtos.setHTMLNome(ret.dados.userNome);
			Produtos.setListaContas(ret.contas);
			Produtos.setClickNovaConta();
		});
	},


	setHTMLNome: function(nome) {

		if(nome) {
			$('.labelUserNome').html(nome);
		} else {
			$('.labelUserNome').html('desconhecido <small><a href="#" id="linkTenhoNome">Ei, eu tenho nome</a></small>');
			Produtos.setNomePop = $('#linkTenhoNome').pop({
				preventDefault: true,
				classes: 'paspatur',
				html: '<div id="inputUserNome">Diga seu nome</div><div id="btnUserNome">Gravar</div>',
				onOpen: function(){
					Fields.create([
						{ id:'inputUserNome', type:'string' },
						{ id:'btnUserNome',   type:'button', classes:'bgSuccess' }
					]);

					$('#inputUserNome').focus();

					$('#btnUserNome').click(function(){
						let nome = $('#inputUserNome').val();
						if(nome) {
							Pop.destroyAll('force');
							Produtos.salvarNome(nome);
						} else {
							Warning.on('Preencha seu nome antes de clicar no botão');
						}
					});
				}
			});
		}
	},


	salvarNome: function(nome){
		if(!nome) return;

		let params = {
			com: 'salvarNome',
			val: nome
		};
		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {
			Produtos.setHTMLNome(ret.dados.userNome);
		})
	},


	setListaContas: function(dados) {
		for(let k in dados) {
			Produtos.addHTMLConta(dados[k]);
		}
	},


	setClickNovaConta: function(){
		$('#boxCriarConta').click(function(){
			$('#formCriarConta').dialog({
				onCreate: function(){
					Fields.create([
						{ id: 'produtosNomeConta', type: 'string', maxSize: 200 }
					]);
				},
				onOpen: function(){
					$('#produtosNomeConta').val('');
				},
				buttons: [
					{
						label:   'Criar nova conta',
						classes: 'bgSuccess',
						onClick: function(){
							Produtos.salvarConta();
						}
					},
					{
						label:   'Voltar',
						classes: 'R4DialogCloser bgDanger'
					}
				]
			});
			//$('#formCriarConta').dialog('open');
		});
	},


	salvarConta: function(){

		let params = {
			com: 'salvarConta',
			nome: $('#produtosNomeConta').val()
		};

		$().getJSON(Produtos.pathAjax, params)
		.then(ret => {
			Produtos.addHTMLConta(ret.dados);
			Dialog.close('formCriarConta');
		});
	},


	addHTMLConta:  function(dados){

		let t = '<div class="linhaConta" cod="'+ dados.codigo +'">'
			+ '<div>'+ dados.codigo                 +'</div>'
			+ '<div>'+ dados.nome                   +'</div>'
			+ '<div>'+ $().dateMask(dados.dtAcesso) +'</div>'
			+ '</div>';

		$('#boxContas').append(t);

		$('.linhaConta[cod="'+ dados.codigo +'"]').click(function(event) {

			let params = {
				com: 'selConta',
				cod: $(this).attr('cod')
			};

			$().getJSON(Produtos.pathAjax, params)
			.then(ret => {
				window.location = 'confer/';
			});
		});

	}

};