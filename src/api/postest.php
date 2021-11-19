<?php
$url = 'https://api.sistemaseinformacao.com.br/api/login/DispositivoCliente';
$url = 'http://lerio-owoxm.run-us-west2.goorm.io/api/produtos/';

$payload = '{ "iddispositivo": 0, "nome": "FMO", "serialHd": "FM4F4DA6" }';

$token = base64_encode('id1:ZiQ7hEvb9cYEku7Cm89zGZy5ZoLbIa8SgHUceO4IHoLbafeLapbgY+3qrYr0cdFA/1+coJ66LRFEcQRph6cSDw==');

$header = [
	'Authorization: Basic '. $token,
	'Content-Type: application/json',
	'Accept: application/json'
];

$ch = curl_init();

curl_setopt_array($ch, [
//	CURLOPT_POST           => false,
	CURLOPT_URL            => $url,
	CURLOPT_HTTPHEADER     => $header,
	CURLOPT_POSTFIELDS     => $payload,
	CURLOPT_CUSTOMREQUEST  => 'GET',
	CURLOPT_MAXREDIRS      => 10,
	CURLOPT_TIMEOUT        => 10,
	CURLOPT_SSL_VERIFYHOST => 2,
	CURLOPT_SSL_VERIFYPEER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HEADER         => false
]);

echo '<pre>';

// for($ii=0; $ii<10; $ii++) {
// 	$ret    = curl_exec($ch);
// 	$retArr = json_decode($ret, 1);
// 	print_r($retArr);
// }

$ret    = curl_exec($ch);
$retArr = json_decode($ret, 1);

print_r($retArr);

echo '</pre>';