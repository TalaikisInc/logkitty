"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codes = {
    UNKNOWN: 0,
    VERBOSE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    FATAL: 6,
    SILENT: 7,
};
exports.Priority = Object.assign(Object.assign({}, codes), { fromName(name) {
        const value = codes[name.toUpperCase()];
        return value ? value : 0;
    },
    toName(code) {
        return (Object.keys(codes).find((key) => codes[key] === code) || 'UNKNOWN');
    },
    fromLetter(letter) {
        return codes[Object.keys(codes).find((key) => key[0] === letter.toUpperCase()) || 'UNKNOWN'];
    },
    toLetter(code) {
        return exports.Priority.toName(code)[0];
    } });
//# sourceMappingURL=constants.js.map