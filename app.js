// ========================================
// MonShift
// Personal Work Hours Tracker
// ========================================


const today = new Date();

const dateKey =
  today.toISOString().split("T")[0];


// ========================================
// DATA
// ========================================

let days =
  JSON.parse(
    localStorage.getItem("monshift_days")
  ) || {};


// ========================================
// GET TODAY
// ========================================

function getToday() {

  if (!days[dateKey]) {

    days[dateKey] = {

      entry: null,

      breakStart: null,

      breakEnd: null,

      exit: null

    };

    saveData();
  }

  return days[dateKey];
}


// ========================================
// SAVE
// ========================================

function saveData() {

  localStorage.setItem(
    "monshift_days",
    JSON.stringify(days)
  );
}


// ========================================
// TIME
// ========================================

function currentTime() {

  const now = new Date();

  const hours =
    String(now.getHours())
      .padStart(2, "0");

  const minutes =
    String(now.getMinutes())
      .padStart(2, "0");

  return `${hours}:${minutes}`;
}


// ========================================
// MINUTES
// ========================================

function timeToMinutes(time) {

  if (!time) return null;

  const parts = time.split(":");

  return (
    parseInt(parts[0]) * 60 +
    parseInt(parts[1])
  );
}


// ========================================
// CALCULATE DAY
// ========================================

function calculateDay(day) {

  if (!day.entry || !day.exit) {

    return 0;
  }

  let start =
    timeToMinutes(day.entry);

  let end =
    timeToMinutes(day.exit);


  // Night shift

  if (end < start) {

    end += 24 * 60;
  }


  let total =
    end - start;


  // Pause

  if (
    day.breakStart &&
    day.breakEnd
  ) {

    let pauseStart =
      timeToMinutes(day.breakStart);

    let pauseEnd =
      timeToMinutes(day.breakEnd);


    if (pauseEnd < pauseStart) {

      pauseEnd += 24 * 60;
    }


    total -=
      pauseEnd - pauseStart;
  }


  return Math.max(total, 0);
}


// ========================================
// FORMAT
// ========================================

function formatMinutes(minutes) {

  const hours =
    Math.floor(minutes / 60);

  const mins =
    minutes % 60;

  return (
    String(hours).padStart(2, "0") +
    "h" +
    String(mins).padStart(2, "0")
  );
}


// ========================================
// UPDATE UI
// ========================================

function updateUI() {

  const day =
    getToday();


  document.getElementById(
    "entryTime"
  ).textContent =
    day.entry || "--:--";


  document.getElementById(
    "breakStartTime"
  ).textContent =
    day.breakStart || "--:--";


  document.getElementById(
    "breakEndTime"
  ).textContent =
    day.breakEnd || "--:--";


  document.getElementById(
    "exitTime"
  ).textContent =
    day.exit || "--:--";


  const worked =
    calculateDay(day);


  document.getElementById(
    "workedTime"
  ).textContent =
    formatMinutes(worked);


  document.getElementById(
    "todayTotal"
  ).textContent =
    formatMinutes(worked);


  updateWeek();

  updateMonth();

  updateButtons();
}


// ========================================
// WEEK
// ========================================

function updateWeek() {

  let total = 0;

  const current =
    new Date();


  const dayOfWeek =
    current.getDay();


  const mondayOffset =
    dayOfWeek === 0
      ? -6
      : 1 - dayOfWeek;


  const monday =
    new Date(current);


  monday.setDate(
    current.getDate() +
    mondayOffset
  );


  for (let i = 0; i < 7; i++) {

    const date =
      new Date(monday);

    date.setDate(
      monday.getDate() + i
    );


    const key =
      date.toISOString()
        .split("T")[0];


    if (days[key]) {

      total +=
        calculateDay(days[key]);
    }
  }


  document.getElementById(
    "weekTotal"
  ).textContent =
    formatMinutes(total);
}


// ========================================
// MONTH
// ========================================

function updateMonth() {

  let total = 0;

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1)
      .padStart(2, "0");


  Object.keys(days).forEach(key => {

    if (
      key.startsWith(
        `${year}-${month}`
      )
    ) {

      total +=
        calculateDay(days[key]);
    }
  });


  document.getElementById(
    "monthTotal"
  ).textContent =
    formatMinutes(total);
}


// ========================================
// BUTTONS
// ========================================

function updateButtons() {

  const day =
    getToday();


  document.getElementById(
    "entryBtn"
  ).disabled =
    !!day.entry;


  document.getElementById(
    "breakStartBtn"
  ).disabled =
    !day.entry ||
    !!day.breakStart;


  document.getElementById(
    "breakEndBtn"
  ).disabled =
    !day.breakStart ||
    !!day.breakEnd;


  document.getElementById(
    "exitBtn"
  ).disabled =
    !day.entry ||
    !!day.exit;
}


// ========================================
// ENTRY
// ========================================

document.getElementById(
  "entryBtn"
).addEventListener(
  "click",
  () => {

    const day =
      getToday();

    day.entry =
      currentTime();

    saveData();

    updateUI();
  }
);


// ========================================
// BREAK START
// ========================================

document.getElementById(
  "breakStartBtn"
).addEventListener(
  "click",
  () => {

    const day =
      getToday();

    day.breakStart =
      currentTime();

    saveData();

    updateUI();
  }
);


// ========================================
// BREAK END
// ========================================

document.getElementById(
  "breakEndBtn"
).addEventListener(
  "click",
  () => {

    const day =
      getToday();

    day.breakEnd =
      currentTime();

    saveData();

    updateUI();
  }
);


// ========================================
// EXIT
// ========================================

document.getElementById(
  "exitBtn"
).addEventListener(
  "click",
  () => {

    const day =
      getToday();

    day.exit =
      currentTime();

    saveData();

    updateUI();
  }
);


// ========================================
// DATE
// ========================================

function showDate() {

  const options = {

    weekday: "long",

    day: "numeric",

    month: "long"
  };


  document.getElementById(
    "todayDate"
  ).textContent =
    today.toLocaleDateString(
      "fr-FR",
      options
    );
}


// ========================================
// DARK MODE
// ========================================

const themeBtn =
  document.getElementById(
    "themeBtn"
  );


themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const dark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      "monshift_dark",
      dark
    );


    themeBtn.textContent =
      dark ? "☀️" : "🌙";
  }
);


// Restore theme

if (
  localStorage.getItem(
    "monshift_dark"
  ) === "true"
) {

  document.body.classList.add(
    "dark"
  );

  themeBtn.textContent =
    "☀️";
}


// ========================================
// INIT
// ========================================

showDate();

updateUI();
