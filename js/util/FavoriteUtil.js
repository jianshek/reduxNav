import {FLAG_STORAGE} from '../expand/dao/DataStore'

export default class FavoriteUtil {

    /**
     * favoriteIcon单击回调函数
     * @param favoriteDao
     * @param item          原始数据
     * @param isFavorite    是否收藏
     * @param flag          最热或趋势
     */
    static onFavorite(favoriteDao, item, isFavorite, flag) {
        const key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}