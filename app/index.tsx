import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const Home = () => {
  const webviewRef = useRef(null);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = tomorrow.toLocaleDateString("ko-KR");
  tomorrow = tomorrow.replace(/\. /g, '-')
  const uri = `https://login.schulmanager-online.de/#/modules/schedules/view//?start=${tomorrow}`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
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
                    child.style.setProperty('padding-right', '10px', 'important');
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
        sharedCookiesEnabled={true}
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