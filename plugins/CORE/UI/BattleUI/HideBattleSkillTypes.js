/*:
@plugindesc
戦闘中非表示スキルタイプ Ver1.0.0(2026/1/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/GAME/Battle/ui/HideBattleSkillTypes.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
戦闘時に非表示にするスキルタイプを設定します

## 使い方
プラグインパラメータ「戦闘時非表示スキルタイプ」に
戦闘中に表示したくないスキルタイプのIDを指定してください

メニュー画面では表示されますが、戦闘画面のコマンド選択時には
指定したスキルタイプが表示されなくなります

@param HideBattleSkillTypes
@type number[]
@text 戦闘時非表示スキルタイプ
@desc 戦闘時に非表示にするスキルタイプ
@default ["2"]
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_numberArray(data) {
        return data ? JSON.parse(data).map(Number) : [];
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const HideBattleSkillTypes = Potadra_numberArray(params.HideBattleSkillTypes);

    /**
     * スキルコマンドをリストに追加
     */
    Window_ActorCommand.prototype.addSkillCommands = function() {
        const skillTypes = this._actor.skillTypes().filter(n => !HideBattleSkillTypes.includes(n));
        for (const stypeId of skillTypes) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    };
})();
