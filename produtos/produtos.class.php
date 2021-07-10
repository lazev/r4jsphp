<?php

class Produtos {

	public $errMsg = '';
	public $errObs = '';

	
	public function read($codProduto) {
		global $db;
		
		$codProduto = (int)$codProduto;
		
		if(!$codProduto) {
			$this->errMsg = 'Não foi possível detalhar o produto';
			$this->errObs = 'Não foi informado o código do registro';
			return false;
		}
		
		$dados = $db->sql("
			select *
			from `produtos`
			where codigo = $codProduto
			limit 1
		");
		
		return $dados;
	}


	public function save($codProduto, $dados) {
		global $db;

		$codProduto = (int)$codProduto;

		//INSERT
		if(!$codProduto) {
			$new = [
				'nome'       => $dados['nome'],
				'categoria'  => $dados['categoria'],
				'preco'      => $dados['preco'],
				'tags'       => $dados['tags'],
				'comEstoque' => $dados['comEstoque']
			];
			
			$codProduto = $db->insert('produtos', $new);
			
			if($codProduto === false) {
				$this->errMsg = 'Erro ao salvar o produto';
				$this->errObs = '';
				return false;
			}
		}

		//UPDATE
		else {
			$old = $db->sql("
				select *
				from `produtos`
				where codigo = $codProduto
			");

			$alt = [
				'nome'       => $dados['nome'],
				'categoria'  => $dados['categoria'],
				'preco'      => $dados['preco'],
				'tags'       => $dados['tags'],
				'comEstoque' => $dados['comEstoque']
			];

			$retdb = $db->sql("
				update `produtos`
				set [fields]
				where codigo = $codProduto
			", $alt);
		}

		return [
			'codigo' => $codProduto
		];
	}
	
	
	public function list($arrFiltros) {
		global $db;

		$lista = $db->sql("
			select *
			from `produtos`
			where ativo = 1
			order by nome
		");

		return [
			'list' => $lista,
			'info' => $info
		];
	}
	
	
	public function delete($ids) {
		global $db;
		
		$listId = R4::intArray($ids);
		
		$strId = implode(', ', $listId);
		
		$produtos = $db->sql("
			select codigo, ativo
			from `produtos`
			where codigo in ($strId)
		");

		foreach($produtos as $key => $item) {
			$list[ $item['codigo'] ] = $item;
		}

		$deleted = [];
		$alert   = [];
		
		foreach($listId as $id) {
			
			if(!$list[$id]['codigo']) {
				$alert[$id] = 'Item não encontrado';
				continue;
			}
			
			if($item['ativo'] == 0) {
				$alert[$id] = 'Item já excluído antes';
				continue;
			}
			
			$ret = $db->sql("
				update `produtos`
				set
					dtDel = now(),
					ativo = 0
				where codigo = $id
			");
			
			if($ret === false) {
				$alert[$id] = 'Erro na exclusão do item';
				continue;
			}
			
			$deleted[] = $id;
		}
		
		return [
			'deleted' => $deleted,
			'alert'   => $alert
		];
	}
}