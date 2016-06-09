const Task = require('./Task');
const Book = require('./BookTask');
const $ = require('cheerio');
const Crawler = require('../Crawler');

module.exports = class PageTask extends Task {

    scrap(res) {
        const self = this;
        super.scrap(res);

        const $page = $.load(res.body);

        // Scapping книг.
        const books = $page('#contentwrapper .book-container .block-book-title');
        if (books && books.length) {
            books.each(function (index, elem) {
                const $elem = $(elem);
                const rate = $elem.closest('.event-data-title').find('.rating-book .rating-my span:first-child').text();
                const url = self.baseUrl + $elem.attr('href');
                Crawler.push(new Book(url, rate));                
            });
        }

        // Scapping страниц.
        const nextPath = $page('#contentwrapper .pagination-page .i-pager-next').closest('.pagination-page').attr('href');
        if (nextPath) {
            Crawler.push(new PageTask(this.baseUrl + nextPath));
        }
    }
}
