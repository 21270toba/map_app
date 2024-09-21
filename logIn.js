// 画面がロードされたときにユーザリストを表示する -----------
window.onload = function () {
    GetUserData();
  }
  
  
  
  
  // データベースからユーザ一覧を取得する --------------------
  let GetUserData = () => {
  
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "functions/getUserList.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.responseType = "json";
  
  
    // 送信が成功したときの処理
    xhr.onload = () => {
      let response = xhr.response;
      let data = response["data"];
      SetUserList(data);
    };
  
    // 送信が失敗したときの処理
    xhr.onerror = () => {
      alert("error");
    }
  };
  
  
  
  // データベースから取得したデータをリスト表示する -----------
  let SetUserList = (values) => {
    let element = document.getElementById("user-list");
    element.innerHTML = ""; // いったん表示をクリアする
  
  
    let len = values.length;
    let tag = "";
  
    for (let i = 0; i < len; i++) {
      let user_id = values[i]["id"];
      let display_name = values[i]["display_name"];
  
      tag += "<li><a href='index.html?user_id=" + user_id + "&display_name=" + display_name + "'>" + display_name + "</a></li>";
    }
  
    element.innerHTML = tag;
  }
  