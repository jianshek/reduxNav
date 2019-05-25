/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, ActivityIndicator, StyleSheet, Text, View, Button, FlatList, RefreshControl, ListFooterComponent, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import TrendingItem from '../common/TrendingItem'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'  //今天,本周,本月
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";



const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";  //事件名
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);


type Props = {};
export default class TrendingView extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0], //默认选择今天
    };
    this.tabNames = ['JavaScript', 'C', 'vim', 'C++', 'go'];
  }

  //生成topTab
  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,  //定义tab时给页面传递参数
        navigationOptions: {
          title: item,
        }
      }
    });
    return tabs;
  }

  //绘制navigationView,点击显示trendingDialog
  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => this.dialog.show()}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '400'
          }}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{ color: 'white' }}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    //发送事件,为了topnavbar不刷新,topnavbar附属的页面就不会刷新,发送事件过去,让页面刷新
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }

  //生成trendingDialog
  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}          //拿到trendingDialog赋给this.dialog
      onSelect={tab => this.onSelectTimeSpan(tab)}  //选择某个item的回调
    />
  }

  _tabNav() {

    //上方tab
    if (!this.tabNav) {   //如果topnavbar存在就不再重新创建
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(), {
          tabBarOptions: {
            tabStyle: styles.tabStyle,  //给topTab设置样式
            upperCaseLabel: false, //默认文字大写
            scrollEnabled: true, //可滚动
            style: {
              backgroundColor: '#678',
              height: 30,
            },
            indicatorStyle: styles.indStyle, //指示器样式,就是tab下面那个横线
            labelStyle: styles.labelStyle,   //tab上的文字属性
          }
        }

      ));
    }
    return this.tabNav
  }

  render() {

    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />;
    //topNavBar
    const TabNavigator = this._tabNav()

    return (

      <View style={{ flex: 1 }}>
        {navigationBar}
        <TabNavigator />
        {this.renderTrendingDialog()}
      </View>
    );
  }
}
const pageSize = 10;
//每一个topTab的具体页面
class TrendingTab extends Component {

  constructor(props) {
    super(props)
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;  //topnavbar的哪个item
    this.timeSpan = timeSpan;   //trendingDialog的哪个item
  }

  componentDidMount() {
    this.loadData()
    //监听事件,当有事件来的时候会执行事件里面的方法
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
  }

  componentWillUnmount() {

    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();   //移除事件监听
    }
  }

  loadData(loadMore) {
    const { onRefreshTrending, onLoadMoreTrending } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      const { onRefreshTrending, onLoadMoreTrending } = this.props;
      onLoadMoreTrending(this.storeName, store.pageIndex + 1, pageSize, store.items, favoriteDao,callback => {
        this.refs.toast.show('没有更多数据了');
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize,favoriteDao);
    }

  }

  /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName]; //动态获取state数据,把storeName传过去
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
    return URL + key + '?' + this.timeSpan.searchText;
  }


  renderItem(data) {
    const item = data.item;
    return <TrendingItem
      projectModel={item}
      onSelect={(callBack) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callBack      //baseItem的setFavoriteState函数
      }, 'DetailView')
      }}
      onFavorite={(item, isFavorite)=>FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={'red'}
              colors={['red']}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={'red'}
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
  trending: state.trending  //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize,favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize,favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao,callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao,callBack)),
});
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

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
    // minWidth: 60, 
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
