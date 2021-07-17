const SignUp = {

	setPaths: function() {
		let self = this;
		self.pathAjax   = _CONFIG.rootURL +'signup/ajax.php';
		self.pathFields = _CONFIG.rootURL +'signup/fields.json';
	},


	start: function(callback){
		let self = this;

		self.setPaths();

		Fields.createFromFile(self.pathFields)
		.then(() => {

			$('#formSignUp').submit(function(event){
				event.preventDefault();
				SignUp.salvar();
			});

			if(typeof callback == 'function') {
				callback();
			}
		});
	},


	salvar: function() {
		let self = this;

		if(self.validar()) {

			let params = {
				com:   'salvar',
				user:  $('#signUp_user').val(),
				pass:  $('#signUp_pass').val(),
				pass2: $('#signUp_pass2').val(),
			};

			$().getJSON(self.pathAjax, params)
			.then(dados => {
				if(dados.ok) {
					window.location = _CONFIG.rootURL +'inicio/';
				}
			})
			.catch(dados => {
				if(dados.status == '10') {
					Warning.on('<a href="'+ _CONFIG.rootURL +'login/">Clique aqui para recuperar o acesso</a>');
				}
			});
		}
	},


	validar: function() {
		return true;

	}

};