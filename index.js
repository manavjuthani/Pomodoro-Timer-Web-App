// Getting values from html file
const timer = document.querySelector("#timeContainer");
const timeDisplay = document.querySelector("#timeDisplay");
const longBrk = document.querySelector("#longBrk");
const shortBrk = document.querySelector("#shortBrk");
const pomoBtn = document.querySelector("#pomoBtn");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const settings = document.querySelector("#settings");
const spotify = document.querySelector("#spotify");
const logIn = document.querySelector("#user");
const authType = document.querySelector("#authType");
const nameField = document.querySelector("#name");
const signUpBtn = document.querySelector("#signUpBtn");
const signInBtn = document.querySelector("#signInBtn");
const logOutBtn = document.querySelector("#logOutBtn");
const settingsBtn = document.querySelector("#settings");
const settingsMenu = document.querySelector(".settingsContainer");
const timerBtn = document.querySelector("#timer");
const timerSave = document.getElementById("saveBtnTimer");
const themeSaveBtn = document.getElementById("saveBtnTheme");
let studyTime = document.getElementById("pomo");
let shortBrkTime = document.getElementById("short");
let longBrkTime = document.getElementById("long");
let backgroundColor = document.getElementById("")
let audio = document.getElementById("clickSound");

// Variables
let mins = 0;
let secs = 0;
let elapsedTime = 0;
let startTime = 0;
let currentTime = 0;
let intervalID;
let paused = true;
let long = false;
let short = false;
let pomo = true;
let sBrkCount = 0;
let lBrkCount = 0;
let timeOut = false;
let auth0Client = null;

// Button events
themeSaveBtn.addEventListener("click", () => {
    editTheme();
})

timerSave.addEventListener("click", function() {
    longBrk.click();
    shortBrk.click();
    pomoBtn.click();
});

longBrk.addEventListener("click", () => {
    long = true;
    short = false;
    pomo = false; 
    reset(intervalID);
});

shortBrk.addEventListener("click", () => {
    long = false;
    short = true;
    pomo = false;
    reset(intervalID);
});

pomoBtn.addEventListener("click", () => {
    long = false;
    short = false;
    pomo = true;
    reset(intervalID);
});

startBtn.addEventListener("click", () => {
    if(paused){
        paused = false;
        startTime = Date.now() - elapsedTime;
        intervalID = setInterval(pomodoroTimer, 75);
    }
    audio.play();
});

pauseBtn.addEventListener("click", () => {
    paused = true;
    clearInterval(intervalID);
    audio.play();
});

logIn.addEventListener("click", () => {
    let displayMode = logInMenu.style.display;
    let timerMode = timer.style.display;
    timer.style.display = timerMode === 'none' ? 'block' : 'none';
});

signUpBtn.addEventListener("click", () => {
    login();
});

signInBtn.addEventListener("click", async () => {
    login();
    updateUI();
});

logOutBtn.addEventListener("click", () => {
    logout();
});

settingsBtn.addEventListener("click", () => {
    // timer.style.display = 'none';
    settingsMenu.classList.add("animateSlideDown");
    settingsMenu.classList.remove("animateSlideUp");
    settingsMenu.style.display = 'block';
});

timerBtn.addEventListener("click", () => {
    timer.style.display = 'block';
    settingsMenu.classList.add("animateSlideUp");
    settingsMenu.classList.remove("animateSlideDown");
    settingsContainer.addEventListener('animationend', () => {
        if (settingsContainer.classList.contains('slide-up')) {
            settingsContainer.style.display = 'none';
        }
    }, { once: true });
    document.getElementById("defaultOpen").click();
});

// Settings menu click events
function openTab(evt, tabName){
    var i, tabContent, tabBtns;
    
    tabContent = document.getElementsByClassName("tabContent");
    for(i = 0; i < tabContent.length; i++){
        tabContent[i].style.display = 'none';
    }

    tabBtns = document.getElementsByClassName("tabBtns");
    for(i = 0; i < tabBtns.length; i++){
        tabBtns[i].className = tabBtns[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += " active";
}

//Theme settings dropdown menu
const dropdowns = document.querySelectorAll('.dropdown');
const themeMenu = document.querySelectorAll('.themeMenu');
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');


    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('.caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(option => {
                option.classList.remove("activated");
            })

            option.classList.add("activated");
        });
    });
});



function displayThemeMenu(textId, choiceId) {
    var textDisplay = document.getElementById(textId);
    var choiceDisplay = document.getElementById(choiceId);
    var solidOptions = document.getElementsByClassName('solidOptions');
    var wallOptions = document.getElementsByClassName('wallOptions');

    // Hide all previously displayed elements
    for (var i = 0; i < solidOptions.length; i++) {
        solidOptions[i].style.display = 'none';
    }
    for (var i = 0; i < wallOptions.length; i++) {
        wallOptions[i].style.display = 'none';
    }

    if (textDisplay && choiceDisplay) {
        textDisplay.style.display = 'block';
        choiceDisplay.style.display = 'block';
    } else {
        console.error("One or both elements not found.");
    }
}

function editTheme(){
    var bgColor = document.getElementById("solidColor").value;
    var chosenType = document.querySelector(".activated");
    var bgImage = document.getElementById("wallpaperChoice").files[0];

    if(chosenType.id == "solid"){
        document.body.style.backgroundColor = bgColor;
        document.body.style.backgroundImage = null;
        console.log("Solid color option was chosen");
    }
    else if(chosenType.id == "wallpaper"){
        document.body.style.backgroundColor = null;
        var reader = new FileReader();
        reader.onload = function(event) {
            document.body.style.backgroundImage = "url('" + event.target.result + "')";
        };
        reader.readAsDataURL(bgImage);
        console.log("Wallpaper option was chosen");
    }
}

// Functionality
function pomodoroTimer(){
    let pomoMode;
    if(long == true){
        pomoMode = longBrkTime.value;
    }
    else if(short == true){
        pomoMode = shortBrkTime.value;
    }
    else{
        pomoMode = studyTime.value;
    }

    // Formatting function
    function pad(unit){
        return (("0") + unit).length > 2 ? unit : ("0" + unit);
    }

    // Calculation of time
    elapsedTime = Date.now() - startTime;

    mins = Math.floor((elapsedTime / (1000 * 60))%60);
    secs = Math.floor(elapsedTime / 1000 % 60);

    minsVal = (pomoMode - 1) - mins;
    secsVal = pad(59-secs);

    // Time display
    timeDisplay.textContent = `${minsVal}:${secsVal}`;

    //Negative values constraint;
    if(Math.sign(minsVal) == -1 || Math.sign(secsVal) == -1){
        reset(intervalID);
        timeOut = true;
        autoMode();
    }
}

function reset(intervalVar){
    clearInterval(intervalVar);
    if(long == true){ 
        timeDisplay.textContent = longBrkTime.value + ":00";
    }
    else if(short == true){
        timeDisplay.textContent = shortBrkTime.value + ":00";
    }
    else{
        timeDisplay.textContent = studyTime.value + ":00";
    }
    paused = true;
    elapsedTime = 0;
}

function autoMode(){
   // Case 1: Pomodoro mode, no breaks taken
   if(pomo == true && sBrkCount < 3){
    shortBrk.click();
    sBrkCount += 0;
    intervalID = setInterval(pomodoroTimer, 75)
   }
   // Case 2: Short break mode, no short breaks left
   else if(short == true && sBrkCount == 3){
    sBrkCount = 0;
    pomoBtn.click();
    intervalID = setInterval(pomodoroTimer, 75)
   }
   // Case 3: Pomodoro mode, long break mode time
   else if(pomo == true && sBrkCount == 3){
    lBrkCount += 1;
    longBrk.click();
    intervalID = setInterval(pomodoroTimer, 75)
   }
   // Case 4: Long break mode, back to Pomodoro
   else if(long == true){
    pomoBtn.click();
    intervalID = setInterval(pomodoroTimer, 75)
   }
}

// Auth0 Functions
const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0Client = await auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId
    });
  };

window.onload = async () => {
    await configureClient();
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        return;
    }

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        await auth0Client.handleRedirectCallback();
        
        updateUI();

        window.history.replaceState({}, document.title, "/");
    }
}


const login = async () => {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      }
    });
};

const logout = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if(isAuthenticated){
        logOutBtn.style.display = 'initial';
        signInBtn.style.display = 'none';
        signUpBtn.style.display = 'none';
        console.log("isAuthenticated is true");
    }
};

document.getElementById("defaultOpen").click();
document.getElementById("solid").click();


