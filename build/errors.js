"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.CodeError = CodeError;
exports.ERR_ANDROID_UNPROCESSABLE_PID = 'ERR_ANDROID_UNPROCESSABLE_PID';
exports.ERR_ANDROID_CANNOT_GET_APP_PID = 'ERR_ANDROID_CANNOT_GET_APP_PID';
exports.ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER = 'ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER';
exports.ERR_ANDROID_CANNOT_START_LOGCAT = 'ERR_ANDROID_CANNOT_START_LOGCAT';
exports.ERR_IOS_CANNOT_LIST_SIMULATORS = 'ERR_IOS_CANNOT_LIST_SIMULATORS';
exports.ERR_IOS_NO_SIMULATORS_BOOTED = 'ERR_IOS_NO_SIMULATORS_BOOTED';
exports.ERR_IOS_CANNOT_START_SYSLOG = 'ERR_IOS_CANNOT_START_SYSLOG';
//# sourceMappingURL=errors.js.map