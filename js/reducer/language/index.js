/**
 * 返回最热或趋势模块的topNavBar数据
 */

import Types from '../../action/types';
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
    languages: [],  //趋势默认数据
    keys: []        //最热默认数据
};
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS://获取数据成功
            if (FLAG_LANGUAGE.flag_key === action.flag) {   //返回最热topNavBar数据
                return {
                    ...state,
                    keys: action.languages
                }
            } else {                                       //返回趋势topNavBar数据
                return {
                    ...state,
                    languages: action.languages
                }
            }
        default:
            return state;
    }

}