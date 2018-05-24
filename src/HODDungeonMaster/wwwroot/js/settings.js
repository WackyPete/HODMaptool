function SaveSettings(name, value) {
    var cookie = name + "=" + value + ";";
    document.cookie = cookie;
}

function GetSettings(name) {
    var val = document.cookie.match(new RegExp(name + '=([^;]+)'));
    return val ? val[1] === "true" ? true : false : null;
}

function LoadSettings(loadin) {
    CheckSettings();
    loadin();
}

function CheckSettings() {
    if (!GetSettings('showWeather')) {
        SaveSettings('showWeather', false);
        SaveSettings('highlightSpawns', false);
        SaveSettings('ShowTileNames', false);
        SaveSettings('ShowSpawnPanel', false);
        SaveSettings('QuickDropdownEscape', false);
    }
}

function DestroySettings() {
    document.cookie = null;
}