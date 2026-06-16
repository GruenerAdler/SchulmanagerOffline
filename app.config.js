import config from "./app.json";

const isDev = process.env.EAS_BUILD !== "true";

config.expo.name = isDev
  ? "DEVmanagerOffline"
  : "SchulmanagerOffline";

config.expo.android.package = isDev
  ? "com.grueneradler.SchulmanagerOffline.dev"
  : "com.grueneradler.SchulmanagerOffline";

export default config;