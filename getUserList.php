<?php
// データベースへの接続情報を読み込む
include "common.php";


try {
  $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // データを取得する
  $sql = "SELECT id, display_name FROM user_location";
  $stmt = $db->query($sql);
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $db = null;

  $ret = array("status" => "success", "data" => $users);
} catch (PDOException $e) {
  $ret = array("status" => "fail", "data" => $e->getMessage());
}

echo json_encode($ret, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
