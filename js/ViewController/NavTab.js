import React, { Component } from 'react';
import { View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import { NavigationActions, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import BackPressComponent from '../common/BackPressComponent'
import CustomTheme from '../ViewController/CustomTheme';


type Props = {};
//配置tabbar
class NavTab extends Component<Props> {

    constructor(props) {
        super(props);
        //处理安卓物理返回键
        this.backPress = new BackPressComponent({ backPress: this.onBackPress });
    }

    componentDidMount() {
        //开启事件监听
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        //移除监听
        this.backPress.componentWillUnmount();
    }

    /**
     * 处理 Android 中的物理返回键
     * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
     * @returns {boolean}
     */
    onBackPress = () => {
        const { dispatch, nav } = this.props;
        /**
         * nav.routes[1]:在AppNavgator.js文件中rootNav是两个,Init和Main,[1]表示Main
         * nav.routes[1].index === 0:表示没有上层页面可返回
         * return false:表示不处理物理按键,即退出APP
         */
        if (nav.routes[1].index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    renderCustomThemeView() {
        const { customThemeViewVisible, onShowCustomThemeView } = this.props;
        return (<CustomTheme
            visible={customThemeViewVisible}
            {...this.props}
            onClose={() => onShowCustomThemeView(false)}
        />)
    }

    render() {
        //把外部导航器传给油条,使其能在配置的路由中跳转
        NavigationUtil.navigation = this.props.navigation;
        // return <DynamicTabNavigator/>
        return <View style={{ flex: 1 }}>
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </View>

    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible,
    theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps)(NavTab);