import React, { Component } from 'react'
import { PropTypes } from 'prop-types';
import { ViewPropTypes, Text, StatusBar, StyleSheet, View, Platform, DeviceInfo } from 'react-native'

const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50;//导航栏在Android中的高度
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;//状态栏的高度

//设置状态栏所接受的属性
const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default',]),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
};

export default class NavigationBar extends Component {

    //设置属性的类型检查
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    };
    //设置默认属性
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
        }
    };

    render() {
        /* 把外界传来的属性赋值给statusBar */
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} /> 
            </View> : null;

        /**ellipsizeMode:取值为enum(‘head’, ‘middle’, ‘tail’, ‘clip’) ,用来设定当文本显示不下全部内容时，文本应该如何被截断，需要注意的是，它必须和numberOfLines（文本显示的行数）搭配使用 */ 
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>;

        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }

    getButtonElement(data) {
        return (
            <View style={styles.navBarButton}>
                {data ? data : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3'
    },
    navBarButton: {
        alignItems: 'center'
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',       //中间的titleview绝对布局,不随所有两头的按钮宽度变化而变化,始终居中
        left: 40,
        right: 40,
        top: 0,
        bottom: 0
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,  //Android状态栏不需要设置
    }
});