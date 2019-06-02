/**
 * 最热或趋势模块加载topNavBar
 */

import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handleData} from '../ActionUtil'
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../model/ProjectModel";
import LanguageDao from "../../expand/dao/LanguageDao";

export function onLoadLanguage(flagKey) {   //flagKey:区分最热还是趋势模块
    return async dispatch => {      //异步转同步
        try {
            let languages = await new LanguageDao(flagKey).fetch();
            dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey})
        } catch (e) {
            console.log(e)
        }
    }
}