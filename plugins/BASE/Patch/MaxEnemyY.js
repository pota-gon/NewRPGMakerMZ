/*:
@plugindesc
敵キャラY座標最大値 Ver1.0.0(2025/10/13)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/BASE/Core/patch/MaxEnemyY.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵キャラのY座標に下限値を設定します
これにより、敵キャラが指定したY座標より上（画面の上方向）に
表示されるのを防ぎます

RPGツクールMZのバージョン1.9.0から、敵グループの配置で
敵キャラのY座標を個別に設定できるようになりました
このプラグインは、敵キャラが画面の上の方に行き過ぎないように
Y座標の最小値を保証したい場合などに役立ちます

## 使い方
プラグインを導入し、プラグインパラメータ「Y座標の下限値」に
Y座標の下限値として設定したい値を入力します

例えば、パラメータを 436 に設定した場合：
- 敵グループ設定でY座標が 400 になっている敵キャラは
  Y=436 の位置に出現します
- 敵グループ設定でY座標が 500 になっている敵キャラは
  Y=500 のままの位置に出現します

つまり、エディタで設定したY座標とプラグインで設定したY座標を比較し
より大きい（画面の下側）方の値が採用されます

## 注意事項
このプラグインは、敵キャラが出現する際のY座標を計算し直します
他のプラグインでY座標を動的に変更している場合
意図しない挙動になる可能性があります
プラグインの導入順序にご注意ください

@param Y
@type number
@text Y座標の下限値
@desc 敵キャラが表示されるY座標の下限値を設定します
これより小さいY座標は、この値に補正されます
@default 436
@min 0
@max 999999999999999
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const Y = Number(params.Y || 436);

    /**
     * オブジェクト初期化
     *
     * @param {} enemyId - 
     * @param {} x - 
     * @param {} y - 
     */
    Game_Enemy.prototype.initialize = function(enemyId, x, y) {
        Game_Battler.prototype.initialize.call(this);
        this.setup(enemyId, x, Math.max(Y, y));
    };
})();
