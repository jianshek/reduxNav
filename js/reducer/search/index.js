import Types from '../../action/types';

const defaultState = {
    showText: '搜索',   //搜索页右上角显示的文字(搜索期间显示取消,点击可取消搜索)
    items: [],          //请求的数据
    isLoading: false,
    projectModels: [],//要显示的数据
    hideLoadingMore: true,//默认隐藏加载更多
    showBottomButton: false,    //搜索页面是否显示底部按钮,如果搜索的key不在最热模块的topNavbar数据中,点击可将key添加到topNavbar中
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_REFRESH://搜索数据
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
                showText:'取消',
            };
        case Types.SEARCH_REFRESH_SUCCESS://获取数据成功
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: '搜索',
                inputKey: action.inputKey
            };
        case Types.SEARCH_FAIL://下拉刷新失败
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case Types.SEARCH_CANCEL://搜索取消
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case Types.SEARCH_LOAD_MORE_SUCCESS://上拉加载更多成功
            return {
                ...state,
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        case Types.SEARCH_LOAD_MORE_FAIL://上拉加载更多失败
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }

}