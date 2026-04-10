export const injectJavaScript = () => {return `
try {
// -- Basic settings
let theme
document.body.style.setProperty("--safe-area-inset-top","0");

// --Dark Mode
function applyDarkMode() {
  document.body.style.backgroundColor = "#121212";
  document.body.style.setProperty("--bs-body-bg","#121212");
  document.documentElement.style.setProperty("--bs-body-color", "#fff");
  document.body.style.setProperty("--bs-btn-color","#fff", "!important");

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
      }
      if (!child.style.color && !el.classList.contains("cancelled")) {
        child.style.color = "#fff";
      }
    });
  });
  
  //Buttons
  document.querySelectorAll('.btn-light').forEach(el => {
    el.classList.remove('btn-light');
    el.classList.add('btn-dark');  
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

function fixStuff() {
  //Drop Down
  document.querySelectorAll('.ng-dropdown-panel').forEach(el => {
    el.style.setProperty('left', '-85px');
  });

  //Tooltips
  document.querySelectorAll(".lesson-cell").forEach(el => {
    el.querySelectorAll(".fa-info-circle").forEach(child => {
      child.style.setProperty('padding-right', '15px', 'important');
    });
  });
}

//OnLoad
window.addEventListener("load", () => {
  fixStuff();
  if (theme == "dark") {
    applyDarkMode(); 
  }
});

//OnChange
const observer = new MutationObserver(() => {
  fixStuff();
  if (theme == "dark") {
    applyDarkMode();
  }
});


function handleMessage(event) {
  try {
    const data = JSON.parse(event.data);
    if (data.type === "theme") {
      theme = data.value === "dark" ? "dark" : "light";
      if (theme === "dark") {
        applyDarkMode();
      } else {
        window.location.reload();
      }
    }
  } catch (e) {
    window.ReactNativeWebView.postMessage("ERROR: " + e.message);
  }
}

//LISTENER
document.addEventListener("message", handleMessage); // Android
//window.addEventListener("message", handleMessage);   // iOS



observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class", "style"]
});

} catch (e) {
  window.ReactNativeWebView.postMessage(JSON.stringify(e));
}
true;
`;};