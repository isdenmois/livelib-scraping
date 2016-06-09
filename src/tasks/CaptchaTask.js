const needle = require('needle');
const readline = require('readline');
const fs = require('fs');
const options = require('../Options');
const cookie = require('cookie');
const Task = require('./Task');
const log = require('cllc')();

module.exports = class CaptchaTask {
    constructor() {
        this.url = 'https://www.livelib.ru/service/captcha';
        this.location = 'https://www.livelib.ru/service/ratelimitcaptcha';
    }

    start(callback) {
        const self = this;

        needle.get(self.url, options.options, function(err, res){
            if (err) throw err

            options.update(res);

            fs.writeFileSync('./captcha.jpg', res.body), 

            self.scrap(callback);
        });
    }

    scrap(callback) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const self = this;

        rl.question('Откройте файл captcha.jpg и впишите цифры: ', (answer) => {

            rl.close();

            const params = `form[captcha]=${answer.trim()}&btn_go=Вернуться`;
            const postOptions = JSON.parse(JSON.stringify(options.options));
            postOptions.headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            };

            needle.post(self.location, params, postOptions, function (err, res) {
                if (err) throw err

                options.update(res);

                log('Cookie успешно сохранены');

                callback();
            })
        });
    }
}
