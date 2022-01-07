// ゲームの背景を管理するクラス
// ここより下のコードを編集しなくてもいろいろカスタマイズができます
class ScreenScroller {
  constructor(tile_draw_function, starting_stage = 0, tile_size=32, tiles=[], stages=[]) {
    this.tile_draw_function = tile_draw_function;
    this.starting_stage = starting_stage;
    this.tile_size = tile_size;
    this.tiles = tiles;
    this.stages = stages;

    // スクロールがまだ始まっていない時はnull、途中の時は経過タイル数
    this.scroll_progress = null;
    // スクロール元はthis.stagesの中のindexです。最初はデフォルト0です
    this.scroll_from = starting_stage;
    // スクロール先はthis.stagesの中のindexです。未定の時はnull
    this.scroll_to = null;

    // 行の数（タイル単位）
    this.rows = this.stages[0].length;
    // 列の数（タイル単位）
    this.cols = this.stages[0][0].length;

    // 本当に表示される現在のマップ
    // this.stagesと違って、中身がスクルールしていると変わります
    this.screen = this.stages[this.scroll_from];
  }

  // スケッチのdraw関数で呼び出される関数
  // スクロールの流れを制御する
  draw() {
    // もし今スクロールが始まろうとしているなら
    if (screen.scroll_progress === 1) {
      // 現在のマップの右に行き先のマップをくっつけましょう
      screen.generate_matrix_with_two_screens();
    }
    // スクロール中の場合
    if (screen.scroll_progress !== null){
      // スクロールが完了しているなら
      if (screen.scroll_progress > screen.cols) {
        // スクロールの後処理を行う
        screen.finalize_scroll();
      } else {
        // スクロールを進ませる
        screen.advance_scroll();
      }
    }
    // 現在のマップを表示させる
    screen.display_map();
  }

  // 現在のマップを表示させる
  display_map() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.tile_draw_function(i, j, this.tiles[this.screen[i][j]], this.tile_size)
      }
    }
  }

  // スクロールが時始まるように設定する
  // このスケッチではマウスのクリックで誘発するが、きっかけはなんでもいい
  initiate_scroll() {
    if (screen.scroll_progress === null) {
      this.scroll_to = (this.scroll_from + 1) % this.stages.length;
      this.scroll_progress = 1;
    }
  }

  // 2面の幅を持つマップを生成する
  generate_matrix_with_two_screens() {
    // 画面の各行
    for (var i = 0; i < this.rows; i++) {
      // 今までいた面のその行と同じになる
      this.screen[i] = this.stages[this.scroll_from][i];
      // そして、今からいく面のこの行の要素（数字）を一つずつ後ろに追加していく
      for (var j = 0; j < this.cols; j++) {
        this.screen[i].push(this.stages[this.scroll_to][i][j]);
      }
    }
  }
  // 次の面まで1タイルずつスクロールさせます
  advance_scroll() {
    // 画面の各行
    for (var i = 0; i < this.rows; i++) {
      // その行の最初（一番左の）タイルを取り除く
      this.screen[i].shift();
    }
    // 1タイル分スクロールが進んだと記録する
    this.scroll_progress ++;
  }

  finalize_scroll() {
    // しばらくスクロールを止めるように
    this.scroll_progress = null;
    // 現在のマップをそのまま行き先の面と同じにする
    this.screen = this.stages[this.scroll_to];
    // 今までの行き先が次のスクロールの原点となる
    this.scroll_from = this.scroll_to;
    // 次の行先は未定
    this.scroll_to = null;
  }
}
