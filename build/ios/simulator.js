"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const errors_1 = require("../errors");
function runSimulatorLoggingProcess() {
    try {
        return child_process_1.spawn('xcrun', [
            'simctl',
            'spawn',
            'booted',
            'log',
            'stream',
            '--type',
            'log',
            '--level',
            'debug',
        ], {
            stdio: 'pipe',
        });
    }
    catch (error) {
        throw new errors_1.CodeError(errors_1.ERR_IOS_CANNOT_START_SYSLOG, error.message);
    }
}
exports.runSimulatorLoggingProcess = runSimulatorLoggingProcess;
//# sourceMappingURL=simulator.js.map