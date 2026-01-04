/*:
@plugindesc
歩行グラフィック表示 Ver1.0.0(2025/10/13)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/GAME/Ui/ChangeChara.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
顔グラフィック表示部分を歩行グラフィックに変更します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }

    // 他プラグイン連携(パラメータ取得)
    const five_party_params = Potadra_getPluginParams('BattleMembers');
    const FiveParty         = Potadra_convertBool(five_party_params.FiveParty);

    /**
     * 
     *
     * @param {} index - 
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.standardFaceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());

        // rect.x = 4
        // rect.y = 2, 137, 272, 407
        // width = 14400
        // height = 129
        // this.drawActorCharacter(actor, (rect.x + 1) + (width / 2), (rect.y + 1) + 88);

        // 48x48
        if (FiveParty) {
            this.drawActorCharacter(actor, (rect.x + 1) + (width / 2), (rect.y + 1) + 74);
        } else {
            this.drawActorCharacter(actor, (rect.x + 1) + (width / 2), (rect.y + 1) + 88);
        }

        // 32x32

        this.changePaintOpacity(true);
    };
 
    Window_SkillStatus.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._actor) {
            const x = this.colSpacing() / 2;
            const h = this.innerHeight;
            const y = h / 2 - this.lineHeight() * 1.5;

            // x = 4
            // y = 12
            // h = 132
            // t = 48
            // t_x = 72
            // t_y = 88

            // 48x48
            this.drawActorCharacter(this._actor, 72, 88);
    
            // x = 4
            // y = 12
            // h = 132
            // t = 48
            // t_x = 80
            // t_y = 80

            // 32x32
            // this.drawActorCharacter(this._actor, 80, 80);

            this.drawActorSimpleStatus(this._actor, x + 180, y);
        }
    };
 
     /**
      * リフレッシュ
      */
    Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);

            // nameRect.width = 272
            // nameRect.height = 36
            // nameRect.x = 8

            // 48x48
            this.drawActorCharacter(this._actor, nameRect.x + (nameRect.width / 2), 128);

            // 32x32

            this.drawAllParams();
        }
    };
 
    /**
     * ブロック 2 の描画
     */
    Window_Status.prototype.drawBlock2 = function() {
        const y = this.block2Y();

        // y = 50

        // 48x48
        this.drawActorCharacter(this._actor, 96, y + 88);

        // 32x32
        // this.drawActorCharacter(this._actor, 88, y + 80);

        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    };
 
    /**
     * 
     *
     * @param {} index - 
     */
    Window_BattleStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorCharacter(actor, rect.x + (rect.width / 2), rect.y + (rect.height / 2) + ($dataSystem.tileSize / 2 - 8));
    };
})();
