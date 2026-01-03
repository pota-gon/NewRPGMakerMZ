/*:
@plugindesc
敵キャラY座標固定 Ver1.0.0(2025/10/13)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/BASE/Core/patch/FixEnemyY.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵キャラのY座標を指定した値に固定します。

RPGツクールMZのバージョン1.9.0から、敵グループの配置で
敵キャラのY座標を個別に設定できるようになりました
しかし、敵キャラごとにY座標を微調整するのが面倒な場合や
全ての敵キャラのY座標を統一したい場合にこのプラグインが役立ちます

## 使い方
プラグインを導入し、プラグインパラメータ「固定Y座標」に
希望のY座標の値を設定するだけで動作します

例えば、Y座標を 436 に設定すると、全ての敵キャラが
Y=436の位置に出現するようになります

## 注意事項
このプラグインは、敵キャラが出現する際のY座標を強制的に上書きします
他のプラグインでY座標を動的に変更している場合
このプラグインの設定が優先されるため、意図しない挙動になる可能性があります
プラグインの導入順序にご注意ください

@param Y
@type number
@text 固定Y座標
@desc 固定するY座標の値
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
        this.setup(enemyId, x, Y);
    };
})();
