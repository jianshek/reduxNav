//创建根action(不是必须)
import { onThemeChange } from './theme'
import { onLoadPopularData, onLoadMorePopular } from './popular'
import { onRefreshTrending, onLoadMoreTrending } from './trending'
import { onLoadFavoriteData } from './favorite'


export default {
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopular,
    onRefreshTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,
}