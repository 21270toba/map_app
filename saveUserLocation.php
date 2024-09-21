<?php
/* -------------------------------------
 * 自分の位置情報をデータベースに上書き保存する処理
 * ------------------------------------- */

include "common.php";


if ($_SERVER["REQUEST_METHOD"] == "POST") {

  try {
    $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 自分の位置情報を更新する
    $stmt = $db->prepare("UPDATE user_location 
                          SET latitude=:lat, longitude=:lng, speed=:speed, heading=:heading, update_time=:dt
                          WHERE id=:user_id");

    $stmt->execute(
      array(
        ":lat" => $_POST["lat"],
        ":lng" => $_POST["lng"],
        ":speed" => $_POST["speed"],
        ":heading" => $_POST["heading"],
        ":dt" =>  $_POST["dt"],
        ":user_id" => $_POST["user_id"]
      )
    );
    $ret = array("status" => "success", "message" => "success");

    $db = null;
  } catch (PDOException $e) {
    $ret = array("status" => "fail", "message" => $e->getMessage());
  }

  // JSON形式でテーブルの更新ができたか否かを返す
  echo json_encode($ret, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
}
