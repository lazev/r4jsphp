const Inicio = {

	userNome: '',
	setNomePop: null,

	setPaths: () => {
		Inicio.pathAjax   = _CONFIG.rootURL +'inicio/ajax.php';
		Inicio.pathFields = _CONFIG.rootURL +'inicio/fields.json';
	},


	init: () => {
		Inicio.setPaths();
		Inicio.getInit();
		Inicio.initForm();
		Inicio.initFields();
	},


	getInit: () => {
		let params = {
			com: 'getInit'
		};
		$().getJSON(Inicio.pathAjax, params)
		.then(ret => {
			Inicio.setHTMLNome(ret.dados.userNome);
			Inicio.setListaContas(ret.contas);
		});
	},


	initForm: () => {
		$('#formCriarConta').dialog({
			onOpen: function(){
				$('#inicioNomeConta').val('');
			},
			buttons: [
				{
					label:   'Criar nova conta',
					classes: 'bgSuccess',
					onClick: function(){
						Inicio.salvarConta();
					}
				},
				{
					label:   'Voltar',
					classes: 'R4DialogCloser bgDanger'
				}
			]
		});
	},


	initFields: () => {
		Fields.create([
			{ id: 'inicioNomeConta', type: 'string', maxSize: 200 }
		]);
	},


	abrirFormCriarConta: () => {
		$('#formCriarConta').dialog('open');
	},


	setHTMLNome: nome => {

		if(nome) {
			$('.labelUserNome').html(nome);
		} else {
			$('.labelUserNome').html('desconhecido <small><a href="#" id="linkTenhoNome">Ei, eu tenho nome</a></small>');
			Inicio.setNomePop = $('#linkTenhoNome').pop({
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
							Inicio.salvarNome(nome);
						} else {
							Warning.on('Preencha seu nome antes de clicar no botão');
						}
					});
				}
			});
		}
	},


	salvarNome: nome => {
		if(!nome) return;

		let params = {
			com: 'salvarNome',
			val: nome
		};
		$().getJSON(Inicio.pathAjax, params)
		.then(ret => {
			Inicio.setHTMLNome(ret.dados.userNome);
		})
	},


	setListaContas: dados => {
		for(let k in dados) {
			Inicio.addHTMLConta(dados[k]);
		}
	},


	salvarConta: () => {

		let params = {
			com: 'salvarConta',
			nome: $('#inicioNomeConta').val()
		};

		$().getJSON(Inicio.pathAjax, params)
		.then(ret => {
			Inicio.addHTMLConta(ret.dados);
			Dialog.close('formCriarConta');
		});
	},


	addHTMLConta:  dados => {

		let t = ''
			+ '<div class="linhaConta" cod="'+ dados.codigo +'">'
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

			$().getJSON(Inicio.pathAjax, params)
			.then(ret => {
				window.location = _CONFIG.rootURL +'produtos/';
			});
		});
	}

};