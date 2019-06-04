/**
 * 自定义主题页面
 */
import React, {Component} from 'react'
import {DeviceInfo,Modal, TouchableHighlight,Platform, ScrollView, StyleSheet, Text, View} from 'react-native'
import ThemeDao from "../expand/dao/ThemeDao";
import GlobalStyles from "../res/styles/GlobalStyles";
import ThemeFactory, {ThemeFlags} from "../res/styles/ThemeFactory";
import actions from "../action";
import {connect} from "react-redux";

class CustomTheme extends Component {

    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    //cell点击事件
    onSelectTheme(themeKey) {
    //    this.props.onClose();    //用这个调用会报错(不明原因),使用下面的方法调用
        this.props.onShowCustomThemeView(false);
        this.themeDao.save(ThemeFlags[themeKey]);
        const {onThemeChange} = this.props;
        onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
    }

    /**
     * 创建主题cell
     * @param themeKey
     */
    getThemeItem(themeKey) {
        return <TouchableHighlight
            style={{flex: 1}}
            underlayColor='white'  //按下的颜色
            onPress={() => this.onSelectTheme(themeKey)}
        >
            <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
                <Text style={styles.themeText}>{themeKey}</Text>
            </View>
        </TouchableHighlight>
    }

    //scrollerview上显示的view
    renderThemeItems() {
        const views = [];
        // Object.keys:返回一个数组,元素为枚举类型; i+=3 每行显示3个cell
        for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {   
            const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
            views.push(<View key={i} style={{flexDirection: 'row'}}>
                {this.getThemeItem(key1)}
                {this.getThemeItem(key2)}
                {this.getThemeItem(key3)}
            </View>)
        }
        return views;
    }

    renderContentView() {
        return (
            <Modal
                animationType={"slide"}     
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.onClose()
                }}
            >
                <View style={styles.modalContainer}>
                    <ScrollView>
                        {this.renderThemeItems()}
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        let view = this.props.visible ? <View style={GlobalStyles.root_container}>
            {this.renderContentView()}
        </View> : null;
        return view;
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
    themeItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        margin: 10,
        marginBottom: 10 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
        marginTop: Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3
    },
    themeText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16
    }
});