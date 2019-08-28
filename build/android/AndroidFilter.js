"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adb_1 = require("./adb");
const constants_1 = require("./constants");
class AndroidFilter {
    constructor(minPriority = 0) {
        this.minPriority = minPriority;
        // Default filter by all
        this.filter = (entry) => {
            return entry.priority >= this.minPriority;
        };
    }
    setFilterByTag(tags) {
        this.filter = (entry) => {
            return Boolean(entry.priority >= this.minPriority &&
                entry.tag &&
                tags.indexOf(entry.tag) > -1);
        };
    }
    setFilterByApp(applicationId, adbPath) {
        const pid = adb_1.getApplicationPid(applicationId, adbPath);
        this.filter = (entry) => {
            return entry.priority >= this.minPriority && entry.pid === pid;
        };
    }
    setFilterByMatch(regexes) {
        this.filter = (entry) => {
            return (entry.priority >= this.minPriority &&
                Boolean(regexes.find((reg) => Boolean(entry.messages.find((message) => reg.test(message))))));
        };
    }
    setCustomFilter(patterns) {
        const tagFilters = patterns.reduce((acc, pattern) => {
            const [tag, priority] = pattern.split(':');
            return Object.assign(Object.assign({}, acc), { [tag]: constants_1.Priority.fromLetter(priority) });
        }, {});
        this.filter = (entry) => {
            return ((entry.tag &&
                entry.priority >= (tagFilters[entry.tag] || constants_1.Priority.SILENT)) ||
                entry.priority >= (tagFilters['*'] || constants_1.Priority.UNKNOWN));
        };
    }
    shouldInclude(entry) {
        return this.filter(entry);
    }
}
exports.default = AndroidFilter;
//# sourceMappingURL=AndroidFilter.js.map