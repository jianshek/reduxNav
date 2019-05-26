import Types from '../../action/types'

const defaultState = {
}
/**
 * state树结构
 * 
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.POPULAR_REFRESH:         //下拉刷新
            return {
                ...state,   //原来的state
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,             //开始刷新,loading为true
                    hideLoadingMore: true,      //隐藏上拉加载更多
                }
            };
        case Types.POPULAR_REFRESH_SUCCESS: //下拉刷新成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,                 //所有数据
                    projectModels: action.projectModels, //此次要显示的数据
                    isLoading: false,                       //刷新成功后返回false
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            };
        case Types.POPULAR_REFRESH_FAIL:    //下拉刷新失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        case Types.POPULAR_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,    //数据
                    hideLoadingMore: false,                 //隐藏下方菊花
                    pageIndex: action.pageIndex,
                }
            };
        case Types.POPULAR_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                }
            };
        case Types.FLUSH_POPULAR_FAVORITE://刷新收藏状态
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                }
            };
        default:
            return state;
    }
}