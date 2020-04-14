const puppeteer = require('puppeteer');
const monthRu2Num = require('./monthRu2Num.js');
const selectors = require('./2gis-html.js');
const express = require('express');
const app = express();

const url = 'https://covid.2gis.ru/stat';
const port = 22019;
const host = '127.0.0.1';

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});

    app.get('/', async function (req, res) {
        let page = await browser.newPage();

        let currentResult = await parse2gis(page);

        console.log('Send result:', currentResult);

        res.send(currentResult);

        // clear page memory
        await page.goto('about:blank');
        await page.close();
        page = null;
        // await browser.close();
    });

    app.listen(port, host);

    console.log('Start serving app on: localhost:' + port);
})();

async function parse2gis(page) {
    await page.goto(url);

    let result = {};
    try {
        result.date = await getDate(page);
        result.russia = await getRussia(page);
        result.moscow = await getMoscow(page);
    } catch (e) {
        result.description = 'ERROR: markup changed, couldn\'t find elements';
    }

    result.description = 'This is actual parsed data about COVID-2019 in Russia/Moscow from ' + url;

    console.log('Parsed result:', result);

    return result;
}

//###################################################################################33

async function getDate(page) {
    let currentDate = await getTextContent(page, selectors.date);
    currentDate = currentDate.split(',')[1].trim().split(' ');

    currentDate = currentDate[0] + '.' + monthRu2Num(currentDate[1]) + '.' + currentDate[2];

    return currentDate;
}

async function getRussia(page) {
    return (await getTextContent(page, selectors.russia)).replace(',', '');
}

async function getMoscow(page) {
    return (await getTextContent(page, selectors.moscow)).replace(',', '');
}

async function getTextContent(page, selector) {
    return page.evaluate(
        resultsSelector => {
            let anchor = document.querySelectorAll(resultsSelector)[0];
            return anchor.textContent.trim();
        },
        selector
    );
}
