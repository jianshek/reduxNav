import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'


/**
 * 
 * @param storeName 哪一个topTab
 * @param  url  请求的接口
 */
export function onLoadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({ type: Types.POPULAR_REFRESH, storeName: storeName });
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
            .then(data => {
                handleData(dispatch, storeName, data, pageSize)
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


/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })
            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                console.log(pageIndex, max);
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max),
                })
            }
        }, 500);
    }
}

function handleData(dispatch, storeName, data, pageSize) {
    let fixItems = []
    if (data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items: fixItems,    //所有数据
        projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//第一次加载数据
        storeName,       //es7语法,相当于storeName:storeName
        pageIndex: 1,
    })
}