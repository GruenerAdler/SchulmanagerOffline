export const injectJavaScript = () => {return `
try {
// -- Basic settings
document.body.style.backgroundColor = "#121212";
document.body.style.setProperty("--bs-body-bg","#121212");
document.documentElement.style.setProperty("--bs-body-color", "#fff");
document.body.style.setProperty("--bs-btn-color","#fff", "!important");
document.body.style.setProperty("--safe-area-inset-top","0");

// --Dark Mode
function applyDarkMode() {
  //BG
  document.body.style.backgroundColor = "#121212";

  //Lesson Table
  document.querySelectorAll(".lesson-cell").forEach(el => {
    //TEXT
    if (!el.classList.contains("cancelled")) {
      el.style.color = "#fff";
    }
    el.querySelectorAll("*").forEach(child => {
      //Info Circle
      if (child.classList.contains("fa-info-circle")) {
        child.style.setProperty('color', '#fff', 'important');
        child.style.setProperty('padding-right', '15px', 'important');
      }
      if (!child.style.color && !el.classList.contains("cancelled")) {
        child.style.color = "#fff";
      }
    })
  });
  
  //Buttons
  document.querySelectorAll('.btn-light').forEach(el => {
    el.classList.remove('btn-light');
    el.classList.add('btn-dark');  
  });

  //Drop Down
  document.querySelectorAll('.ng-dropdown-panel').forEach(el => {
    el.style.setProperty('left', '-85px');
  });

  //Headline
  document.querySelectorAll('.sm-navbar').forEach(el => {
    el.style.setProperty('--smo-navbar-color-bright', '#2f608b')  
  });

  //Tooltips
  document.querySelectorAll('.tooltip').forEach(el => {
    el.style.setProperty('--bs-tooltip-bg', '#fff')
  });
}

// --Get JWT--
function getjwt() {
  try {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const msg =
      "sub: " + payload.sub + "\\n" +
      " issued: " + new Date(payload.iat * 1000) + "\\n" +
      " expires: " + new Date(payload.exp * 1000);

      if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(msg);
      }
    }
  } catch (error) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(error));
    }
  }
}

//OnLoad
window.addEventListener("load", () => {
  applyDarkMode();  
});

const observer = new MutationObserver(() => {
  applyDarkMode();
  //getjwt();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class", "style"]
});
} catch (e) {
  window.ReactNativeWebView.postMessage(JSON.stringify(error));
}
true;
`;};