"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const constants_1 = require("./constants");
class AndroidParser {
    splitMessages(raw) {
        const messages = [];
        let data = raw.toString();
        let match = data.match(AndroidParser.timeRegex);
        while (match) {
            const timeHeader = match[0];
            data = data.slice((match.index || 0) + timeHeader.length);
            const nextMatch = data.match(AndroidParser.timeRegex);
            const body = nextMatch ? data.slice(0, nextMatch.index) : data;
            messages.push(`${timeHeader} ${body}`);
            match = nextMatch;
        }
        return messages;
    }
    parseMessages(messages) {
        return messages
            .map((rawMessage) => {
            const timeMatch = rawMessage.match(AndroidParser.timeRegex);
            if (!timeMatch) {
                throw new Error(`Time regex was not matched in message: ${rawMessage}`);
            }
            const headerMatch = rawMessage
                .slice(timeMatch[0].length)
                .match(AndroidParser.headerRegex) || ['', 'U', 'unknown', '-1'];
            const [, priority, tag, pid] = headerMatch;
            return {
                platform: 'android',
                date: dayjs_1.default()
                    .set('month', parseInt(timeMatch[1], 10))
                    .set('day', parseInt(timeMatch[2], 10))
                    .set('hour', parseInt(timeMatch[3], 10))
                    .set('minute', parseInt(timeMatch[4], 10))
                    .set('second', parseInt(timeMatch[5], 10))
                    .set('millisecond', 0),
                pid: parseInt(pid.trim(), 10) || 0,
                priority: constants_1.Priority.fromLetter(priority),
                tag: tag.trim() || 'unknown',
                messages: [
                    rawMessage
                        .slice(timeMatch[0].length + headerMatch[0].length)
                        .trim(),
                ],
            };
        })
            .reduce((acc, entry) => {
            if (acc.length > 0 &&
                acc[acc.length - 1].date.isSame(entry.date) &&
                acc[acc.length - 1].tag === entry.tag &&
                acc[acc.length - 1].pid === entry.pid &&
                acc[acc.length - 1].priority === entry.priority) {
                acc[acc.length - 1].messages.push(...entry.messages);
                return acc;
            }
            return [...acc, entry];
        }, []);
    }
}
exports.default = AndroidParser;
AndroidParser.timeRegex = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).\d{3}/m;
AndroidParser.headerRegex = /^\s*(\w)\/(.+)\(([\s\d]+)\):/;
//# sourceMappingURL=AndroidParser.js.map