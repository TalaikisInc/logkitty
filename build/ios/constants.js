"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codes = {
    DEBUG: 0,
    DEFAULT: 1,
    INFO: 2,
    ERROR: 3,
};
exports.Priority = Object.assign(Object.assign({}, codes), { fromName(name) {
        const value = codes[name.toUpperCase()];
        return value ? value : 0;
    },
    toName(code) {
        return (Object.keys(codes).find((key) => codes[key] === code) || 'DEFAULT');
    },
    fromLetter(letter) {
        return codes[Object.keys(codes).find((key) => key[0] === letter.toUpperCase()) || 'DEFAULT'];
    },
    toLetter(code) {
        return exports.Priority.toName(code)[0];
    } });
//# sourceMappingURL=constants.js.map