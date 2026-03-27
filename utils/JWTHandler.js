import * as SecureStore from "expo-secure-store";

export const getJWT = async (webviewRef) => {
    if (!webviewRef) return;
    const checkJwtjs = `
        (function() {
            const jwt = localStorage.getItem("jwt");
            if (!jwt) return "NO_JWT";
            try {
                const payload = JSON.parse(atob(jwt.split(".")[1]));
                const now = Date.now() / 1000;
                if (payload.exp < now) {
                    return "EXPIRED";
                } else {
                    return "VALID";
                }
            } catch(e) {
                return "INVALID";
            }
        })();
    `;

    webviewRef.current?.injectJavaScript(`
        (async () => {
            const status = ${checkJwtjs};
            window.ReactNativeWebView.postMessage(status);
        })();
    `)
};

export const Login = async (webviewRef, event: any) => {
    if (!webviewRef) return;
    const username = await SecureStore.getItemAsync("user_email");
    const password = await SecureStore.getItemAsync("user_pass");
    if (!username || !password) {
        console.log("Keine Login Daten gespeichert");
        return;
    }
    const msg = event.nativeEvent.data;
        const LoginJS = `
            (function() {
                const interval = setInterval(() => {
                    const userInput = document.querySelector('#emailOrUsername');
                    const passInput = document.querySelector('#password');
                    
                    if (userInput && passInput) {
                        clearInterval(interval);

                        userInput.value = "${username}";
                        userInput.dispatchEvent(new Event('input', { bubbles: true }));
                        passInput.value = "${password}";
                        passInput.dispatchEvent(new Event('input', { bubbles: true }));

                        document.querySelector('.btn-primary')?.click();
                        }
                }, 300)
                true;
        })();
        `;
        webviewRef.current?.injectJavaScript(LoginJS);
};