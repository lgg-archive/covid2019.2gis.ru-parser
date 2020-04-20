const columns = {
    date: 'A',
    russia: 'C',
    moscow: 'F'
};
const rowStart = 11;

function run() {
    let app = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = app.getSheetByName('Россия и Москва');

    // we have data about infected for previous date only
    let dataDate = getDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    let currentDate = getDate(new Date().toString());

    // load data from 2gis
    let data = parse2gis();

    if (data) {
        log('INFO: 2gis parsed successfully');

        log('DEBUG: DATES | current: ' + currentDate + ' | ' + data.date)

        // check if we have data for fill
        if (currentDate === data.date) {
            // get data date cell
            // for current date we have data about infected for previous date only
            let currentDateRow = getDateRow(sheet, dataDate);

            // get cell addresses for moscow and russia
            let addresses = {
                russia: getCellAddress((currentDateRow), columns.russia),
                moscow: getCellAddress((currentDateRow), columns.moscow)
            };

            let currentValues = {
                russia: getCellValue(sheet, addresses.russia),
                moscow: getCellValue(sheet, addresses.moscow)
            };

            // check that cells values are equal to parsed
            // for now i don't want to modify cell value if it's not empty
            log('DEBUG: Dates Russia | current: ' + currentValues.russia + ' | ' + data.russia)
            log('DEBUG: Dates Moscow | current: ' + currentValues.moscow + ' | ' + data.moscow)

            if (isValueEmpty(currentValues.russia) && areDatesNotEqual(currentValues.russia, data.russia)) {
                writeDataToCell(sheet, addresses.russia, data.russia);
                log('INFO: Russia cell updated to value: ' + data.russia.toString());
            }

            if (isValueEmpty(currentValues.moscow) && areDatesNotEqual(currentValues.moscow, data.moscow)) {
                writeDataToCell(sheet, addresses.moscow, data.moscow);
                log('INFO: Moscow cell updated to value: ' + data.moscow.toString());
            }
        }
    } else {
        log('ERROR: Failed to parse 2gis data');
    }
}

function writeDataToCell(sheet, address, value) {
    let cell = sheet.getRange(address.row, address.column);
    cell.setValue(value);
}

function areDatesNotEqual(d1, d2) {
    return parseInt(d1) !== parseInt(d2)
}

function isValueEmpty(value) {
    return value.toString().trim() === '';
}

function getDateRow(sheet, currentDate) {
    let range = sheet.getRange(rowStart, letterToColumn(columns.date), 120);
    let values = range.getValues();
    let dates = [];

    for (let row in values) {
        for (let col in values[row]) {
            let c = values[row][col];
            if (c.toString().trim() !== '') {
                dates.push(getDate(c));
            }
        }
    }

    return dates.indexOf(currentDate) + rowStart;
}

function getCellAddress(row, columnName) {
    return {
        row: row,
        column: letterToColumn(columnName)
    }
}

function getCellValue(sheet, address) {
    let range = sheet.getRange(address.row, address.column);
    let values = range.getValues();
    return values[0][0];
}

function getDate(str) {
    // used date format in this app: d.m.yyyy
    str = new Date(str);
    return str.getDate() + '.' + (str.getMonth() + 1) + '.' + str.getFullYear();
}

function loadUrl(url) {
    let response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
    log(response);

    try {
        response = JSON.parse(response);
    } catch (e) {
        response = false;
    }
    return response;
}

function parse2gis() {
    const url = 'https://covid2019.fedos.top'; //https://github.com/lgg/covid2019.2gis.ru-parser
    return loadUrl(url);
}

function log(data) {
    Logger.log(data);
}

function letterToColumn(letter) {
    // copyright: https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
    let column = 0, length = letter.length;
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}
