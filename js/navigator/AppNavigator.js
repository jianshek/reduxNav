import { createStackNavigator, createSwitchNavigator, createAppContainer } from "react-navigation";
import WelcomeView from '../ViewController/WelcomeView'
import NavTab from '../ViewController/NavTab'
import DetailView from '../ViewController/DetailView'
import { connect } from 'react-redux';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import { createReduxContainer } from 'react-navigation-redux-helpers'
import WebviewView from '../ViewController/WebviewView'
import AboutView from '../ViewController/about/AboutView'
import AboutMeView from '../ViewController/about/AboutMeView'
import CustomKeyView from './/../ViewController/CustomKeyView'


export const rootCom = 'Init';//设置根路由

const InitNavigator = createStackNavigator({
    WelcomeView: {
        screen: WelcomeView,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }
});

const MainNavigator = createStackNavigator({
    NavTab: {
        screen: NavTab,
        navigationOptions: {
            header: null,
        }
    },
    DetailView: {
        screen: DetailView,
        navigationOptions: {
            header: null,
        }
    },
    WebviewView: {
        screen: WebviewView,
        navigationOptions: {
            header: null,
        }
    },
    AboutView: {
        screen: AboutView,
        navigationOptions: {
            header: null,
        }
    },
    AboutMeView: {
        screen: AboutMeView,
        navigationOptions: {
            header: null,
        }
    },
    CustomKeyView: {
        screen: CustomKeyView,
        navigationOptions: {
            header: null,
        }
    }
}, {
        defaultNavigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    });

export const RootNavigator = createAppContainer(createSwitchNavigator({ //设置最外层路由
    Init: InitNavigator,    //rootCom
    Main: MainNavigator,    //resetToHomPage
}, {
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }));

/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为reduxifyNavigator的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 * 把需要导航的组件与导航reducer连接起来
 */
export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'

);

/**
 * 2.将根导航器组件传递给 reduxifyNavigator 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 * 弃用方法
 */
// const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

/**
 *2 将NavigationStack封装成高阶组件AppNavigation，这个高阶组件完成了navigation prop的替换，
 * 改成了使用redux里的navigation
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * State到Props的映射关系
 *  映射导航状态到组件props
 * @param state
 */
const mapStateToProps = state => ({
    state: state.nav,//v2
});
/**
 * 3.连接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);