// 定義したクラスからオブジェクトを名付けます
var screen;

function setup() {
  // スクロールを設定して初期化する
  // 設定はset_options.jsで指定しましょう
  set_options();

  createCanvas(16*screen.tile_size, 14*screen.tile_size);

  noStroke();
}

function draw() {
  background('#c3f6f6');

  screen.draw();
}

// マウスのボタンがクリックされたとき、もしくは画面がタッチされた陶器
function mousePressed () {
  // スクロールを開始させる
  screen.initiate_scroll();
}
// スクロールのきっかけはゲームのキャラクターの位置などにしてみましょう
