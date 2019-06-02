/**
 * 获取最热和趋势模块的topNavBar
 */
import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../res/data/keys.json';   //趋势模块的topNavBar
import langs from '../../res/data/langs.json';   //最热模块的topNavBar

/**
 * flag_language:趋势模块
 * flag_key:最热模块
 */
export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}
export default class LanguageDao {

    constructor(flag) {
        this.flag = flag;
    }

    //获取topNavBar数据
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {    //从数据库获取
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {                          //如果数据库无数据,从文件中获取
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
                    this.save(data);    //保存到数据库
                    resolve(data);
                } else {
                    try {
                        console.log('最热数据:',result)
                        resolve(JSON.parse(result)); //JSON.parse:转成对象
                    } catch (e) {
                        reject(error);
                    }
                }
            });
        });
    }

    /**
     * 保存到数据库
     * @param objectData
     */
    save(objectData) {
        let stringData = JSON.stringify(objectData);    //对象转成字符串
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {

        });
    }

}