const NewUser = {
	
	setPaths: function() {
		let self = this;
		self.pathAjax   = _CONFIG.rootURL +'newuser/ajax.php';
		self.pathFields = _CONFIG.rootURL +'newuser/fields.json';
	},
	
	
	start: function(callback){
		let self = this;
		
		self.setPaths();

		Fields.createFromFile(self.pathFields)
		.then(() => {
			
			$('#formNewUser').submit(function(event){
				event.preventDefault();
				NewUser.salvar();
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
				user:  $('#newUser_user').val(),
				pass:  $('#newUser_pass').val(),
				pass2: $('#newUser_pass2').val(),
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