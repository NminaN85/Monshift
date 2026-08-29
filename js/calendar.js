import {
  data,
  getDay
} from "./storage.js";


import {
  calcDay,
  formatMin,
  key
} from "./calculations.js";


export function renderCalendar(
  calendarDate,
  settings,
  selectDate
) {

  const names =
    settings.language === "fr"

      ? ["L","M","M","J","V","S","D"]

      : settings.language === "ar"

        ? ["ن","ث","ر","خ","ج","س","ح"]

        : ["M","T","W","T","F","S","S"];


  document.getElementById(
    "calendarMonth"
  ).textContent =

    calendarDate.toLocaleDateString(

      settings.language === "fr"
        ? "fr-FR"

        : settings.language === "ar"
          ? "ar"

          : "en-US",

      {
        month: "long",
        year: "numeric"
      }

    );


  document.getElementById(
    "weekdays"
  ).innerHTML =

    names
      .map(
        name =>
          `<div class="weekday">
             ${name}
           </div>`
      )
      .join("");


  const grid =
    document.getElementById(
      "calendarGrid"
    );


  grid.innerHTML = "";


  const firstDay =
    new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1
    );


  const offset =
    settings.weekStart === 0

      ? firstDay.getDay()

      : (firstDay.getDay() + 6) % 7;


  for (
    let i = 0;
    i < offset;
    i++
  ) {

    grid.innerHTML +=
      `<div class="day-cell empty"></div>`;

  }


  const daysInMonth =
    new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
      0
    ).getDate();


  for (
    let number = 1;
    number <= daysInMonth;
    number++
  ) {

    const date =
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        number
      );


    const dateKey =
      key(date);


    const day =
      getDay(dateKey);


    const minutes =
      calcDay(day);


    let status = "";


    if (
      day.entry &&
      day.exit
    ) {

      status = "complete";

    }

    else if (
      day.entry ||
      day.exit
    ) {

      status = "incomplete";

    }


    const button =
      document.createElement("button");


    button.className =
      `day-cell ${status}
       ${
         dateKey === key(new Date())
           ? "today"
           : ""
       }`;


    button.innerHTML = `

      <span class="day-num">
        ${number}
      </span>

      <span class="day-hours">
        ${
          minutes
            ? formatMin(minutes)
            : "—"
        }
      </span>

    `;


    button.onclick = () =>
      selectDate(dateKey);


    grid.appendChild(button);

  }

}
