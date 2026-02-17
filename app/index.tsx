import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CURRENT_VERSION = "0.1.2"; //TODO: updaten!! UND in app.json



const Home = () => { //TODO: rewrite update code, EVERYTHING!!
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedUri, setDownloadedUri] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [updateVersion, setUpdateVersion] = useState(null);

  // ---------- UPDATE CHECK ----------
  const getLatestApk = async () => {
    const response = await fetch('https://api.github.com/repos/GruenerAdler/SchulmanagerOffline/releases/latest');
    const data = await response.json();

    const apk = data.assets.find(a => a.name.endsWith('.apk'));
    if (!apk) throw new Error("No APK found!");

    return {
      url: apk.browser_download_url,
      version: data.tag_name
    };
  };

  const checkForUpdate = async () => {
    try {
      // If something downloaded
      const fileUri = FileSystem.cacheDirectory + "update.apk";
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setDownloadedUri(fileUri); // Install-Button aktivieren
        setDownloadProgress(1);    // Fortschrittsbalken voll
      }

      // Getting latest apk
      const latest = await getLatestApk();
      const cleanLatest = latest.version.replace(/[^\d.]/g, "");

      // Prompt
      if (cleanLatest !== CURRENT_VERSION) {
        setUpdateVersion(latest.version);
      }
    } catch (error) {
      Alert.alert("Update-Check-Error:", error.message);
    }
  };

  const Download = async (apkUrl) => {
    try {
      if (Platform.OS !== 'android') {
        Alert.alert("Only Android supports APK installation");
        return;
      }
      setDownloading(true);
      // UpdateFile location
      const fileUri  = FileSystem.cacheDirectory + "update.apk";

      // Prepare Download
      const download = FileSystem.createDownloadResumable(
        apkUrl,
        fileUri,
        {},
        (progressEvent) => {
          const progress =
            progressEvent.totalBytesWritten /
            progressEvent.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );
      //Download
      const result = await download.downloadAsync();
      setDownloadedUri(result.uri);
      setDownloading(false);

    } catch (e) {
      console.log(e);
      Alert.alert("Download-Error:", e.message);
      setDownloading(false);
    }
  };

const Install = async () => {
  if (!downloadedUri) return;
  try {
      const contentUri = await FileSystem.getContentUriAsync(downloadedUri);
      await IntentLauncher.startActivityAsync(
        'android.intent.action.INSTALL_PACKAGE',
        {
          data: contentUri,
          flags: 1,
          type: 'application/vnd.android.package-archive',
        }
      );
    } catch (e) {
      Alert.alert("Install-Error", e.message);
    }
  };

  const DownloadPressed = async () => {
    console.log(downloadProgress)
    if (downloadProgress == 0) {
      console.log("downloading")
      const latest = await getLatestApk();
      Download(latest.url);
    } else if (downloadProgress == 1) {
      Install();
    }
  };


  useEffect(() => {
    checkForUpdate();
  }, []);

  // Prepare URL
  const webviewRef = useRef(null);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = tomorrow.toLocaleDateString("ko-KR");
  tomorrow = tomorrow.replace(/\. /g, '-')
  const uri = `https://login.schulmanager-online.de/#/modules/schedules/view//?start=${tomorrow}`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        bounces={false}
        ref={webviewRef}
        pullToRefreshEnabled={true}
        style={{ flex: 1}}
        injectedJavaScript={`
          document.body.style.backgroundColor = "#121212";
          document.body.style.setProperty("--bs-body-bg","#121212");
          document.documentElement.style.setProperty("--bs-body-color", "#fff");
          document.body.style.setProperty("--bs-btn-color","#fff", "!important");
          document.body.style.setProperty("--safe-area-inset-top","0");

          // ---- DARK MODE ----
          function applyDarkMode() {
          
          // Background Color
            document.body.style.backgroundColor = "#121212";


            //  SCHRIFT
            const lessonElements = document.querySelectorAll(".lesson-cell");
            lessonElements.forEach(el => {
              // el selbst färben
              if (!el.classList.contains("cancelled")) {
                el.style.color = "#fff";
                
                
                
                // alle Kinder von el färben
                const children = el.querySelectorAll("*");
                children.forEach(child => {
                  if (child.classList.contains("fa-info-circle")) {
                    child.style.setProperty('color', '#fff', 'important');
                    child.style.setProperty('padding-right', '15px', 'important');
                  }
                  if (!child.style.color) {
                    child.style.color = "#fff";
                  }
                });
              }
            });
            
            // Buttons
            const buttons = document.querySelectorAll('.btn-light');
            buttons.forEach(el => {
              el.classList.remove('btn-light');
              el.classList.add('btn-dark');
            });

            // Drop Down
            document.querySelectorAll('.ng-dropdown-panel').forEach(el =>{
              el.style.setProperty('left','-85px');
            });

            // Headline
            document.querySelectorAll('.sm-navbar').forEach(el => {
              el.style.setProperty('--smo-navbar-color-bright', '#2f608b')
            });

            // Tooltips
            document.querySelectorAll('.tooltip').forEach(el => {
              el.style.setProperty('--bs-tooltip-bg', '#fff')
            });

        }

        window.addEventListener("load", () => {
          applyDarkMode();
        });

        // beobachten wenn neue Elemente dazukommen
        const observer = new MutationObserver(() => {
          applyDarkMode();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "style"]
        });

        true;
          `}
        source={{ uri }}
        cacheEnabled={true}
        />

        {/* DOWNLOADING BAR */}
        <TouchableOpacity
          onPress={DownloadPressed} //TODO: Add lambda funktion wenn Download Version1 dann start download sonst Install
          //disabled={downloadProgress !== 1}
          style={{
          height: 25,
          backgroundColor: "#ddd",
          borderRadius: 10,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          display: updateVersion ? "flex" : "none"
        }}>
            <View style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${downloadProgress * 100}%`,
              backgroundColor: "#4caf50",
            }}/>
            <Text style={{
              color: "black",
              fontWeight: "bold",
              fontSize: 18
            }}>
              {downloadProgress === 0
                ? `Update to: ${updateVersion}`
                : downloadProgress < 1 
                  ? `Downloading... ${Math.round(downloadProgress * 100)}%` 
                  : "Install"}
            </Text>

        </TouchableOpacity>
        <View style={styles.headline}>
            <Text style={styles.text}>Inofficial - Modified by GruenerAdler</Text>
        </View>
    </SafeAreaView>
  )
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
      justifyContent: "center"
    },
    text: {
        fontSize:20,
        padding:5,
        color: "white"
    },
    downloadtext: {
      fontSize: 25,
      color: "white",
      display: "flex"
    }
})