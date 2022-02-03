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

// キーボードのカーソルキーでスクロールをはじめます
function keyPressed() {
  if (keyCode == UP_ARROW) {
    screen.initiate_scroll('up');
  }
  else if (keyCode == DOWN_ARROW) {
    screen.initiate_scroll('down');
  }
  else if (keyCode == LEFT_ARROW) {
    screen.initiate_scroll('left');
  }
  else if (keyCode == RIGHT_ARROW) {
    screen.initiate_scroll('right');
  }
}
// スクロールのきっかけはゲームのキャラクターの位置などにしてみましょう
