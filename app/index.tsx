import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import React, { useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const CURRENT_VERSION = "0.1.0"; //TODO: updaten!! UND in app.json


// Autoupdate
const getLatestApk = async () => {
  const response = await fetch('https://api.github.com/repos/GruenerAdler/SchulmanagerOffline/releases/latest');
  const data = await response.json();

  console.log("GitHub API Response:", data);

  const apk = data.assets.find(a => a.name.endsWith('.apk'));
  if (!apk) {
    throw new Error("Keine APK gefunden!");
  }

  return {
    url: apk.browser_download_url,
    version: data.tag_name
  };
};

const checkForUpdate = async () => {
  try {
    const latest = await getLatestApk();
    const cleanLatest = latest.version.replace(/[^\d.]/g, "");
    if (cleanLatest !== CURRENT_VERSION) {
      //Prompt
      Alert.alert(
        "Update verfügbar",
        `Neue Version ${latest.version} verfügbar. Willst du updaten?`,
        [
          {
            text: "Nein",
            style: "cancel"
          },
          {
            text: "Ja",
            onPress: () => DownloadAndInstall(latest.url)
          }
        ]
      );
    }
  } catch (error) {
    console.log("Update-Check Fehler:", error);
  };
};
const DownloadAndInstall = async (apkUrl) => {
  try {
    const fileUri = FileSystem.documentDirectory + 'app-release.apk';

    // Download
    const download = await FileSystem.downloadAsync(apkUrl, fileUri);
    console.log("APK gespeichert unter:", download.uri);

    // Installationsdialog starten
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: download.uri,
      flags: 1,
      type: 'application/vnd.android.package-archive'
    });
  } catch (error) {
  console.log("Download/Install Fehler:", error);
  }
};



const Home = () => {
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
    }
})