"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const errors_1 = require("../errors");
const isWin = process.platform === 'win32';
function runAndroidLoggingProcess(adbPath) {
    const execPath = getAdbPath(adbPath);
    return spawnLogcatProcess(execPath);
}
exports.runAndroidLoggingProcess = runAndroidLoggingProcess;
function getAdbPath(customPath) {
    if (customPath) {
        return path_1.default.resolve(customPath);
    }
    if (isWin) {
        return process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}\\platform-tools\\adb` : 'adb';
    }
    else {
        return process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';
    }
}
exports.getAdbPath = getAdbPath;
function spawnLogcatProcess(adbPath) {
    try {
        if (isWin) {
            child_process_1.execSync(`${adbPath} logcat -c`);
        }
        else {
            child_process_1.execSync(`'${adbPath}' logcat -c`);
        }
    }
    catch (error) {
        throw new errors_1.CodeError(errors_1.ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER, error.message);
    }
    try {
        return child_process_1.spawn(adbPath, ['logcat', '-v', 'time', 'process', 'tag'], {
            stdio: 'pipe',
        });
    }
    catch (error) {
        throw new errors_1.CodeError(errors_1.ERR_ANDROID_CANNOT_START_LOGCAT, error.message);
    }
}
exports.spawnLogcatProcess = spawnLogcatProcess;
function getApplicationPid(applicationId, adbPath) {
    let output;
    try {
        output = child_process_1.execSync(`'${getAdbPath(adbPath)}' shell pidof -s ${applicationId}`);
    }
    catch (error) {
        throw new errors_1.CodeError(errors_1.ERR_ANDROID_CANNOT_GET_APP_PID, error.message);
    }
    const pid = output ? parseInt(output.toString(), 10) : NaN;
    if (isNaN(pid)) {
        throw new errors_1.CodeError(errors_1.ERR_ANDROID_UNPROCESSABLE_PID);
    }
    return pid;
}
exports.getApplicationPid = getApplicationPid;
//# sourceMappingURL=adb.js.map