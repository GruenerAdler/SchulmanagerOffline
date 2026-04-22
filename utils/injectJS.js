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

function CustomColor() {
  const color = localStorage.getItem("customColor") || "#2f608b";

  // Titles
  document.querySelectorAll('.sm-navbar').forEach(el => {
    el.style.setProperty('--smo-navbar-color-bright', color);
    let {r,g,b} = hexToRgbDarkened(color, 0.25);
    el.style.setProperty('--smo-navbar-color-dark', 'rgb(' + r + ', ' + g + ', ' + b + ')', 'important');
  })

  // Login Title
  document.querySelectorAll('.tile-header' ).forEach(el => {
    el.style.setProperty('background-color', color);
  });

  document.querySelectorAll('.btn-primary').forEach(el => {
    let {r,g,b} = hexToRgbDarkened(color, -0.25);
    el.style.setProperty('--bs-btn-bg', color);
    el.style.setProperty('--bs-btn-disabled-bg', color);
    el.style.setProperty('--bs-btn-border-color', color);
    el.style.setProperty('--bs-btn-disabled-border-color', color);
    el.style.setProperty('--bs-btn-active-bg', 'rgb(' + r + ', ' + g + ', ' + b + ')');
    el.style.setProperty('--bs-btn-hover-bg', color);
  });


  //Mails
  document.querySelectorAll('.modal-header').forEach(el => {
    el.style.setProperty('background-color', color);
  });
  document.querySelectorAll('.table').forEach(el => {
    el.style.setProperty('--bs-table-hover-color', "gray");
    el.style.setProperty('--bs-table-hover-bg', "rgba(0,0,0,0)");
  });
  document.querySelectorAll('.modal-content .dropdown-menu, .ng-dropdown-panel').forEach(el => {
    el.style.setProperty('--bs-dropdown-link-active-bg', color);
  });

  //Reports
  document.querySelectorAll('.nav, .nav-item').forEach(el => {
    el.style.setProperty('border-color', color);
  });
  const style1 = document.createElement('style');
  style1.textContent = \`
  .nice-tabs > li.nav-item.active:not(.disabled),
  .nice-tabs > li.nav-item:hover:not(.disabled),
  .nice-tabs > li.nav-item:focus:not(.disabled) {
    background: \${color} !important;
  }
  .nice-tabs>li>a {
      margin-right: 0;
      padding: 7px 12px 5px;
      color: \${color} !important;
  }  
  \`;
  document.head.appendChild(style1);


  //Dropdown - Dropdown
  document.querySelectorAll('.navbar-dropdown .dropdown-menu').forEach(el => {
    el.style.setProperty('--bs-dropdown-bg', color);
    el.style.setProperty('--bs-dropdown-link-hover-bg', "rgba(0,0,0,0)");
    el.style.setProperty('--bs-dropdown-link-active-bg', "rgba(0,0,0,0)");
    el.querySelectorAll('.dropdown-item').forEach(child => {
      let {r,g,b} = hexToRgbDarkened(color, 0.25);
      child.style.setProperty('background-color', 'rgb(' + r + ', ' + g + ', ' + b + ')', 'important');
    });
  });

  //Calendar week dropdown
  const style2 = document.createElement('style');
  style2.textContent = \`
    .class-hour-calendar .week-navigation .calendar-week-column .calendar-week-column-flex .calendar-week .calendar-week-selection .ng-dropdown-panel .ng-option.ng-option-selected {
      background: \${color} !important;
    }
  \`;
  document.head.appendChild(style2);

}

//OnLoad
window.addEventListener("load", () => {
  fixStuff();
  CustomColor();
  if (theme == "dark") {
    applyDarkMode(); 
  }
});

//OnChange
const observer = new MutationObserver(() => {
  fixStuff();
  CustomColor();
  if (theme == "dark") {
    applyDarkMode();
  }
});


function handleMessage(event) {
try {
    const data = JSON.parse(event.data);
    if (data.type == "theme") {
      theme = data.value === "dark" ? "dark" : "light";
      if (theme === "dark") {
        applyDarkMode();
      } else {
        window.location.reload();
      }
    }
    if (data.type == "customColor") {
    if (!data.value.startsWith("#")) return;
     localStorage.setItem("customColor", data.value);
     CustomColor();
    }
  } catch (e) {
    window.ReactNativeWebView.postMessage("ERROR: " + e.message);
  }
}

//LISTENER
document.addEventListener("message", handleMessage); // Android
window.addEventListener("message", handleMessage);   // iOS

const hexToRgbDarkened = (hex, amount = 0.1) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // dunkler machen (einfach multiplizieren)
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));

  return { r, g, b };
};

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class", "style"]
});

} catch (e) {
  window.ReactNativeWebView.postMessage(JSON.stringify(e.message));
}
true;
`;};