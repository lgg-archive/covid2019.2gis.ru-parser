const monthsRu2Num = {
    'января': '1',
    'февраля': '2',
    'марта': '3',
    'апреля': '4',
    'мая': '5',
    'июня': '6',
    'июля': '7',
    'август': '8',
    'сентября': '9',
    'октября': '10',
    'ноября': '11',
    'декабря': '12'
};

function monthRu2Num(monthName) {
    return monthsRu2Num[monthName]
}

module.exports = monthRu2Num;
