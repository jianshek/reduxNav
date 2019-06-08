import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    DeviceInfo
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import GlobalStyles from '../res/styles/GlobalStyles'
import ViewUtil from "../util/ViewUtil";
import Utils from "../util/Utils";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";


const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};
const pageSize = 10;//设为常量，防止修改
class SearchView extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.isKeyChange = false;   //最热模块的topNavbar数据是否改变
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    loadData(loadMore) {
        const {onLoadMoreSearch, onSearch, search, keys} = this.props;
        if (loadMore) {
            onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, callback => {
                this.toast.show('没有更多了');
            })
        } else {
            onSearch(this.inputKey, pageSize, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
                this.toast.show(message);
            })
        }
    }

    onBackPress() {
        const {onSearchCancel, onLoadLanguage} = this.props;
        onSearchCancel();//退出时取消搜索
        this.refs.input.blur(); //回收键盘
        NavigationUtil.goBack(this.props.navigation);
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key);//重新加载标签
        }
        return true;
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.params;
        return <PopularItem
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_popular,
                    callback,
                }, 'DetailView')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
        />
    }

    //footerview菊花
    genIndicator() {
        const {search} = this.props;
        return search.hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    /**
     * 添加标签
     */
    saveKey() {
        const {keys} = this.props;
        let key = this.inputKey;
        if (Utils.checkKeyIsExist(keys, key)) {
            this.toast.show(key + '已经存在');
        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true
            };
            keys.unshift(key);//将key添加到数组的开头
            this.languageDao.save(keys);
            this.toast.show(key.name + '保存成功');
            this.isKeyChange = true;
        }
    }

    onRightButtonClick() {
        const {onSearchCancel, search} = this.props;
        if (search.showText === '搜索') {
            this.loadData();
        } else {
            onSearchCancel(this.searchToken);
        }
    }

    renderNavBar() {
        const {theme} = this.params;
        const {showText, inputKey} = this.props.search;
        const placeholder = inputKey || "请输入";
        let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
        let inputView = <TextInput
            ref="input"
            placeholder={placeholder}
            onChangeText={text => this.inputKey = text}     //将text赋给this.inputKey
            style={styles.textInput}
        >
        </TextInput>;
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.refs.input.blur();//收起键盘
                    this.onRightButtonClick();
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>{showText}</Text>
                </View>
            </TouchableOpacity>;
        return <View style={{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    render() {
        const {isLoading, projectModels, showBottomButton, hideLoadingMore} = this.props.search;
        const {theme} = this.params;
        let statusBar = null;
        if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {
            statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]}/>
        }
        let listView = !isLoading ? <FlatList
            data={projectModels}
            renderItem={data => this.renderItem(data)}
            keyExtractor={item => "" + item.item.id}
            contentInset={
                {
                    bottom: 45
                }
            }
            refreshControl={
                <RefreshControl
                    title={'Loading'}
                    titleColor={theme.themeColor}
                    colors={[theme.themeColor]}
                    refreshing={isLoading}
                    onRefresh={() => this.loadData()}
                    tintColor={theme.themeColor}
                />
            }
            ListFooterComponent={() => this.genIndicator()}
            onEndReached={() => {
                console.log('---onEndReached----');
                setTimeout(() => {
                    if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                        this.loadData(true);
                        this.canLoadMore = false;
                    }
                }, 100);
            }}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                console.log('---onMomentumScrollBegin-----')
            }}
        /> : null;
        let bottomButton = showBottomButton ?
            <TouchableOpacity
                style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
                onPress={() => {
                    this.saveKey();
                }}
            >
                <View style={{justifyContent: 'center'}}>
                    <Text style={styles.title}>保存标签</Text>
                </View>
            </TouchableOpacity> : null;
            //页面中间菊花
        let indicatorView = isLoading ?
            <ActivityIndicator
                style={styles.centering}
                size='large'
                animating={isLoading}
            /> : null;
        let resultView = <View style={{flex: 1}}>
            {indicatorView}
            {listView}
        </View>;
        return <SafeAreaViewPlus
            style={GlobalStyles.root_container}
            topColor={theme.themeColor}
        >
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
            <Toast ref={toast => this.toast = toast}/>
        </SafeAreaViewPlus>
    }

}

const mapStateToProps = state => ({
    search: state.search,
    keys: state.language.keys
});
const mapDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(SearchView)
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    },
    statusBar: {
        height: 20
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0),
        right: 10,
        borderRadius: 3
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 26 : 36,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "white",
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white'
    },
    title: {
        fontSize: 18,
        color: "white",
        fontWeight: '500'
    },
});
