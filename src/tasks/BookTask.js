const Task = require('./Task');
const cheerio = require('cheerio');
const log = require('cllc')();

module.exports = class BookTask extends Task {

    constructor(url, rate) {
        super(url);
        this.rate = rate;
        this.id = url.slice(url.lastIndexOf('/') + 1);
    }

    scrap(res) {
        super.scrap(res);

        const $container = cheerio('#contentwrapper .container', res.body);
        const $ = $container.find.bind($container);
        const book = {
            id: this.id,
            title: $('[itemprop="name"]').text(),
            author: $('[itemprop="author"] a').text() || $('[itemprop="author"]').text(),
            ISBN: $('[itemprop="isbn"]').text(),
            description: $('[itemprop="description"]').text() || $('[itemprop="about"]').text() ,
            image: $('#main-image-book').attr('src'),
            rating: +$('[itemprop="ratingValue"]').text() * 2,
            rate: +this.rate * 2
        }
        log.step(0, 1);

        return book;
    }
}
