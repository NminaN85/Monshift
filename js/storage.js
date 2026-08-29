const DATA_KEY = "monshift_data_v1";

const SETTINGS_KEY = "monshift_settings_v1";


export let data =
  JSON.parse(
    localStorage.getItem(DATA_KEY) || "{}"
  );


export let settings =
  Object.assign(

    {
      language: "fr",
      target: 7,
      weekStart: 1,
      dark: false
    },

    JSON.parse(
      localStorage.getItem(SETTINGS_KEY) || "{}"
    )

  );


export function saveData() {

  localStorage.setItem(
    DATA_KEY,
    JSON.stringify(data)
  );

}


export function saveSettings() {

  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings)
  );

}


export function getDay(key) {

  return data[key] || {

    entry: null,

    breaks: [],

    exit: null,

    notes: ""

  };

}


export function replaceData(newData) {

  data = newData || {};

  saveData();

}


export function replaceSettings(newSettings) {

  settings = Object.assign(
    settings,
    newSettings || {}
  );

  saveSettings();

}
