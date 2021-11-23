#!/bin/bash

echo ''
echo -e '\e[1;33m'

echo 'The world`s greatest R4 installer';

echo ''
echo -e '\e[1;37m'

echo 'Informe o usuário administrador do banco de dados (pode ser o root):'

echo -e '\e[0;37m'

read -p 'DB Admin: ' userdb

echo -e '\e[1;37m'

echo 'Agora informe a senha de acesso deste usuario ao BD:'

echo -e '\e[0;37m'

read -sp 'DB Pass: ' passdb

echo ''

echo ''

#mysql -u $userdb -p$passdb -e "create database _sistema collate 'utf8mb4_general_ci';";

#mysql -u $userdb -p$passdb _sistema < utils/kickStartDB.sql

mkdir public
cd modules

composer -v > /dev/null 2>&1
COMPOSER=$?
if [[ $COMPOSER -ne 0 ]]; then

	echo -e '\e[1;31m'
	echo 'O Composer não está instaldo.'
	echo -e '\e[0;31mEle é necessário para instalar os módulos de terceiros.';

else

	composer install

fi