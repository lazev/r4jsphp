const Login = {

	setPaths: () => {
		Login.pathAjax   = _CONFIG.rootURL +'login/ajax.php';
		Login.pathFields = _CONFIG.rootURL +'login/fields.json';
	},


	init: async () => {
		Login.setPaths();
		Login.initFields();
	},


	initFields: async () => {
		await Fields.createFromFile(Login.pathFields)
		.then(() => {

			$('#formLogin').submit(event => {
				event.preventDefault();
				Login.login();
			});
		});
	},


	login: () => {
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