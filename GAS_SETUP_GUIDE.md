# Google Apps Script (GAS) セットアップ手順（複数予定・JSON対応版）

時間表記を含めた複数の予定を表示・管理するために、以下の手順でGoogleスプレッドシートとプログラム（GAS）を再設定してください。

## 1. スプレッドシート側の準備
スプレッドシート（加藤智也スケジュール）のシートを、以下のシンプルな構造に変更してください。
- **1列目 (A列) のヘッダー**: `日付`
- **2列目 (B列) のヘッダー**: `予定`
- **データ例**:
    - A2: `2026-06-05`（日付形式）
    - B2: `10:00～13:30レッスン\n20:00～21:00オンラインレッスン`（1つのセル内で改行して入力）

---

## 2. GASエディタを開く
1. 該当のスプレッドシートを開きます。
2. メニューの **[拡張機能] > [Apps Script]** をクリックします。
3. （すでにコードがある場合は）既存のコードをすべて消去します。

---

## 3. コードの貼り付け
以下の新しいプログラムコードをコピーして、エディタに貼り付けてください。

```javascript
// --- 設定：WEBサイト側のパスワードと一致させてください ---
const ADMIN_PASSWORD = "加藤智也"; 

// スプレッドシートからデータを取得する (GETリクエスト)
// 返却形式: { "2026-06-05": ["予定1", "予定2"], ... }
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const scheduleData = {};
  
  // 1行目がヘッダー（日付, 予定）のため、2行目から読み込み
  for (let i = 1; i < values.length; i++) {
    let dateObj = values[i][0];
    let scheduleText = values[i][1];
    let dateStr = "";
    
    if (!dateObj) continue;
    
    if (dateObj instanceof Date) {
      dateStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else {
      dateStr = String(dateObj).replace(/\//g, '-').trim();
    }
    
    if (dateStr) {
      // 改行区切りの予定を配列に分割（空文字は除外）
      if (scheduleText) {
        scheduleData[dateStr] = String(scheduleText).split("\n").map(function(s) { return s.trim(); }).filter(Boolean);
      } else {
        scheduleData[dateStr] = [];
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(scheduleData))
    .setMimeType(ContentService.MimeType.JSON);
}

// WEBサイトからの更新を受け取る (POSTリクエスト)
// 受信形式: { password: "...", data: { "yyyy-MM-dd": ["予定1", "予定2"], ... } }
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    // パスワードチェック
    if (params.password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid password"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = params.data; // { "2026-06-05": ["予定1", "予定2"], ... }
    
    // 現在のスプレッドシートデータを取得
    let range = sheet.getDataRange();
    let values = range.getValues();
    
    // 日付と行インデックスのマッピングを作成
    const dateRowMap = {};
    for (let i = 1; i < values.length; i++) {
      let dateObj = values[i][0];
      let dateStr = "";
      if (dateObj instanceof Date) {
        dateStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        dateStr = String(dateObj).replace(/\//g, '-').trim();
      }
      if (dateStr) {
        dateRowMap[dateStr] = i; // 行インデックスを記録
      }
    }
    
    // 送信されたデータを反映
    for (let dateStr in data) {
      if (!dateStr) continue;
      // 予定配列を改行コードで連結して1つの文字列にする
      let scheduleText = Array.isArray(data[dateStr]) ? data[dateStr].join("\n") : "";
      
      if (dateRowMap[dateStr] !== undefined) {
        // 既存行を更新
        let rowIndex = dateRowMap[dateStr];
        values[rowIndex][1] = scheduleText;
      } else {
        // 新規日付の場合は配列の末尾に新規行を追加
        values.push([dateStr, scheduleText]);
      }
    }
    
    // シート全体に書き込み（新規行が追加された場合は範囲を広げる）
    sheet.getRange(1, 1, values.length, 2).setValues(values);
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 4. デプロイ（公開設定）の更新
プログラムを書き換えた後は、**デプロイを更新**する必要があります。
1. GASエディタ右上の **[デプロイ] > [デプロイの管理]** をクリックします。
2. アクティブなウェブアプリのデプロイを選択し、**鉛筆マーク（編集）** をクリックします。
3. バージョンで **[新バージョン]** を選択します。
4. **[デプロイ]** ボタンをクリックします。
5. （※もしウェブアプリのURLが変わった場合は、新しいURLをコピーして `src/Schedule.jsx` の `API_URL` に貼り付けてください。通常、同じデプロイの管理から更新すればURLは変わりません）

以上で設定完了です。
ホームページのスケジュール管理画面でログインし、カレンダーの日付をクリックして複数予定を追加し、「変更を保存する」ボタンで反映されるかお試しください。

