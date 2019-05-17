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
        case Types.POPULAR_REFRESH:
            return {
                ...state,   //原来的state
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true //开始刷新,loading为true
                }
            };
        case Types.POPULAR_REFRESH_SUCCESS:
            return {
                ...state,  
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items, //数据
                    isLoading: false //刷新成功后返回false
                }
            };
            case Types.POPULAR_REFRESH_FAIL:
            return {
                ...state,   
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        default:
            return state;
    }
}