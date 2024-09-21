<?php
/* -------------------------------------
 * マーカーデータを返す処理
 * ------------------------------------- */

include "common.php";


$ret = array();

try {
  // データベースに接続
  $db = new PDO(PDO_DSN, DB_USERNAME, DB_PASSWORD);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);



  // （１）自分の位置情報を取得する処理を書き、結果を$my_locationに格納する
  $stmt = $db->prepare("SELECT 
                          id, display_name, latitude, longitude, ROUND(speed, 2) AS speed, heading, update_time 
                        FROM user_location 
                        WHERE id=:user_id");
  $stmt->execute(array(":user_id" => MY_USER_ID));
  $my_location = $stmt->fetch(PDO::FETCH_ASSOC);


  // （２）友達の位置情報を取得する処理を書き、結果を$friend_locationに格納する
  $stmt = $db->prepare("SELECT 
                          id, display_name, latitude, longitude, ROUND(speed, 2) AS speed, heading, update_time 
                        FROM user_location 
                        WHERE id=:user_id");
  $stmt->execute(array(":user_id" => FRIEND_USER_ID));
  $friend_location = $stmt->fetch(PDO::FETCH_ASSOC);



  // （３）自分と友達との距離を計算する処理を書き、結果を$distanceに格納する
  $distance = CalcDistance($my_location["latitude"], $my_location["longitude"], $friend_location["latitude"], $friend_location["longitude"]);


  // 応答データをまとめる
  $ret = array(
    "status" => "success",
    "data" => array("my_location" => $my_location, "friend_location" => $friend_location, "distance" => $distance)
  );

  // データベース切断
  $db = null;
} catch (PDOException $e) {
  $ret = array("status" => "fail", "message" => $e->getMessage());
}


// JSON形式でデータを返す
echo json_encode($ret, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);




/* ----------------------------------- 
 * 2点間の距離[m]を計算する関数
 * ----------------------------------- */
function CalcDistance($lat1, $lng1, $lat2, $lng2)
{
  $R = pi() / 180;
  $lat1 *= $R;
  $lng1 *= $R;
  $lat2 *= $R;
  $lng2 *= $R;
  return 6371 * acos(cos($lat1) * cos($lat2) * cos($lng2 - $lng1) + sin($lat1) * sin($lat2)) * 1000;
}
