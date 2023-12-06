package com.awesomeproject;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;  // Import for Bundle class
import androidx.appcompat.app.AppCompatActivity;  // Import for AppCompatActivity class
import com.facebook.react.ReactInstanceManager;  // Import for ReactInstanceManager class
import com.facebook.react.ReactRootView;  // Import for ReactRootView class
import com.facebook.react.common.LifecycleState;  // Import for LifecycleState enum
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;  // Import for DefaultHardwareBackBtnHandler interface
import com.facebook.react.shell.MainReactPackage;  // Import for MainReactPackage class
import com.facebook.soloader.SoLoader;  // Import for SoLoader class
import org.pgsqlite.SQLitePluginPackage;  // Import for SQLitePluginPackage class (if you are using SQLite)

public class MainActivity extends ReactActivity {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

 
 /*  
   @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")  // this is dependant on how you name you JS files, example assumes index.android.js
                .setJSMainModuleName("index.android")        // this is dependant on how you name you JS files, example assumes index.android.js
                .addPackage(new MainReactPackage())
                .addPackage(new SQLitePluginPackage())       // register SQLite Plugin here
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "AwesomeProject", null); //change "AwesomeProject" to name of your app
        setContentView(mReactRootView);
    }
    */
    /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   
  @Override
  protected String getMainComponentName() {
    return "AwesomeProject";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
