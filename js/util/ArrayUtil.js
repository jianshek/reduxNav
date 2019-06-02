/**
 * 数组类工具
 */
export default class ArrayUtil {
    /**
     * 判断两个数组的是否相等
     * @return boolean true 数组长度相等且对应元素相等
     * */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false;      //两个数组都要存在
        if (arr1.length !== arr2.length) return false;  //长度判断
        for (let i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] !== arr2[i]) return false;  //元素判断
        }
        return true;
    }
}