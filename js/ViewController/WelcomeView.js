import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil'

export default class WelcomeView extends Component{

    componentDidMount(){
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomPage({
                navigation: this.props.navigation
            })
        }, 200);
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    render(){
        return null;
    }

}