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
    this.direction = null;

    // 行の数（タイル単位）
    this.rows = this.stages[0].length;
    // 列の数（タイル単位）
    this.cols = this.stages[0][0].length;

    // 本当に表示される現在のマップ
    // this.stagesと違って、中身がスクルールしていると変わります
    this.screen = this.stages[this.current_stage].slice(0);
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
    if (this.scroll_progress === null) {
      this.screen = this.stages[this.current_stage].slice(0);
    }
    // 左と上に移動する場合は、進むのではなくて戻るので処理が多少複雑になります
    if (this.direction === 'left') {
      const screencols = this.screen[0].length;
      let offset = screencols - this.cols - this.scroll_progress + 2;
      offset = offset >= 0? offset : 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < screencols; j++) {
          this.tile_draw_function(i, j - offset, this.tiles[this.screen[i][j]], this.tile_size)
        }
      }
    } else if (this.direction === 'up') {
      const screenrows = this.screen.length;
      let offset = screenrows - this.rows - this.scroll_progress + 2;
      offset = offset >= 0? offset : 0;
      for (var i = 0; i < screenrows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.tile_draw_function(i - offset, j, this.tiles[this.screen[i][j]], this.tile_size)
        }
      }
    } else {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.tile_draw_function(i, j, this.tiles[this.screen[i][j]], this.tile_size)
        }
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
  get_destination() {
    const current_stage_indices = this.get_stage_indices(this.current_stage);
    // console.log('現在位置', current_stage_indices);
    // ひとまず、わかりやすいアウトを蹴る
    if (this.direction == 'left' && current_stage_indices[0] < 1) {
      return false;
    }
    if (this.direction == 'up' && current_stage_indices[1] < 1) {
      return false;
    }

    // 目的地の`this.scroll_map`の中の[x, y]を決める
    let destination_stage_indices = current_stage_indices;
    if (this.direction == 'left') {
      destination_stage_indices[0] = destination_stage_indices[0] - 1;
    }
    else if (this.direction == 'right') {
      destination_stage_indices[0] = destination_stage_indices[0] + 1;
    }
    else if (this.direction == 'up') {
      destination_stage_indices[1] = destination_stage_indices[1] - 1;
    }
    else if (this.direction == 'down') {
      destination_stage_indices[1] = destination_stage_indices[1] + 1;
    }

    // console.log('目的地', destination_stage_indices);

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
      this.direction = direction;
      const destination = this.get_destination(this.direction);
      if (destination === false) {
        return;
      }
      this.scroll_to = destination;
      this.scroll_progress = 1;
    }
  }

  // 2面の幅を持つマップを生成する
  generate_matrix_with_two_screens() {
    if (this.direction === 'right') {
      // 画面の各行
      for (var i = 0; i < this.rows; i++) {
        // 今までいた面のその行と同じになる
        this.screen[i] = this.stages[this.current_stage][i].slice(0);
        // そして、今からいく面のこの行の要素（数字）を一つずつ後ろに追加していく
        for (var j = 0; j < this.cols; j++) {
          this.screen[i].push(this.stages[this.scroll_to][i][j]);
        }
      }
    } else if (this.direction === 'left') {
      // 画面の各行
      for (var i = 0; i < this.rows; i++) {
        // 今までいた面のその行と同じになる
        this.screen[i] = this.stages[this.scroll_to][i].slice(0);
        // そして、今からいく面のこの行の要素（数字）を一つずつ後ろに追加していく
        for (var j = 0; j < this.cols; j++) {
          this.screen[i].push(this.stages[this.current_stage][i][j]);
        }
      }
    } else if (this.direction === 'down') {
      // 現在位置のステージの下に行先のステージをくっつけます
      this.screen = this.stages[this.current_stage].slice(0);
      for (var i = 0; i < this.rows; i++) {
        this.screen.push(this.stages[this.scroll_to][i].slice(0));
      }
    } else if (this.direction === 'up') {
      // 行先のステージの下に現在位置のステージをくっつけます
      this.screen = this.stages[this.scroll_to].slice(0);
      for (var i = 0; i < this.rows; i++) {
        this.screen.push(this.stages[this.current_stage][i].slice(0));
      }
    }
    // console.log(this.direction);
    // this.log_screen();
  }
  // 今の画面を文字で`console`に出力します
  log_screen() {
    this.screen.forEach((e) => {
      let row = '';
      e.forEach((c) => {
        row += c;
      });
      console.log(row);
    });
  }
  // 次の面まで1タイルずつスクロールさせます
  advance_scroll() {
    if (this.direction === 'right') {
      // 画面の各行
      for (var i = 0; i < this.rows; i++) {
        // その行の最初（一番左の）タイルを取り除く
        this.screen[i].shift();
      }
    } else if (this.direction === 'down') {
      // 上野行を抜きます。しかし、抜きすぎないように`if`
      if (this.screen.length > this.rows) {
        this.screen.shift();
      }
    } else if (this.direction === 'left') {
      // 画面の各行
      for (var i = 0; i < this.rows; i++) {
        // その行の最後（一番右の）タイルを取り除く
        // this.screen[i].pop();
      }
    } else if (this.direction === 'up') {
      if (this.screen.length > this.rows) {
        // this.screen.shift();
      }
    }
    // 1タイル分スクロールが進んだと記録する
    this.scroll_progress ++;
  }

  finalize_scroll() {
    // しばらくスクロールを止めるように
    this.scroll_progress = null;
    // 今までの行き先が次のスクロールの原点となる
    this.current_stage = this.scroll_to;
    // 現在のマップをそのまま行き先の面と同じにする
    this.screen = this.stages[this.current_stage].slice(0);

    // 次の行先は未定
    this.scroll_to = null;
    this.direction = null;
  }
}
