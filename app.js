let map;

// マップに表示するマーカーオブジェクト
let my_marker;
let friend_marker;


// アプリに接続しているユーザid
let login_user_id = 2;
let login_user_name = "自分";


// ブラウザでデータの読み込みが完了したらアプリの処理を開始する
window.onload = function () {

  // どのユーザとして接続しているかをURLパラメータから取得する
  let url = new URL(window.location.href);
  let params = url.searchParams;
  login_user_id = params.get("user_id") ?? 2;
  login_user_name = params.get("display_name") ?? "自分";

  
  // ログインユーザ名を表示
  let element = document.getElementById("login-user-name");
  element.innerHTML = login_user_name;


  Init();
};


// アプリの初期処理 ----------------------------------
let Init = () => {
  // マップオブジェクトの生成
  map = L.map("map-canvas", {
    center: [34.482298, 136.824435], // 鳥羽商船図書館
    zoom: 20,
  });

  // 地図の表示：マップオブジェクトに表示する地図画像を指定
  let tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>",
  });
  tileLayer.addTo(map);

  // マーカーの表示
  SetMarkers();


  // 位置情報の取得とDBへの保存を定期的に行う処理
  setInterval(function () {
    GetPosition();
  }, INTERVAL_TIME);
}




// 自分・友達のマーカーを生成・更新する処理 -----------------------
let SetMarkers = () => {

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "functions/getUserLocation.php");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.responseType = "json";


  // 送信が成功したときの処理
  xhr.onload = () => {
    let response = xhr.response;

    let status = response["status"];
    if (status != "success") {
      return;
    }


    let data = response["data"];
    let my_location = data["my_location"];
    let friend_location = data["friend_location"];
    let distance = data["distance"];


    if (!my_marker) {
      // 自分のマーカー生成
      my_marker = InitMarker(my_location, distance);
    }
    else {
      // すでにマーカーが生成されている場合はマーカーのデータを更新する
      UpdateMarker(my_marker, my_location, distance);
    }

    if (!friend_marker) {
      // 友達のマーカー生成
      friend_marker = InitMarker(friend_location, distance);
    }
    else {
      // すでにマーカーが生成されている場合はマーカーのデータを更新する
      UpdateMarker(friend_marker, friend_location, distance);
    }

  };


  // 送信が失敗したときの処理
  xhr.onerror = () => {
    console.log("エラー");
  }


}



// マーカーを生成する処理 --------------------------------
let InitMarker = (location_data, distance) => {

  // マーカーの内容を生成する
  let marker_contents = setMarkerContents(location_data, distance);

  return L.marker(
    [location_data["latitude"], location_data["longitude"]],
    {
      icon: L.divIcon({
        html: marker_contents,
      })
    }).addTo(map);

}


// マーカーを更新する処理 --------------------------------
let UpdateMarker = (marker_obj, location_data, distance) => {

  // マーカーの内容を生成する
  let marker_contents = setMarkerContents(location_data, distance);



  // 位置情報の更新の有無のチェックボックスの状態取得
  let element = document.getElementById("update-button");
  let is_update = element.checked;

  if (!is_update) {
    // アイコンのみ更新
    let icon = L.divIcon({
      html: marker_contents,
    });
    marker_obj.setIcon(icon);
  }
  else {
    // マーカーの内容と位置情報を更新
    let icon = L.divIcon({
      html: marker_contents,
    });
    marker_obj.setIcon(icon);
    marker_obj.setLatLng(new L.LatLng(location_data["latitude"], location_data["longitude"]));



    // マーカーを画面の中心に表示する処理
    if (login_user_id == location_data["id"]) {
      //map.setView([location_data["latitude"], location_data["longitude"]]);
    }

  }


  return;
}



// マーカーの内容を生成する処理 --------------------------------
let setMarkerContents = (location_data, distance) => {
  let display_name = location_data["display_name"];
  let user_id = location_data["id"];
  let speed = location_data["speed"];
  let heading = location_data["heading"];

  // icon画像の置いてあるディレクトリ設定
  let icon_dir = "img/" + user_id + "/";
  // icon画像のurlの設定
  let icon_url = icon_dir + "default.png";



  // 位置情報の更新の有無のチェックボックスの状態取得
  let element = document.getElementById("update-button");
  let is_update = element.checked;

  if (login_user_id == user_id && !is_update) {
    icon_url = icon_dir + "freeze.png";
    speed = "---";
    heading = "---";
  }
  else {
    if (distance <= DISTANCE_FROM_FRIEND) {
      icon_url = icon_dir + "near.png";
    }
    else {
      icon_url = icon_dir + "default.png";
    }
  }



  return "<img class='marker-label-img' src='" + icon_url + "'>\
      <div class='marker-label-text'>"+ display_name + "<br>速度：" + speed + "m/s<br>方角：" + heading + "</div>";
}




// 位置情報を取得する処理 --------------------------------
let GetPosition = () => {
  navigator.geolocation.getCurrentPosition(GetPositionSuccess);
  //navigator.geolocation.watchPosition(GetPositionSuccess);
}

// 位置情報の取得が成功した時の処理
let GetPositionSuccess = (position) => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  let speed = position.coords.speed ?? 0.0; // 「??」は Null 合体演算子：この演算子は左辺が null または undefined の場合に右の値を返し、それ以外の場合に左の値を返す
  let heading = position.coords.heading ?? 0;
  let dt = new Date(position.timestamp); // 取得時刻
  dt = dt.toLocaleString();



  // データベースへ書き込む処理を書く
  let post_data = "lat=" + lat +
    "&lng=" + lng +
    "&speed=" + speed +
    "&heading=" + heading +
    "&dt=" + dt +
    "&user_id=" + login_user_id;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "functions/saveUserLocation.php");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(post_data);
  xhr.responseType = "json";


  // 送信が成功したときの処理
  xhr.onload = () => {
    // マーカーの更新
    SetMarkers();
  };

  // 送信が失敗したときの処理
  xhr.onerror = () => {
    console.log("エラー");
  }

}
