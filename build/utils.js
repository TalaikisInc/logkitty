"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMinPriority(Priority, priorities, defaultPriority) {
    const parsedPriorities = Object.keys(priorities)
        .filter((key) => priorities[key])
        .map((key) => {
        return Priority.fromName(key);
    });
    return parsedPriorities.length
        ? Math.min(...parsedPriorities)
        : defaultPriority;
}
exports.getMinPriority = getMinPriority;
//# sourceMappingURL=utils.js.map