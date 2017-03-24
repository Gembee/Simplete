<?php

if (!isset($_GET['q']) || $_GET['q'] == '') {
    throw new HttpInvalidParamException('Invalid parameters');
}
$q = $_GET['q'];

$tags = [];
if ($mysqli = mysqli_connect('localhost', 'root', '', 'lessreal')) {
    if ($result = mysqli_query($mysqli, "SELECT * FROM primary_tags WHERE label LIKE '{$q}%' LIMIT 10")) {
        while ($row = mysqli_fetch_assoc($result)) {
            $tags[] = $row['label'];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($tags);
