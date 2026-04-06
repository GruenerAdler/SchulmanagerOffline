import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsMenu from '../components/SettingsMenu';
import { defaultSettings } from "../utils/defaultSettings";
import { checkForUpdate, DownloadPressHandler } from '../utils/DownloadHandler';
import { injectJavaScript } from '../utils/injectJS';
import { getJWT, Login } from '../utils/JWTHandler';

const CURRENT_VERSION = "0.3.0"; //TODO: updaten!! UND in app.json


function Home() {
  const [downloadState, setDownloadState] = useState({
    progress: 0,
    uri: null,
    downloading: false,
    version: null,
  });
  const [currentSettings, setSettings] = useState();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [theme, setTheme] = useState(null);
  const systemTheme = useColorScheme();

  const webviewRef = useRef(null);

  

  useEffect(() => {
    checkForUpdate(setDownloadState, CURRENT_VERSION);
    loadSettings()
  }, []);

  useEffect(() => {
    if (!currentSettings) return;

    const newTheme =
        currentSettings.theme === "system"
            ? systemTheme
            : currentSettings.theme;

    setTheme(newTheme);

}, [currentSettings, systemTheme]);

  useEffect(() => {
      if (!theme || !webviewRef) return;

      NavigationBar.setButtonStyleAsync(
          theme === "dark" ? "light" : "dark"
      );
      webviewRef.current.postMessage(JSON.stringify({
        type: "theme",
        value: theme
      }));
  }, [theme]);

  const loadSettings = async () => {
    try {
        const data = await AsyncStorage.getItem("Settings");
        setSettings(data ? JSON.parse(data) : defaultSettings)
        if (!data) await AsyncStorage.setItem("Settings", JSON.stringify(defaultSettings));
    } catch (e) {
        console.log("LoadSettings Error:", e);
        return null;
    }
  };

  const onMessage = async (event: any) => {
    const msg = event.nativeEvent.data;
    if (msg === "EXPIRED" || msg === "NO_JWT" || msg === "INVALID") {
      Login(webviewRef, event);
    } else if (msg != "VALID") {
      console.log("MESSAGE" + msg)
    }
  };


  //Prepare URL
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = tomorrow.getFullYear(); + "-" + String(tomorrow.getMonth() + 1).padStart(2, '0') + "-" + String(tomorrow.getDate()).padStart(2, '0');

  const uri = `https://login.schulmanager-online.de/#/modules/schedules/view//?start=${formatted}`;

  // {---APP---}
  return (
    <SafeAreaView style={[styles.container, theme === "light" && styles.lightBG]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} translucent={false}/>
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
            display: downloadState.version ? "flex" : "none",
            marginBottom: 3,
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


        <View style={[styles.headline, theme === "light" && styles.lightBG]}>

          {/* LEFT - Spacer*/}
          <View style={styles.side} />

          {/* CENTER - Titel */}
          <View style={styles.center}>
            <Text style={[styles.text, theme === "light" && styles.darkFont]}>Inofficial - Modified</Text>
          </View>

          {/* RIGHT - Settings */}
          <View style={styles.side}>
            <TouchableOpacity onPress={() => setSettingsVisible(true)}>
              <Ionicons name="settings-outline" color={theme === "light" ? "black" : "white"} size={24} />
            </TouchableOpacity>
          </View>

        </View>

        <SettingsMenu
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          currentSettings={currentSettings}
          setSettings={setSettings}
          theme={theme} />
      </SafeAreaView>
  );
}

export default Home

const styles = StyleSheet.create({
    darkFont: {
      color: "black",
    },
    lightBG: {
      backgroundColor: "#fff",
    },
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