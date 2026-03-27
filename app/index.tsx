import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import SettingsMenu from '../components/SettingsMenu';
import { checkForUpdate, DownloadPressHandler } from '../utils/DownloadHandler';
import { injectJavaScript } from '../utils/injectJS';
import { getJWT, Login } from '../utils/JWTHandler';

const CURRENT_VERSION = "0.2.1"; //TODO: updaten!! UND in app.json


function Home() {
  const [downloadState, setDownloadState] = useState({
    progress: 0,
    uri: null,
    downloading: false,
    version: null,
  });

  const webviewRef = useRef(null);

  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    checkForUpdate(setDownloadState, CURRENT_VERSION);
  }, []);

  const onMessage = async (event: any) => {
    const msg = event.nativeEvent.data;
    if (msg === "EXPIRED" || msg === "NO_JWT" || msg === "INVALID") {
      Login(webviewRef, event);
    }
  };

  //Prepare URL
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = tomorrow.toLocaleDateString("ko-KR");
  tomorrow = tomorrow.replace(/\. /g, '-');
  const uri = `https://login.schulmanager-online.de/#/modules/schedules/view//?start=${tomorrow}`;

  // {---APP---}
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        bounces={false}
        ref={webviewRef}
        pullToRefreshEnabled={true}
        style={{ flex: 1 }}
        onMessage={onMessage}
        onLoadEnd={() => { getJWT(webviewRef); } }
        injectedJavaScript={injectJavaScript()}
        injectedJavaScriptBeforeContentLoaded={injectJavaScript()}
        source={{ uri }}
        cacheEnabled={true} />

      {/* DOWNLOAD BAR*/}
      <TouchableOpacity
        onPress={() => DownloadPressHandler(downloadState, setDownloadState)}
        style={{
          height: 25,
          backgroundColor: "#ddd",
          borderRadius: 10,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          display: downloadState.version ? "flex" : "none"
        }}>
        <View style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${downloadState.progress * 100}%`,
          backgroundColor: "#4caf50",
        }} />
        <Text style={{
          color: "black",
          fontWeight: "bold",
          fontSize: 18
        }}>
          {downloadState.progress === 0
            ? `Update to: ${downloadState.version}`
            : downloadState.progress < 1
              ? `Downloading... ${Math.round(downloadState.progress * 100)}%`
              : "Install"}
        </Text>

      </TouchableOpacity>


      <View style={styles.headline}>

        {/* LEFT - Spacer*/}
        <View style={styles.side} />

        {/* CENTER - Titel */}
        <View style={styles.center}>
          <Text style={styles.text}>Inofficial - Modified</Text>
        </View>

        {/* RIGHT - Settings */}
        <View style={styles.side}>
          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Ionicons name="settings-outline" color="white" size={24} />
          </TouchableOpacity>
        </View>

      </View>

      <SettingsMenu
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black"
    },
    headline: {
      backgroundColor: "#121212",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
    },
    text: {
        fontSize:20,
        padding:5,
        color: "white"
    },
    side: {
      width: 40,
      alignItems: "flex-end",
      justifyContent: "center",
      marginRight: 10,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    downloadtext: {
      fontSize: 25,
      color: "white",
      display: "flex"
    }
})