package com.reduxnavtest;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "reduxNavTest";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        SplashScreen.show(this); //开启启动图
        MobclickAgent.setSessionContinueMillis(1000*40);   //友盟统计 
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
}
