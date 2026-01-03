/*:
@plugindesc
あらすじ Ver1.0.0(2025/10/13)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/GAME/Ui/Story.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ゲームの進行状況に応じた「あらすじ」をメニュー画面から確認できる機能を追加

## 使い方
あらすじを表示するための画面とメニューコマンドを提供します

### 1. メニューに「あらすじ」コマンドを追加する
プラグインパラメータ `MenuCommand` グループで
メニューに関する設定を行います

- **メニュー表示名**:
  メニューに表示されるコマンド名です。例えば「あらすじ」と設定します
  空にするとメニューに表示されません

- **メニュー表示スイッチ**:
  指定したスイッチがONのときだけ、メニューにコマンドを表示します
  ストーリーの進行に合わせて表示/非表示を切り替えたい場合に使用します
  `0` (なし) を指定すると、常に表示されます

- **メニュー禁止スイッチ**:
  指定したスイッチがONのとき、コマンドをメニューに表示はするものの
  選択できない状態（グレーアウト）にします

### 2. あらすじの進行度を管理する
プラグインパラメータ `進行段階` に
ゲームの進行度を管理するための変数を指定します

イベントコマンド「変数の操作」を使い、この変数に数値を代入することで
ゲームが今どの段階にあるのかを記録します

例えば
- 序盤のイベントが終わったら、変数に `1` を代入
- 中盤のボスを倒したら、変数に `2` を代入
といったように使用します

### 3. あらすじの内容を表示する
このプラグインはあらすじを表示する「器」を提供するものです
表示するあらすじの本文は、このプラグインを改変するか
別途アドオンプラグインを作成して実装する必要があります

`Window_Story` クラスの `refresh` メソッドを改変し
`PhaseVariable` の値に応じて `drawTextEx` などで
テキストを描画する処理を追記してください

### パラメータ説明

#### 進行段階 (PhaseVariable)
あらすじの進行度を管理するための変数を指定します
イベントコマンド「変数の操作」でこの変数の値を変更することで
表示されるあらすじを切り替えます

#### メニュー表示名 (MenuCommand)
メニュー画面に表示する「あらすじ」コマンドの表示・挙動を設定します

##### メニュー表示スイッチ (MenuSwitch)
ここで指定したスイッチがONの時のみ、メニューにコマンドが表示されます
0を指定した場合は常に表示されます

##### メニュー禁止スイッチ (DisableMenuSwitch)
ここで指定したスイッチがONの時
コマンドが使用できなくなります(グレーアウト表示)

@param PhaseVariable
@type variable
@text 進行段階
@desc 進行段階を記憶する変数
@default 21

@param MenuCommand
@type combo
@text メニュー表示名
@desc メニューの表示が出来るコマンド
空文字でメニューに表示しません
@default あらすじ
@option あらすじ

    @param MenuSwitch
    @parent MenuCommand
    @type switch
    @text メニュー表示スイッチ
    @desc ONのときメニューにコマンドを表示します
    0(なし)の場合、常にメニューへ表示します
    @default 0

    @param DisableMenuSwitch
    @parent MenuCommand
    @type switch
    @text メニュー禁止スイッチ
    @desc ONのときコマンドの使用を禁止します
    @default 0
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_checkSwitch(switch_no, bool = true) {
        return switch_no === 0 || $gameSwitches.value(switch_no) === bool;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const PhaseVariable     = Number(params.PhaseVariable || 21);
    const MenuCommand       = String(params.MenuCommand);
    const MenuSwitch        = Number(params.MenuSwitch || 0);
    const DisableMenuSwitch = Number(params.DisableMenuSwitch || 0);

    /**
     * あらすじの表示を行うウィンドウクラスです
     *
     * @class
     */
    class Window_Story extends Window_Selectable {
        /**
         *
         *
         * @param {} rect -
         */
        constructor(rect) {
            super(rect);
            this.refresh();
            this.activate();
        }
    }

    if (MenuCommand) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */

        /**
         * 独自コマンドの追加用
         */
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
            if (Potadra_checkSwitch(MenuSwitch)) {
                this.addCommand(MenuCommand, "story", Potadra_checkSwitch(DisableMenuSwitch, false));
            }
        };

        /**
         * メニュー画面の処理を行うクラスです。
         *
         * @class
         */

        /**
         * コマンドウィンドウの作成
         */
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.apply(this, arguments);
            this._commandWindow.setHandler("story", this.story.bind(this));
        };
        
        /**
         * コマンド［あらすじ］
         */
        Scene_Menu.prototype.story = function() {
            SceneManager.push(Scene_Story);
        };
    }

    /**
     * あらすじ画面の処理を行うクラスです
     *
     * @class
     */
    class Scene_Story extends Scene_MenuBase {
        /**
         *
         */
        create() {
            super.create();
            this.createStoryWindow();
        }

        /**
         * 
         */
        createStoryWindow() {
            const rect = this.storyWindowRect();
            this._storyWindow = new Window_Story(rect);
            this._storyWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._storyWindow);
        }

        /**
         * 
         *
         * @returns {} 
         */
        storyWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - this.buttonAreaHeight();
            return new Rectangle(wx, wy, ww, wh);
        }
    }
})();
