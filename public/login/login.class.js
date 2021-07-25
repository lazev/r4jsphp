const Login = {

	setPaths: function() {
		let self = this;
		self.pathAjax   = _CONFIG.rootURL +'login/ajax.php';
		self.pathFields = _CONFIG.rootURL +'login/fields.json';
	},


	init: async function() {
		Login.setPaths();
		Login.initFields();
	},

	
	initFields: async () => {
		await Fields.createFromFile(Login.pathFields)
		.then(() => {

			$('#formLogin').on('submit', function(event){
				event.preventDefault();
				Login.logar();
			});
		});
	},


	logar: function(){
		let params = {
			com: 'login',
			user: $('#login_user').val(),
			pass: $('#login_pass').val()
		};

		$().getJSON(Login.pathAjax, params)

		.then(dados => {
			if(dados.logged) {
				window.location = _CONFIG.rootURL +'inicio/';
			}
		})

		.catch(dados => {
			
		});
	}
};