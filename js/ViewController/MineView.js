

import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MORE_MENU } from "../common/MORE_MENU";
import NavigationBar from '../common/NavigationBar';
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from "../res/styles/GlobalStyles";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import {connect} from 'react-redux'
import actions from "../action";


const THEME_COLOR = '#678';
type Props = {};
class MineView extends Component<Props> {

  //scrollView点击item
  onClick(menu) {
    const {theme} = this.props;
    let RouteName = '';
    let params = {theme}; //使用theme初始化,以便于下个页面能拿到theme

    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebviewView';
        params.title = '教程';
        // params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        params.url = 'https://www.baidu.com'
        break;
      case MORE_MENU.About:
        RouteName = 'AboutView';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMeView';
        break;
      case MORE_MENU.Custom_Theme:
        const { onShowCustomThemeView } = this.props;
        onShowCustomThemeView(true);    //弹出themeview
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyView';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyView';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyView';
        RouteName = 'CustomKeyView';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  //获取ScrollView的数据源
  getItem(menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }

  render() {
    const {theme} = this.props;
    //状态栏和navigationbar
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar =
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />;

    return (

      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)} //跳转到 关于 页面
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: theme.themeColor,
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: theme.themeColor,
              }} />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>

    );
  }
}

const mapStateToProps = state => ({ //state包含reducer中popular,trending等,
  //state.theme是取出reducer中theme文件,state树有两个字段,theme和onShowCustomThemeView; state.theme.theme就是取出state树中的theme字段 
  theme: state.theme.theme,   
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }

});
