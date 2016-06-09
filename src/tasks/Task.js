const needle = require('needle');
const CaptchaTask = require('./CaptchaTask');
const options = require('../Options');
const log = require('cllc')();

module.exports = class Task {
    constructor(url) {
        this.url = url;
    }

    start(callback) {
        const self = this;
        needle.get(self.url, options.options, function(err, res){
            if (err) throw err

            if (res.statusCode == 302 && res.headers && res.headers.hasOwnProperty('location')) {
                const task = new CaptchaTask(res.headers.location);
                task.start(callback);
                return;
            }
            options.update(res);

            log.i(self.url);
            callback(self.id, self.scrap(res));
        });
    }

    scrap(res) {
        log.step();
    }
}
