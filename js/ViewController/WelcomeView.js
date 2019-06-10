import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil'
import SplashScreen from 'react-native-splash-screen'


export default class WelcomeView extends Component{

    componentDidMount(){
        this.timer = setTimeout(() => {
            SplashScreen.hide();
            NavigationUtil.resetToHomPage({
                navigation: this.props.navigation
            })
        }, 200);    //Android没有启动图,使用定时器模拟
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    render(){
        return null;    //可显示广告等
    }

}