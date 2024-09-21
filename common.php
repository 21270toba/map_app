<?php
date_default_timezone_set('Asia/Tokyo'); // タイムゾーンを設定


define("DB_SERVER", "localhost"); // サーバ名
define("DB_DATABASE", "map_app"); // データベース名
define("DB_USERNAME", "非公開");    // データベースのユーザ名
define("DB_PASSWORD", "非公開"); // データベースのパスワード
define("PDO_DSN", "mysql:host=" . DB_SERVER . ";dbname=" . DB_DATABASE . ";charset=utf8;");



// データベースのテーブル[ user_location ] での自分・友達のid
define("FRIEND_USER_ID", "1");
define("MY_USER_ID", "2");
