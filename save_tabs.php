<?php
header('Content-Type: application/json');

$json = file_get_contents('php://input');

if ($json) {
    $data = json_decode($json, true);

    if ($data !== null) {
        if (file_put_contents('tabs_data.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['status' => 'success', 'message' => 'Дані успішно збережено!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Помилка запису у файл.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Некоректний JSON.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Дані не отримано.']);
}
?>