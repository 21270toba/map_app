<?php
date_default_timezone_set('Asia/Tokyo'); // タイムゾーンを設定


define("DB_SERVER", "localhost"); // サーバ名
define("DB_DATABASE", "map_app"); // データベース名
define("DB_USERNAME", "root");    // データベースのユーザ名
define("DB_PASSWORD", "ここには自分のパスワードを書く"); // データベースのパスワード
define("PDO_DSN", "mysql:host=" . DB_SERVER . ";dbname=" . DB_DATABASE . ";charset=utf8;");



// データベースのテーブル[ user_location ] での自分・友達のid
define("FRIEND_USER_ID", "1");
define("MY_USER_ID", "2");
