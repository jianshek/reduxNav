import Types from '../types'


export function onThemeChange(theme) {
    return { type: Types.THEME_CHANGE, theme: theme } //返回一个action和要传递的数据
}