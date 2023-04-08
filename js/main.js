'use strict';

{
  // 各パネルを生成、管理するクラス
  class Panel {
    constructor(game) {
      this.game = game;
      this.board = document.getElementById('board');

      this.el = document.createElement('li');
      this.el.classList.add('first');
      this.el.addEventListener('click', () => {
        this.check();
      });
    }

    getEl() {
      return this.el;
    }

    // 各パネルに対してfirstクラスを外し、引数の数字をパネルに設定
    activate(num) {
      if (this.el.classList.contains('pressed')) {
        this.el.classList.remove('pressed');
      }
      this.el.classList.remove('first');
      this.el.textContent = num;
    }

    // 押し込むべき数値と押し込んだ数値が一致しているかチェック
    check() {

      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add('pressed');
        this.game.addCurrentNum();

        // 最後まで数値を押し込んでも経過時間を止める
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  // パネルを管理するクラス
  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      this.board = document.getElementById('board');

      // パネルの作成
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setUp();
    }

    getBoard() {
      return this.board;
    }

    // Boardにパネルを設定
    setUp() {
      this.panels.forEach(panel => {
        this.board.appendChild(panel.getEl());
      });
    }

    // 各パネルに数字をランダムに設定
    activate() {
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }
      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.activate(num);
      });
    }
  }

  // ゲーム全体を管理するクラス
  class Game {
    constructor(level) {
      this.level = level;
      this.answerInput = document.getElementById('answer_input');
      this.result = document.getElementById('result');

      this.board = new Board(this);

      // 押し込むべき数値
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;

      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        this.start();
      });

      this.setUp();
    }

    // レベルに合わせてcontainerの幅を調整
    setUp() {
      const container = document.getElementById('container');
      const panel_width = 48;
      const board_padding = 3;
      container.style.width = panel_width * this.level + board_padding * 2 + 'px';
      container.classList.add('display');
    }

    start() {
      // タイマーが動いていたらタイマーをクリアして0.00からにする
      if (typeof this.timeoutId !== 'undefined') {
        clearTimeout(this.timeoutId);
      }

      // 再スタート時、テキストボックスと「正解・不正解」を削除
      this.answerInput.value = '';
      this.result.textContent = '';

      this.currentNum = 0;
      this.board.activate();

      this.startTime = Date.now();
      this.runTimer();

      this.imageSet();
    }

    // ランダムに背景画像を設定し、answer()に正解の配列を渡す
    imageSet() {
      const imageBox = ['curry.png', 'inu.png', 'roll_cake.png', 'tullip.png'];
      const boardPanel = document.getElementById('board');
      const n = Math.floor(Math.random() * imageBox.length);
      let correct = [];
      boardPanel.style.backgroundImage = 'url("https://matsuda1017.github.io/NumberGame/img/'+ imageBox[n] +'")';
      switch(n) {
        case 0:
          correct = ['カレー', 'カレーライス'];
          break;
        case 1:
          correct = ['いぬ', '犬', 'イヌ'];
          break;
        case 2:
          correct = ['ケーキ', 'ロールケーキ'];
          break;
        case 3:
          correct = ['チューリップ'];
          break;
      }

      this.answer(correct);
    }

    // タイマーの設定
    runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    // 回答時の動作を制御
    answer(correct) {
      const answerBtn = document.getElementById('answer_btn');
      
      answerBtn.addEventListener('click', () => {
        if (correct.includes(this.answerInput.value)) {
          this.result.textContent = '正解！';
          clearTimeout(this.getTimeoutId());
        } else {
          this.result.textContent = '不正解です';
        }
      });
    }
  
    addCurrentNum() {
      this.currentNum++;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }
  }

  // 押下されたボタンのレベルを取得、各ボタンを非活性にする
  const levels = document.querySelectorAll('.level');
  let levelValue = 0;
  for (let i = 0; i < levels.length; i++) {
    levels[i].addEventListener('click', (e) => {
      levels[i].setAttribute('disabled', true);
      switch (i) {
        case 0:
          levels[1].classList.add('pressed');
          levels[2].classList.add('pressed');
          break;
        case 1:
          levels[0].classList.add('pressed');
          levels[2].classList.add('pressed');
          break;
        case 2:
          levels[0].classList.add('pressed');
          levels[1].classList.add('pressed');
          break;
      }

      levelValue = e.target.value;
      new Game(levelValue);
    });
  }
}