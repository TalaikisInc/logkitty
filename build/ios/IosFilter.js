"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IosFilter {
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
    setFilterByMatch(regexes) {
        this.filter = (entry) => {
            return (entry.priority >= this.minPriority &&
                Boolean(regexes.find((reg) => Boolean(entry.messages.find((message) => reg.test(message))))));
        };
    }
    shouldInclude(entry) {
        return this.filter(entry);
    }
}
exports.default = IosFilter;
//# sourceMappingURL=IosFilter.js.map