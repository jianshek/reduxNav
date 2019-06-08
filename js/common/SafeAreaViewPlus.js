/**
 * iPhone适配全面屏(iPhoneX),Android全面屏在清单文件中设置max_aspect
 */

import React, {Component,} from 'react';
import {DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';

export default class SafeAreaViewPlus extends Component {
    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,     //topNavBar颜色
        bottomColor: PropTypes.string,  //tabbar颜色,react-navigation会自动适配tabbar
        enablePlus: PropTypes.bool,     //是否使用SafeAreaViewPlus,false的话会使用SafeAreaView
        topInset: PropTypes.bool,       //topNavbar与顶部的偏移量
        bottomInset: PropTypes.bool,    //tabbar与底部的偏移量

    };
    static defaultProps = {
        topColor: 'transparent',
        bottomColor: '#f8f8f8',
        enablePlus: true,
        topInset: true,
        bottomInset: false,
    };

    genSafeAreaViewPlus() {
        //外部控件包含一些控件,那么外面控件的children就是它包含的这些控件
        const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
        return <View style={[styles.container, this.props.style]}>
            {this.getTopArea(topColor, topInset)}
            {children}
            {this.getBottomArea(bottomColor, bottomInset)}
        </View>;
    }

    genSafeAreaView() {
        return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
            {this.props.children}
        </SafeAreaView>
    }

    getTopArea(topColor, topInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !topInset ? null
            : <View style={[styles.topArea, {backgroundColor: topColor}]}/>;
    }

    getBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
            : <View style={[styles.bottomArea, {backgroundColor: bottomColor}]}/>;
    }

    render() {
        const {enablePlus} = this.props;
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topArea: {
        height: 44,
    },
    bottomArea: {
        height: 34,
    }
});