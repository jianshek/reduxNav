import React, { Component } from 'react';
import { View, Linking, Clipboard } from 'react-native';
import NavigationUtil from "../../navigator/NavigationUtil";
import { MORE_MENU } from "../../common/MORE_MENU";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, { FLAG_ABOUT } from "./AboutCommon";
import config from '../../res/data/AboutDefault.json'
import GlobalStyles from "../../res/styles/GlobalStyles";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'

const THEME_COLOR = '#678';
type Props = {};

export default class AboutMeView extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about_me,
        }, data => this.setState({ ...data })
        );
        this.state = {
            data: config,
            showTutorial: true, //展开课程
            showBlog: false,    //展开博客    
            showQQ: false,      //展开QQ
            showContact: false  //展开联系方式
        }
    }

    //点击了cell
    onClick(tab) {
        if (!tab) return;
        const {theme}=this.params;
        if (tab.url) {
            NavigationUtil.goPage({
                theme,
                title: tab.title,
                url: tab.url
            }, 'WebviewView');
            return;
        }
        if (tab.account && tab.account.indexOf('@') > -1) { //包含@的字符串
            let url = 'mailto://' + tab.account;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
            return;
        }
        if (tab.account) {
            Clipboard.setString(tab.account);           //Clipboard:剪切板
            this.toast.show(tab.title + tab.account + '已复制到剪切板。');
        }
    }


    /**
     * 
     * @param {*} data 
     * @param {*} isShow 
     * @param {*} key 
     */
    _item(data, isShow, key) {
        const {theme} = this.params;
        return ViewUtil.getSettingItem(() => {  //点击cell的回调
            this.setState({
                [key]: !this.state[key]     //根据传进来的key,获取相应的state
            });
        }, data.name, theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-down' : 'ios-arrow-forward')
    }

     /**
     * 显示展开列表数据
     * @param dic
     * @param isShowAccount
     * 函数两个参数,如果调用时值传递一个参数,就是第1个参数
     */
    renderItems(dic, isShowAccount) {
        if (!dic) return null;
        const {theme} = this.params;
        let views = [];
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, theme.themeColor)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }

    render() {
        const content = <View>
            {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
            <View style={GlobalStyles.line}/>
            {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
        </View>;
        return <View style={{flex: 1}}>
            {this.aboutCommon.render(content, this.state.data.author)}
            <Toast ref={toast => this.toast = toast}
                   position={'center'}
            />
        </View>
    }

}