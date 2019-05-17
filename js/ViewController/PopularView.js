/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, FlatList, RefreshControl } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';


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
      <View style={{ flex: 1, marginTop: 30 }}>
        <TabNavigator />
      </View>
    );
  }
}

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

  loadData() {
    const { onLoadPopularData } = this.props;
    const url = this.genFetchUrl(this.storeName);
    onLoadPopularData(this.storeName, url);
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    return <PopularItem
      item={item}
      onSelect={() => {

      }}
    />
  }

  render() {
    const { popular } = this.props;
    let store = popular[this.storeName];//动态获取state
    if (!store) {   //在state树中没有默认的state,所以初始化一个默认的state树
      store = {
        items: [],
        isLoading: false,
      }
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={store.items}
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
        />
      </View>
    )
  }

}

const mapStateToProps = state => ({
  popular: state.popular  //从reducer文件夹的index.js文件中获取对应的state给props
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url)),
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
  }
});
