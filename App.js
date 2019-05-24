import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './js/navigator/AppNavigator';
import store from './js/store'
import { createAppContainer } from 'react-navigation'


type Props = {};
export default class App extends Component<Props> {
    render() {
        /**
         * 将store传递给App框架
         * Provider:把store 提供给其子组件
         */
        return <Provider store={store}>
            <AppNavigator />
        </Provider>
    }
}


