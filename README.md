# covid2019.2gis.ru-parser

## Requirements

* nodejs / npm
* `sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`
    * [original post](https://github.com/puppeteer/puppeteer/issues/3443#issuecomment-433096772)

## Installation

* git clone
* `npm install`
* `npm start`

Optional:
* add nginx config (edit it for your data): `sudo ln -sT nginx.conf /etc/nginx/sites-enabled/covid2019.fedos.top`
* you will need SSL (Let's Encrypt certificate)

## Output:

JSON:
```
{
    date: 'current date',
    russia: 123.
    moscow: 100
}
```

## License

* MIT, 2020, lgg
