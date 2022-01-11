# formbridge_map

トヨクモ社のフォームブリッジにOpenStreetMapを用いて位置情報を可視化するためのカスタマイズに用いる

# Features

公共分野でkintoneやformbridgeを使う際、地図表現を実施する時に費用がない場合に、とりあえず位置情報を可視化するために低コストで実施できる。

# Requirement

フォームブリッジ の管理画面から、本JavaScriptファイルを追加した後、以下のJavaScriptを追加
https://js.kintone.com/jquery/3.4.1/jquery.min.js
https://unpkg.com/leaflet@1.7.1/dist/leaflet.js

kintoneのアプリ 管理画面から、以下のCSSを追加
https://unpkg.com/leaflet@1.7.1/dist/leaflet.css

# Note

フォームブリッジのhtml要素取得のコマンドが用意されていないため、かなり微妙な設定になっていることは否めない
