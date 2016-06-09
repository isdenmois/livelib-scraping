const fs = require('fs');
const log = require('cllc')();

class Crawler {
    constructor() {
        this.data = [];
        this.results = {};
        this.limit = 0;
    }

    push(elem) {
        this.data.push(elem);
    }

    drain() {
    }

    sync() {
        const data = JSON.stringify(this.results, null, 4);
        fs.writeFileSync(`./results/${this.username}.json`, data);
    }

    tick(id, result) {
        const self = this;
        if (id && result) {
            self.results[id] = result;
            self.sync();
        }

        const resultCount = Object.keys(self.results).length;
        if (self.limit && resultCount >= self.limit) {
            log.finish();
            self.drain(self.results);
            return;
        }
        if (self.data.length) {

            const elem = self.data.shift();

            if (elem.id && self.results.hasOwnProperty(elem.id)) {
                setTimeout(function() {
                    self.tick();
                });
            }
            else {
                setTimeout(function() {
                    if (elem && elem.start) {
                        elem.start(self.tick.bind(self));
                    }
                }, this.delay);
            }
        }
        else {
            self.drain(self.results);
        }
    }

    start(username, delay, limit) {
        this.username = username;
        this.delay = delay;
        this.limit = limit;

        try {
            this.results = JSON.parse(fs.readFileSync(`./results/${username}.json`, 'utf8')) || {};
            const resultCount = Object.keys(this.results).length;
            log.step(0, resultCount);
        }
        catch (error) {
            // Do nothing.
        }

        this.tick();
    }
}

module.exports = new Crawler();
