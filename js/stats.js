import {
  data,
  getDay
} from "./storage.js";


import {
  calcDay,
  formatMin,
  key
} from "./calculations.js";


export function renderStats(
  monthDate,
  settings
) {

  const year =
    monthDate.getFullYear();


  const month =
    monthDate.getMonth();


  const locale =
    settings.language === "fr"

      ? "fr-FR"

      : settings.language === "ar"
        ? "ar"
        : "en-US";


  document.getElementById(
    "statsMonthLabel"
  ).textContent =

    monthDate.toLocaleDateString(
      locale,
      {
        month: "long",
        year: "numeric"
      }
    );


  let total = 0;

  let count = 0;

  let rows = [];


  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  for (
    let number = 1;
    number <= days;
    number++
  ) {

    const date =
      new Date(
        year,
        month,
        number
      );


    const dateKey =
      key(date);


    const day =
      getDay(dateKey);


    const minutes =
      calcDay(day);


    if (minutes) {

      total += minutes;

      count++;

      rows.push([
        dateKey,
        minutes
      ]);

    }

  }


  document.getElementById(
    "statWorked"
  ).textContent =
    formatMin(total);


  document.getElementById(
    "statDays"
  ).textContent =
    count;


  document.getElementById(
    "statAverage"
  ).textContent =

    formatMin(
      count
        ? total / count
        : 0
    );


  const target =
    Math.round(
      Number(settings.target) * 60
    );


  const overtime =
    Math.max(
      0,
      total - count * target
    );


  document.getElementById(
    "statOvertime"
  ).textContent =
    formatMin(overtime);


  document.getElementById(
    "statsList"
  ).innerHTML =

    rows.length

      ? rows
          .map(
            row => `

              <div class="stat-line">

                <span>

                  ${
                    new Date(
                      row[0] +
                      "T12:00:00"
                    ).toLocaleDateString(
                      locale,
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short"
                      }
                    )
                  }

                </span>

                <strong>
                  ${formatMin(row[1])}
                </strong>

              </div>

            `
          )
          .join("")

      : `<p style="color:var(--muted)">
           ${
             settings.language === "ar"
               ? "لا توجد بيانات"
               : "No data"
           }
         </p>`;

}


export function exportMonth(
  monthDate
) {

  const year =
    monthDate.getFullYear();


  const month =
    monthDate.getMonth();


  const lines = [

    [
      "Date",
      "Entree",
      "Pauses",
      "Sortie",
      "Temps travaille",
      "Note"
    ]

  ];


  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  for (
    let number = 1;
    number <= days;
    number++
  ) {

    const date =
      new Date(
        year,
        month,
        number
      );


    const dateKey =
      key(date);


    const day =
      getDay(dateKey);


    if (
      day.entry ||
      day.exit ||
      (day.breaks || []).length
    ) {

      lines.push([

        dateKey,

        day.entry || "",

        JSON.stringify(
          day.breaks || []
        ),

        day.exit || "",

        formatMin(
          calcDay(day)
        ),

        day.notes || ""

      ]);

    }

  }


  const csv =
    "\ufeff" +

    lines

      .map(
        row =>
          row
            .map(
              value =>
                `"${String(value)
                  .replace(/"/g,'""')}"`
            )
            .join(";")
      )

      .join("\n");


  const link =
    document.createElement("a");


  link.href =
    URL.createObjectURL(

      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8"
        }
      )

    );


  link.download =
    `monshift-${year}-${
      String(month + 1)
        .padStart(2,"0")
    }.csv`;


  link.click();

}
