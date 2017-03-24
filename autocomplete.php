<?php

if (!isset($_GET['q']) || $_GET['q'] == '') {
    throw new HttpInvalidParamException('Invalid parameters');
}
$q = $_GET['q'];

$dummyTags = [
    'Naruto',
    'Bleach',
    'Sakura',
    'Uzumaki Naruto',
    'Narakashi',
    'Nandato',
    'Uzumaki Naragashi',
    'Narbuto'
];

$returnTags = [];

foreach ($dummyTags as $dummyTag) {
    if (strtolower($q) == strtolower($dummyTag)) {
        $returnTags[] = $dummyTag;
    }
}

header('Content-Type: application/json');
echo json_encode($returnTags);
