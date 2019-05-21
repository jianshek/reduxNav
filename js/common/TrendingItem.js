
import React,{ Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import HTMLView from 'react-native-htmlview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default class TrendingItem extends Component {

    render() {
        const { projectModel } = this.props;//获取数据
        const item = projectModel;
        if (!item ) return null;
        let description = '<p>' + item.description + '</p>';//description有标清Text标签显示不出来
        //搜藏按钮
        let favouriteButton = <TouchableOpacity
            style={{ padding: 6 }} //padding:增加点击的范围
            onPress={() => {

            }}
            underlayColor={'transparent'}  //按下颜色,透明
        >
            <FontAwesome
                name={'star-o'}
                size={26}
                style={{ color: 'red' }}
            />

        </TouchableOpacity>

        return (

            <TouchableOpacity
                onPress={this.props.onSelect} //回调函数
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                        }}
                        stylesheet={{
                            p: styles.description,  //p标签样式
                            a: styles.description,  //a标签样式
                        }}
                    />
                    <Text style={styles.description}>
                        {item.meta}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Built by: </Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={{ height: 22, width: 22, margin: 2 }}
                                    source={{ uri: arr[i] }}
                                />
                            })}

                        </View>
                        {favouriteButton}
                    </View>
                </View>

            </TouchableOpacity>

        )
    }

}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
}
);