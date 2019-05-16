import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'


/**
 * 
 * @param storeName 哪一个topTab
 * @param  url  请求的接口
 */
export function onLoadPopularData(storeName, url) {
    return dispatch => {
        dispatch({ type: Types.POPULAR_REFRESH, storeName: storeName });
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
            .then(data => {
                handleData(dispatch, storeName, data)
            })
            .catch(error => {
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,   //es7语法,相当于storeName:storeName
                    error
                });
            })
    }
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items: data && data.data && data.data.items,
        storeName       //es7语法,相当于storeName:storeName
    })
}
