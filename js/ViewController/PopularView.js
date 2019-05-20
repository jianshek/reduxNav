/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, ActivityIndicator, StyleSheet, Text, View, Button, FlatList, RefreshControl, ListFooterComponent } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR='#678'


type Props = {};
export default class PopularView extends Component<Props> {

  constructor(props) {
    super(props);
    this.tabNames = ['java', 'ios', 'php', 'python', 'swift']
  }

  //生成topTab
  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item} />,  //定义tab时给页面传递参数
        navigationOptions: {
          title: item,
        }
      }
    });
    return tabs;
  }

  render() {

    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
    />;
    //上方tab
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,  //给topTab设置样式
          upperCaseLabel: false, //默认文字大写
          scrollEnabled: true, //可滚动
          style: {
            backgroundColor: '#678'
          },
          indicatorStyle: styles.indStyle, //指示器样式,就是tab下面那个横线
          labelStyle: styles.labelStyle,   //tab上的文字属性
        }
      }

    ));
    return (
      <View style={{ flex: 1}}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}
const pageSize = 10;
//每一个topTab的具体页面
class PopularTab extends Component {

  constructor(props) {
    super(props)
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData()
  }

  loadData(loadMore) {
    const { onLoadPopularData, onLoadMorePopular } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, store.pageIndex + 1, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多数据了');
      })
    } else {
      onLoadPopularData(this.storeName, url, pageSize);
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
    return <PopularItem
      projectModel={item}
      onSelect={(callBack) => {

      }}
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
  popular: state.popular  //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url, pageSize) => dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack)),
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
    minWidth: 60,
  },
  indStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
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
