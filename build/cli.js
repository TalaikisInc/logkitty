"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const api_1 = require("./api");
const formatters_1 = require("./formatters");
const utils_1 = require("./utils");
const androidPriorityOptions = {
    unknown: {
        alias: ['U', 'u'],
        boolean: true,
        default: false,
        describe: 'Unknown priority',
    },
    verbose: {
        alias: ['V', 'v'],
        boolean: true,
        default: false,
        describe: 'Verbose priority',
    },
    debug: {
        alias: ['D', 'd'],
        boolean: true,
        default: false,
        describe: 'Debug priority',
    },
    info: {
        alias: ['I', 'i'],
        boolean: true,
        default: false,
        describe: 'Info priority',
    },
    warn: {
        alias: ['W', 'w'],
        boolean: true,
        default: false,
        describe: 'Warn priority',
    },
    error: {
        alias: ['E', 'e'],
        boolean: true,
        default: false,
        describe: 'Error priority',
    },
    fatal: {
        alias: ['F', 'f'],
        boolean: true,
        default: false,
        describe: 'Fatal priority',
    },
    silent: {
        alias: ['S', 's'],
        boolean: true,
        default: false,
        describe: 'Silent priority',
    },
};
const iosPriorityOptions = {
    debug: {
        alias: ['D', 'd'],
        boolean: true,
        default: false,
        describe: 'Debug level',
    },
    info: {
        alias: ['I', 'i'],
        boolean: true,
        default: false,
        describe: 'Info level',
    },
    error: {
        alias: ['E', 'e'],
        boolean: true,
        default: false,
        describe: 'Error level',
    },
};
const _a = yargs_1.default
    .usage('Usage: $0 [options] <platform>')
    .command('android', 'Android', yargs => yargs
    .command('tag <tags ...>', 'Show logs matching given tags', androidPriorityOptions)
    .command('app <appId>', 'Show logs from application with given identifier', androidPriorityOptions)
    .command('match <regexes...>', 'Show logs matching given patterns', androidPriorityOptions)
    .command('custom <patterns ...>', 'Filter using custom patterns <tag>:<priority>')
    .command('all', 'Show all logs', androidPriorityOptions)
    .demandCommand(1)
    .option('adb-path', {
    type: 'string',
    describe: 'Use custom path to ADB',
})
    .example('$0 android tag MyTag', 'Filter logs to only include ones with MyTag tag')
    .example('$0 android tag MyTag -I', 'Filter logs to only include ones with MyTag tag and priority INFO and above')
    .example('$0 android app com.example.myApp', 'Show all logs from com.example.myApp')
    .example('$0 android match device', 'Show all logs matching /device/gm regex')
    .example('$0 android app com.example.myApp -E', 'Show all logs from com.example.myApp with priority ERROR and above')
    .example('$0 android custom *:S MyTag:D', 'Silence all logs and show only ones with MyTag with priority DEBUG and above'))
    .command('ios <filter>', 'ios', yargs => yargs
    .command('tag <tags ...>', 'Show logs matching given tags', iosPriorityOptions)
    .command('match <regexes...>', 'Show logs matching given patterns', iosPriorityOptions)
    .command('all', 'Show all logs', iosPriorityOptions)
    .demandCommand(1)
    .example('$0 ios tag MyTag', 'Filter logs to only include ones with MyTag tag')
    .example('$0 ios tag MyTag -i', 'Filter logs to only include ones with MyTag tag and priority Info and Error')
    .example('$0 ios match device', 'Show all logs matching /device/gm regex'))
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .version().argv, { _: [platform, filter] } = _a, args = __rest(_a, ["_"]);
const selectedAndroidPriorities = {
    unknown: Boolean(args.unknown),
    verbose: Boolean(args.verbose),
    debug: Boolean(args.debug),
    info: Boolean(args.info),
    warn: Boolean(args.warn),
    error: Boolean(args.error),
    fatal: Boolean(args.fatal),
    silent: Boolean(args.silent),
};
const selectedIosPriorities = {
    debug: Boolean(args.debug),
    info: Boolean(args.info),
    error: Boolean(args.error),
};
try {
    let createFilter;
    switch (filter) {
        case 'app':
            createFilter = api_1.makeAppFilter(args.appId);
            break;
        case 'tag':
            createFilter = api_1.makeTagsFilter(...args.tags);
            break;
        case 'match':
            createFilter = api_1.makeMatchFilter(...args.regexes.map((value) => new RegExp(value, 'gm')));
            break;
        case 'custom':
            createFilter = api_1.makeCustomFilter(...args.patterns);
            break;
        case 'all':
        default:
    }
    const emitter = api_1.logkitty({
        platform: platform,
        priority: platform === 'android'
            ? utils_1.getMinPriority(api_1.AndroidPriority, selectedAndroidPriorities, api_1.AndroidPriority.DEBUG)
            : utils_1.getMinPriority(api_1.IosPriority, selectedIosPriorities, api_1.IosPriority.DEFAULT),
        filter: createFilter,
    });
    emitter.on('entry', (entry) => {
        process.stdout.write(formatters_1.formatEntry(entry));
    });
    emitter.on('error', (error) => {
        terminate(error);
    });
}
catch (error) {
    terminate(error);
}
function terminate(error) {
    // eslint-disable-next-line no-console
    console.log(formatters_1.formatError(error));
    process.exit(1);
}
//# sourceMappingURL=cli.js.map