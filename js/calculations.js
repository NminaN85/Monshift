export function parseTime(time) {

  if (!time) {
    return null;
  }

  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;

}


export function calcDay(day) {

  if (!day.entry || !day.exit) {
    return 0;
  }


  let start =
    parseTime(day.entry);

  let end =
    parseTime(day.exit);


  /*
    لو الشيفت عدى منتصف الليل
    مثال:

    22:00 → 06:00
  */

  if (end < start) {

    end += 1440;

  }


  let total =
    end - start;


  /*
    طرح فترات الـ Pause
  */

  (day.breaks || []).forEach(
    pause => {

      if (
        pause.start &&
        pause.end
      ) {

        let pauseStart =
          parseTime(pause.start);

        let pauseEnd =
          parseTime(pause.end);


        if (pauseEnd < pauseStart) {

          pauseEnd += 1440;

        }


        total -= Math.max(
          0,
          pauseEnd - pauseStart
        );

      }

    }
  );


  return Math.max(
    0,
    total
  );

}


export function formatMin(minutes) {

  minutes =
    Math.max(
      0,
      Math.round(minutes || 0)
    );


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


export function key(date) {

  return (

    `${date.getFullYear()}-` +

    `${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-` +

    `${String(
      date.getDate()
    ).padStart(2, "0")}`

  );

}
