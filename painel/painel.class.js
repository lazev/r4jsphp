const Painel = {
	
	setPaths: function() {
		let self = this;
		self.pathAjax   = _CONFIG.rootURL +'painel/ajax.php';
		self.pathFields = _CONFIG.rootURL +'painel/fields.json';
	},
	
	
	start: function(callback){
		let self = this;

		self.setPaths();
		
		self.getInit()
		.then(() => {
			Fields.createFromFile(self.pathFields)
			.then(() => {
				if(typeof callback == 'function') {
					callback();
				}
			});
		})
		.catch(ret => {
			if(ret.status == 10) {
				window.location = 'inicio/';
			}
		});

	},
	

	getInit: function(){

		$().getJSON(Inicio.pathAjax, {
			com: 'getInit'
		})
		.then(ret => {
			
		});
	}
};