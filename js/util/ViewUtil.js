import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {

    /**
     * 左侧返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{ padding: 8, paddingLeft: 12 }}
            onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{ color: 'white' }} />
        </TouchableOpacity>
    }

    /**
         * 右侧文字按钮
         * @param title
         * @param callBack
         * @returns {XML}
         */
    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{ alignItems: 'center', }}
            onPress={callBack}>
            <Text style={{ fontSize: 20, color: '#FFFFFF', marginRight: 10 }}>{title}</Text>
        </TouchableOpacity>
    }

    /**
     * 分享按钮
     * @param callBack
     * @returns {XML}
     */
    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={20}
                style={{ opacity: 0.9, marginRight: 10, color: 'white' }} />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});

