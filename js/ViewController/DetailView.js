
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, DeviceInfo, TouchableOpacity } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar, { NAV_BAR_HEIGHT_IOS, NAV_BAR_HEIGHT_ANDROID } from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import WebView from 'react-native-webview';
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";



const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

type Props = {};
export default class DetailView extends Component<Props> {
  constructor(props) {
    super(props);
    //通过 this.props.navigation.state.params.xxx 获取上个页面通过navigation传过来的数据
    this.params = this.props.navigation.state.params;
    const { projectModel, flag } = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;

    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,   //网页能否后退
      isFavorite: projectModel.isFavorite
    };
    //处理Android物理返回键
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });


  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.onBack();
    return true;  //停止事件传递,物理返回键不再往后一个页面传递
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onFavoriteButtonClick() {
    const { projectModel, callBack } = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callBack(isFavorite);//调用,baseItem中的setFavoriteState方法,更新最热或趋势cell的收藏状态
    this.setState({
      isFavorite: isFavorite,
    });
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  renderRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{ color: 'white', marginRight: 10 }}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {
          console.log('点击了分享按钮')
        })}
      </View>
    )
  }

  onNavigationStateChange(navState) {

    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,      //当前状态栏下的URL
    })
  }

  render() {
    const { theme } = this.params;
    const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      title={this.state.title}
      titleLayoutStyle={titleLayoutStyle}           //文字过长留空隙
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;

    return <SafeAreaViewPlus
      topColor={theme.themeColor}
    >
      {navigationBar}
      <View style={{ width: '100%', height: '100%' }} >
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}                                        //显示菊花
          onNavigationStateChange={e => this.onNavigationStateChange(e)}  //webview导航栏状态
          source={{ uri: this.state.url }}
        // source={{ uri: "https://www.baidu.com" }}
        />
      </View>
    </SafeAreaViewPlus >
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
  },
});
