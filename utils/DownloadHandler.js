import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';
import FileViewer from "react-native-file-viewer";

let openingFile = false;

const getLatestAPK = async () => {
    const response = await fetch('https://api.github.com/repos/GruenerAdler/SchulmanagerOffline/releases/latest');
    const data = await response.json();
    const apk = data.assets.find(a => a.name.endsWith('.apk'));
    if (!apk) throw new Error("No APK found!");
    return {
        url: apk.browser_download_url,
        version: data.tag_name
    }
};

export const checkForUpdate = async (setDownloadState, CURRENT_VERSION) => {
    try {
        // If something already downloaded
        const fileUri = FileSystem.cacheDirectory + "update.apk";
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            setDownloadState(prev => ({
                ...prev,
                uri: fileUri,
                progress: 1,
            }));
        }
        
        // Getting latest apk
        const latest = await getLatestAPK();
        const cleanLatest = latest.version.replace(/[^\d.]/g, "");

        // Prompt
        if (cleanLatest !== CURRENT_VERSION) {
            setDownloadState(prev => ({
                ...prev,
                version: latest.version
            }));
        }
    } catch (error) {
        Alert.alert("Update-Check-Error:", error.message);
    }
};

const Download = async (apkUrl, setDownloadState) => {
    try {
        if (Platform.OS !== 'android') {
            Alert.alert("Only Android supports APK installation");
            return;
        }
        setDownloadState(prev => ({
            ...prev,
            downloading: true
        }));
        // UpdateFile location
        const fileUri = FileSystem.cacheDirectory + "update.apk";

        // Prepare Download
        const download = FileSystem.createDownloadResumable(
            apkUrl,
            fileUri,
            {},
            (progressEvent) => {
                const progress =
                    progressEvent.totalBytesWritten /
                    progressEvent.totalBytesExpectedToWrite;
                setDownloadState(prev => ({
                    ...prev,
                    progress: progress
                }));
            }
        );
        // Download
        const result = await download.downloadAsync();
        setDownloadState(prev => ({
            ...prev,
            uri: result.uri,
            downloading: false
        }));
    } catch (e) {
        console.log(e);
        Alert.alert("Download-Error:", e.message);
        setDownloadState(prev => ({
                    ...prev,
                    downloading: false
                }));
    }
};

const Install = async (downloadState, setDownloadState) => {
    if (!downloadState.uri) return;
    try {
        const contentUri = await FileSystem.getContentUriAsync(downloadState.uri);
        const installresult = await IntentLauncher.startActivity(
        'android.intent.action.INSTALL_PACKAGE',
        {
          data: contentUri,
          flags: 1 << 0,
          type: 'application/vnd.android.package-archive',
        }
      );
      if (installresult?.extra?.['android.intent.extra.INSTALL_RESULT'] == -2) {
        setDownloadState(prev => ({
            ...prev,
            progress: 0,
            uri: ""
        }));
        Alert.alert("Download Fehler", "Die Datei wurde nicht vollständig heruntergeladen. Bitte installieren sie Sie erneut.")
        }
    } catch (e) {
        Alert.alert("Install-Error", e.message);
        console.log(e.message)
    }
}

export const DownloadPressHandler = async (downloadState, setDownloadState) => {
    if (downloadState.downloading) return;
    if (downloadState.progress == 0) {
        const latest = await getLatestAPK();
        Download(latest.url, setDownloadState);
    } else if (downloadState.progress == 1) {
        Install(downloadState, setDownloadState);
    }
}


//NORMAL FILES
const extractFileInfo = (url) => {
  try {
    const encoded = url.split("/download-file/")[1];
    const decoded = atob(encoded);
    const parsed = JSON.parse(decoded);
    const fileName = parsed[6];
    return fileName;
  } catch (e) {
    console.log("DECODE ERROR:", e);
    return {
      fileName: "file"
    };
  }
};

const openFile = async (fileUri) => {
  try {
    await FileViewer.open(fileUri);

  } catch (e) {
    console.log("OPEN ERROR:", e);
  }
};

export const downloadAndOpenFile = async (url) => {
  try {
    if (openingFile == false) {
        openingFile = true;
        const fileName = extractFileInfo(url);
        const fileUri = FileSystem.cacheDirectory + fileName;

        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
        await openFile(fileUri);
        return;
        }

        const result = await FileSystem.downloadAsync(url, fileUri);

        if (result.status !== 200) {
        throw new Error("Download fehlgeschlagen");
        }

        openFile(fileUri);
        openingFile = false;
    }
  } catch (e) {
    console.log("DOWNLOAD ERROR:", e);
  }
};