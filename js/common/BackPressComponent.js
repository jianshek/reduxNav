import React, {PropTypes} from "react";
import {BackHandler} from "react-native";

/**
 * Android物理回退键处理
 */
export default class BackPressComponent {
    constructor(props) {
        this._hardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }

    componentDidMount() {
        //添加安卓物理按键监听,如果按了返回键,调用_hardwareBackPress       
        if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
    }

    componentWillUnmount() {
        if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackPress);
    }

    //物理按键按下时的回调
    onHardwareBackPress(e) {
        return this.props.backPress(e); //返回传进来的backPress,ye就是让原来的页面自行处理
    }
}