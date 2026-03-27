import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Alert, Platform } from 'react-native';

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

const Install = async (downloadState) => {
    if (!downloadState.uri) return;
    try {
        const contentUri = await FileSystem.getContentUriAsync(downloadState.uri);
        await IntentLauncher.startActivityAsync(
        'android.intent.action.INSTALL_PACKAGE',
        {
          data: contentUri,
          flags: 1 << 0,
          type: 'application/vnd.android.package-archive',
        }
      );
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
        Install(downloadState);
    }
}