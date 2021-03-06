import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { connect } from 'react-redux';
import PopularView from '../ViewController/PopularView';
import TrendingView from '../ViewController/TrendingView';
import FavoriteView from '../ViewController/FavoriteView';
import MineView from '../ViewController/MineView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { BottomTabBar } from 'react-navigation-tabs';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus'




type Props = {};

const TABS = {//在这里配置页面的路由
    PopularView: {
        screen: PopularView,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        }
    },
    TrendingView:
    {
        screen: TrendingView,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        }
    }
    ,
    FavoriteView: {
        screen: FavoriteView,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        }
    }
    ,
    MineView: {
        screen: MineView,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({ tintColor, focused }) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        }
    }
};

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    _tabNavigator() {
        if (this.Tabs) {
            //如果tabbar存在就不再次创建
            return this.Tabs;
        }
        const { PopularView, TrendingView, FavoriteView, MineView } = TABS;
        const tabs = { PopularView, TrendingView, FavoriteView, MineView };//根据需要定制显示的tab
        PopularView.navigationOptions.tabBarLabel = '最热';//动态配置Tabbar属性
        return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
            //tabbar组件,修改它可以改变tabbar样式
            tabBarComponent: props => {
                //将theme传给TabBarComponent
                return <TabBarComponent theme={this.props.theme} {...props} />
            }
        }
        ));
    }

    render() {

        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => { //点击了tabbar会触发这个函数
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {    //发送底部tab切换的事件
                    from: prevState.index,  //上一次点击的tabbar
                    to: newState.index      //这次点击的tabbar
                })
            }}
        />
    }
}

class TabBarComponent extends Component {
    constructor(props) {
        super(props)
        this.theme = {    //定义一个主题属性
            tintColor: props.activeTintColor,    //设置颜色
            updataTime: new Date().getTime(),    //时间作为标志位
        }
    }

    render() {
        return <BottomTabBar    //navigation组件tabbar
            {...this.props}
            activeTintColor={this.props.theme.themeColor}
        />
    }
}

/**
 * state是reducer中的state
 * state.theme是reducer文件夹index.js文件combineReducers中的theme
 * state.theme.theme是reducer文件夹,下的theme文件夹下的index.js文件Types.THEME_CHANGE的自定义theme
 */
const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);

