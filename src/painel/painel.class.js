const Painel = {

	userNome: '',
	setNomePop: null,

	setPaths: () => {
		Painel.pathAjax   = _CONFIG.rootURL +'painel/ajax.php';
		Painel.pathFields = _CONFIG.rootURL +'painel/fields.json';
	},


	init: () => {
		Painel.setPaths();
		Painel.getInit();
	},


	getInit: () => {
		let params = {
			com: 'getInit'
		};
		$().getJSON(Painel.pathAjax, params)
		.then(ret => {

		});
	}

};