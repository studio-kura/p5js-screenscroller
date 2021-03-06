# ScreenScrollerクラスを使ってのスクロール

`ScreenScroller`はStudio Kuraで小学生以上向けに開発された簡易スクロールエンジンです。

設定するだけで、`setup`や`draw`にあまりコードを加えることなく使えるようにできています。

## 使い方

- このリポジトリーを踏み台にして使う場合: フォーク・クローン・ダウンロードしてください
- 既存のプロジェクトに導入する場合: 
	1. [ScreenScroller.js](ScreenScroller.js)と[set_options.js](set_options.js)をプロジェクトに含めて、既存のプロジェクトの`index.html`などで`sketch.js`と同じように呼び出す
	1. 既存のプロジェクトの`sketch.js`でこのリポジトリーの[sketch.js](sketch.js)と同じように
		1. `screen`変数を用意する
		1. `setup()`の中で`set_options()`を呼び出す
		1. `draw()`の中で`screen.draw()`を呼び出す
		1. スクロールのきっかけ`screen.initiate_scroll('right')`を適当な個所で呼び出す（up, right, down, left）
	1. p5.js公式エディターで使う場合は[ここから編集する](https://editor.p5js.org/alecrem/sketches/i2hjFVchu)


`index.html`で全ての

## 設定したいオプション

- `tile_engine`: タイルの書き方や中身を設定するオブジェクト。その中にあるのは：
	- `tiles`: 色のHEX文字列(白が`#ffffff`など)や絵文字を使ってタイルの中身を指定します
	- `tile_draw_function`: タイルの一つ一つを画面に描く関数（絵文字ようの関数と、単色四角の関数は用意されています）
- `stages`: ゲームの中で一つ一つの面のタイル配置を配列にしたもの（タイルを横に並べた行の配列が1面で、面の配列である`stages`がゲーム全ての面を表す）
- `scroll_map`: このゲームの世界での`stages`の位置関係。ゲームは`0`から始まります。

## 参考資料

- 動画: [p5.jsでファミコンのゼルダの伝説のスクロールを思い浮かばせるスクロールテクニック！！！](https://www.youtube.com/watch?v=MqLW7TVIBsw&t=162s)
