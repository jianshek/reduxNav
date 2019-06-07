//创建根action(不是必须)
import { onThemeChange,onShowCustomThemeView } from './theme'
import { onLoadPopularData, onLoadMorePopular,onFlushPopularFavorite } from './popular';
import { onRefreshTrending, onLoadMoreTrending,onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';
import {onLoadLanguage} from './language';
import {onSearch, onLoadMoreSearch, onSearchCancel} from './search';



export default {
    onThemeChange,
    onShowCustomThemeView,
    onLoadPopularData,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,
    onFlushTrendingFavorite,
    onLoadLanguage,
    onSearch,
    onLoadMoreSearch,
    onSearchCancel,
}