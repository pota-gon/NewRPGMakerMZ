/*:
@plugindesc
スキル名参照制御文字 Ver0.0.0(2024/11/25)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Other/Name/ExSkill.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver0.0.1: 
- 
* Ver0.0.0: 作成開始

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
スキル名を参照する制御文字 \SS を追加します。

## 使い方
\SS[ファイア] のようにスキル名を記載すると、  
[アイコン]ファイア のようにアイコンとスキル名が表示されるようになります。
 
同じスキル名がある場合は、最初に見つけたスキル名が表示されます。
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) return val;
        for (const i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column && data[i][search_column] == id) {
                val = column ? data[i][column] : data[i];
                break;
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    /**
     * 制御文字の事前変換
     *    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
     *    文字「\」はエスケープ文字（\e）に変換。
     *
     * @param {} text - 
     * @returns {} 
     */
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        let tmp_text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        tmp_text = tmp_text.replace(/\x1bSS\[(.+?)\](.*)/gi, (_, p1, p2) =>
            "\x1bI[" + Potadra_nameSearch($dataSkills, p1, 'iconIndex') + "]" + p1 + p2
        );
        return tmp_text;
    };
})();
