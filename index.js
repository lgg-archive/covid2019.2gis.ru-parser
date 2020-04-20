const json = require('./2gis-json');
const axios = require('axios');
const express = require('express');
const app = express();

const port = 22019;
const host = '127.0.0.1';
const url = 'https://covid.2gis.ru/stat';

(async () => {
    app.get('/', async function (req, res) {
        let currentResult = await parse2gis();

        console.log('Send result:', currentResult);

        res.send(currentResult);
    });

    app.listen(port, host);

    console.log('Start serving app on: localhost:' + port);
})();

async function parse2gis() {
    let result = {};

    try {
        let russiaHistory = await getJson(json.russia);
        result.date = getDate(russiaHistory[russiaHistory.length - 1]['date']);
        result.russia = russiaHistory[russiaHistory.length - 1]['cases'];
        result.moscow = await getMoscow();
    } catch (e) {
        result.description = 'ERROR: ' + e.toString();
    }

    result.description = 'This is actual parsed data about COVID-2019 in Russia/Moscow from ' + url;

    console.log('Parsed result:', result);

    return result;
}

//###################################################################################33

async function getMoscow() {
    let data = await getJson(json.cities);
    return data.items[0]['confirmed']
}

function getDate(date) {
    // input format: 2020-04-19
    // output format: 19.4.2020
    let currentDate = date.split('-');
    return currentDate[2] + '.' + currentDate[1] + '.' + currentDate[0]
}

async function getJson(url) {
    try {
        const response = await axios.get(url);
        return response.data
    } catch (error) {
        console.error(error);
        return {
            error: true,
            description: error.toString()
        }
    }
}
