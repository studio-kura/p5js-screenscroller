// ゲームの背景を管理するクラス
// ここより下のコードを編集しなくてもいろいろカスタマイズができます
class ScreenScroller {
  constructor(tile_draw_function, scroll_map = [0, 1], tile_size=32, tiles=[], stages=[]) {
    this.tile_draw_function = tile_draw_function;
    this.scroll_map = scroll_map;
    this.tile_size = tile_size;
    this.tiles = tiles;
    this.stages = stages;

    // スクロールがまだ始まっていない時はnull、途中の時は経過タイル数
    this.scroll_progress = null;
    // スクロール元はthis.stagesの中のindexです。最初はデフォルト0です
    this.current_stage = 0;
    // スクロール先はthis.stagesの中のindexです。未定の時はnull
    this.scroll_to = null;

    // 行の数（タイル単位）
    this.rows = this.stages[0].length;
    // 列の数（タイル単位）
    this.cols = this.stages[0][0].length;

    // 本当に表示される現在のマップ
    // this.stagesと違って、中身がスクルールしていると変わります
    this.screen = this.stages[this.current_stage];
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

  // 現在いるステージの`this.scroll_map`の中でのインデックスを返す
  // `this.scroll_map`は二次配列なので、[x, y]の形で返す
  get_stage_indices(stage = 0) {
    // `this.scroll_map`を1次元にして現在位置のインデックスを調べる
    const index = [].concat.apply([], ([].concat.apply([], this.scroll_map))).indexOf(stage);
    if (index === -1) {
      return false;
    }
    // 何コラムあるか
    const numColumns = this.scroll_map[0].length;
    // 1次元でのインデックスから何行目か計算
    const row = parseInt(index / numColumns);
    // 1次元でのインデックスから何列目か計算
    const col = index % numColumns;
    return [col, row]; 
  }

  // `this.scroll_map`にそって行先のステージを調べる
  // 行き止まりの場合は`false`を返す
  get_destination(direction = 'right') {
    const current_stage_indices = this.get_stage_indices(this.current_stage);
    console.log('現在位置', current_stage_indices);
    // ひとまず、わかりやすいアウトを蹴る
    if (direction == 'left' && current_stage_indices[0] < 1) {
      return false;
    }
    if (direction == 'up' && current_stage_indices[1] < 1) {
      return false;
    }

    // 目的地の`this.scroll_map`の中の[x, y]を決める
    let destination_stage_indices = current_stage_indices;
    if (direction == 'left') {
      destination_stage_indices[0] = destination_stage_indices[0] - 1;
    }
    else if (direction == 'right') {
      destination_stage_indices[0] = destination_stage_indices[0] + 1;
    }
    else if (direction == 'up') {
      destination_stage_indices[1] = destination_stage_indices[1] - 1;
    }
    else if (direction == 'down') {
      destination_stage_indices[1] = destination_stage_indices[1] + 1;
    }

    console.log('目的地', destination_stage_indices);

    // 右や下からはみ出た場合も、蹴る
    if (
      destination_stage_indices[1] >= this.scroll_map.length
      || destination_stage_indices[0] >= this.scroll_map[0].length 
    ) {
      return false;
    }
    const destination = this.scroll_map[destination_stage_indices[1]][destination_stage_indices[0]];
    return destination;
  }

  // スクロールが時始まるように設定する
  // このスケッチではマウスのクリックで誘発するが、きっかけはなんでもいい
  initiate_scroll(direction = 'right') {
    if (screen.scroll_progress === null) {
      const destination = this.get_destination(direction);
      console.log(this.current_stage, direction, destination);
      console.log('\n');
      if (destination === false) {
        return;
      }
      this.scroll_to = destination;
      this.scroll_progress = 1;
    }
  }

  // 2面の幅を持つマップを生成する
  generate_matrix_with_two_screens() {
    // 画面の各行
    for (var i = 0; i < this.rows; i++) {
      // 今までいた面のその行と同じになる
      this.screen[i] = this.stages[this.current_stage][i];
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
    this.current_stage = this.scroll_to;
    // 次の行先は未定
    this.scroll_to = null;
  }
}
