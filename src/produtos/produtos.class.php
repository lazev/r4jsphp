<?php

class Produtos {

	public $errMsg = '';
	public $errObs = '';

	public function read($id, $detail='') {
		global $db;

		$id = (int)$id;

		if(!$id) {
			$this->errMsg = 'Não foi possível detalhar o produto';
			$this->errObs = 'Não foi informado o código do registro';
			return false;
		}

		$dados = $db->sql("
			select *
			from `produtos`
			where id = $id
			limit 1
		");
		
		if($detail) {
			return $dados[$detail];
		}

		return $dados;
	}


	public function save($id, $dados) {
		global $db;

		$id = (int)$id;

		$new = [
			'nome'       => $dados['nome'],
			'categoria'  => $dados['categoria'],
			'preco'      => $dados['preco'] ?: 0,
			'tags'       => $dados['tags'],
			'comEstoque' => $dados['comEstoque'] ?: 0
		];

		if($id) {
			$id = $this->update($id, $new);
		} else {
			$id = $this->insert($new);
		}
		
		if($id === false) return false;

		return [
			'id' => $id
		];
	}
	
	
	public function insert($params) {
		$id = $db->sql('insert into `produtos`', $params);

		if($id === false) {
			$this->errMsg = 'Erro ao inserir o produto';
			$this->errObs = '';
			return false;
		}
		
		return $id;
	}
	
	
	public function update($id, $params) {
		global $db;

		$alt = [];

		$old = $db->sql("
			select *
			from `produtos`
			where id = $id
			limit 1
		");

		foreach($old as $key => $val) {
			$alt[$key] = (array_key_exists($key, $params)) ? $params[$key] : $old[$key];
		}
		
		$retdb = $db->sql("
			update `produtos`
			set [fields]
			where id = $id
		", $alt);

		if($retdb === false) {
			$this->errMsg = 'Erro ao atualizar o produto';
			$this->errObs = '';
			return false;
		}
		
		return $id;
	}


	public function delete($ids) {
		global $db;

		$listId = R4::intArray($ids);

		$strId = implode(', ', $listId);

		$produtos = $db->sql("
			select id, ativo
			from `produtos`
			where id in ($strId)
		");

		foreach($produtos as $key => $item) {
			$list[ $item['id'] ] = $item;
		}

		$deleted = [];
		$alert   = [];

		foreach($listId as $id) {

			if(!$list[$id]['id']) {
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
				where id = $id
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


	public function list($listFilter=[], $listParams=[]) {
		global $db;

		$params = $this->listFilter($listFilter, $listParams);

		$limit       = $params['limit'];
		$orderBy     = $params['orderBy'];
		$currentPage = $params['currentPage'];
		$regPerPage  = $params['regPerPage'];
		$strFilter   = $params['strFilter'];

		//$db->setDebug(1);

		$list = $db->sql("
			select *
			from `produtos`
			where ativo = 1
			$strFilter
			order by $orderBy
			limit $limit
		");

		$count = $db->sql("
			select count(*) as 'total'
			from `produtos`
			where ativo = 1
			$strFilter
			limit 1
		");

		$info = [
			'orderBy'     => $orderBy,
			'currentPage' => $currentPage,
			'regPerPage'  => $regPerPage,
			'totalReg'    => (int)$count['total']
		];

		return [
			'list' => $list,
			'info' => $info
		];
	}


	private function listFilter($listFilter=[], $listParams=[]) {

		if(!is_array($listParams)) $listParams = [];
		if(!is_array($listFilter)) $listFilter = [];

		$arrFilter   = [];
		$orderBy     = @$listParams['orderBy']     ?: 'nome';
		$currentPage = @$listParams['currentPage'] ?: 1;
		$regPerPage  = @$listParams['regPerPage']  ?: 15;
		$limit       = $regPerPage*($currentPage-1) .','. $regPerPage;

		//Filters

		$filter = @$listFilter['busca'] ?: false;
		if($filter) {
			$arrFilter[] = "(id = $filter or busca like '%$filter%')";
		}

		$filter = @$listFilter['categoria'] ?: false;
		if($filter) {
			$arrFilter[] = "categoria like '%$filter%'";
		}

		return [
			'limit'       => $limit,
			'orderBy'     => $orderBy,
			'currentPage' => $currentPage,
			'regPerPage'  => $regPerPage,
			'strFilter'   => (count($arrFilter)) ? implode(' and ', $arrFilter) : ''
		];
	}
}