import React, {Component} from 'react';
import {View, Linking} from 'react-native';
import NavigationUtil from "../../navigator/NavigationUtil";
import {MORE_MENU} from "../../common/MORE_MENU";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/AboutDefault.json' ;     //导入json文件相当于导入一个对象
import GlobalStyles from "../../res/styles/GlobalStyles";

const THEME_COLOR = '#678';
type Props = {};

export default class AboutView extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
                ...this.params,
                navigation: this.props.navigation,
                flagAbout: FLAG_ABOUT.flag_about,
            }, data => this.setState({...data})
        );
        this.state = {
            data: config,
        }
    }

    onClick(menu) {

        let RoutseName, params = this.params;
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebviewView';
                params.title = '教程';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMeView';
                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://crazycodeboy@gmail.com';
                Linking.canOpenURL(url)     //是否能打开邮箱
                    .then(support => {
                        debugger
                        if (!support) {
                            console.log('Can\'t handle url: ' + url);
                        } else {
                            Linking.openURL(url);   //打开邮箱
                        }
                    }).catch(e => {
                    console.error('An error occurred', e);
                });
                break;
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }

    getItem(menu) {
        const {theme} = this.params;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
    }

    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}      
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>;
        return this.aboutCommon.render(content, this.state.data.app);
    }

}