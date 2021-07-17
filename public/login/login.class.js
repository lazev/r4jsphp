const Login = {

	setPaths: function() {
		let self = this;
		self.pathAjax   = _CONFIG.rootURL +'login/ajax.php';
		self.pathFields = _CONFIG.rootURL +'login/fields.json';
	},


	start: function(callback) {
		let self = this;

		self.setPaths();

		Fields.createFromFile(self.pathFields)
		.then(() => {

			$('#formLogin').on('submit', function(event){
				event.preventDefault();
				self.logar();
			});

			if(typeof callback == 'function') {
				callback();
			}
		});
	},
	
	
	logar: function(){
		let self = this;

		let params = {
			com: 'login',
			user: $('#login_user').val(),
			pass: $('#login_pass').val()
		};

		$().getJSON(self.pathAjax, params)

		.then(dados => {
			if(dados.logged) {
				window.location = _CONFIG.rootURL +'inicio/';
			}
		})

		.catch(dados => {
			
		});

	}


};