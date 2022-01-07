# ScreenScrollerクラスを使ってのスクロール

`ScreenScroller`はStudio Kuraで開発された簡易スクロールエンジンです。

設定するだけで、`setup`や`draw`にあまりコードを加えることなく使えるようにできています。

## 絶対設定したいオプションは

- `tiles`: 色のHEX文字列や絵文字を使ってタイルの中身をしていします
- `tile_draw_function`: タイルの一つ一つを画面に描く関数（絵文字ようの関数と、単色四角の関数は用意されています）
- `stages`: ゲームの中で一つ一つの面のタイル配置を配列にしたもの（タイルを横に並べた行の配列が1面で、面の配列であるstagesがゲーム全ての面を表す）

## 注意点

今のところ、最初の画面からそのすぐ右の面に行ける機能だけが実装されていますけど、ちょくちょく更新する予定です！ひとまずは誰か作ったクラスを導入するのを練習してみましょう。

## 動いているところを見てさわる

[https://editor.p5js.org/alecrem/sketches/i2hjFVchu](https://editor.p5js.org/alecrem/sketches/i2hjFVchu)
