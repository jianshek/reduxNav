import React, {Component} from 'react';
import {DeviceInfo, StyleSheet,View} from 'react-native';
import {WebView}from 'react-native-webview';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import GlobalStyles from "../res/styles/GlobalStyles";


const THEME_COLOR = '#678';
type Props = {};

export default class WebviewView extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url} = this.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        };
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();  //webview返回上一页
        } else {
            NavigationUtil.goBack(this.props.navigation);   //返回到上个页面
        }
    }

    //webview是否还能返回到上一页
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    }

    render() {

        const {theme} = this.params;
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={theme.styles.navBar}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
        />;

        return (
            <View
                style={GlobalStyles.root_container}
                backgroundColor={THEME_COLOR}
            >
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
            </View >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    },
});
