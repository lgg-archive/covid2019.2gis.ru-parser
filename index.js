const puppeteer = require('puppeteer');
const monthRu2Num = require('./monthRu2Num.js');
const selectors = require('./2gis-html.js');
const express = require('express');
const app = express();

const port = 22019;
let page;

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    page = await browser.newPage();

    app.get('/', async function (req, res) {
        let currentResult = await parse2gis();

        console.log('Send result:', currentResult);

        res.send(currentResult)
    });

    app.listen(port);

    console.log('Start serving app on: localhost:' + port);

    //await browser.close();
})();

async function parse2gis() {
    await page.goto('https://covid.2gis.ru/');

    let result = {};
    result.date = await getDate();
    result.russia = await getRussia();
    result.moscow = await getMoscow();

    console.log('Parsed result:', result);

    return result;
}

//###################################################################################33

async function getDate() {
    let currentDate = await getTextContent(selectors.date);
    currentDate = currentDate.split(',')[1].trim().split(' ');

    currentDate = monthRu2Num(currentDate[1]) + '.' + currentDate[0] + '.' + currentDate[2];

    return currentDate;
}

async function getRussia() {
    return (await getTextContent(selectors.russia)).replace(',', '');
}

async function getMoscow() {
    return (await getTextContent(selectors.moscow)).replace(',', '');
}

async function getTextContent(selector) {
    return page.evaluate(
        resultsSelector => {
            let anchor = document.querySelectorAll(resultsSelector)[0];
            return anchor.textContent.trim();
        },
        selector
    );
}