const log = require('cllc')();
const Crawler = require('./src/Crawler');
const PageTask = require('./src/tasks/PageTask');
const Task = require('./src/tasks/Task');
const report = require('./src/Report');

const baseUrl = Task.prototype.baseUrl = 'https://www.livelib.ru';

const username = process.argv[2];
const limit = +process.argv[3];

if (username == undefined) {
    log.e('Необходимо указать имя пользователя')
    return
}

log.i('Запуск для пользователя ' + username);

if (limit) {
    log.i('Установлен лимит ' + limit);
}

const URL = `${baseUrl}/reader/${username}/read`

log.level('info');
log.start('Проанализировано страниц %s, Обработано книг %s');

Crawler.push(new PageTask(URL));

Crawler.drain = function (items) {
    report({
        items: items,
        username: username
    });
};

Crawler.start(username, 500, limit);
