"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Common */
const events_1 = require("events");
/* Android */
const AndroidFilter_1 = __importDefault(require("./android/AndroidFilter"));
const AndroidParser_1 = __importDefault(require("./android/AndroidParser"));
const adb_1 = require("./android/adb");
var constants_1 = require("./android/constants");
exports.AndroidPriority = constants_1.Priority;
/* iOS */
const IosParser_1 = __importDefault(require("./ios/IosParser"));
const IosFilter_1 = __importDefault(require("./ios/IosFilter"));
const simulator_1 = require("./ios/simulator");
const errors_1 = require("./errors");
var constants_2 = require("./ios/constants");
exports.IosPriority = constants_2.Priority;
/* Exports */
var formatters_1 = require("./formatters");
exports.formatEntry = formatters_1.formatEntry;
exports.formatError = formatters_1.formatError;
function makeTagsFilter(...tags) {
    return (platform, minPriority) => {
        const filter = platform === 'android'
            ? new AndroidFilter_1.default(minPriority)
            : new IosFilter_1.default(minPriority);
        filter.setFilterByTag(tags);
        return filter;
    };
}
exports.makeTagsFilter = makeTagsFilter;
function makeAppFilter(appIdentifier) {
    return (platform, minPriority, adbPath) => {
        if (platform !== 'android') {
            throw new Error('App filter is only available for Android');
        }
        const filter = new AndroidFilter_1.default(minPriority);
        filter.setFilterByApp(appIdentifier, adbPath);
        return filter;
    };
}
exports.makeAppFilter = makeAppFilter;
function makeMatchFilter(...regexes) {
    return (platform, minPriority) => {
        const filter = platform === 'android'
            ? new AndroidFilter_1.default(minPriority)
            : new IosFilter_1.default(minPriority);
        filter.setFilterByMatch(regexes);
        return filter;
    };
}
exports.makeMatchFilter = makeMatchFilter;
function makeCustomFilter(...patterns) {
    return (platform, minPriority) => {
        if (platform !== 'android') {
            throw new Error('Custom filter is only available for Android');
        }
        const filter = new AndroidFilter_1.default(minPriority);
        filter.setCustomFilter(patterns);
        return filter;
    };
}
exports.makeCustomFilter = makeCustomFilter;
function logkitty(options) {
    const { platform, adbPath, priority, filter: createFilter } = options;
    const emitter = new events_1.EventEmitter();
    if (!['ios', 'android'].some(availablePlatform => availablePlatform === platform)) {
        throw new Error(`Platform ${platform} is not supported`);
    }
    const parser = platform === 'android' ? new AndroidParser_1.default() : new IosParser_1.default();
    let filter;
    if (createFilter) {
        filter = createFilter(platform, priority, adbPath);
    }
    else {
        filter =
            platform === 'android'
                ? new AndroidFilter_1.default(priority)
                : new IosFilter_1.default(priority);
    }
    const loggingProcess = platform === 'android'
        ? adb_1.runAndroidLoggingProcess(adbPath)
        : simulator_1.runSimulatorLoggingProcess();
    process.on('exit', () => {
        loggingProcess.kill();
        emitter.emit('exit');
    });
    loggingProcess.stderr.on('data', (errorData) => {
        if (platform === 'ios' &&
            errorData.toString().includes('No devices are booted.')) {
            emitter.emit('error', new errors_1.CodeError(errors_1.ERR_IOS_NO_SIMULATORS_BOOTED, 'No simulators are booted.'));
        }
        else {
            emitter.emit('error', new Error(errorData.toString()));
        }
    });
    loggingProcess.stdout.on('data', (raw) => {
        let entryToLog;
        try {
            const messages = parser.splitMessages(raw.toString());
            const entries = parser.parseMessages(messages);
            entries.forEach((entry) => {
                if (filter.shouldInclude(entry)) {
                    entryToLog = entry;
                }
            });
        }
        catch (error) {
            emitter.emit('error', error);
        }
        if (entryToLog) {
            emitter.emit('entry', entryToLog);
        }
    });
    loggingProcess.stdout.on('error', (error) => {
        emitter.emit('error', error);
        emitter.emit('exit');
    });
    return emitter;
}
exports.logkitty = logkitty;
//# sourceMappingURL=api.js.map