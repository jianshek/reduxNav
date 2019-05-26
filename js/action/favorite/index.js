import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handleData} from '../ActionUtil'
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../model/ProjectModel";

/**
 * 加载收藏的项目
 * @param flag 最热,趋势
 * @param isShowLoading 是否显示loading
 * @returns {function(*)}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {    //如果不让显示菊花,就不往reducer传递了
            dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
        }
        new FavoriteDao(flag).getAllItems()
            .then(items => {
                let resultData = [];
                for (let i = 0, len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                dispatch({type: Types.FAVORITE_LOAD_SUCCESS, projectModels: resultData, storeName: flag});
            })
            .catch(e => {
                console.log(e);
                dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag});
            })

    }
}
