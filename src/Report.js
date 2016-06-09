const pug = require('pug');
const fs = require('fs');
const xlsx = require('node-xlsx');
const log = require('cllc')();

module.exports = function report(params) {
    params.items = params.items || [];
    let items = [];
    for (let key in params.items) {
        items.push(params.items[key]);
    }

    items = items.sort(function (i1, i2) {
        if (i1.author < i2.author) {
            return -1;
        }

        if (i1.author > i2.author) {
            return 1;
        }

        if (i1.title < i2.title) {
            return -1;
        }
        if (i1.title > i2.title) {
            return 1;
        }

        return 0;
    });

    log.i('Выгружено ' + items.length + ' книг');

    // HTML report
    const date = new Date();

    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = date.getFullYear();

    let hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }

    let min = date.getMinutes();
    if (min < 10) {
        min = '0' + min;
    }

    const dateTime = `${day}.${month}.${year} ${hour}:${min}`;

    const html = pug.renderFile('src/pug/index.pug', {
        pageTitle: 'Отчет для пользователя: ' + params.username + ' за ' + dateTime,
        items: items
    });

    fs.writeFile(`results/${params.username}.html`, html);

    log.i('Создан html отчет');

    // XLS report
    let arr = [['Автор', 'Название', 'ISBN', 'Оценка', 'Средняя оценка']];
    for (let i = 0, l = items.length; i < l; i++) {
        arr.push([
            items[i].author,
            items[i].title,
            items[i].ISBN,
            items[i].rate,
            items[i].rating
        ]);
    }
    var buffer = xlsx.build([{name: params.username, data: arr}]);
    fs.writeFile(`results/${params.username}.xlsx`, buffer);

    log.i('Создан xls отчет');
};
