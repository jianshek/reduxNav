/**
 * 自定义语言,自定义标签,移除标签的详情页(最热模块显示的为标签,趋势模块显示的为语言)
 */

import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import CheckBox from 'react-native-check-box'       //复选框
import Ionicons from 'react-native-vector-icons/Ionicons'
import ArrayUtil from "../util/ArrayUtil";

const THEME_COLOR = '#678'

type Props = {};
class CustomKeyView extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.changeValues = [];         //将改变的数据保存到这个数组中
        this.isRemoveKey = !!this.params.isRemoveKey;   //是否是点击 标签移除 进来的(将标签从数据库中删除)
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: []    //当前页面的的数据(最热或趋势topNavbar的数据)
        }
    }

    //reducer已经返回数据了,但是本页面state没有改变,重写下面这个方法
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyView._keys(nextProps, null, prevState)) {   //当之前的keys和现在的keys不同时
            return {
                keys: CustomKeyView._keys(nextProps, null, prevState),  //把新的数据赋给keys
            }
        }
        return null;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (CustomKeyView._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyView._keys(this.props),  //把数据赋给keys
        })
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始的标签
     * @param state 移除标签时使用
     * @returns {*}
     * @private
     */
    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
        if (isRemoveKey && !original) {
            //如果state中的keys为空则从props中取
            return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
                return {//注意：不直接修改props，copy一份
                    ...val,
                    checked: false  //将checked属性设为false
                };
            });
        } else {
            return props.language[key];
        }
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    //右上角按钮点击事件
    onSave() {
        if (this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props.navigation);
            return;
        }
        let keys;
        if (this.isRemoveKey) {//移除标签的特殊处理
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtil.remove(keys = CustomKeyView._keys(this.props, true), this.changeValues[i], "name");
            }
        }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys);
        const {onLoadLanguage} = this.props;
        //更新store,实时改变最热和趋势模块的topNavbar数据
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }

    //ScrollView上的view,使当前view可以滑动
    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {   //每行显示两个复选框
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}   
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        return views;
    }

    //复选框点击事件
    onClick(data, index) {
        data.checked = !data.checked;   //将数据的checked属性取反
        ArrayUtil.updateArray(this.changeValues, data);
        this.state.keys[index] = data;//更新state以便显示选中状态
        this.setState({
            keys: this.state.keys
        })
    }

    //左上角按钮点击事件
    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    }, {
                    text: '是', onPress: () => {
                        this.onSave();
                    }
                }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    //复选框图片
    _checkedImage(checked) {
        const {theme} = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: theme.themeColor,
            }}/>
    }

    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }

    render() {
        const {theme} = this.params;
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            style={theme.styles.navBar}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />;
        return <View
            style={styles.container}
            topColor={theme.themeColor}
        >
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }

}

const mapPopularStateToProps = state => ({
    language: state.language,   //当前页面的数据(最热和趋势topNavbar的数据)
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    }
});