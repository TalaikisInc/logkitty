"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_fragments_1 = require("ansi-fragments");
const constants_1 = require("./android/constants");
const constants_2 = require("./ios/constants");
function formatError(error) {
    return ansi_fragments_1.container(ansi_fragments_1.color('red', '✖︎ Ups, something went wrong'), ansi_fragments_1.pad(2, '\n'), ansi_fragments_1.color('red', ansi_fragments_1.modifier('bold', 'CODE'), ' ▶︎ '), 'code' in error ? error.code : 'ERR_UNKNOWN', ansi_fragments_1.pad(1, '\n'), ansi_fragments_1.color('red', ansi_fragments_1.modifier('bold', 'MESSAGE'), ' ▶︎ '), error.message).build();
}
exports.formatError = formatError;
function formatEntry(entry) {
    let priorityColor = 'none';
    let priorityModifier = 'none';
    if ((entry.platform === 'android' && entry.priority >= constants_1.Priority.ERROR) ||
        (entry.platform === 'ios' && entry.priority >= constants_2.Priority.ERROR)) {
        priorityColor = 'red';
    }
    else if (entry.platform === 'android' &&
        entry.priority === constants_1.Priority.WARN) {
        priorityColor = 'yellow';
    }
    else if ((entry.platform === 'android' &&
        entry.priority === constants_1.Priority.VERBOSE) ||
        (entry.platform === 'ios' && entry.priority === constants_2.Priority.DEBUG)) {
        priorityModifier = 'dim';
    }
    const output = ansi_fragments_1.container(ansi_fragments_1.modifier('dim', `[${entry.date.format('HH:mm:ss')}]`), ansi_fragments_1.pad(1), ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityModifier, `${entry.platform === 'android'
        ? constants_1.Priority.toLetter(entry.priority)
        : constants_2.Priority.toLetter(entry.priority)} |`)), ansi_fragments_1.pad(1), ansi_fragments_1.modifier('bold', ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityModifier, entry.tag || entry.appId || ''))), ansi_fragments_1.pad(1), ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityModifier, '▶︎')), ansi_fragments_1.pad(1), ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityModifier, entry.messages[0])), ansi_fragments_1.ifElse(entry.messages.length > 1, ansi_fragments_1.container(...entry.messages
        .slice(1)
        .map((line, index, arr) => ansi_fragments_1.container(ansi_fragments_1.pad(1, '\n'), ansi_fragments_1.pad((entry.tag || entry.appId || '').length + 16), ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityColor === 'none' ? 'dim' : 'none', `${index === arr.length - 1 ? '└' : '│'} `)), ansi_fragments_1.color(priorityColor, ansi_fragments_1.modifier(priorityModifier, line))))), '')).build();
    return `${output}\n`;
}
exports.formatEntry = formatEntry;
//# sourceMappingURL=formatters.js.map