<?php
header('Content-Type: application/json');
$target = $_GET['target'];
$changeInformation = $_GET['dat'];
$dat = json_decode($changeInformation);
$nowDats = json_decode(file_get_contents('datas.json'));
$nowDats[$target]=$dat;
file_put_contents('datas.json',json_encode($nowDats,JSON_PRETTY_PRINT));
?>