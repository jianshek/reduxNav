/**
 * 最热模块
 */

import React, { Component } from 'react';
import { Platform, ActivityIndicator, StyleSheet, Text, View, Button, FlatList, RefreshControl, ListFooterComponent,TouchableOpacity } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnalyticsUtil from "../util/AnalyticsUtil";  


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);



type Props = {};
class PopularView extends Component<Props> {

  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key); //请求topNavBar数据
  }

  //生成topTab
  _genTabs() {
    const tabs = {}
    const { keys, theme } = this.props;  //topNavBar数据
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }

  //右上角搜索按钮
  renderRightButton() {
    const { theme } = this.props;
    return <TouchableOpacity
      onPress={() => {
        AnalyticsUtil.onEvent("SearchButtonClick"); //友盟统计
        NavigationUtil.goPage({ theme }, 'SearchView')
      }}
    >
      <View style={{ padding: 5, marginRight: 8 }}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }} />
      </View>
    </TouchableOpacity>
  }

  render() {
    const { keys, theme } = this.props;  //topNavBar数据
    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;

    //如果keys有数据就创建topNavbar,否则返回null
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,  //给topTab设置样式
          upperCaseLabel: false, //默认文字大写
          scrollEnabled: true, //可滚动
          style: {
            backgroundColor: theme.themeColor,
            height: 30,      //开启scrollEnabled后再Android上初次加载时闪烁问题,给个固定高度
          },
          indicatorStyle: styles.indStyle, //指示器样式,就是tab下面那个横线
          labelStyle: styles.labelStyle,   //tab上的文字属性
        },
        lazy: true //懒加载,当点击这个tab的时候再加载数据
      }

    )) : null;

    return (
      <View style={{ flex: 1 }}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,  //topNavBar数据
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularView);


const pageSize = 10;
//每一个topTab的具体页面
class PopularTab extends Component {

  constructor(props) {
    super(props)
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false; //是否有收藏状态的改变
  }

  componentDidMount() {
    this.loadData()
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;  //从收藏页面传来通知,在收藏页面改变了最热模块的收藏状态
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {  //点击了第0个bottomtabbar,并且有收藏状态改变
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, store.pageIndex + 1, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多数据了');
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    }
    else {
      onLoadPopularData(this.storeName, url, pageSize, favoriteDao);
    }

  }

  /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName]; //动态获取state数据,把storeName传过去
    if (!store) {                        //在state树中没有默认的state,所以初始化一个默认的state树
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }


  renderItem(data) {
    const item = data.item;
    const { theme } = this.props;
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callBack) => {
        NavigationUtil.goPage({
          theme,
          flag: FLAG_STORAGE.flag_popular,
          projectModel: item,
          callBack,     //baseItem的setFavoriteState函数
        }, 'DetailView')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }

  genIndicator() {
    //是否显示加载更多的菊花
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }

  render() {
    let store = this._store();
    const { theme } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.genIndicator()} //上拉加载更多控件
          onEndReached={() => {                           //上拉完成的回调
            setTimeout(() => {          //设置定时器,使标志位一定设置成功
              if (this.canLoadMore) { //上拉时会有两次回调,设置标志位使只加载一次数据
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}     //flatlist和上拉控件的距离
          onMomentumScrollBegin={() => {  //上拉时的回调
            this.canLoadMore = true;      //开始设置标志位

          }}
        />
        <Toast ref={'toast'}      //添加toast
          position={'center'}
        />
      </View>
    )
  }

}

const mapStateToProps = state => ({
  popular: state.popular  //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabStyle: {
    // minWidth: 60,  //如果设置最小值,Android会有问题
    padding: 0,
  },
  indStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 15,
    margin: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
