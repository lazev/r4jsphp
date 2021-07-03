const Painel = {

	userNome: '',
	setNomePop: null,

	setPaths: function() {
		Painel.pathAjax   = _CONFIG.rootURL +'painel/ajax.php';
		Painel.pathFields = _CONFIG.rootURL +'painel/fields.json';
	},


	iniciar: function(){
		Painel.setPaths();
		Painel.getInit();
	},


	getInit: function(){
		let params = {
			com: 'getInit'
		};
		$().getJSON(Painel.pathAjax, params)
		.then(ret => {

		});
	}

};