const fs = require('fs');

let options = {
    follow_max: 3
};
if (fs.existsSync('./options.json')) {
    Object.assign(options, JSON.parse(fs.readFileSync('./options.json', 'utf8')));
}

module.exports = {
    options: options,

    update(res) {
        if (res.cookies) {
            options.cookies = options.cookies || {};
            Object.assign(options.cookies, res.cookies);
            fs.writeFileSync('./options.json', JSON.stringify(options, null, 4));
        }
    }
}
