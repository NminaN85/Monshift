import {
  data,
  settings,
  saveData,
  saveSettings,
  getDay,
  replaceData,
  replaceSettings
} from "./storage.js";


import {
  T
} from "./translations.js";


import {
  calcDay,
  formatMin,
  key
} from "./calculations.js";


import {
  renderCalendar
} from "./calendar.js";


import {
  renderStats,
  exportMonth
} from "./stats.js";


export let selectedDate =
  key(new Date());


export let calendarDate =
  new Date();


export function init() {

  bind();

  render();

}


function locale() {

  if (settings.language === "fr") {
    return "fr-FR";
  }

  if (settings.language === "ar") {
    return "ar";
  }

  return "en-US";

}


function dateLabel(dateKey) {

  return new Date(
    dateKey + "T12:00:00"
  ).toLocaleDateString(

    locale(),

    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }

  );

}


function tr(keyName) {

  return (
    T[settings.language][keyName]
    || keyName
  );

}


function render() {

  document.documentElement.lang =
    settings.language;


  document.documentElement.dir =
    settings.language === "ar"
      ? "rtl"
      : "ltr";


  document.body.classList.toggle(
    "dark",
    settings.dark
  );


  document.getElementById(
    "themeBtn"
  ).textContent =
    settings.dark
      ? "☀️"
      : "🌙";


  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      element.textContent =
        tr(element.dataset.i18n);

    });


  document.getElementById(
    "headerDate"
  ).textContent =
    dateLabel(selectedDate);


  document.getElementById(
    "selectedDateLabel"
  ).textContent =
    dateLabel(selectedDate);


  renderHome();


  renderCalendar(
    calendarDate,
    settings,
    dateKey => {

      selectedDate = dateKey;

      show("homeView");

      render();

    }
  );


  renderStats(
    calendarDate,
    settings
  );


  document.getElementById(
    "languageSelect"
  ).value =
    settings.language;


  document.getElementById(
    "targetHours"
  ).value =
    settings.target;


  document.getElementById(
    "weekStart"
  ).value =
    settings.weekStart;

}


function renderHome() {

  const day =
    getDay(selectedDate);


  const minutes =
    calcDay(day);


  document.getElementById(
    "workedTime"
  ).textContent =
    formatMin(minutes);


  document.getElementById(
    "todayTotal"
  ).textContent =
    formatMin(minutes);


  document.getElementById(
    "weekTotal"
  ).textContent =
    formatMin(
      weekTotal(selectedDate)
    );


  document.getElementById(
    "monthTotal"
  ).textContent =
    formatMin(
      monthTotal(selectedDate)
    );


  const segments =
    document.getElementById(
      "segments"
    );


  segments.innerHTML = "";


  segments.innerHTML += row(
    "🟢",
    tr("entry"),
    day.entry
  );


  (day.breaks || [])
    .forEach(
      (pause, index) => {

        segments.innerHTML += row(
          "🟡",
          `${tr("break")} ${index + 1} — début`,
          pause.start
        );


        segments.innerHTML += row(
          "🔵",
          `${tr("break")} ${index + 1} — fin`,
          pause.end
        );

      }
    );


  segments.innerHTML += row(
    "🔴",
    tr("exit"),
    day.exit
  );


  if (day.notes) {

    segments.innerHTML += `

      <div class="segment">

        <span>
          📝 ${tr("notes")}
        </span>

        <span>
          ${esc(day.notes)}
        </span>

      </div>

    `;

  }


  const openBreak =
    (day.breaks || [])
      .find(
        pause =>
          pause.start &&
          !pause.end
      );


  entryBtn.disabled =
    !!day.entry;


  pauseStartBtn.disabled =
    !day.entry ||
    !!day.exit ||
    !!openBreak;


  pauseEndBtn.disabled =
    !openBreak;


  exitBtn.disabled =
    !day.entry ||
    !!day.exit ||
    !!openBreak;


  addBreakBtn.disabled =
    !day.entry ||
    !!day.exit;

}


function row(
  icon,
  label,
  value
) {

  return `

    <div class="segment">

      <div class="segment-left">

        <span>
          ${icon}
        </span>

        <div>

          <strong>
            ${esc(label)}
          </strong>

          <small>
            ${value || "--:--"}
          </small>

        </div>

      </div>

      <strong>
        ${value || "--:--"}
      </strong>

    </div>

  `;

}


function esc(value) {

  return String(value || "")
    .replace(
      /[&<>"']/g,
      character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[character])
    );

}


function monthTotal(dateKey) {

  const date =
    new Date(
      dateKey + "T12:00:00"
    );


  let total = 0;


  Object.keys(data)
    .forEach(savedKey => {

      const savedDate =
        new Date(
          savedKey + "T12:00:00"
        );


      if (

        savedDate.getFullYear() ===
          date.getFullYear()

        &&

        savedDate.getMonth() ===
          date.getMonth()

      ) {

        total +=
          calcDay(data[savedKey]);

      }

    });


  return total;

}


function weekTotal(dateKey) {

  const date =
    new Date(
      dateKey + "T12:00:00"
    );


  const weekday =
    date.getDay();


  const offset =
    settings.weekStart === 0
      ? weekday
      : (weekday + 6) % 7;


  const start =
    new Date(date);


  start.setDate(
    date.getDate() - offset
  );


  let total = 0;


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const current =
      new Date(start);


    current.setDate(
      start.getDate() + i
    );


    total +=
      calcDay(
        getDay(
          key(current)
        )
      );

  }


  return total;

}


function show(viewId) {

  document
    .querySelectorAll(".view")
    .forEach(
      view =>
        view.classList.remove(
          "active"
        )
    );


  document
    .getElementById(viewId)
    .classList.add("active");


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
          viewId
      );

    });

}


function openEditor(
  dateKey = selectedDate
) {

  const day =
    getDay(dateKey);


  formDateInput.value =
    dateKey;


  formEntry.value =
    day.entry || "";


  formExit.value =
    day.exit || "";


  formNotes.value =
    day.notes || "";


  breakFields.innerHTML = "";


  (day.breaks || [])
    .forEach(
      pause =>
        addBreak(pause)
    );


  dayDialog.showModal();

}


function addBreak(
  pause = {
    start: "",
    end: ""
  }
) {

  const container =
    document.createElement(
      "div"
    );


  container.className =
    "break-field";


  container.innerHTML = `

    <label>

      Début pause

      <input
        type="time"
        class="bstart"
        value="${pause.start || ""}">

    </label>


    <label>

      Fin pause

      <input
        type="time"
        class="bend"
        value="${pause.end || ""}">

    </label>


    <button
      type="button"
      class="remove-break">

      ×

    </button>

  `;


  container
    .querySelector(
      ".remove-break"
    )
    .onclick = () =>
      container.remove();


  breakFields.appendChild(
    container
  );

}


function bind() {

  const $ =
    id =>
      document.getElementById(id);


  window.entryBtn =
    $("entryBtn");


  window.pauseStartBtn =
    $("pauseStartBtn");


  window.pauseEndBtn =
    $("pauseEndBtn");


  window.exitBtn =
    $("exitBtn");


  window.addBreakBtn =
    $("addBreakBtn");


  window.formDateInput =
    $("formDateInput");


  window.formEntry =
    $("formEntry");


  window.formExit =
    $("formExit");


  window.formNotes =
    $("formNotes");


  window.breakFields =
    $("breakFields");


  window.dayDialog =
    $("dayDialog");


  entryBtn.onclick = () => {

    const day =
      getDay(selectedDate);


    if (!day.entry) {

      day.entry =
        new Date()
          .toTimeString()
          .slice(0,5);


      data[selectedDate] =
        day;


      saveData();

      render();

    }

  };


  pauseStartBtn.onclick = () => {

    const day =
      getDay(selectedDate);


    day.breaks =
      day.breaks || [];


    day.breaks.push({

      start:
        new Date()
          .toTimeString()
          .slice(0,5),

      end: null

    });


    data[selectedDate] =
      day;


    saveData();

    render();

  };


  pauseEndBtn.onclick = () => {

    const day =
      getDay(selectedDate);


    const pause =
      (day.breaks || [])
        .find(
          item =>
            item.start &&
            !item.end
        );


    if (pause) {

      pause.end =
        new Date()
          .toTimeString()
          .slice(0,5);


      data[selectedDate] =
        day;


      saveData();

      render();

    }

  };


  exitBtn.onclick = () => {

    const day =
      getDay(selectedDate);


    const openPause =
      (day.breaks || [])
        .some(
          item =>
            item.start &&
            !item.end
        );


    if (
      day.entry &&
      !day.exit &&
      !openPause
    ) {

      day.exit =
        new Date()
          .toTimeString()
          .slice(0,5);


      data[selectedDate] =
        day;


      saveData();

      render();

    }

  };


  $("addBreakBtn").onclick =
    () =>
      openEditor();


  $("editDayBtn").onclick =
    () =>
      openEditor();


  $("newDayBtn").onclick =
    () =>
      openEditor(
        key(new Date())
      );


  $("formAddBreak").onclick =
    () =>
      addBreak();


  $("closeDialog").onclick =
    () =>
      $("dayDialog").close();


  $("cancelDialog").onclick =
    () =>
      $("dayDialog").close();


  $("dayForm").onsubmit =
    event => {

      event.preventDefault();


      const dateKey =
        formDateInput.value;


      if (!dateKey) {
        return;
      }


      data[dateKey] = {

        entry:
          formEntry.value || null,

        breaks:
          [
            ...document
              .querySelectorAll(
                ".break-field"
              )
          ]

          .map(
            field => ({

              start:
                field
                  .querySelector(
                    ".bstart"
                  )
                  .value || null,

              end:
                field
                  .querySelector(
                    ".bend"
                  )
                  .value || null

            })
          )

          .filter(
            pause =>
              pause.start ||
              pause.end
          ),

        exit:
          formExit.value || null,

        notes:
          formNotes.value.trim()

      };


      selectedDate =
        dateKey;


      calendarDate =
        new Date(
          dateKey +
          "T12:00:00"
        );


      saveData();


      dayDialog.close();


      show("homeView");


      render();

    };


  $("datePickerBtn").onclick =
    () => {

      const value =
        prompt(
          "Date YYYY-MM-DD",
          selectedDate
        );


      if (
        value &&
        /^\d{4}-\d{2}-\d{2}$/.test(
          value
        )
      ) {

        selectedDate =
          value;


        calendarDate =
          new Date(
            value +
            "T12:00:00"
          );


        render();

      }

    };


  $("prevDay").onclick =
    () =>
      moveDay(-1);


  $("nextDay").onclick =
    () =>
      moveDay(1);


  $("prevMonth").onclick =
    () => {

      calendarDate.setMonth(
        calendarDate.getMonth() - 1
      );

      render();

    };


  $("nextMonth").onclick =
    () => {

      calendarDate.setMonth(
        calendarDate.getMonth() + 1
      );

      render();

    };


  $("themeBtn").onclick =
    () => {

      settings.dark =
        !settings.dark;


      saveSettings();

      render();

    };


  $("languageSelect").onchange =
    event => {

      settings.language =
        event.target.value;


      saveSettings();

      render();

    };


  $("targetHours").onchange =
    event => {

      settings.target =
        Math.max(
          0,
          Number(
            event.target.value
          ) || 0
        );


      saveSettings();

      render();

    };


  $("weekStart").onchange =
    event => {

      settings.weekStart =
        Number(
          event.target.value
        );


      saveSettings();

      render();

    };


  $("clearBtn").onclick =
    () => {

      if (
        confirm(
          tr("confirmClear")
        )
      ) {

        replaceData({});

        render();

      }

    };


  $("backupBtn").onclick =
    () => {

      download(

        "monshift-backup.json",

        JSON.stringify(
          {
            version: 1,
            data,
            settings
          },
          null,
          2
        ),

        "application/json"

      );

    };


  $("restoreInput").onchange =
    event => {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        () => {

          try {

            const backup =
              JSON.parse(
                reader.result
              );


            replaceData(
              backup.data
            );


            replaceSettings(
              backup.settings
            );


            render();


            alert(
              tr("saved")
            );

          }

          catch {

            alert(
              "Invalid backup file"
            );

          }

        };


      reader.readAsText(file);

    };


  $("exportBtn").onclick =
    () =>
      exportMonth(
        calendarDate
      );


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.onclick =
        () =>
          show(
            button.dataset.view
          );

    });

}


function moveDay(number) {

  const date =
    new Date(
      selectedDate +
      "T12:00:00"
    );


  date.setDate(
    date.getDate() + number
  );


  selectedDate =
    key(date);


  calendarDate =
    new Date(date);


  render();

}


function download(
  filename,
  content,
  type
) {

  const link =
    document.createElement(
      "a"
    );


  link.href =
    URL.createObjectURL(

      new Blob(
        [content],
        { type }
      )

    );


  link.download =
    filename;


  link.click();

}
