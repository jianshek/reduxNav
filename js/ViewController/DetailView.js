/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import DataStore from '../expand/dao/DataStore'

type Props = {};
export default class DetailView extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      showText: ''
    }
    this.dataStore = new DataStore();
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q='java`
    this.dataStore.fetchData(url)
      .then(data => {
        let showData = `初次加载数据时间:${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
        this.setState({
          showText: showData
        })
      })
      .catch(error => {
        error && console.log(error);
      })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>详情页</Text>
        <Button
          title='返回'
          onPress={() => { NavigationUtil.goBack(this.props.navigation) }}
        />

        <Button
          title='离线缓存'
          onPress={() => {
            this.loadData()
          }}
        />

        <Text>{this.state.showText}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
