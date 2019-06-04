/**
 * 主题dao
 */
import {AsyncStorage,} from 'react-native';
import {ThemeFlags} from "../../res/styles/ThemeFactory";
import ThemeFactory from "../../res/styles/ThemeFactory";

const THEME_KEY = 'theme_key'
export default class ThemeDao {

    /**
     * 获取当前主题
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {                   //如果本地没有保存样式
                    this.save(ThemeFlags.Default);  //保存默认样式
                    result = ThemeFlags.Default;    
                }
                resolve(ThemeFactory.createTheme(result))
            });
        });
    }

    /**
     * 保存主题标识
     * @param themeFlag
     */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {
        }))
    }
}

