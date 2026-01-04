/*:
@plugindesc
改変ベース Ver1.0.0(2026/1/3)

@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
改変素材用のベースプラグインです

## 使い方
1. 本プラグインを導入
2. PotBase.jsが必要な改変素材のプラグインを導入
*/

/**
 * 共通処理
 *
 * @class
 */
class PotBase {
    /**
     * プラグイン名取得
     *
     * @param {string} extension - 拡張子(初期値は js)
     * @returns {string} プラグイン名
     */
    static pluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    /**
     * 他プラグインのパラメータ取得
     *
     * @param {string} plugin_name - パラメータを取得するプラグイン名(.js の記載は除く)
     * @returns {object} プラグインパラメータ
     */
    static getPluginParams(plugin_name) {
        return this.isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }

    // データ配列ごとのキャッシュを保持
    static _searchCache = new WeakMap();

    /**
     * 通常検索
     *
     * @param {array} data - 検索対象のデータ
     * @param {any} id - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        // null / undefined のみ弾く（0 や "" は有効）
        if (id === null || id === undefined) return val;

        // キャッシュ取得 or 初期化
        let cache = this._searchCache.get(data);
        if (!cache) {
            cache = {};
            this._searchCache.set(data, cache);
        }

        const key = `${search_column}:${id}`;

        // キャッシュヒット
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }

        // キャッシュにない → 検索開始
        let result = val;

        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;

            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item; // 見つかったので item をキャッシュ
                return result;
            }

            // search_column が無い場合の fallback（ID と index が一致する MZ 仕様）
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }

        // 見つからなかった → val をキャッシュ
        cache[key] = val;
        return val;
    }

    /**
     * 名前検索
     *
     * @param {array} data - 検索対象のデータ
     * @param {any} name - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return this.search(data, name, column, search_column, val, initial);
    }

    /**
     * アイテム検索
     *
     * @param {any} name - 検索する数値や文字列
     * @param {string} column - 検索して見つかったときに返すカラム(指定しない場合は、全データを返す)
     * @param {string} search_column - 検索対象のカラム(指定しない場合は、カラム を指定せず検索)
     * @param {any} val - 検索しても見つからなかった場合に返すデータ
     * @param {number} initial - 検索対象をどこから検索するか
     * @returns {any} 検索した結果
     */
    static itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = this.search($dataItems, name, column, search_column, val, initial);
        if (item) return item;
        const weapon = this.search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) return weapon;
        const armor = this.search($dataArmors, name, column, search_column, val, initial);
        if (armor) return armor;
        return false;
    }

    /**
     * メタデータ取得
     *
     * @param {array} meta - メモ内のメタデータ
     * @param {string} tag - メタデータのタグ
     * @returns {string|boolean} メタデータの値(メタデータがない場合、false)
     */
    static meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                if (data !== true) {
                    return data.trim();
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 配列用メタデータ取得
     *
     * @param {array} meta_data - 改行を含むメモ内のメモデータ
     * @param {string} delimiter - 区切り文字
     * @returns {array|boolean} メタデータの配列(メタデータがない場合、false)
     */
    static metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }
}
