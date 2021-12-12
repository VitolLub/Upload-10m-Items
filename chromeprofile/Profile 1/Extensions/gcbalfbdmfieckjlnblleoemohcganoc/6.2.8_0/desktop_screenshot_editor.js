/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		5: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1073,1,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(__webpack_require__(93));
const debounce = __webpack_require__(86);
const ts_utils_1 = __webpack_require__(12);
const path_1 = __webpack_require__(29);
const error_1 = __webpack_require__(137);
var StorageEvent;
(function (StorageEvent) {
    StorageEvent["ListChanged"] = "list_changed";
    StorageEvent["FilesChanged"] = "files_changed";
})(StorageEvent = exports.StorageEvent || (exports.StorageEvent = {}));
var EntryStatus;
(function (EntryStatus) {
    EntryStatus[EntryStatus["Unknown"] = 0] = "Unknown";
    EntryStatus[EntryStatus["NonExistent"] = 1] = "NonExistent";
    EntryStatus[EntryStatus["File"] = 2] = "File";
    EntryStatus[EntryStatus["Directory"] = 3] = "Directory";
})(EntryStatus = exports.EntryStatus || (exports.EntryStatus = {}));
class StandardStorage extends eventemitter3_1.default {
    constructor(options = {}) {
        super();
        this.encode = (x, fileName) => x;
        this.decode = (x, fileName) => x;
        this.displayedCount = 0;
        this.totalCount = 0;
        this.listFilter = (list) => list;
        // Q: Why do we need debounce for followingemitXXX?
        // A: So that there could be more than 1 invocation of emitXXX in one operation
        //    And it will just emit once. For downstream like React / Vue, it won't trigger
        //    unnecessary render
        // Note: list changed event is for move (rename) / remove / clear / write a new file
        this.emitListChanged = debounce(() => {
            // FIXME:
            this.list('/')
                .then(fileInfos => {
                this.emit(StorageEvent.ListChanged, fileInfos);
            });
        }, 100);
        this.changedFileNames = [];
        this.__emitFilesChanged = debounce(() => {
            const fileNames = this.changedFileNames;
            // Note: clear changedFileNames right after this method is called,
            // instead of waiting till promise resolved
            // so that new file changes won't be blocked or affect current emit
            this.changedFileNames = [];
            return Promise.all(fileNames.map(fileName => {
                return this.read(fileName, 'Text')
                    .catch(() => null);
            }))
                .then(contents => {
                if (contents.length === 0)
                    return;
                // Note: in case some files don't exist any more, filter by content
                const changedFiles = contents.map((content, i) => ({
                    content,
                    fileName: fileNames[i]
                }))
                    .filter(item => !!item.content);
                this.emit(StorageEvent.FilesChanged, changedFiles);
            });
        }, 100);
        if (options.decode) {
            this.decode = options.decode;
        }
        if (options.encode) {
            this.encode = options.encode;
        }
        if (options.listFilter) {
            this.listFilter = options.listFilter;
        }
    }
    getPathLib() {
        // Note: only subclass knows whether it should use win32/posix style path
        return this.isWin32Path() ? path_1.win32 : path_1.posix;
    }
    relativePath(entryPath, isDirectory) {
        const absPath = isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
        const rootPath = this.dirPath('/');
        return this.getPathLib().relative(rootPath, absPath);
    }
    entryPath(entryPath, isDirectory) {
        return isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
    }
    list(directoryPath = '/', brief = false) {
        return this.__list(directoryPath, brief)
            .then((items) => {
            return this.sortEntries(items);
        });
    }
    listR(directoryPath = '/') {
        const listDir = (dir) => {
            return this.list(dir, false)
                .then((entries) => {
                return Promise.all(entries.map((entry) => {
                    if (entry.isDirectory) {
                        return listDir(entry.fullPath);
                    }
                    return Promise.resolve(null);
                }))
                    .then((listOfEntries) => {
                    return this.sortEntries(entries.map((entry, i) => (Object.assign(Object.assign({}, entry), { children: listOfEntries[i] || [] }))));
                });
            });
        };
        return listDir(directoryPath)
            .then((entryNodes) => {
            if (directoryPath !== '/') {
                return entryNodes;
            }
            return Promise.resolve(this.listFilter(entryNodes))
                .then(displayEntryNodes => {
                this.totalCount = ts_utils_1.sum(...entryNodes.map(ts_utils_1.nodeCount));
                this.displayedCount = ts_utils_1.sum(...displayEntryNodes.map(ts_utils_1.nodeCount));
                return displayEntryNodes;
            });
        });
    }
    getDisplayCount() {
        return this.displayedCount;
    }
    getTotalCount() {
        return this.totalCount;
    }
    exists(path) {
        return this.stat(path)
            .then(({ isFile, isDirectory }) => isFile || isDirectory, () => false);
    }
    fileExists(path) {
        return this.stat(path)
            .then((entry) => entry.isFile, () => false);
    }
    directoryExists(path) {
        return this.stat(path, true)
            .then((entry) => {
            return entry.isDirectory;
        }, () => false);
    }
    readR(directoryPath, readFileType = 'Text', onErrorFiles) {
        return this.listR(directoryPath)
            .then((entryNodes) => {
            return Promise.all(entryNodes.map((node) => {
                if (node.isFile) {
                    return this.read(node.fullPath, readFileType)
                        .then((content) => [{
                            content: content,
                            filePath: node.fullPath
                        }]);
                }
                if (node.isDirectory) {
                    return this.readR(node.fullPath, readFileType);
                }
                throw new Error('Not file or directory');
            }))
                .then((result) => {
                return ts_utils_1.flatten(result);
            });
        });
    }
    write(fileName, content) {
        return this.exists(fileName)
            .then(isExist => {
            const next = () => {
                if (!isExist)
                    this.emitListChanged();
                this.emitFilesChanged([fileName]);
            };
            return this.__write(fileName, content)
                .then(next);
        });
    }
    overwrite(fileName, content) {
        return this.__overwrite(fileName, content)
            .then(() => {
            this.emitFilesChanged([fileName]);
        });
    }
    bulkWrite(list) {
        return Promise.all(list.map(item => this.write(item.filePath, item.content)))
            .then(() => { });
    }
    removeFile(filePath) {
        return this.__removeFile(filePath)
            .then(() => {
            this.emitListChanged();
        });
    }
    removeEmptyDirectory(directoryPath) {
        return this.__removeEmptyDirectory(directoryPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    removeDirectory(directoryPath) {
        return this.remove(directoryPath, true);
    }
    remove(path, isDirectory) {
        return this.stat(path, isDirectory)
            .then((entry) => {
            if (entry.isFile) {
                return this.removeFile(entry.fullPath);
            }
            if (entry.isDirectory) {
                return this.list(entry.fullPath)
                    .then((entries) => {
                    return Promise.all(entries.map((item) => this.remove(item.fullPath, item.isDirectory)))
                        .then(() => this.removeEmptyDirectory(entry.fullPath));
                });
            }
            throw new Error('Not file or directory');
        });
    }
    clear() {
        return this.list('/')
            .then((entries) => {
            return Promise.all(entries.map((entry) => this.remove(entry.fullPath)))
                .then(() => { });
        });
    }
    moveFile(filePath, newPath) {
        return this.__moveFile(filePath, newPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    copyFile(filePath, newPath) {
        return this.__copyFile(filePath, newPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    moveDirectory(directoryPath, newPath) {
        return this.move(directoryPath, newPath, true, true);
    }
    copyDirectory(directoryPath, newPath) {
        return this.copy(directoryPath, newPath, true, true);
    }
    move(src, dst, isSourceDirectory, isTargetDirectory) {
        const absSrc = this.entryPath(src, isSourceDirectory);
        const absDst = this.entryPath(dst, isTargetDirectory);
        if (absSrc === absDst) {
            throw new Error('move: src should not be the same as dst');
        }
        if (this.getPathLib().dirname(absSrc) === absDst) {
            throw new Error('move: cannot move to original dir');
        }
        if (isSourceDirectory && isTargetDirectory && this.isTargetInSourceDirectory(dst, src)) {
            throw new Error('Cannot move a directory into its sub directory');
        }
        // It's slow to copy then remove. Subclass should definitely
        // override this method if it has native support for move operation
        return this.copy(src, dst, isSourceDirectory, isTargetDirectory)
            .then(() => this.remove(src, isSourceDirectory));
    }
    copy(src, dst, isSourceDirectory, isTargetDirectory) {
        const srcDir = this.getPathLib().dirname(src);
        const dstDir = this.getPathLib().dirname(dst);
        const isSameDir = srcDir === dstDir;
        if (src === dst) {
            throw new Error('copy: dst should not be the same as src');
        }
        return Promise.all([
            this.getEntryStatus(src, isSourceDirectory),
            this.getEntryStatus(dst, isTargetDirectory),
            isSameDir ? Promise.resolve(EntryStatus.Directory) : this.getEntryStatus(this.getPathLib().dirname(dst), true)
        ])
            .then((triple) => {
            const [srcStatus, dstStatus, dstDirStatus] = triple;
            if (dstDirStatus !== EntryStatus.Directory) {
                throw new error_1.ENOTDIR(this.getPathLib().dirname(dst));
            }
            switch (srcStatus) {
                case EntryStatus.NonExistent:
                    throw new error_1.ENOENT(src);
                case EntryStatus.Unknown:
                    throw new Error(`source (${src}) exists but is neither a file nor a directory`);
                case EntryStatus.File: {
                    switch (dstStatus) {
                        case EntryStatus.File:
                            throw new error_1.EEXIST(dst);
                        case EntryStatus.Unknown:
                            throw new Error(`dst '${dst}' is neither a file nor directory`);
                        case EntryStatus.Directory: {
                            const dstFilePath = this.getPathLib().resolve(dst, this.getPathLib().basename(src));
                            return this.copyFile(src, dstFilePath);
                        }
                        case EntryStatus.NonExistent: {
                            return this.copyFile(src, dst);
                        }
                    }
                }
                case EntryStatus.Directory: {
                    switch (dstStatus) {
                        case EntryStatus.File:
                            throw new Error(`dst '${dst}' is an existing file, but src '${src}' is a directory`);
                        case EntryStatus.Unknown:
                            throw new Error(`dst '${dst}' is neither a file nor directory`);
                        case EntryStatus.Directory: {
                            if (this.isTargetInSourceDirectory(dst, src)) {
                                throw new Error('Cannot copy a directory into its sub directory');
                            }
                            const dstDir = this.getPathLib().resolve(dst, this.getPathLib().basename(src));
                            return this.ensureDirectory(dstDir)
                                .then(() => this.copyAllInDirectory(src, dstDir));
                        }
                        case EntryStatus.NonExistent: {
                            return this.ensureDirectory(dst)
                                .then(() => this.copyAllInDirectory(src, dst));
                        }
                    }
                }
            }
        });
    }
    createDirectory(directoryPath) {
        return this.mkdir(directoryPath, false);
    }
    ensureDirectory(directoryPath) {
        return this.getEntryStatus(directoryPath, true)
            .then((status) => {
            switch (status) {
                case EntryStatus.File:
                case EntryStatus.Unknown:
                    throw new error_1.EEXIST();
                case EntryStatus.Directory:
                    return;
                case EntryStatus.NonExistent:
                    return this.mkdir(directoryPath, true);
            }
        });
    }
    ensureDir() {
        return this.ensureDirectory('/');
    }
    rename(filePath, newPath) {
        return this.move(filePath, newPath);
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list('/')
            .then((items) => {
            return Promise.all(items
                .filter(item => item.isFile)
                .map(item => {
                return this.read(item.fullPath, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.name
                }))
                    // Note: Whenever there is error in reading file,
                    // return null
                    .catch(e => {
                    return {
                        fileName: item.name,
                        fullFilePath: item.fullPath,
                        error: new Error(`Error in parsing ${item.fullPath}:\n${e.message}`)
                    };
                });
            }))
                .then(list => {
                const errorFiles = list.filter(item => item.error);
                if (onErrorFiles)
                    onErrorFiles(errorFiles);
                return list.filter((item) => item.content);
            });
        });
    }
    isTargetInSourceDirectory(targetPath, sourcePath) {
        const dstPath = this.dirPath(targetPath);
        const srcPath = this.dirPath(sourcePath);
        const sep = this.getPathLib().sep;
        const relativePath = this.getPathLib().relative(srcPath, dstPath);
        const parts = relativePath.split(sep);
        return parts.indexOf('..') === -1;
    }
    sortEntries(entries) {
        // Sort entries in this order
        // 1. Directories come before files
        // 2. Inside directories or files, sort it alphabetically a-z (ignore case)
        const items = [...entries];
        items.sort((a, b) => {
            if (a.isDirectory && b.isFile) {
                return -1;
            }
            if (a.isFile && b.isDirectory) {
                return 1;
            }
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName < bName)
                return -1;
            if (aName > bName)
                return 1;
            return 0;
        });
        return items;
    }
    copyAllInDirectory(srcDir, dstDir) {
        return this.list(srcDir)
            .then((entries) => {
            return Promise.all(entries.map((entry) => {
                if (entry.isFile) {
                    return this.copyFile(entry.fullPath, this.getPathLib().resolve(dstDir, entry.name));
                }
                if (entry.isDirectory) {
                    const dstSubDir = this.getPathLib().resolve(dstDir, entry.name);
                    return this.ensureDirectory(dstSubDir)
                        .then(() => this.copyAllInDirectory(entry.fullPath, dstSubDir));
                }
                return Promise.resolve();
            }))
                .then(() => { });
        });
    }
    mkdir(dir, sureAboutNonExistent = false) {
        const makeSureNonExistent = () => {
            if (sureAboutNonExistent) {
                return Promise.resolve();
            }
            return this.getEntryStatus(dir, true)
                .then((status) => {
                if (status !== EntryStatus.NonExistent) {
                    throw new error_1.EEXIST(dir);
                }
            });
        };
        return makeSureNonExistent()
            .then(() => {
            const parentDir = this.getPathLib().dirname(dir);
            if (parentDir === '/') {
                return this.__createDirectory(dir);
            }
            return this.getEntryStatus(parentDir, true)
                .then((status) => {
                switch (status) {
                    case EntryStatus.File:
                    case EntryStatus.Unknown:
                        throw new error_1.EEXIST(parentDir);
                    case EntryStatus.Directory:
                        return this.__createDirectory(dir);
                    case EntryStatus.NonExistent:
                        return this.mkdir(parentDir, true)
                            .then(() => this.__createDirectory(dir));
                }
            });
        })
            .then(() => {
            this.emitListChanged();
        });
    }
    getEntryStatus(path, isDirectory) {
        return this.stat(path, isDirectory)
            .then((entry) => {
            if (entry.isFile)
                return EntryStatus.File;
            if (entry.isDirectory)
                return EntryStatus.Directory;
            return EntryStatus.NonExistent;
        }, (e) => {
            return EntryStatus.NonExistent;
        });
    }
    // Note: files changed event is for write file only  (rename excluded)
    emitFilesChanged(fileNames) {
        this.changedFileNames = fileNames.reduce((prev, fileName) => {
            if (prev.indexOf(fileName) === -1)
                prev.push(fileName);
            return prev;
        }, this.changedFileNames);
        this.__emitFilesChanged();
    }
}
exports.StandardStorage = StandardStorage;


/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(__webpack_require__(381));
const types_1 = __webpack_require__(109);
const utils_1 = __webpack_require__(4);
const ts_utils_1 = __webpack_require__(12);
function runOCR(options) {
    const scaleStr = (options.scale + '').toLowerCase();
    const scale = ['true', 'false'].indexOf(scaleStr) !== -1 ? scaleStr : 'true';
    const engine = [1, 2].indexOf(options.engine || 0) !== -1 ? options.engine : 1;
    const singleRun = () => {
        return options.getApiUrlAndApiKey()
            .then(server => {
            const { url, key } = server;
            const f = new FormData();
            f.append('apikey', key);
            f.append('language', options.language);
            f.append('scale', scale);
            f.append('OCREngine', '' + engine);
            f.append('isOverlayRequired', '' + options.isOverlayRequired);
            if (options.isTable !== undefined) {
                f.append('isTable', '' + options.isTable);
            }
            if (typeof options.image === 'string') {
                f.append('file', utils_1.dataURItoBlob(options.image), 'unknown.png');
            }
            else {
                f.append('file', options.image.blob, options.image.name);
            }
            const startTime = new Date().getTime();
            if (options.willSendRequest) {
                options.willSendRequest({ server, startTime });
            }
            return utils_1.withTimeout(options.singleApiTimeout, () => {
                return superagent_1.default.post(url)
                    .send(f);
            })
                .then((res) => {
                if (options.didGetResponse) {
                    return options.didGetResponse({
                        server,
                        startTime,
                        endTime: new Date().getTime(),
                        response: res.body,
                        error: null
                    })
                        .then(() => res, () => res);
                }
                return res;
            }, (e) => {
                const err = getApiError(e);
                if (options.didGetResponse) {
                    return options.didGetResponse({
                        server,
                        startTime,
                        endTime: new Date().getTime(),
                        response: null,
                        error: err
                    })
                        .then(() => { throw err; }, () => { throw err; });
                }
                throw e;
            })
                .then(onApiReturn, onApiError)
                .catch(e => {
                if (/timeout/i.test(e.message)) {
                    throw new Error(`OCR request timeout ${(options.singleApiTimeout / 1000).toFixed(1)}s`);
                }
                else {
                    throw e;
                }
            });
        });
    };
    const run = ts_utils_1.retry(singleRun, {
        // We don't want timeout mechanism from retry, so just make it big enough
        timeout: options.singleApiTimeout * 10,
        retryInterval: 0,
        shouldRetry: options.shouldRetry || (() => false)
    });
    return utils_1.withTimeout(options.totalTimeout, run)
        .catch(e => {
        if (/timeout/i.test(e.message)) {
            throw new Error('OCR timeout');
        }
        else {
            throw e;
        }
    });
}
exports.runOCR = runOCR;
function getApiError(e) {
    if (e.response && typeof e.response.body === 'string') {
        return new Error(e.response.body);
    }
    return e;
}
function onApiError(e) {
    console.error(e);
    throw getApiError(e);
}
function onApiReturn(res) {
    guardOCRResponse(res.body);
    return res.body;
}
function guardOCRResponse(data) {
    switch (data.OCRExitCode) {
        case types_1.OCRExitCode.AllParsed:
            return;
        case types_1.OCRExitCode.PartiallyParsed:
            throw new Error([
                'Parsed Partially (Only few pages out of all the pages parsed successfully)',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
        case types_1.OCRExitCode.Failed:
            throw new Error([
                'OCR engine fails to parse an image',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
        case types_1.OCRExitCode.Fatal:
            throw new Error([
                'Fatal error occurs during parsing',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
    }
}
exports.guardOCRResponse = guardOCRResponse;
function wordIteratorFromParseResults(parseResults) {
    let pageIndex = 0;
    let lineIndex = 0;
    let wordIndex = 0;
    const next = () => {
        const page = parseResults[pageIndex];
        const currentLines = page ? page.TextOverlay.Lines : [];
        const line = page ? page.TextOverlay.Lines[lineIndex] : null;
        const currentWords = line ? line.Words : [];
        const word = line ? line.Words[wordIndex] : null;
        if (!word) {
            return {
                done: true,
                value: null
            };
        }
        const value = {
            word,
            position: {
                pageIndex,
                lineIndex,
                wordIndex
            }
        };
        [pageIndex, lineIndex, wordIndex] = (() => {
            let nextWordIndex = wordIndex + 1;
            let nextLineIndex = lineIndex;
            let nextPageIndex = pageIndex;
            if (nextWordIndex >= currentWords.length) {
                nextWordIndex = 0;
                nextLineIndex += 1;
            }
            if (nextLineIndex >= currentLines.length) {
                nextLineIndex = 0;
                nextPageIndex += 1;
            }
            if (nextPageIndex >= parseResults.length) {
                return [-1, -1, -1];
            }
            return [nextPageIndex, nextLineIndex, nextWordIndex];
        })();
        return {
            value,
            done: false
        };
    };
    return { next };
}
exports.wordIteratorFromParseResults = wordIteratorFromParseResults;
function iterateThroughParseResults(parseResults, fn) {
    const iterator = wordIteratorFromParseResults(parseResults);
    while (true) {
        const { done, value } = iterator.next();
        if (done)
            break;
        const shouldContinue = fn(value);
        if (!shouldContinue)
            break;
    }
}
exports.iterateThroughParseResults = iterateThroughParseResults;
function searchTextInOCRResponse(data) {
    const { text, index, parsedResults, exhaust } = data;
    const isExactMatch = /^\[.*\]$/.test(text);
    const realText = isExactMatch ? text.slice(1, -1) : text;
    const words = realText.split(/\s+/g).map(s => s.trim()).filter(s => s.length > 0);
    if (index < 0 || Math.round(index) !== index) {
        throw new Error('index must be positive integer');
    }
    let found = [];
    let wordIndex = 0;
    let matchIndex = 0;
    iterateThroughParseResults(parsedResults, (wordWithPos) => {
        const matchType = (() => {
            if (isExactMatch)
                return WordMatchType.Full;
            if (words.length === 1)
                return WordMatchType.AnyPart;
            if (wordIndex === 0)
                return WordMatchType.Postfix;
            if (wordIndex === words.length - 1)
                return WordMatchType.Prefix;
            return WordMatchType.Full;
        })();
        if (!hasWordMatch(words[wordIndex], wordWithPos.word.WordText, matchType)) {
            found[matchIndex] = [];
            wordIndex = 0;
            return true;
        }
        found[matchIndex] = found[matchIndex] || [];
        found[matchIndex].push(wordWithPos);
        wordIndex += 1;
        // Whether it's the last word
        if (wordIndex >= words.length) {
            matchIndex += 1;
            wordIndex = 0;
            const shouldContinue = exhaust || matchIndex <= index;
            return shouldContinue;
        }
        return true;
    });
    const all = found.filter(pWords => pWords.length === words.length)
        .map(pWords => ({
        words: pWords,
        // Note: similarity is useless in current implementation
        similarity: 1
    }));
    const hit = all[index] || null;
    return {
        hit,
        all,
        exhaust
    };
}
exports.searchTextInOCRResponse = searchTextInOCRResponse;
function isWordEqual(a, b) {
    if (!a || !b)
        return false;
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}
exports.isWordEqual = isWordEqual;
var WordMatchType;
(function (WordMatchType) {
    WordMatchType[WordMatchType["Full"] = 0] = "Full";
    WordMatchType[WordMatchType["Prefix"] = 1] = "Prefix";
    WordMatchType[WordMatchType["Postfix"] = 2] = "Postfix";
    WordMatchType[WordMatchType["AnyPart"] = 3] = "AnyPart";
})(WordMatchType = exports.WordMatchType || (exports.WordMatchType = {}));
function hasWordMatch(pattern, target, matchType) {
    if (!pattern || !target)
        return false;
    const lowerPattern = pattern.trim().toLowerCase();
    const lowerTarget = target.trim().toLowerCase();
    switch (matchType) {
        case WordMatchType.Full: {
            return lowerPattern === lowerTarget;
        }
        case WordMatchType.Prefix: {
            return lowerTarget.indexOf(lowerPattern) === 0;
        }
        case WordMatchType.Postfix: {
            const index = lowerTarget.indexOf(lowerPattern);
            return index !== -1 && index === lowerTarget.length - lowerPattern.length;
        }
        case WordMatchType.AnyPart: {
            return lowerTarget.indexOf(lowerPattern) !== -1;
        }
    }
}
exports.hasWordMatch = hasWordMatch;
function isWordPositionEqual(a, b) {
    return a.pageIndex === b.pageIndex &&
        a.lineIndex === b.lineIndex &&
        a.wordIndex === b.wordIndex;
}
exports.isWordPositionEqual = isWordPositionEqual;
function allWordsWithPosition(parseResults, excludePositions) {
    const result = [];
    const isAtKnownPosition = (wordWithPos) => {
        return excludePositions.reduce((prev, pos) => {
            if (prev)
                return true;
            return isWordPositionEqual(pos, wordWithPos.position);
        }, false);
    };
    iterateThroughParseResults(parseResults, (wordWithPos) => {
        if (!isAtKnownPosition(wordWithPos)) {
            result.push(wordWithPos);
        }
        return true;
    });
    return result;
}
exports.allWordsWithPosition = allWordsWithPosition;
function ocrMatchRect(match) {
    const rectsByLine = match.words.reduce((prev, cur) => {
        const key = `${cur.position.pageIndex}_${cur.position.lineIndex}`;
        if (!prev[key]) {
            prev[key] = {
                x: cur.word.Left,
                y: cur.word.Top,
                width: cur.word.Width,
                height: cur.word.Height
            };
        }
        else {
            prev[key] = Object.assign(Object.assign({}, prev[key]), { width: Math.max(prev[key].width, cur.word.Left + cur.word.Width - prev[key].x), height: Math.max(prev[key].height, cur.word.Top + cur.word.Height - prev[key].y) });
        }
        return prev;
    }, {});
    const widestRect = Object.keys(rectsByLine).reduce((prev, key) => {
        return prev.width < rectsByLine[key].width ? rectsByLine[key] : prev;
    }, { x: 0, y: 0, width: 0, height: 0 });
    return widestRect;
}
exports.ocrMatchRect = ocrMatchRect;
function ocrMatchCenter(match) {
    const rect = ocrMatchRect(match);
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
    };
}
exports.ocrMatchCenter = ocrMatchCenter;
function scaleOcrParseResultWord(word, scale) {
    return Object.assign(Object.assign({}, word), { Width: scale * word.Width, Height: scale * word.Height, Left: scale * word.Left, Top: scale * word.Top });
}
exports.scaleOcrParseResultWord = scaleOcrParseResultWord;
function scaleOcrResponseCoordinates(res, scale) {
    const data = ts_utils_1.safeUpdateIn(['ParsedResults', '[]', 'TextOverlay', 'Lines', '[]', 'Words', '[]'], (word) => scaleOcrParseResultWord(word, scale), res);
    return data;
}
exports.scaleOcrResponseCoordinates = scaleOcrResponseCoordinates;
function scaleOcrTextSearchMatch(match, scale) {
    const data = ts_utils_1.safeUpdateIn(['words', '[]', 'word'], (word) => scaleOcrParseResultWord(word, scale), match);
    return data;
}
exports.scaleOcrTextSearchMatch = scaleOcrTextSearchMatch;


/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference types="chrome"/>
Object.defineProperty(exports, "__esModule", { value: true });
class InvocationQueueItem {
    constructor(id, method, params, callback) {
        this.requestObject = {
            id,
            method,
            params
        };
        this.callback = callback;
    }
    get request() {
        return this.requestObject;
    }
}
class NativeMessagingHost {
    constructor(hostName) {
        this.internalHostName = hostName;
        this.nextInvocationId = 1;
        this.queue = new Array();
        this.handleMessage = this.handleMessage.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
    }
    processResponse(id, result, error) {
        let callback = undefined;
        for (let i = 0; i < this.queue.length; ++i) {
            const entry = this.queue[i];
            if (entry.request.id === id) {
                callback = entry.callback;
                this.queue.splice(i, 1);
                break;
            }
        }
        if (callback) {
            callback(result, error);
        }
    }
    handleMessage(message) {
        const response = message;
        if (typeof response.id !== "number") {
            return;
        }
        this.processResponse(response.id, response.result, response.error);
    }
    handleDisconnect() {
        this.disconnect();
    }
    get hostName() {
        return this.internalHostName;
    }
    connectAsync() {
        if (this.port) {
            return this.invokeAsync("get_version", undefined);
        }
        this.port = chrome.runtime.connectNative(this.hostName);
        this.port.onMessage.addListener(this.handleMessage);
        this.port.onDisconnect.addListener(this.handleDisconnect);
        return this.invokeAsync("get_version", undefined);
    }
    disconnect() {
        const message = chrome.runtime.lastError && chrome.runtime.lastError.message || "Disconnected";
        if (this.port) {
            this.port.disconnect();
            this.port = undefined;
        }
        // Discard all queued invocations
        const invocationIdArray = this.queue.map(x => x.request.id);
        for (const id of invocationIdArray) {
            this.processResponse(id, undefined, { message });
        }
        this.queue = new Array();
    }
    invoke(method, params, callback) {
        if (!this.port) {
            callback(undefined, {
                message: "Disconnected"
            });
            return;
        }
        const id = this.nextInvocationId++;
        const item = new InvocationQueueItem(id, method, params, callback);
        this.queue.push(item);
        this.port.postMessage(item.request);
    }
    invokeAsync(method, params) {
        return new Promise((resolve, reject) => {
            this.invoke(method, params, (result, error) => {
                if (chrome.runtime.lastError) {
                    error = new Error(chrome.runtime.lastError.message);
                }
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.NativeMessagingHost = NativeMessagingHost;


/***/ }),

/***/ 1073:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(__webpack_require__(0));
const react_dom_1 = __importDefault(__webpack_require__(18));
const antd_1 = __webpack_require__(114);
const en_US_1 = __importDefault(__webpack_require__(383));
const select_area_1 = __webpack_require__(390);
const types_1 = __webpack_require__(84);
const desktop_1 = __webpack_require__(87);
const ipc_bg_cs_1 = __webpack_require__(89);
const storage_1 = __importDefault(__webpack_require__(37));
const dom_utils_1 = __webpack_require__(22);
const storage_2 = __webpack_require__(13);
const xfile_1 = __webpack_require__(33);
const ts_utils_1 = __webpack_require__(12);
const utils_1 = __webpack_require__(4);
const types_2 = __webpack_require__(109);
const ocr_1 = __webpack_require__(104);
const cs_timeout_1 = __webpack_require__(115);
__webpack_require__(382);
__webpack_require__(1074);
const csIpc = ipc_bg_cs_1.csInit(true);
init();
cs_timeout_1.polyfillTimeoutFunctions(csIpc);
function init() {
    return Promise.all([
        restoreConfig(),
        xfile_1.getXFile().getConfig()
    ])
        .then(([config, xFileConfig]) => {
        storage_2.getStorageManager(config.storageMode);
        render();
    }, render);
}
function restoreConfig() {
    return storage_1.default.get('config')
        .then((config = {}) => {
        return Object.assign({ storageMode: storage_2.StorageStrategyType.Browser }, config);
    });
}
function render() {
    const rootEl = document.getElementById('root');
    return react_dom_1.default.render(react_1.default.createElement(antd_1.LocaleProvider, { locale: en_US_1.default },
        react_1.default.createElement(App, null)), rootEl);
}
class App extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult,
            rects: [],
            ocrMatches: [],
            imageUrl: '',
            scale: 0.5,
            imagePageRect: { x: 0, y: 0, width: 0, height: 0 },
            imageSize: { width: 0, height: 0 }
        };
    }
    componentDidMount() {
        csIpc.onAsk((type, data) => {
            switch (type) {
                case 'DOM_READY':
                    return true;
                case types_1.DesktopScreenshot.RequestType.DisplayVisualResult: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult,
                        rects: d.rects
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => true);
                }
                case types_1.DesktopScreenshot.RequestType.DisplayOcrResult: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.DisplayOcrResult,
                        ocrMatches: d.ocrMatches
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => true);
                }
                case types_1.DesktopScreenshot.RequestType.Capture: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.Capture
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => ts_utils_1.delay(() => { }, 1000))
                        .then(() => this.selectAreaOnImage());
                }
            }
        });
    }
    resetToMode(mode) {
        return new Promise(resolve => {
            this.setState({
                mode,
                rects: [],
                ocrMatches: []
            }, () => resolve());
        });
    }
    updateImagePageRect() {
        const $image = this.$image;
        if (!$image)
            return;
        const offset = dom_utils_1.accurateOffset($image);
        this.setState({
            imagePageRect: {
                x: offset.left,
                y: offset.top,
                width: $image.offsetWidth,
                height: $image.offsetHeight
            }
        });
    }
    getImagePageRect() {
        return this.state.imagePageRect;
    }
    selectAreaOnImage() {
        return new Promise((resolve, reject) => {
            select_area_1.selectArea({
                preventGlobalClick: false,
                clickToDestroy: false,
                overlayStyles: {
                    top: this.state.imagePageRect.y + 'px'
                },
                onDestroy: () => {
                    resolve();
                },
                done: (rect, boundingRect) => {
                    const areaPageRect = rect;
                    const imagePageRect = this.getImagePageRect();
                    const relativeRect = {
                        x: areaPageRect.x - imagePageRect.x,
                        y: areaPageRect.y - imagePageRect.y,
                        width: areaPageRect.width,
                        height: areaPageRect.height,
                    };
                    const finalScale = (1 / this.state.scale) * (this.state.imageSize.width / screen.width);
                    const finalRect = {
                        x: relativeRect.x * finalScale,
                        y: relativeRect.y * finalScale,
                        width: relativeRect.width * finalScale,
                        height: relativeRect.height * finalScale,
                    };
                    return dom_utils_1.subImage(this.state.imageUrl, finalRect)
                        .then(resolve, reject);
                },
                allowCursor: (e) => {
                    const imagePageRect = this.getImagePageRect();
                    const x = e.pageX;
                    const y = e.pageY;
                    return x > imagePageRect.x &&
                        y > imagePageRect.y &&
                        x < imagePageRect.x + imagePageRect.width &&
                        y < imagePageRect.y + imagePageRect.height;
                }
            });
        })
            .then(result => {
            this.setState({ mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult });
            return result;
        })
            .catch(e => {
            this.setState({ mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult });
            throw e;
        });
    }
    consumeImageInfo(image) {
        const pImageDataUrl = (() => {
            switch (image.source) {
                case types_1.DesktopScreenshot.ImageSource.HardDrive:
                case types_1.DesktopScreenshot.ImageSource.Storage:
                    return storage_2.getStorageManager().getScreenshotStorage().read(image.path, 'DataURL');
                case types_1.DesktopScreenshot.ImageSource.CV:
                    return desktop_1.getNativeCVAPI().readFileAsDataURL(image.path, true);
                case types_1.DesktopScreenshot.ImageSource.DataUrl:
                    return Promise.resolve(image.path);
            }
        })();
        return pImageDataUrl.then((dataUrl) => {
            this.setState({
                imageUrl: dataUrl
            });
            dom_utils_1.preloadImage(dataUrl)
                .then(result => {
                this.setState({
                    imageSize: {
                        width: result.width,
                        height: result.height
                    }
                });
            });
            setTimeout(() => {
                this.updateImagePageRect();
            }, 1000);
        });
    }
    cornerPosition(rect) {
        const required = {
            width: 50,
            height: 20
        };
        const horizon = rect.x < required.width ? 'right' : 'left';
        const vertical = rect.y < required.height ? 'bottom' : 'top';
        return vertical + '-' + horizon;
    }
    ocrMatchStyle(pw, match) {
        const { scale } = this.state;
        const styleByType = (() => {
            switch (match.highlight) {
                case types_2.OcrHighlightType.Identified:
                    return {
                        color: 'rgba(255, 0, 0, 1)',
                        backgroundColor: 'rgba(200, 200, 200, 0.75)'
                    };
                case types_2.OcrHighlightType.Matched:
                    return {
                        color: '#f00',
                        backgroundColor: 'rgba(255, 215, 15, 0.5)'
                    };
                case types_2.OcrHighlightType.TopMatched:
                    return {
                        color: '#fe1492',
                        backgroundColor: 'rgba(255, 215, 15, 0.5)'
                    };
            }
        })();
        return Object.assign({ boxSizing: 'border-box', position: 'absolute', left: `${scale * pw.word.Left}px`, top: `${scale * pw.word.Top}px`, width: `${scale * pw.word.Width}px`, height: `${scale * pw.word.Height}px`, lineHeight: `${scale * pw.word.Height}px`, fontSize: `${scale * pw.word.Height * 0.8}px`, fontWeight: 'bold', textAlign: 'center', pointerEvents: 'none' }, styleByType);
    }
    renderRectForOcrMatch(match) {
        const { scale } = this.state;
        const rect = ocr_1.ocrMatchRect(match);
        const styles = {
            boxSizing: 'border-box',
            position: 'absolute',
            left: `${scale * rect.x}px`,
            top: `${scale * rect.y}px`,
            width: `${scale * rect.width}px`,
            height: `${scale * rect.height}px`,
            border: `2px solid #fe1492`,
            background: `transparent`,
            pointerEvents: 'none',
        };
        return (react_1.default.createElement("div", { style: styles }));
    }
    colorForRectType(rectType) {
        switch (rectType) {
            case types_1.DesktopScreenshot.RectType.Match:
                return 'orange';
            case types_1.DesktopScreenshot.RectType.BestMatch:
                return '#ff0000';
            case types_1.DesktopScreenshot.RectType.Reference:
            case types_1.DesktopScreenshot.RectType.ReferenceOfBestMatch:
                return '#00ff00';
        }
    }
    render() {
        return (react_1.default.createElement("div", { className: "desktop-screenshot-editor" },
            react_1.default.createElement("div", { className: "top-bar" },
                react_1.default.createElement("button", { onClick: () => {
                        this.setState({
                            scale: this.state.scale < 1 ? 1 : 0.5
                        }, () => {
                            setTimeout(() => {
                                this.updateImagePageRect();
                            }, 1000);
                        });
                    } }, this.state.scale < 1 ? 'Show Original Size' : 'Show 50%'),
                react_1.default.createElement("button", { disabled: this.state.mode === types_1.DesktopScreenshot.RequestType.Capture, onClick: () => {
                        this.resetToMode(types_1.DesktopScreenshot.RequestType.Capture)
                            .then(() => this.selectAreaOnImage())
                            .then(dataUrl => {
                            if (dataUrl)
                                return csIpc.ask('DESKTOP_EDITOR_ADD_VISION_IMAGE', { dataUrl });
                        });
                    } }, this.state.mode === types_1.DesktopScreenshot.RequestType.Capture ? 'Selecting...' : 'Select Image')),
            react_1.default.createElement("div", { className: "editing-area" },
                this.state.imageUrl.length > 0 ? (react_1.default.createElement("img", { ref: (ref) => { this.$image = ref; }, style: {
                        width: screen.width * this.state.scale + 'px',
                        height: screen.height * this.state.scale + 'px',
                    }, src: this.state.imageUrl })) : null,
                react_1.default.createElement("div", { className: "highlight-rect-list" }, this.state.rects.map((rect, i) => (react_1.default.createElement("div", { key: i, style: {
                        top: (rect.y * this.state.scale) + 'px',
                        left: (rect.x * this.state.scale) + 'px',
                        width: (rect.width * this.state.scale) + 'px',
                        height: (rect.height * this.state.scale) + 'px',
                        border: `1px solid ${this.colorForRectType(rect.type)}`,
                        color: this.colorForRectType(rect.type)
                    }, className: "highlight-rect" },
                    react_1.default.createElement("div", { className: utils_1.cn('score', this.cornerPosition(rect)) }, rect.text
                        ? (rect.text + (this.state.rects.length > 1 ? `#${rect.index + 1}` : ''))
                        : ((rect.score !== undefined ? rect.score.toFixed(2) : '') + `#${rect.index + 1}`)))))),
                react_1.default.createElement("div", { className: "ocr-match-list" }, this.state.ocrMatches.map((match, i) => (react_1.default.createElement("div", { key: i },
                    match.words.map((pw, j) => (react_1.default.createElement("div", { key: j, style: this.ocrMatchStyle(pw, match), className: "ocr-match" }, pw.word.WordText))),
                    match.highlight === types_2.OcrHighlightType.TopMatched ? (this.renderRectForOcrMatch(match)) : null)))))));
    }
}


/***/ }),

/***/ 1074:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1075);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(121)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 1075:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(120)(undefined);
// imports


// module
exports.push([module.i, "body{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}#root{-webkit-box-flex:1;-ms-flex:1;flex:1;min-width:100%;min-height:100%}.desktop-screenshot-editor{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column;min-height:100%}.desktop-screenshot-editor,.desktop-screenshot-editor .top-bar{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-direction:normal}.desktop-screenshot-editor .top-bar{position:fixed;z-index:2;top:0;left:0;right:0;height:54px;background:#007bff;-webkit-box-orient:horizontal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:default}.desktop-screenshot-editor .top-bar button{margin-left:20px;padding:0 20px;height:40px;line-height:40px;border:1px solid #fff;border-radius:4px;font-size:14px;color:#fff;background:transparent;cursor:pointer;-webkit-transition:all .3s ease;transition:all .3s ease}.desktop-screenshot-editor .top-bar button:hover{background:#fefefe;color:#007bff}.desktop-screenshot-editor .top-bar button[disabled]{background:hsla(0,0%,100%,.5);color:#fff;cursor:not-allowed}.desktop-screenshot-editor .editing-area{-webkit-box-flex:1;-ms-flex:1;flex:1;position:relative;z-index:1;margin-top:54px;width:100%;min-height:calc(100% - 54px);background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABaWlrMzMz////nPAkwAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+IDGRUHMxeV5KYAAAAXSURBVAjXY1i16v9/BiKI//9XrSKCAABNyDUhZP4pqwAAAABJRU5ErkJggg==);background-repeat:repeat}.desktop-screenshot-editor .editing-area img{display:block}.desktop-screenshot-editor .editing-area .highlight-rect{position:absolute;z-index:110001;pointer-events:none;font-size:14px}.desktop-screenshot-editor .editing-area .highlight-rect .score{position:absolute;width:200px}.desktop-screenshot-editor .editing-area .highlight-rect .score.top-left{top:0;left:0;-webkit-transform:translate(-100%,-100%);transform:translate(-100%,-100%);text-align:right}.desktop-screenshot-editor .editing-area .highlight-rect .score.top-right{top:0;right:0;-webkit-transform:translate(100%,-100%);transform:translate(100%,-100%)}.desktop-screenshot-editor .editing-area .highlight-rect .score.bottom-right{bottom:0;right:0;-webkit-transform:translate(100%,100%);transform:translate(100%,100%)}.desktop-screenshot-editor .editing-area .highlight-rect .score.bottom-left{bottom:0;left:0;-webkit-transform:translate(-100%,100%);transform:translate(-100%,100%);text-align:right}", ""]);

// exports


/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OCRExitCode;
(function (OCRExitCode) {
    OCRExitCode[OCRExitCode["AllParsed"] = 1] = "AllParsed";
    OCRExitCode[OCRExitCode["PartiallyParsed"] = 2] = "PartiallyParsed";
    OCRExitCode[OCRExitCode["Failed"] = 3] = "Failed";
    OCRExitCode[OCRExitCode["Fatal"] = 4] = "Fatal";
})(OCRExitCode = exports.OCRExitCode || (exports.OCRExitCode = {}));
var FileParseExitCode;
(function (FileParseExitCode) {
    FileParseExitCode[FileParseExitCode["FileNotFound"] = 0] = "FileNotFound";
    FileParseExitCode[FileParseExitCode["Success"] = 1] = "Success";
    FileParseExitCode[FileParseExitCode["ParseError"] = -10] = "ParseError";
    FileParseExitCode[FileParseExitCode["Timeout"] = -20] = "Timeout";
    FileParseExitCode[FileParseExitCode["ValidationError"] = -30] = "ValidationError";
    FileParseExitCode[FileParseExitCode["UnknownError"] = -99] = "UnknownError";
})(FileParseExitCode = exports.FileParseExitCode || (exports.FileParseExitCode = {}));
var OcrHighlightType;
(function (OcrHighlightType) {
    OcrHighlightType[OcrHighlightType["Identified"] = 0] = "Identified";
    OcrHighlightType[OcrHighlightType["Matched"] = 1] = "Matched";
    OcrHighlightType[OcrHighlightType["TopMatched"] = 2] = "TopMatched";
})(OcrHighlightType = exports.OcrHighlightType || (exports.OcrHighlightType = {}));


/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(__webpack_require__(11));
const oldSetTimeout = window.setTimeout;
const oldClearTimeout = window.clearTimeout;
const oldSetInterval = window.setInterval;
const oldClearInterval = window.clearInterval;
function uid() {
    return Math.floor(Math.random() * 1e8);
}
function polyfillTimeoutFunctions(csIpc) {
    const timeoutRecords = {};
    function createSetTimeoutViaBackground(identity) {
        const id = identity !== null && identity !== void 0 ? identity : uid();
        return function setTimeoutViaBackground(fn, timeout = 0, ...args) {
            timeoutRecords[id] = true;
            csIpc.ask('TIMEOUT', { id, timeout }).then((identity) => {
                if (!timeoutRecords[identity]) {
                    return;
                }
                fn(...args);
            })
                .catch((e) => {
                log_1.default.error('Error in setTimeout', e.stack);
            });
            return id;
        };
    }
    function clearTimeoutViaBackground(id) {
        delete timeoutRecords[id];
    }
    // Call both native setTimeout and setTimeoutViaBackground
    // and take the first one resolved
    function smartSetTimeout(fn, timeout = 0, ...args) {
        let done = false;
        const wrappedFn = (...args) => {
            if (done) {
                return null;
            }
            done = true;
            return fn(...args);
        };
        const id = oldSetTimeout(wrappedFn, timeout, ...args);
        createSetTimeoutViaBackground(id)(wrappedFn, timeout, ...args);
        return id;
    }
    const intervalRecords = {};
    function smartSetInterval(fn, timeout = 0, ...args) {
        const id = uid();
        const wrappedFn = () => {
            if (!intervalRecords[id]) {
                return;
            }
            smartSetTimeout(wrappedFn, timeout);
            fn(...args);
        };
        intervalRecords[id] = true;
        smartSetTimeout(wrappedFn, timeout);
        return id;
    }
    function clearIntervalViaBackground(id) {
        delete intervalRecords[id];
    }
    const runBoth = (f1, f2) => {
        return (...args) => {
            f1(...args);
            f2(...args);
        };
    };
    window.setTimeout = smartSetTimeout;
    window.clearTimeout = runBoth(clearTimeoutViaBackground, oldClearTimeout);
    window.setInterval = smartSetInterval;
    window.clearInterval = clearIntervalViaBackground;
}
exports.polyfillTimeoutFunctions = polyfillTimeoutFunctions;


/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var idb_filesystem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(329);
/* harmony import */ var idb_filesystem_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(idb_filesystem_js__WEBPACK_IMPORTED_MODULE_0__);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



var fs = function () {
  var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  if (!requestFileSystem) {
    throw new Error('requestFileSystem not supported');
  }

  var dumbSize = 1024 * 1024;
  var maxSize = 5 * 1024 * 1024;
  var getFS = function getFS(size) {
    size = size || maxSize;

    return new Promise(function (resolve, reject) {
      requestFileSystem(window.TEMPORARY, size, resolve, reject);
    });
  };

  var getDirectory = function getDirectory(dir, shouldCreate, fs) {
    var parts = (Array.isArray(dir) ? dir : dir.split('/')).filter(function (p) {
      return p && p.length;
    });
    var getDir = function getDir(parts, directoryEntry) {
      if (!parts || !parts.length) return Promise.resolve(directoryEntry);

      return new Promise(function (resolve, reject) {
        directoryEntry.getDirectory(parts[0], { create: !!shouldCreate }, function (dirEntry) {
          return resolve(dirEntry);
        }, function (e) {
          return reject(e);
        });
      }).then(function (entry) {
        return getDir(parts.slice(1), entry);
      });
    };

    var pFS = fs ? Promise.resolve(fs) : getFS(dumbSize);
    return pFS.then(function (fs) {
      return getDir(parts, fs.root);
    });
  };

  var ensureDirectory = function ensureDirectory(dir, fs) {
    return getDirectory(dir, true, fs);
  };

  var rmdir = function rmdir(dir, fs) {
    return getDirectory(dir, false, fs).then(function (directoryEntry) {
      return new Promise(function (resolve, reject) {
        directoryEntry.remove(resolve, reject);
      });
    });
  };

  var rmdirR = function rmdirR(dir, fs) {
    return getDirectory(dir, false, fs).then(function (directoryEntry) {
      return new Promise(function (resolve, reject) {
        return directoryEntry.removeRecursively(resolve, reject);
      });
    });
  };

  // @return a Promise of [FileSystemEntries]
  var list = function list() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    return getFS(dumbSize).then(function (fs) {
      return new Promise(function (resolve, reject) {
        getDirectory(dir).then(function (dirEntry) {
          var result = [];
          var dirReader = dirEntry.createReader();
          var read = function read() {
            dirReader.readEntries(function (entries) {
              if (entries.length === 0) {
                resolve(result.sort());
              } else {
                result = result.concat(Array.from(entries));
                read();
              }
            }, reject);
          };

          read();
        }).catch(reject);
      });
    }).catch(function (e) {
      console.warn('list', e.code, e.name, e.message);
      throw e;
    });
  };

  var fileLocator = function fileLocator(filePath, fs) {
    var parts = filePath.split('/');
    return getDirectory(parts.slice(0, -1), false, fs).then(function (directoryEntry) {
      return {
        directoryEntry: directoryEntry,
        fileName: parts.slice(-1)[0]
      };
    });
  };

  var readFile = function readFile(filePath, type) {
    if (['ArrayBuffer', 'BinaryString', 'DataURL', 'Text'].indexOf(type) === -1) {
      throw new Error('invalid readFile type, \'' + type + '\'');
    }

    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref) {
        var directoryEntry = _ref.directoryEntry,
            fileName = _ref.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, {}, function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();

              reader.onerror = reject;
              reader.onloadend = function () {
                resolve(this.result);
              };

              switch (type) {
                case 'ArrayBuffer':
                  return reader.readAsArrayBuffer(file);
                case 'BinaryString':
                  return reader.readAsBinaryString(file);
                case 'DataURL':
                  return reader.readAsDataURL(file);
                case 'Text':
                  return reader.readAsText(file);
                default:
                  throw new Error('unsupported data type, \'' + type);
              }
            }, reject);
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('readFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var writeFile = function writeFile(filePath, blob, size) {
    return getFS(size).then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref2) {
        var directoryEntry = _ref2.directoryEntry,
            fileName = _ref2.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                return resolve(fileEntry.toURL());
              };
              fileWriter.onerror = reject;

              fileWriter.write(blob);
            });
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn(e.code, e.name, e.message);
      throw e;
    });
  };

  var removeFile = function removeFile(filePath) {
    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref3) {
        var directoryEntry = _ref3.directoryEntry,
            fileName = _ref3.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.remove(resolve, reject);
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('removeFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var moveFile = function moveFile(srcPath, targetPath) {
    return getFS().then(function (fs) {
      return Promise.all([fileLocator(srcPath, fs), fileLocator(targetPath, fs)]).then(function (tuple) {
        var srcDirEntry = tuple[0].directoryEntry;
        var srcFileName = tuple[0].fileName;
        var tgtDirEntry = tuple[1].directoryEntry;
        var tgtFileName = tuple[1].fileName;

        return new Promise(function (resolve, reject) {
          srcDirEntry.getFile(srcFileName, {}, function (fileEntry) {
            try {
              fileEntry.moveTo(tgtDirEntry, tgtFileName, resolve, reject);
            } catch (e) {
              // Note: For firefox, we use `idb.filesystem.js`, but it hasn't implemented `moveTo` method
              // so we have to mock it with read / write / remove
              readFile(srcPath, 'ArrayBuffer').then(function (arrayBuffer) {
                return writeFile(targetPath, new Blob([new Uint8Array(arrayBuffer)]));
              }).then(function () {
                return removeFile(srcPath);
              }).then(resolve, reject);
            }
          }, reject);
        });
      });
    });
  };

  var copyFile = function copyFile(srcPath, targetPath) {
    return getFS().then(function (fs) {
      return Promise.all([fileLocator(srcPath, fs), fileLocator(targetPath, fs)]).then(function (tuple) {
        var srcDirEntry = tuple[0].directoryEntry;
        var srcFileName = tuple[0].fileName;
        var tgtDirEntry = tuple[1].directoryEntry;
        var tgtFileName = tuple[1].fileName;

        return new Promise(function (resolve, reject) {
          srcDirEntry.getFile(srcFileName, {}, function (fileEntry) {
            try {
              fileEntry.copyTo(tgtDirEntry, tgtFileName, resolve, reject);
            } catch (e) {
              // Note: For firefox, we use `idb.filesystem.js`, but it hasn't implemented `copyTo` method
              // so we have to mock it with read / write
              readFile(srcPath, 'ArrayBuffer').then(function (arrayBuffer) {
                return writeFile(targetPath, new Blob([new Uint8Array(arrayBuffer)]));
              }).then(resolve, reject);
            }
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('copyFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var getMetadata = function getMetadata(filePath) {
    var isDirectory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return getFS().then(function (fs) {
      if (filePath.getMetadata) {
        return new Promise(function (resolve, reject) {
          return filePath.getMetadata(resolve);
        });
      }

      return fileLocator(filePath, fs).then(function (_ref4) {
        var directoryEntry = _ref4.directoryEntry,
            fileName = _ref4.fileName;

        return new Promise(function (resolve, reject) {
          var args = [fileName, { create: false }, function (entry) {
            entry.getMetadata(resolve);
          }, reject];

          if (isDirectory) {
            directoryEntry.getDirectory.apply(directoryEntry, args);
          } else {
            directoryEntry.getFile.apply(directoryEntry, args);
          }
        });
      });
    }).catch(function (e) {
      console.warn('getMetadata', e.code, e.name, e.message);
      throw e;
    });
  };

  var existsStat = function existsStat(entryPath) {
    return getFS().then(function (fs) {
      return fileLocator(entryPath, fs).then(function (_ref5) {
        var directoryEntry = _ref5.directoryEntry,
            fileName = _ref5.fileName;

        var isSomeEntry = function isSomeEntry(getMethodName) {
          return new Promise(function (resolve) {
            directoryEntry[getMethodName](fileName, { create: false }, function (data) {
              resolve(true);
            }, function () {
              return resolve(false);
            });
          });
        };

        var pIsFile = isSomeEntry('getFile');
        var pIsDir = isSomeEntry('getDirectory');

        return Promise.all([pIsFile, pIsDir]).then(function (_ref6) {
          var _ref7 = _slicedToArray(_ref6, 2),
              isFile = _ref7[0],
              isDirectory = _ref7[1];

          return {
            isFile: isFile,
            isDirectory: isDirectory
          };
        });
      });
    }).catch(function (e) {
      // DOMException.NOT_FOUND_ERR === 8
      if (e && e.code === 8) {
        return {
          isFile: false,
          isDirectory: false
        };
      }

      console.warn('fs.exists', e.code, e.name, e.message);
      throw e;
    });
  };

  var exists = function exists(entryPath) {
    var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref8.type;

    return existsStat(entryPath).then(function (stat) {
      switch (type) {
        case 'file':
          return stat.isFile;

        case 'directory':
          return stat.isDirectory;

        default:
          return stat.isFile || stat.isDirectory;
      }
    });
  };

  return {
    list: list,
    readFile: readFile,
    writeFile: writeFile,
    removeFile: removeFile,
    moveFile: moveFile,
    copyFile: copyFile,
    getDirectory: getDirectory,
    getMetadata: getMetadata,
    ensureDirectory: ensureDirectory,
    exists: exists,
    existsStat: existsStat,
    rmdir: rmdir,
    rmdirR: rmdirR
  };
}();

// For test only
window.fs = fs;

/* harmony default export */ __webpack_exports__["default"] = (fs);

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(__webpack_require__(93));
const browser_filesystem_storage_1 = __webpack_require__(136);
const native_filesystem_storage_1 = __webpack_require__(138);
const ts_utils_1 = __webpack_require__(12);
const xfile_1 = __webpack_require__(33);
const convert_utils_1 = __webpack_require__(53);
const convert_suite_utils_1 = __webpack_require__(70);
const utils_1 = __webpack_require__(4);
const path_1 = __importDefault(__webpack_require__(29));
var StorageStrategyType;
(function (StorageStrategyType) {
    StorageStrategyType["Browser"] = "browser";
    StorageStrategyType["XFile"] = "xfile";
    StorageStrategyType["Nil"] = "nil";
})(StorageStrategyType = exports.StorageStrategyType || (exports.StorageStrategyType = {}));
var StorageTarget;
(function (StorageTarget) {
    StorageTarget[StorageTarget["Macro"] = 0] = "Macro";
    StorageTarget[StorageTarget["TestSuite"] = 1] = "TestSuite";
    StorageTarget[StorageTarget["CSV"] = 2] = "CSV";
    StorageTarget[StorageTarget["Screenshot"] = 3] = "Screenshot";
    StorageTarget[StorageTarget["Vision"] = 4] = "Vision";
})(StorageTarget = exports.StorageTarget || (exports.StorageTarget = {}));
var StorageManagerEvent;
(function (StorageManagerEvent) {
    StorageManagerEvent["StrategyTypeChanged"] = "StrategyTypeChanged";
    StorageManagerEvent["RootDirChanged"] = "RootDirChanged";
    StorageManagerEvent["ForceReload"] = "ForceReload";
})(StorageManagerEvent = exports.StorageManagerEvent || (exports.StorageManagerEvent = {}));
class StorageManager extends eventemitter3_1.default {
    constructor(strategyType, extraOptions) {
        super();
        this.strategyType = StorageStrategyType.Nil;
        this.getMacros = () => [];
        this.getMaxMacroCount = (s) => Promise.resolve(Infinity);
        this.setCurrentStrategyType(strategyType);
        if (extraOptions && extraOptions.getMacros) {
            this.getMacros = extraOptions.getMacros;
        }
        if (extraOptions && extraOptions.getMaxMacroCount) {
            this.getMaxMacroCount = extraOptions.getMaxMacroCount;
        }
        this.getConfig = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.getConfig;
    }
    isXFileMode() {
        return this.strategyType === StorageStrategyType.XFile;
    }
    isBrowserMode() {
        return this.strategyType === StorageStrategyType.Browser;
    }
    getCurrentStrategyType() {
        return this.strategyType;
    }
    setCurrentStrategyType(type) {
        const needChange = type !== this.strategyType;
        if (needChange) {
            setTimeout(() => {
                this.emit(StorageManagerEvent.StrategyTypeChanged, type);
            }, 0);
            this.strategyType = type;
        }
        return needChange;
    }
    isStrategyTypeAvailable(type) {
        switch (type) {
            case StorageStrategyType.Browser:
                return Promise.resolve(true);
            case StorageStrategyType.XFile:
                return xfile_1.getXFile().sanityCheck();
            default:
                throw new Error(`type '${type}' is not supported`);
        }
    }
    getStorageForTarget(target, forceStrategytype) {
        switch (forceStrategytype || this.strategyType) {
            case StorageStrategyType.Browser: {
                switch (target) {
                    case StorageTarget.Macro: {
                        const storage = browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'macros',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                const obj = convert_utils_1.fromJSONString(text, path_1.default.basename(filePath), { withStatus: true });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (data, fileName) => {
                                var _a, _b;
                                const str = convert_utils_1.toJSONString(Object.assign(Object.assign({}, data), { commands: data.data.commands }), {
                                    withStatus: true,
                                    ignoreTargetOptions: !!((_b = (_a = this.getConfig) === null || _a === void 0 ? void 0 : _a.call(this)) === null || _b === void 0 ? void 0 : _b.saveAlternativeLocators)
                                });
                                // Note: BrowserFileSystemStorage only supports writing file with Blob
                                // so have to convert it here in `encode`
                                return new Blob([str]);
                            }
                        });
                        window.newMacroStorage = storage;
                        return storage;
                    }
                    case StorageTarget.TestSuite: {
                        const storage = browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'testsuites',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                console.log('test suite raw content', filePath, text, this.getMacros());
                                const obj = convert_suite_utils_1.parseTestSuite(text, { fileName: path_1.default.basename(filePath) });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (suite, fileName) => {
                                const str = convert_suite_utils_1.stringifyTestSuite(suite);
                                return new Blob([str]);
                            }
                        });
                        window.newTestSuiteStorage = storage;
                        return storage;
                    }
                    case StorageTarget.CSV:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'spreadsheets',
                            extensions: ['csv'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                    case StorageTarget.Screenshot:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'screenshots',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                    case StorageTarget.Vision:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'visions',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                }
            }
            case StorageStrategyType.XFile: {
                const { rootDir } = xfile_1.getXFile().getCachedConfig();
                switch (target) {
                    case StorageTarget.Macro: {
                        const storage = native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'macros',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            listFilter: (entryNodes) => {
                                return this.getMaxMacroCount(this.strategyType)
                                    .then(maxCount => {
                                    return ts_utils_1.forestSlice(maxCount, entryNodes);
                                });
                            },
                            decode: (text, filePath) => {
                                const obj = convert_utils_1.fromJSONString(text, path_1.default.basename(filePath), { withStatus: true });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (data, fileName) => {
                                const str = convert_utils_1.toJSONString(Object.assign(Object.assign({}, data), { commands: data.data.commands }), { withStatus: true });
                                // Note: NativeFileSystemStorage only supports writing file with DataURL
                                // so have to convert it here in `encode`
                                return utils_1.blobToDataURL(new Blob([str]));
                            }
                        });
                        return storage;
                    }
                    case StorageTarget.TestSuite: {
                        const storage = native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'testsuites',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                const obj = convert_suite_utils_1.parseTestSuite(text, { fileName: path_1.default.basename(filePath) });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (suite, fileName) => {
                                const str = convert_suite_utils_1.stringifyTestSuite(suite);
                                return utils_1.blobToDataURL(new Blob([str]));
                            }
                        });
                        return storage;
                    }
                    case StorageTarget.CSV:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'datasources',
                            extensions: ['csv'],
                            shouldKeepExt: true,
                            allowAbsoluteFilePath: true,
                            encode: ((text, fileName) => {
                                return utils_1.blobToDataURL(new Blob([text]));
                            })
                        });
                    case StorageTarget.Vision:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'images',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            decode: xFileDecodeImage,
                            encode: ((imageBlob, fileName) => {
                                return utils_1.blobToDataURL(imageBlob);
                            })
                        });
                    case StorageTarget.Screenshot:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'screenshots',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            decode: xFileDecodeImage,
                            encode: ((imageBlob, fileName) => {
                                return utils_1.blobToDataURL(imageBlob);
                            })
                        });
                }
            }
            default:
                throw new Error(`Unsupported strategy type: '${this.strategyType}'`);
        }
    }
    getMacroStorage() {
        return this.getStorageForTarget(StorageTarget.Macro);
    }
    getTestSuiteStorage() {
        return this.getStorageForTarget(StorageTarget.TestSuite);
    }
    getCSVStorage() {
        return this.getStorageForTarget(StorageTarget.CSV);
    }
    getVisionStorage() {
        return this.getStorageForTarget(StorageTarget.Vision);
    }
    getScreenshotStorage() {
        return this.getStorageForTarget(StorageTarget.Screenshot);
    }
}
exports.StorageManager = StorageManager;
function xFileDecodeImage(data, fileName, readFileType) {
    if (readFileType !== 'DataURL') {
        return data;
    }
    if (data.substr(0, 11) === 'data:image') {
        return data;
    }
    return 'data:image/png;base64,' + data;
}
// Note: in panel window (`src/index.js`), `getStorageManager` is provided with `getMacros` in `extraOptions`
// While in `bg.js` or `csv_edtior.js`, `vision_editor.js`, `extraOptions` is omitted with no harm,
// because they don't read/write test suites
exports.getStorageManager = ts_utils_1.singletonGetter((strategyType, extraOptions) => {
    return new StorageManager(strategyType || StorageStrategyType.XFile, extraOptions);
});


/***/ }),

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standard_storage_1 = __webpack_require__(101);
const filesystem_1 = __importDefault(__webpack_require__(118));
const path_1 = __webpack_require__(29);
const utils_1 = __webpack_require__(4);
const dom_utils_1 = __webpack_require__(22);
const web_extension_1 = __importDefault(__webpack_require__(10));
const ts_utils_1 = __webpack_require__(12);
class BrowserFileSystemStandardStorage extends standard_storage_1.StandardStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode
        });
        this.transformFileName = (path) => path;
        const { extensions, shouldKeepExt, transformFileName, baseDir = 'share' } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        if (transformFileName) {
            this.transformFileName = transformFileName;
        }
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        // Note: create the folder in which we will store files
        filesystem_1.default.getDirectory(baseDir, true);
    }
    getLink(filePath) {
        if (!dom_utils_1.isFirefox()) {
            const tmp = web_extension_1.default.extension.getURL('temporary');
            const link = `filesystem:${tmp}/${this.filePath(filePath)}`;
            return Promise.resolve(link + '?' + new Date().getTime());
        }
        else {
            // Note: Except for Chrome, the filesystem API we use is a polyfill from idb.filesystem.js
            // idb.filesystem.js works great but the only problem is that you can't use 'filesystem:' schema to retrieve that file
            // so here, we have to convert the file to data url
            return this.read(filePath, 'DataURL');
        }
    }
    read(filePath, type) {
        const fullPath = this.filePath(filePath);
        const relativePath = path_1.posix.relative(this.dirPath('/'), fullPath);
        return filesystem_1.default.readFile(fullPath, type)
            .then(intermediate => this.decode(intermediate, relativePath, type), error => {
            if (error.message.indexOf("A requested file or directory could not be found") !== -1) {
                throw new Error(`File not found: ${filePath}`);
            }
            return Promise.reject(error);
        });
    }
    stat(entryPath, isDir) {
        const name = path_1.posix.basename(entryPath);
        const dir = path_1.posix.dirname(entryPath);
        const fullPath = isDir ? this.dirPath(entryPath) : this.filePath(entryPath);
        const relativePath = path_1.posix.relative(this.dirPath('/'), fullPath);
        return filesystem_1.default.existsStat(fullPath)
            .then(({ isFile, isDirectory }) => {
            // Note: idb.filesystem.js (we use it as polyfill for firefox) doesn't support getMetadata on folder yet
            // so we simply set size/lastModified to empty value for now.
            if (!isFile) {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile,
                    isDirectory,
                    size: 0,
                    lastModified: new Date(0)
                };
            }
            return filesystem_1.default.getMetadata(fullPath, isDirectory)
                .then((meta) => {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile,
                    isDirectory,
                    size: meta.size,
                    lastModified: meta.modificationTime
                };
            });
        });
    }
    __list(directoryPath = '/', brief = false) {
        // TODO: Ignore brief param for browser fs for now
        const convertName = (entryName, isDirectory) => {
            return this.shouldKeepExt || isDirectory ? entryName : this.removeExt(entryName);
        };
        return this.ensureBaseDir()
            .then(() => filesystem_1.default.list(this.dirPath(directoryPath)))
            .then(fileEntries => {
            const ps = fileEntries.map(fileEntry => {
                return this.stat(fileEntry.fullPath, fileEntry.isDirectory)
                    .then((stat) => (Object.assign(Object.assign({}, stat), { name: this.transformFileName(convertName(stat.name, fileEntry.isDirectory)) })));
            });
            return Promise.all(ps)
                .then(list => {
                list.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                });
                this.totalCount = list.length;
                this.displayedCount = list.length;
                return list;
            });
        });
    }
    __write(filePath, content) {
        return this.ensureBaseDir()
            .then(() => this.remove(filePath))
            .catch(() => { })
            .then(() => this.encode(content, filePath))
            .then((encodedContent) => filesystem_1.default.writeFile(this.filePath(filePath, true), encodedContent))
            .then(() => { });
    }
    __overwrite(filePath, content) {
        return this.__write(filePath, content);
    }
    __removeFile(filePath) {
        return filesystem_1.default.removeFile(this.filePath(filePath));
    }
    __removeEmptyDirectory(directoryPath) {
        return filesystem_1.default.rmdir(this.dirPath(directoryPath));
    }
    __moveFile(filePath, newPath) {
        return filesystem_1.default.moveFile(this.filePath(filePath), this.filePath(newPath, true))
            .then(() => { });
    }
    __copyFile(filePath, newPath) {
        return filesystem_1.default.copyFile(this.filePath(filePath), this.filePath(newPath, true))
            .then(() => { });
    }
    __createDirectory(directoryPath) {
        return filesystem_1.default.getDirectory(this.dirPath(directoryPath, true), true)
            .then(() => { });
    }
    dirPath(dir, shouldSanitize = false) {
        const path = this.getPathLib();
        const absPath = (() => {
            if (this.isStartWithBaseDir(dir)) {
                return dir;
            }
            else {
                return path.join('/', this.baseDir, dir);
            }
        })();
        const dirName = path.dirname(absPath);
        const baseName = path.basename(absPath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        return path.join(dirName, sanitized);
    }
    isWin32Path() {
        return false;
    }
    filePath(filePath, shouldSanitize = false) {
        const dirName = path_1.posix.dirname(filePath);
        const baseName = path_1.posix.basename(filePath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        const existingExt = path_1.posix.extname(baseName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        if (this.isStartWithBaseDir(dirName)) {
            return path_1.posix.join(dirName, this.transformFileName(finalFileName));
        }
        else {
            return path_1.posix.join('/', this.baseDir, dirName, this.transformFileName(finalFileName));
        }
    }
    isStartWithBaseDir(str) {
        return str.indexOf('/' + this.baseDir) === 0;
    }
    ensureBaseDir() {
        return filesystem_1.default.ensureDirectory(this.baseDir)
            .then(() => { });
    }
    removeExt(fileNameWithExt) {
        const name = path_1.posix.basename(fileNameWithExt);
        const ext = path_1.posix.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
}
exports.BrowserFileSystemStandardStorage = BrowserFileSystemStandardStorage;
exports.getBrowserFileSystemStandardStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return (opts && opts.baseDir) || 'share';
}, (opts) => {
    return new BrowserFileSystemStandardStorage(opts);
});


/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ts_utils_1 = __webpack_require__(12);
// reference: https://nodejs.org/api/errors.html#errors_common_system_errors
exports.EACCES = ts_utils_1.errorClassFactory('EACCES');
exports.EEXIST = ts_utils_1.errorClassFactory('EEXIST');
exports.EISDIR = ts_utils_1.errorClassFactory('EISDIR');
exports.EMFILE = ts_utils_1.errorClassFactory('EMFILE');
exports.ENOENT = ts_utils_1.errorClassFactory('ENOENT');
exports.ENOTDIR = ts_utils_1.errorClassFactory('ENOTDIR');
exports.ENOTEMPTY = ts_utils_1.errorClassFactory('ENOTEMPTY');


/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(__webpack_require__(29));
const standard_storage_1 = __webpack_require__(101);
const utils_1 = __webpack_require__(4);
const filesystem_1 = __webpack_require__(69);
const native_filesystem_storage_1 = __webpack_require__(143);
const ts_utils_1 = __webpack_require__(12);
class NativeFileSystemStandardStorage extends standard_storage_1.StandardStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode,
            listFilter: opts.listFilter
        });
        const { baseDir, rootDir, extensions, shouldKeepExt = false, allowAbsoluteFilePath = false } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        this.rootDir = rootDir;
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        this.allowAbsoluteFilePath = allowAbsoluteFilePath;
        this.fs = filesystem_1.getNativeFileSystemAPI();
    }
    getLink(fileName) {
        return this.read(fileName, 'DataURL');
    }
    read(filePath, type) {
        const fullPath = this.filePath(filePath);
        const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
        const onResolve = (res) => {
            if (res.errorCode !== 0 /* Succeeded */) {
                throw new native_filesystem_storage_1.ErrorWithCode(`${filePath}: ` + native_filesystem_storage_1.getErrorMessageForCode(res.errorCode), res.errorCode);
            }
            const rawContent = res.content;
            const intermediate = (() => {
                switch (type) {
                    case 'Text':
                    case 'DataURL':
                        return rawContent;
                    case 'ArrayBuffer':
                        return utils_1.dataURItoArrayBuffer(rawContent);
                    case 'BinaryString':
                        return utils_1.arrayBufferToString(utils_1.dataURItoArrayBuffer(rawContent));
                }
            })();
            return this.decode(intermediate, relativePath, type);
        };
        switch (type) {
            case 'Text':
                return this.fs.readAllTextCompat({
                    path: fullPath
                })
                    .then(onResolve);
            default:
                return this.fs.readAllBytesCompat({
                    path: fullPath
                })
                    .then(onResolve);
        }
    }
    stat(entryPath, isDirectory) {
        const dir = path_1.default.dirname(entryPath);
        const name = path_1.default.basename(entryPath);
        const fullPath = isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
        const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
        const noEntry = {
            dir,
            name,
            fullPath,
            relativePath,
            isFile: false,
            isDirectory: false,
            lastModified: new Date(0),
            size: 0
        };
        const pExists = isDirectory ? this.fs.directoryExists({ path: fullPath })
            : this.fs.fileExists({ path: fullPath });
        return pExists.then(exists => {
            if (!exists) {
                return noEntry;
            }
            return this.fs.getFileSystemEntryInfo({ path: fullPath })
                .then((info) => {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile: !info.isDirectory,
                    isDirectory: info.isDirectory,
                    lastModified: new Date(info.lastWriteTime),
                    size: info.length
                };
            }, (e) => {
                return noEntry;
            });
        });
    }
    __list(directoryPath = '/', brief = false) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.getEntries({
                brief,
                path: this.dirPath(directoryPath),
                extensions: this.extensions,
            })
                .then(data => {
                const entries = data.entries;
                const errorCode = data.errorCode;
                if (errorCode !== 0 /* Succeeded */) {
                    throw new native_filesystem_storage_1.ErrorWithCode(native_filesystem_storage_1.getErrorMessageForCode(errorCode) + `: ${directoryPath}`, errorCode);
                }
                const convertName = (entryName, isDirectory) => {
                    return this.shouldKeepExt || isDirectory ? entryName : this.removeExt(entryName);
                };
                const convert = (entry) => {
                    const dir = this.dirPath(directoryPath);
                    const name = convertName(entry.name, entry.isDirectory);
                    const fullPath = path_1.default.join(dir, entry.name);
                    const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
                    return {
                        dir,
                        name,
                        fullPath,
                        relativePath,
                        isFile: !entry.isDirectory,
                        isDirectory: entry.isDirectory,
                        lastModified: new Date(entry.lastWriteTime),
                        size: entry.length
                    };
                };
                return entries.map(convert);
            });
        });
    }
    __write(filePath, content) {
        return this.ensureBaseDir()
            .then(() => this.encode(content, filePath))
            .then(encodedContent => {
            return this.fs.writeAllBytes({
                content: encodedContent,
                path: this.filePath(filePath, true),
            })
                .then(result => {
                if (!result) {
                    throw new Error(`Failed to write to '${filePath}'`);
                }
            });
        });
    }
    __overwrite(filePath, content) {
        return this.write(filePath, content);
    }
    __removeFile(filePath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.deleteFile({
                path: this.filePath(filePath)
            })
                .then(() => { });
        });
    }
    __removeEmptyDirectory(directoryPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.removeDirectory({ path: this.dirPath(directoryPath) })
                .then(() => { });
        });
    }
    __moveFile(filePath, newPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.moveFile({
                sourcePath: this.filePath(filePath),
                targetPath: this.filePath(newPath, true)
            })
                .then(() => { });
        });
    }
    __copyFile(filePath, newPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.copyFile({
                sourcePath: this.filePath(filePath),
                targetPath: this.filePath(newPath, true)
            })
                .then(() => { });
        });
    }
    __createDirectory(directoryPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.createDirectory({
                path: this.dirPath(directoryPath, true)
            })
                .then(() => { });
        });
    }
    dirPath(dir, shouldSanitize = false) {
        const path = this.getPathLib();
        const absPath = (() => {
            if (this.isStartWithBaseDir(dir)) {
                return path.normalize(dir);
            }
            else {
                return path.normalize(path.join(this.rootDir, this.baseDir, dir));
            }
        })();
        const dirName = path.dirname(absPath);
        const baseName = path.basename(absPath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        return path.join(dirName, sanitized);
    }
    filePath(filePath, shouldSanitize = false) {
        const dirName = path_1.default.dirname(filePath);
        const baseName = path_1.default.basename(filePath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        const existingExt = path_1.default.extname(baseName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        if (this.isStartWithBaseDir(dirName)) {
            return path_1.default.normalize(path_1.default.join(dirName, finalFileName));
        }
        else if (this.allowAbsoluteFilePath && this.isAbsoluteUrl(filePath)) {
            return path_1.default.normalize(path_1.default.join(dirName, finalFileName));
        }
        else {
            return path_1.default.normalize(path_1.default.join(this.rootDir, this.baseDir, dirName, finalFileName));
        }
    }
    isWin32Path() {
        return /^([A-Z]:\\|\/\/|\\\\)/i.test(this.rootDir);
    }
    isAbsoluteUrl(str) {
        const path = this.getPathLib();
        return path.isAbsolute(str);
    }
    isStartWithBaseDir(str) {
        return str.indexOf(this.rootDir) === 0;
    }
    removeExt(fileNameWithExt) {
        const name = path_1.default.basename(fileNameWithExt);
        const ext = path_1.default.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
    ensureBaseDir() {
        const fs = this.fs;
        const dir = path_1.default.normalize(path_1.default.join(this.rootDir, this.baseDir));
        return fs.directoryExists({
            path: dir
        })
            .then(existed => {
            if (existed)
                return existed;
            return fs.createDirectory({
                path: dir
            });
        })
            .then(() => { });
    }
}
exports.NativeFileSystemStandardStorage = NativeFileSystemStandardStorage;
exports.getNativeFileSystemStandardStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return path_1.default.join(opts.rootDir, opts.baseDir);
}, (opts) => {
    return new NativeFileSystemStandardStorage(opts);
});


/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Non-external method types which the user can use via UI.
 */
exports.PublicMethodTypes = [
    1 /* GetFileSystemEntries */,
    2 /* GetDirectories */,
    3 /* GetFiles */,
    4 /* DirectoryExists */,
    5 /* FileExists */,
    8 /* CreateDirectory */,
    9 /* RemoveDirectory */,
    10 /* CopyFile */,
    11 /* MoveFile */,
    12 /* DeleteFile */,
    13 /* ReadAllText */,
    14 /* WriteAllText */,
    15 /* AppendAllText */,
    16 /* ReadAllBytes */,
    17 /* WriteAllBytes */,
    18 /* AppendAllBytes */
];
exports.MethodTypeFriendlyNames = [
    "GetVersion",
    "GetFileSystemEntries",
    "GetDirectories",
    "GetFiles",
    "GetFileSystemEntryInfo",
    "GetSpecialFolderPath",
    "DirectoryExists",
    "FileExists",
    "CreateDirectory",
    "RemoveDirectory",
    "CopyFile",
    "MoveFile",
    "DeleteFile",
    "ReadAllText",
    "WriteAllText",
    "AppendAllText",
    "ReadAllBytes",
    "WriteAllBytes",
    "AppendAllBytes",
    "GetMaxFileRange",
    "GetFileSize",
    "ReadFileRange",
    "RunProcess"
];
exports.MethodTypeInvocationNames = [
    "get_version",
    "get_file_system_entries",
    "get_directories",
    "get_files",
    "get_file_system_entry_info",
    "get_special_folder_path",
    "directory_exists",
    "file_exists",
    "create_directory",
    "remove_directory",
    "copy_file",
    "move_file",
    "delete_file",
    "read_all_text",
    "write_all_text",
    "append_all_text",
    "read_all_bytes",
    "write_all_bytes",
    "append_all_bytes",
    "get_max_file_range",
    "get_file_size",
    "read_file_range",
    "run_process"
];


/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const native_host_1 = __webpack_require__(105);
class KantuFileAccessHost extends native_host_1.NativeMessagingHost {
    constructor() {
        super(KantuFileAccessHost.HOST_NAME);
    }
}
exports.KantuFileAccessHost = KantuFileAccessHost;
KantuFileAccessHost.HOST_NAME = "com.a9t9.kantu.file_access";


/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Adapted from: http://www.json.org/JSON_checker/utf8_decode.c
Object.defineProperty(exports, "__esModule", { value: true });
class Utf8Decoder {
    constructor(input) {
        this.input = input;
        this.position = 0;
    }
    /**
     * Gets the next byte.
     * @returns UTF8_END if there are no more bytes, next byte otherwise.
     */
    getNextByte() {
        if (this.position >= this.input.length) {
            return Utf8Decoder.END;
        }
        const c = this.input[this.position] & 0xff;
        ++this.position;
        return c;
    }
    /**
     *  Gets the 6-bit payload of the next continuation byte.
     * @returns Contination byte if it's valid, UTF8_ERROR otherwise.
     */
    getNextContinuationByte() {
        const c = this.getNextByte();
        return (c & 0xc0) == 0x80 ? c & 0x3f : Utf8Decoder.ERROR;
    }
    /**
     * Decodes next codepoint.
     * @returns `Utf8Decoder.END` for end of stream, next codepoint if it's valid, `Utf8Decoder.ERROR` otherwise.
     */
    decodeNext() {
        if (this.position >= this.input.length) {
            return this.position === this.input.length
                ? Utf8Decoder.END
                : Utf8Decoder.ERROR;
        }
        const c = this.getNextByte();
        // Zero continuation (0 to 127)
        if ((c & 0x80) == 0) {
            return c;
        }
        // One continuation (128 to 2047)
        if ((c & 0xe0) == 0xc0) {
            const c1 = this.getNextContinuationByte();
            if (c1 >= 0) {
                const r = ((c & 0x1f) << 6) | c1;
                if (r >= 128) {
                    return r;
                }
            }
            // Two continuations (2048 to 55295 and 57344 to 65535)
        }
        else if ((c & 0xf0) == 0xe0) {
            const c1 = this.getNextContinuationByte();
            const c2 = this.getNextContinuationByte();
            if ((c1 | c2) >= 0) {
                const r = ((c & 0x0f) << 12) | (c1 << 6) | c2;
                if (r >= 2048 && (r < 55296 || r > 57343)) {
                    return r;
                }
            }
            // Three continuations (65536 to 1114111)
        }
        else if ((c & 0xf8) == 0xf0) {
            const c1 = this.getNextContinuationByte();
            const c2 = this.getNextContinuationByte();
            const c3 = this.getNextContinuationByte();
            if ((c1 | c2 | c3) >= 0) {
                const r = ((c & 0x07) << 18) | (c1 << 12) | (c2 << 6) | c3;
                if (r >= 65536 && r <= 1114111) {
                    return r;
                }
            }
        }
        return Utf8Decoder.ERROR;
    }
}
Utf8Decoder.REPLACEMENT_CHARACTER = "\uFFFD";
Utf8Decoder.END = -1;
Utf8Decoder.ERROR = -2;
var utf8;
(function (utf8) {
    function isValid(input) {
        const decoder = new Utf8Decoder(input);
        while (true) {
            const cp = decoder.decodeNext();
            switch (cp) {
                case Utf8Decoder.END:
                    return true;
                case Utf8Decoder.ERROR:
                    return false;
                default:
                // ignore
            }
        }
    }
    utf8.isValid = isValid;
    function decode(input) {
        const decoder = new Utf8Decoder(input);
        let output = "";
        while (true) {
            const cp = decoder.decodeNext();
            if (cp === Utf8Decoder.END) {
                break;
            }
            output +=
                cp !== Utf8Decoder.ERROR
                    ? String.fromCodePoint(cp)
                    : Utf8Decoder.REPLACEMENT_CHARACTER;
        }
        return output;
    }
    utf8.decode = decode;
})(utf8 = exports.utf8 || (exports.utf8 = {}));


/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base64;
(function (base64) {
    // prettier-ignore
    const encodingTable = new Uint8Array([
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
    ]);
    // prettier-ignore
    const decodingTable = new Uint8Array([
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ]);
    const paddingChar = 61;
    function calculateEncodedLength(length) {
        let result = Math.trunc(length / 3) * 4;
        result += length % 3 != 0 ? 4 : 0;
        return result;
    }
    function readWord(input, i, maxLength) {
        if (maxLength > 4) {
            throw new Error("maxLength should be in range [0, 4].");
        }
        const t = new Uint8Array(4);
        for (let k = 0; k < maxLength; ++k) {
            const c = input.charCodeAt(i + k);
            const b = decodingTable[c];
            if (b === 0xff) {
                return undefined;
            }
            t[k] = b;
        }
        return ((t[0] << (3 * 6)) +
            (t[1] << (2 * 6)) +
            (t[2] << (1 * 6)) +
            (t[3] << (0 * 6)));
    }
    function writeWord(output, i, triple) {
        output[i + 0] = (triple >> 16) & 0xff;
        output[i + 1] = (triple >> 8) & 0xff;
        output[i + 2] = triple & 0xff;
    }
    function encode(input) {
        const inLen = input.length;
        const outLen = calculateEncodedLength(inLen);
        const lengthMod3 = inLen % 3;
        const calcLength = inLen - lengthMod3;
        const output = new Uint8Array(outLen);
        let i;
        let j = 0;
        for (i = 0; i < calcLength; i += 3) {
            output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
            output[j + 1] =
                encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
            output[j + 2] =
                encodingTable[((input[i + 1] & 0x0f) << 2) | ((input[i + 2] & 0xc0) >> 6)];
            output[j + 3] = encodingTable[input[i + 2] & 0x3f];
            j += 4;
        }
        i = calcLength;
        switch (lengthMod3) {
            case 2: // One character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] =
                    encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
                output[j + 2] = encodingTable[(input[i + 1] & 0x0f) << 2];
                output[j + 3] = paddingChar;
                j += 4;
                break;
            case 1: // Two character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] = encodingTable[(input[i] & 0x03) << 4];
                output[j + 2] = paddingChar;
                output[j + 3] = paddingChar;
                j += 4;
                break;
        }
        const decoder = new TextDecoder("ascii");
        return decoder.decode(output);
    }
    base64.encode = encode;
    function decode(input) {
        const inLen = input.length;
        if (inLen % 4 != 0) {
            return undefined;
        }
        let padding = 0;
        if (inLen > 0 && input.charCodeAt(inLen - 1) == paddingChar) {
            ++padding;
            if (inLen > 1 && input.charCodeAt(inLen - 2) == paddingChar) {
                ++padding;
            }
        }
        const encodedLen = inLen - padding;
        const completeLen = encodedLen & ~3;
        const outLen = (6 * inLen) / 8 - padding;
        const output = new Uint8Array(outLen);
        let triple;
        let i = 0;
        let j = 0;
        while (i < completeLen) {
            triple = readWord(input, i, 4);
            if (typeof triple === "undefined") {
                return undefined;
            }
            writeWord(output, j, triple);
            i += 4;
            j += 3;
        }
        if (padding > 0) {
            triple = readWord(input, i, 4 - padding);
            if (typeof triple === "undefined") {
                return undefined;
            }
            switch (padding) {
                case 1:
                    output[j + 0] = (triple >> 16) & 0xff;
                    output[j + 1] = (triple >> 8) & 0xff;
                    break;
                case 2:
                    output[j + 0] = (triple >> 16) & 0xff;
                    break;
            }
        }
        return output;
    }
    base64.decode = decode;
})(base64 = exports.base64 || (exports.base64 = {}));


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __webpack_require__(80);
const filesystem_1 = __webpack_require__(69);
const path_1 = __importDefault(__webpack_require__(29));
const utils_1 = __webpack_require__(4);
const ts_utils_1 = __webpack_require__(12);
class NativeFileSystemFlatStorage extends storage_1.FlatStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode
        });
        this.listFilter = (list) => list;
        this.displayedCount = 0;
        this.totalCount = 0;
        const { baseDir, rootDir, extensions, shouldKeepExt = false, listFilter } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        this.rootDir = rootDir;
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        if (listFilter) {
            this.listFilter = listFilter;
        }
        this.fs = filesystem_1.getNativeFileSystemAPI();
    }
    getDisplayCount() {
        return this.displayedCount;
    }
    getTotalCount() {
        return this.totalCount;
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list()
            .then(items => {
            return Promise.all(items.map(item => {
                return this.read(item.fileName, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.fileName
                }))
                    // Note: Whenever there is error in reading file,
                    // return null
                    .catch(e => ({
                    fileName: item.fileName,
                    fullFilePath: this.filePath(item.fileName),
                    error: new Error(`Error in parsing ${this.filePath(item.fileName)}:\n${e.message}`)
                }));
            }))
                .then(list => {
                const errorFiles = list.filter(item => item.error);
                if (onErrorFiles)
                    onErrorFiles(errorFiles);
                return list.filter((item) => item.content);
            });
        });
    }
    getLink(fileName) {
        return this.read(fileName, 'DataURL');
    }
    __list() {
        return this.ensureDir()
            .then(() => {
            return this.fs.getEntries({
                path: path_1.default.join(this.rootDir, this.baseDir),
                extensions: this.extensions
            })
                .then(data => {
                const entries = data.entries;
                const errorCode = data.errorCode;
                if (errorCode !== 0 /* Succeeded */) {
                    throw new ErrorWithCode(getErrorMessageForCode(errorCode), errorCode);
                }
                const convertName = (entryName) => this.shouldKeepExt ? entryName : this.removeExt(entryName);
                const convert = (entry) => {
                    return {
                        dir: this.baseDir,
                        fileName: convertName(entry.name),
                        lastModified: new Date(entry.lastWriteTime),
                        size: storage_1.readableSize(entry.length)
                    };
                };
                const allList = entries.map(convert);
                return Promise.resolve(this.listFilter(allList))
                    .then(displayList => {
                    this.totalCount = allList.length;
                    this.displayedCount = displayList.length;
                    return displayList;
                });
            });
        });
    }
    exists(fileName) {
        return this.fs.fileExists({
            path: this.filePath(fileName)
        });
    }
    read(fileName, type) {
        const onResolve = (res) => {
            if (res.errorCode !== 0 /* Succeeded */) {
                throw new ErrorWithCode(`${fileName}: ` + getErrorMessageForCode(res.errorCode), res.errorCode);
            }
            const rawContent = res.content;
            const intermediate = (() => {
                switch (type) {
                    case 'Text':
                    case 'DataURL':
                        return rawContent;
                    case 'ArrayBuffer':
                        return utils_1.dataURItoArrayBuffer(rawContent);
                    case 'BinaryString':
                        return utils_1.arrayBufferToString(utils_1.dataURItoArrayBuffer(rawContent));
                }
            })();
            return this.decode(intermediate, fileName);
        };
        switch (type) {
            case 'Text':
                return this.fs.readAllTextCompat({
                    path: this.filePath(fileName)
                })
                    .then(onResolve);
            default:
                return this.fs.readAllBytesCompat({
                    path: this.filePath(fileName)
                })
                    .then(onResolve);
        }
    }
    __write(fileName, content) {
        return this.ensureDir()
            .then(() => this.encode(content, fileName))
            .then(encodedContent => {
            return this.fs.writeAllBytes({
                content: encodedContent,
                path: this.filePath(fileName, true),
            })
                .then(result => {
                if (!result) {
                    throw new Error(`Failed to write to '${fileName}'`);
                }
            });
        });
    }
    __overwrite(fileName, content) {
        return this.remove(fileName)
            .catch(() => { })
            .then(() => this.write(fileName, content));
    }
    __clear() {
        return this.list()
            .then(list => {
            const ps = list.map(file => {
                return this.remove(file.fileName);
            });
            return Promise.all(ps);
        })
            .then(() => { });
    }
    __remove(fileName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.deleteFile({
                path: this.filePath(fileName)
            })
                .then(() => { });
        });
    }
    __rename(fileName, newName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.moveFile({
                sourcePath: this.filePath(fileName),
                targetPath: this.filePath(newName, true)
            })
                .then(() => { });
        });
    }
    __copy(fileName, newName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.copyFile({
                sourcePath: this.filePath(fileName),
                targetPath: this.filePath(newName, true)
            })
                .then(() => { });
        });
    }
    filePath(fileName, shouldSanitize = false) {
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(fileName) : fileName;
        const existingExt = path_1.default.extname(fileName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        return path_1.default.join(this.rootDir, this.baseDir, finalFileName);
    }
    removeExt(fileNameWithExt) {
        const name = path_1.default.basename(fileNameWithExt);
        const ext = path_1.default.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
    ensureDir() {
        const fs = this.fs;
        const dir = path_1.default.join(this.rootDir, this.baseDir);
        return fs.directoryExists({
            path: dir
        })
            .then(existed => {
            if (existed)
                return existed;
            return fs.createDirectory({
                path: dir
            });
        })
            .then(() => { });
    }
}
exports.NativeFileSystemFlatStorage = NativeFileSystemFlatStorage;
exports.getNativeFileSystemFlatStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return path_1.default.join(opts.rootDir, opts.baseDir);
}, (opts) => {
    return new NativeFileSystemFlatStorage(opts);
});
class ErrorWithCode extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ErrorWithCode';
        this.code = code;
        // Note: better to keep stack trace
        // reference: https://stackoverflow.com/a/32749533/1755633
        let captured = true;
        if (typeof Error.captureStackTrace === 'function') {
            try {
                Error.captureStackTrace(this, this.constructor);
            }
            catch (e) {
                captured = false;
            }
        }
        if (!captured) {
            this.stack = (new Error(message)).stack;
        }
    }
}
exports.ErrorWithCode = ErrorWithCode;
function getErrorMessageForCode(code) {
    switch (code) {
        case 0 /* Succeeded */:
            return 'Success';
        case 1 /* Failed */:
            return 'Failed to load';
        case 2 /* Truncated */:
            return 'File too large to load';
        default:
            return `Unknown error code: ${code}`;
    }
}
exports.getErrorMessageForCode = getErrorMessageForCode;


/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(4);
exports.getStyle = function (dom) {
    if (!dom)
        throw new Error('getStyle: dom does not exist');
    return getComputedStyle(dom);
};
exports.setStyle = function (dom, style) {
    if (!dom)
        throw new Error('setStyle: dom does not exist');
    for (var i = 0, keys = Object.keys(style), len = keys.length; i < len; i++) {
        dom.style[keys[i]] = style[keys[i]];
    }
    return dom;
};
exports.pixel = function (num) {
    if ((num + '').indexOf('px') !== -1)
        return num;
    return (num || 0) + 'px';
};
exports.bindDrag = (options) => {
    const { onDragStart, onDragEnd, onDrag, $el, preventGlobalClick = true, doc = document } = options;
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    const onMouseDown = (e) => {
        isDragging = true;
        startPos = { x: e.screenX, y: e.screenY };
        onDragStart(e);
    };
    const onMouseUp = (e) => {
        if (!isDragging)
            return;
        isDragging = false;
        const dx = e.screenX - startPos.x;
        const dy = e.screenY - startPos.y;
        onDragEnd(e, { dx, dy });
    };
    const onMouseMove = (e) => {
        if (!isDragging)
            return;
        const dx = e.screenX - startPos.x;
        const dy = e.screenY - startPos.y;
        onDrag(e, { dx, dy });
        e.preventDefault();
        e.stopPropagation();
    };
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    if (preventGlobalClick) {
        doc.addEventListener('click', onClick, true);
    }
    doc.addEventListener('mousemove', onMouseMove, true);
    doc.addEventListener('mouseup', onMouseUp, true);
    $el.addEventListener('mousedown', onMouseDown, true);
    return () => {
        doc.removeEventListener('click', onClick, true);
        doc.removeEventListener('mousemove', onMouseMove, true);
        doc.removeEventListener('mouseup', onMouseUp, true);
        $el.removeEventListener('mousedown', onMouseDown, true);
    };
};
exports.bindContentEditableChange = (options) => {
    const { onChange, doc = document } = options;
    let currentCE = null;
    let oldContent = null;
    const onFocus = (e) => {
        if (!e.target || e.target.contentEditable !== 'true')
            return;
        currentCE = e.target;
        oldContent = currentCE.innerHTML;
    };
    const onBlur = (e) => {
        if (e.target !== currentCE) {
            // Do nothing
        }
        else if (currentCE && currentCE.innerHTML !== oldContent) {
            onChange(e);
        }
        currentCE = null;
        oldContent = null;
    };
    doc.addEventListener('focus', onFocus, true);
    doc.addEventListener('blur', onBlur, true);
    return () => {
        doc.removeEventListener('focus', onFocus, true);
        doc.removeEventListener('blur', onBlur, true);
    };
};
exports.scrollLeft = function (document) {
    return document.documentElement.scrollLeft;
};
exports.scrollTop = function (document) {
    return document.documentElement.scrollTop;
};
exports.domText = ($dom) => {
    const it = $dom.innerText ? $dom.innerText.trim() : '';
    const tc = $dom.textContent;
    const pos = tc.toUpperCase().indexOf(it.toUpperCase());
    return pos === -1 ? it : tc.substr(pos, it.length);
};
exports.isVisible = function (el) {
    if (el === window.document)
        return true;
    if (!el)
        return true;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.opacity === '0' || style.visibility === 'hidden')
        return false;
    return exports.isVisible(el.parentNode);
};
exports.cssSelector = function (dom) {
    if (!dom)
        return '';
    if (dom.nodeType !== 1)
        return '';
    if (dom.tagName === 'BODY')
        return 'body';
    if (dom.id)
        return '#' + dom.id;
    var classes = dom.className.split(/\s+/g)
        .filter(function (item) {
        return item && item.length;
    });
    var children = Array.from(dom.parentNode ? dom.parentNode.childNodes : [])
        .filter(function ($el) {
        return $el.nodeType === 1;
    });
    var sameTag = children.filter(function ($el) {
        return $el.tagName === dom.tagName;
    });
    var sameClass = children.filter(function ($el) {
        var cs = $el.className.split(/\s+/g);
        return utils_1.and(...classes.map(function (c) {
            return cs.indexOf(c) !== -1;
        }));
    });
    var extra = '';
    if (sameTag.length === 1) {
        extra = '';
    }
    else if (classes.length && sameClass.length === 1) {
        extra = '.' + classes.join('.');
    }
    else {
        extra = ':nth-child(' + (1 + children.findIndex(function (item) { return item === dom; })) + ')';
    }
    var me = dom.tagName.toLowerCase() + extra;
    // Note: browser will add an extra 'tbody' when tr directly in table, which will cause an wrong selector,
    // so the hack is to remove all tbody here
    var ret = exports.cssSelector(dom.parentNode) + ' > ' + me;
    return ret;
    // return ret.replace(/\s*>\s*tbody\s*>?/g, ' ')
};
exports.isPositionFixed = ($dom) => {
    if (!$dom || $dom === document.documentElement || $dom === document.body)
        return false;
    return getComputedStyle($dom)['position'] === 'fixed' || exports.isPositionFixed($dom.parentNode);
};
exports.offset = function (dom) {
    if (!dom)
        return { left: 0, top: 0 };
    var rect = dom.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
};
function accurateOffset(dom) {
    if (!dom)
        return { left: 0, top: 0 };
    const doc = dom.ownerDocument;
    if (!doc || dom === doc.documentElement)
        return { left: 0, top: 0 };
    const parentOffset = accurateOffset(dom.offsetParent);
    return {
        left: parentOffset.left + dom.offsetLeft,
        top: parentOffset.top + dom.offsetTop
    };
}
exports.accurateOffset = accurateOffset;
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            resolve({
                $img,
                width: $img.width,
                height: $img.height
            });
        };
        $img.onerror = (e) => {
            reject(e);
        };
        $img.src = url;
    });
}
exports.preloadImage = preloadImage;
function isFirefox() {
    return /Firefox/.test(window.navigator.userAgent);
}
exports.isFirefox = isFirefox;
function svgNodetoString(svgNode) {
    return svgNode.outerHTML;
}
exports.svgNodetoString = svgNodetoString;
function svgToBase64(str) {
    return 'data:image/svg+xml;base64,' + window.btoa(str);
}
exports.svgToBase64 = svgToBase64;
function canvasFromSVG(str) {
    return new Promise((resolve, reject) => {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        const img = document.createElement('img');
        const b64 = svgToBase64(str);
        const mw = str.match(/<svg[\s\S]*?width="(.*?)"/m);
        const mh = str.match(/<svg[\s\S]*?height="(.*?)"/m);
        const w = parseInt(mw[1], 10);
        const h = parseInt(mh[1], 10);
        img.src = b64;
        img.onload = function () {
            c.width = w;
            c.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            resolve(c);
        };
        img.onerror = function (e) {
            reject(e);
        };
    });
}
exports.canvasFromSVG = canvasFromSVG;
function imageBlobFromSVG(str, mimeType = 'image/png', quality) {
    return canvasFromSVG(str)
        .then(canvas => {
        const p = new Promise((resolve, reject) => {
            try {
                canvas.toBlob(resolve, mimeType, quality);
            }
            catch (e) {
                reject(e);
            }
        });
        return p;
    });
}
exports.imageBlobFromSVG = imageBlobFromSVG;
function imageDataFromUrl(url) {
    return preloadImage(url)
        .then(({ $img, width, height }) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage($img, 0, 0, width, height);
        return context.getImageData(0, 0, width, height);
    });
}
exports.imageDataFromUrl = imageDataFromUrl;
function subImage(imageUrl, rect) {
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = rect.width;
            canvas.height = rect.height;
            const context = canvas.getContext('2d');
            context.drawImage($img, 0, 0, $img.width, $img.height, -1 * rect.x, -1 * rect.y, $img.width, $img.height);
            resolve(canvas.toDataURL());
        };
        $img.src = imageUrl;
    });
}
exports.subImage = subImage;
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
        throw 'Invalid color component';
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}
exports.rgbToHex = rgbToHex;
function getPixel(params) {
    const { x, y, dataUrl } = params;
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            const imgWidth = $img.width;
            const imgHeight = $img.height;
            if (x < 0 || y < 0 || x > imgWidth || y > imgHeight) {
                return reject(new Error(`${x}, ${y} is out of screenshot bound 0, 0 ~ ${imgWidth}, ${imgHeight}`));
            }
            const canvas = document.createElement('canvas');
            canvas.width = x + 5;
            canvas.height = y + 5;
            const context = canvas.getContext('2d');
            context.drawImage($img, 0, 0, x + 5, y + 5, 0, 0, x + 5, y + 5);
            let hex;
            try {
                const p = context.getImageData(x, y, 1, 1).data;
                hex = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6);
                resolve(hex);
            }
            catch (e) {
                reject(new Error(`Failed to get pixel color` + ((e === null || e === void 0 ? void 0 : e.message) ? `: ${e.message}.` : '.')));
            }
        };
        $img.src = dataUrl;
    });
}
exports.getPixel = getPixel;
function scaleRect(rect, scale) {
    return {
        x: scale * rect.x,
        y: scale * rect.y,
        width: scale * rect.width,
        height: scale * rect.height,
    };
}
exports.scaleRect = scaleRect;
function isEditable(el) {
    if (el.contentEditable === 'true') {
        return true;
    }
    const tag = (el.tagName || '').toLowerCase();
    if (['input', 'textarea'].indexOf(tag) === -1) {
        return false;
    }
    const disabled = el.disabled;
    const readOnly = el.readOnly;
    return !disabled && !readOnly;
}
exports.isEditable = isEditable;
function hasAncestor(el, checkAncestor) {
    let node = el;
    while (node) {
        if (checkAncestor(node)) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
exports.hasAncestor = hasAncestor;
function getAncestor(el, checkAncestor) {
    let node = el;
    while (node) {
        if (checkAncestor(node)) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
exports.getAncestor = getAncestor;


/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _node_modules_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "win32", function() { return _node_modules_path__WEBPACK_IMPORTED_MODULE_0__["win32"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "posix", function() { return _node_modules_path__WEBPACK_IMPORTED_MODULE_0__["posix"]; });



var isWindows = /windows/i.test(window.navigator.userAgent);
var path = isWindows ? _node_modules_path__WEBPACK_IMPORTED_MODULE_0__["win32"] : _node_modules_path__WEBPACK_IMPORTED_MODULE_0__["posix"];

/* harmony default export */ __webpack_exports__["default"] = (path);



/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(94);
const filesystem_1 = __webpack_require__(69);
const ts_utils_1 = __webpack_require__(12);
const path_1 = __importDefault(__webpack_require__(29));
class XFile extends common_1.XModule {
    getName() {
        return common_1.XModuleTypes.XFile;
    }
    getAPI() {
        return filesystem_1.getNativeFileSystemAPI();
    }
    initConfig() {
        return this.getConfig()
            .then(config => {
            if (!config.rootDir) {
                const fsAPI = filesystem_1.getNativeFileSystemAPI();
                return fsAPI.getSpecialFolderPath({ folder: filesystem_1.SpecialFolder.UserDesktop })
                    .then(profilePath => {
                    const kantuDir = path_1.default.join(profilePath, 'uivision');
                    return fsAPI.ensureDir({ path: kantuDir })
                        .then(done => {
                        this.setConfig({
                            rootDir: done ? kantuDir : profilePath
                        });
                    });
                })
                    .catch(e => {
                    // Ignore host not found error, `initConfig` is supposed to be called on start
                    // But we can't guarantee that native fs module is already installed
                    if (!/Specified native messaging host not found/.test(e)) {
                        throw e;
                    }
                });
            }
        });
    }
    sanityCheck(simple) {
        return Promise.all([
            this.getConfig(),
            this.getAPI().getVersion()
                .then(() => this.getAPI(), () => this.getAPI().reconnect())
                .catch(e => {
                throw new Error('xFile is not installed yet');
            })
        ])
            .then(([config, api]) => {
            if (simple) {
                return true;
            }
            if (!config.rootDir) {
                throw new Error('rootDir is not set');
            }
            const checkDirectoryExists = () => {
                return api.directoryExists({ path: config.rootDir })
                    .then((existed) => {
                    if (!existed)
                        throw new Error(`Directory '${config.rootDir}' doesn't exist`);
                    return true;
                });
            };
            const checkDirectoryWritable = () => {
                const testDir = path_1.default.join(config.rootDir, '__kantu__' + Math.round(Math.random() * 100));
                return api.createDirectory({ path: testDir })
                    .then((created) => {
                    if (!created)
                        throw new Error();
                    return api.removeDirectory({ path: testDir });
                })
                    .then((deleted) => {
                    if (!deleted)
                        throw new Error();
                    return true;
                })
                    .catch((e) => {
                    throw new Error(`Directory '${config.rootDir}' is not writable`);
                });
            };
            return checkDirectoryExists()
                .then(checkDirectoryWritable);
        });
    }
    checkUpdate() {
        return Promise.reject(new Error('checkUpdate is not implemented yet'));
    }
    checkUpdateLink(modVersion, extVersion) {
        return `https://ui.vision/x/idehelp?help=xfileaccess_updatecheck&xversion=${modVersion}&kantuversion=${extVersion}`;
    }
    downloadLink() {
        return 'https://ui.vision/x/idehelp?help=xfileaccess_download';
    }
    infoLink() {
        return 'https://ui.vision/x/idehelp?help=xfileaccess';
    }
}
exports.XFile = XFile;
exports.getXFile = ts_utils_1.singletonGetter(() => {
    return new XFile();
});


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_extension_1 = __importDefault(__webpack_require__(10));
const platform = web_extension_1.default.isFirefox() ? 'firefox' : 'chrome';
exports.default = {
    preinstall: {
        version: '5.8.8',
        macroFolder: '/Demo'
    },
    urlAfterUpgrade: 'https://ui.vision/x/idehelp?help=k_update',
    urlAfterInstall: 'https://ui.vision/x/idehelp?help=k_welcome',
    urlAfterUninstall: 'https://ui.vision/x/idehelp?help=k_why',
    performanceLimit: {
        fileCount: Infinity
    },
    xmodulesLimit: {
        unregistered: {
            ocrCommandCount: 100,
            xCommandCount: 25,
            xFileMacroCount: 10,
            proxyExecCount: 5,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgrade'
        },
        free: {
            ocrCommandCount: 250,
            xCommandCount: Infinity,
            xFileMacroCount: 20,
            proxyExecCount: 10,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgradepro'
        },
        pro: {
            ocrCommandCount: 500,
            xCommandCount: Infinity,
            xFileMacroCount: Infinity,
            proxyExecCount: Infinity,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgrade_contactsupport'
        }
    },
    xfile: {
        minVersionToReadBigFile: '1.0.10'
    },
    ocr: {
        apiList: [
            {
                "id": "1",
                "key": "kantu_only_53b8",
                "url": "https://apipro1.ocr.space/parse/image"
            },
            {
                "id": "2",
                "key": "kantu_only_53b8",
                "url": "https://apipro2.ocr.space/parse/image"
            },
            {
                "id": "3",
                "key": "kantu_only_53b8",
                "url": "https://apipro3.ocr.space/parse/image"
            }
        ],
        apiTimeout: 60 * 1000,
        singleApiTimeout: 30 * 1000,
        apiHealthyResponseTime: 20 * 1000,
        resetTime: 24 * 3600 * 1000
    },
    license: {
        api: {
            url: 'https://license1.ocr.space/api/status'
        }
    },
    icons: {
        normal: 'logo38.png',
        inverted: 'inverted_logo_38.png'
    },
    forceMigrationRemedy: false,
    iframePostMessageTimeout: 500,
    ui: {
        commandItemHeight: 35
    },
    commandRunner: {
        sendKeysMaxCharCount: 1000
    }
};


/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodTypeInvocationNames = [
    'get_version',
    'get_desktop_dpi',
    'get_image_info',
    'capture_desktop',
    'search_image',
    'search_desktop',
    'get_max_file_range',
    'get_file_size',
    'read_file_range'
];


/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const native_host_1 = __webpack_require__(105);
class KantuCVHost extends native_host_1.NativeMessagingHost {
    constructor() {
        super(KantuCVHost.HOST_NAME);
    }
}
exports.KantuCVHost = KantuCVHost;
KantuCVHost.HOST_NAME = "com.a9t9.kantu.cv";


/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base64;
(function (base64) {
    // prettier-ignore
    const encodingTable = new Uint8Array([
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
    ]);
    // prettier-ignore
    const decodingTable = new Uint8Array([
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ]);
    const paddingChar = 61;
    function calculateEncodedLength(length) {
        let result = (length / 3) * 4;
        result += length % 3 != 0 ? 4 : 0;
        return result;
    }
    function readWord(input, i, maxLength) {
        if (maxLength > 4) {
            throw new Error("maxLength should be in range [0, 4].");
        }
        const t = new Uint8Array(4);
        for (let k = 0; k < maxLength; ++k) {
            const c = input.charCodeAt(i + k);
            const b = decodingTable[c];
            if (b === 0xff) {
                return undefined;
            }
            t[k] = b;
        }
        return ((t[0] << (3 * 6)) +
            (t[1] << (2 * 6)) +
            (t[2] << (1 * 6)) +
            (t[3] << (0 * 6)));
    }
    function writeWord(output, i, triple) {
        output[i + 0] = (triple >> 16) & 0xff;
        output[i + 1] = (triple >> 8) & 0xff;
        output[i + 2] = triple & 0xff;
    }
    function encode(input) {
        const inLen = input.length;
        const outLen = calculateEncodedLength(inLen);
        const lengthMod3 = inLen % 3;
        const calcLength = inLen - lengthMod3;
        const output = new Uint8Array(outLen);
        let i;
        let j = 0;
        for (i = 0; i < calcLength; i += 3) {
            output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
            output[j + 1] =
                encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
            output[j + 2] =
                encodingTable[((input[i + 1] & 0x0f) << 2) | ((input[i + 2] & 0xc0) >> 6)];
            output[j + 3] = encodingTable[input[i + 2] & 0x3f];
            j += 4;
        }
        i = calcLength;
        switch (lengthMod3) {
            case 2: // One character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] =
                    encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
                output[j + 2] = encodingTable[(input[i + 1] & 0x0f) << 2];
                output[j + 3] = paddingChar;
                j += 4;
                break;
            case 1: // Two character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] = encodingTable[(input[i] & 0x03) << 4];
                output[j + 2] = paddingChar;
                output[j + 3] = paddingChar;
                j += 4;
                break;
        }
        const decoder = new TextDecoder("ascii");
        return decoder.decode(output);
    }
    base64.encode = encode;
    function decode(input) {
        const inLen = input.length;
        if (inLen % 4 != 0) {
            return undefined;
        }
        let padding = 0;
        if (inLen > 0 && input.charCodeAt(inLen - 1) == paddingChar) {
            ++padding;
            if (inLen > 1 && input.charCodeAt(inLen - 2) == paddingChar) {
                ++padding;
            }
        }
        const encodedLen = inLen - padding;
        const completeLen = encodedLen & ~3;
        const outLen = (6 * inLen) / 8 - padding;
        const output = new Uint8Array(outLen);
        let triple;
        let i = 0;
        let j = 0;
        while (i < completeLen) {
            triple = readWord(input, i, 4);
            if (typeof triple === "undefined") {
                return undefined;
            }
            writeWord(output, j, triple);
            i += 4;
            j += 3;
        }
        if (padding > 0) {
            triple = readWord(input, i, 4 - padding);
            if (typeof triple === "undefined") {
                return undefined;
            }
            switch (padding) {
                case 1:
                    output[j + 0] = (triple >> 16) & 0xff;
                    output[j + 1] = (triple >> 8) & 0xff;
                    break;
                case 2:
                    output[j + 0] = (triple >> 16) & 0xff;
                    break;
            }
        }
        return output;
    }
    base64.decode = decode;
})(base64 = exports.base64 || (exports.base64 = {}));


/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/common/web_extension.js
var web_extension = __webpack_require__(10);
var web_extension_default = /*#__PURE__*/__webpack_require__.n(web_extension);

// CONCATENATED MODULE: ./src/common/storage/ext_storage.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var local = web_extension_default.a.storage.local;

/* harmony default export */ var ext_storage = ({
  get: function get(key) {
    return local.get(key).then(function (obj) {
      return obj[key];
    });
  },

  set: function set(key, value) {
    return local.set(_defineProperty({}, key, value)).then(function () {
      return true;
    });
  },

  remove: function remove(key) {
    return local.remove(key).then(function () {
      return true;
    });
  },

  clear: function clear() {
    return local.clear().then(function () {
      return true;
    });
  },

  addListener: function addListener(fn) {
    web_extension_default.a.storage.onChanged.addListener(function (changes, areaName) {
      var list = Object.keys(changes).map(function (key) {
        return _extends({}, changes[key], { key: key });
      });
      fn(list);
    });
  }
});
// CONCATENATED MODULE: ./src/common/storage/index.js



/* harmony default export */ var storage = __webpack_exports__["default"] = (ext_storage);

/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "commonStyle", function() { return /* binding */ commonStyle; });
__webpack_require__.d(__webpack_exports__, "createEl", function() { return /* binding */ select_area_createEl; });
__webpack_require__.d(__webpack_exports__, "createRect", function() { return /* binding */ select_area_createRect; });
__webpack_require__.d(__webpack_exports__, "selectArea", function() { return /* binding */ select_area_selectArea; });
__webpack_require__.d(__webpack_exports__, "selectAreaPromise", function() { return /* binding */ selectAreaPromise; });

// EXTERNAL MODULE: ./src/common/dom_utils.ts
var dom_utils = __webpack_require__(22);

// CONCATENATED MODULE: ./src/common/box.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BOX_ANCHOR_POS = {
  TOP_LEFT: 1,
  TOP_RIGHT: 2,
  BOTTOM_RIGHT: 3,
  BOTTOM_LEFT: 4
};

var fitSquarePoint = function fitSquarePoint(movingPoint, fixedPoint) {
  var mp = movingPoint;
  var fp = fixedPoint;
  var xlen = Math.abs(mp.x - fp.x);
  var ylen = Math.abs(mp.y - fp.y);
  var len = Math.min(xlen, ylen);

  return {
    x: fp.x + Math.sign(mp.x - fp.x) * len,
    y: fp.y + Math.sign(mp.y - fp.y) * len
  };
};

var calcRectAndAnchor = function calcRectAndAnchor(movingPoint, fixedPoint) {
  var mp = movingPoint;
  var fp = fixedPoint;
  var pos = null;
  var tlp = null;

  if (mp.x <= fp.x && mp.y <= fp.y) {
    pos = BOX_ANCHOR_POS.TOP_LEFT;
    tlp = mp;
  } else if (mp.x > fp.x && mp.y > fp.y) {
    pos = BOX_ANCHOR_POS.BOTTOM_RIGHT;
    tlp = fp;
  } else if (mp.x > fp.x) {
    pos = BOX_ANCHOR_POS.TOP_RIGHT;
    tlp = { x: fp.x, y: mp.y };
  } else if (mp.y > fp.y) {
    pos = BOX_ANCHOR_POS.BOTTOM_LEFT;
    tlp = { x: mp.x, y: fp.y };
  }

  return {
    rect: {
      x: tlp.x,
      y: tlp.y,
      width: Math.abs(mp.x - fp.x),
      height: Math.abs(mp.y - fp.y)
    },
    anchorPos: pos
  };
};

var pointAtPos = function pointAtPos(rect, pos) {
  switch (pos) {
    case BOX_ANCHOR_POS.TOP_LEFT:
      return {
        x: rect.x,
        y: rect.y
      };
    case BOX_ANCHOR_POS.TOP_RIGHT:
      return {
        x: rect.x + rect.width,
        y: rect.y
      };
    case BOX_ANCHOR_POS.BOTTOM_RIGHT:
      return {
        x: rect.x + rect.width,
        y: rect.y + rect.height
      };
    case BOX_ANCHOR_POS.BOTTOM_LEFT:
      return {
        x: rect.x,
        y: rect.y + rect.height
      };
  }
};

var diagonalPos = function diagonalPos(pos) {
  switch (pos) {
    case BOX_ANCHOR_POS.TOP_LEFT:
      return BOX_ANCHOR_POS.BOTTOM_RIGHT;

    case BOX_ANCHOR_POS.TOP_RIGHT:
      return BOX_ANCHOR_POS.BOTTOM_LEFT;

    case BOX_ANCHOR_POS.BOTTOM_RIGHT:
      return BOX_ANCHOR_POS.TOP_LEFT;

    case BOX_ANCHOR_POS.BOTTOM_LEFT:
      return BOX_ANCHOR_POS.TOP_RIGHT;
  }
};

var diagonalPoint = function diagonalPoint(rect, anchorPos) {
  return pointAtPos(rect, diagonalPos(anchorPos));
};

var genGetAnchorRects = function genGetAnchorRects(ANCHOR_POS, pointAtPos) {
  return function (_ref) {
    var rect = _ref.rect,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 5 : _ref$size;

    var values = function values(obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    };
    var createRect = function createRect(point, size) {
      return {
        x: point.x - size,
        y: point.y - size,
        width: size * 2,
        height: size * 2
      };
    };

    return values(ANCHOR_POS).map(function (pos) {
      return {
        anchorPos: pos,
        rect: createRect(pointAtPos(rect, pos), size)
      };
    });
  };
};

var getAnchorRects = genGetAnchorRects(BOX_ANCHOR_POS, pointAtPos);

var Box = function () {
  function Box(options) {
    _classCallCheck(this, Box);

    this.state = {
      type: 'box',
      data: null,
      style: {},
      rect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    };
    this.local = {};

    var opts = _extends({
      firstSilence: true,
      transform: function transform(x) {
        return x;
      },
      onStateChange: function onStateChange() {}
    }, options);

    this.transform = opts.transform;
    this.onStateChange = opts.onStateChange;
    this.normalizeRect = opts.normalizeRect || function (x) {
      return x;
    };

    this.__setState({
      id: opts.id,
      data: opts.data,
      type: this.getType(),
      style: this.getDefaultStyle(),
      category: this.getCategory(),
      rect: {
        x: opts.x,
        y: opts.y,
        width: opts.width || 0,
        height: opts.height || 0
      }
    }, { silent: opts.firstSilence });
  }
  // Note: possible settings


  _createClass(Box, [{
    key: 'getType',
    value: function getType() {
      return 'box';
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return Box.category;
    }
  }, {
    key: 'getDefaultAnchorPos',
    value: function getDefaultAnchorPos() {
      return BOX_ANCHOR_POS.BOTTOM_RIGHT;
    }
  }, {
    key: 'getDefaultStyle',
    value: function getDefaultStyle() {
      return {};
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.state.id;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.transform(this.state);
    }
  }, {
    key: 'processIncomingStyle',
    value: function processIncomingStyle(style) {
      return style;
    }
  }, {
    key: 'setStyle',
    value: function setStyle(obj) {
      this.__setState({
        style: _extends({}, this.state.style, this.processIncomingStyle(obj))
      });
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      this.__setState({ data: data });
    }
  }, {
    key: 'moveAnchorStart',
    value: function moveAnchorStart(_ref2) {
      var anchorPos = _ref2.anchorPos;

      this.__setLocal({
        oldPoint: pointAtPos(this.state.rect, anchorPos),
        oldAnchorPos: anchorPos,
        anchorPos: anchorPos
      });
    }
  }, {
    key: 'moveAnchor',
    value: function moveAnchor(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;

      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          fit = _ref4.fit;

      var old = this.state.rect;
      var pos = this.local.anchorPos;
      var fixed = diagonalPoint(old, pos);
      var moving = !fit ? { x: x, y: y } : fitSquarePoint({ x: x, y: y }, fixed);
      var res = calcRectAndAnchor(moving, fixed);

      this.__setLocal({ anchorPos: res.anchorPos });
      this.__setState({ rect: this.normalizeRect(res.rect, 'moveAnchor') });
    }
  }, {
    key: 'moveAnchorEnd',
    value: function moveAnchorEnd() {
      this.__setLocal({
        oldPoint: null,
        oldAnchorPos: null,
        anchorPos: null
      });
    }
  }, {
    key: 'moveBoxStart',
    value: function moveBoxStart() {
      this.__setLocal({
        oldRect: _extends({}, this.state.rect)
      });
    }
  }, {
    key: 'moveBox',
    value: function moveBox(_ref5) {
      var dx = _ref5.dx,
          dy = _ref5.dy;

      var old = this.local.oldRect;
      var upd = _extends({}, old, {
        x: old.x + dx,
        y: old.y + dy
      });

      this.__setState({ rect: this.normalizeRect(upd, 'moveBox') });
    }
  }, {
    key: 'moveBoxEnd',
    value: function moveBoxEnd() {
      this.__setLocal({
        oldRect: null
      });
    }
  }, {
    key: '__setState',
    value: function __setState(obj) {
      var _this = this;

      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var last = this.getState();

      this.state = _extends({}, this.state, obj);

      if (opts.silent) return;

      var fn = function fn() {
        return _this.onStateChange(_this.getState(), last);
      };
      var invoke = opts.nextTick ? function (fn) {
        return setTimeout(fn, 0);
      } : function (fn) {
        return fn();
      };

      invoke(fn);
    }
  }, {
    key: '__setLocal',
    value: function __setLocal(obj) {
      this.local = _extends({}, this.local, obj);
    }
  }]);

  return Box;
}();
Box.settings = [];
Box.category = 'rect';
Box.defaultAnchorPos = BOX_ANCHOR_POS.BOTTOM_RIGHT;
// EXTERNAL MODULE: ./src/common/web_extension.js
var web_extension = __webpack_require__(10);
var web_extension_default = /*#__PURE__*/__webpack_require__.n(web_extension);

// CONCATENATED MODULE: ./src/ext/content_script/select_area.js
var select_area_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var commonStyle = {
  boxSizing: 'border-box',
  fontFamily: 'Arial'
};

var select_area_createEl = function createEl(_ref) {
  var _ref$tag = _ref.tag,
      tag = _ref$tag === undefined ? 'div' : _ref$tag,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === undefined ? {} : _ref$attrs,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      text = _ref.text;

  var $el = document.createElement(tag);

  Object.keys(attrs).forEach(function (key) {
    $el.setAttribute(key, attrs[key]);
  });

  if (text && text.length) {
    $el.innerText = text;
  }

  Object(dom_utils["setStyle"])($el, style);
  return $el;
};

var select_area_createRect = function createRect(opts) {
  var containerStyle = select_area_extends({}, commonStyle, {
    position: 'absolute',
    zIndex: 100000,
    top: Object(dom_utils["pixel"])(opts.top),
    left: Object(dom_utils["pixel"])(opts.left),
    width: Object(dom_utils["pixel"])(opts.width),
    height: Object(dom_utils["pixel"])(opts.height)
  }, opts.containerStyle || {});
  var rectStyle = select_area_extends({}, commonStyle, {
    width: '100%',
    height: '100%',
    border: opts.rectBorderWidth + 'px solid rgb(239, 93, 143)',
    cursor: 'move',
    background: 'transparent'
  }, opts.rectStyle || {});

  var $container = select_area_createEl({ style: containerStyle });
  var $rectangle = select_area_createEl({ style: rectStyle });

  $container.appendChild($rectangle);
  document.documentElement.appendChild($container);

  return {
    $container: $container,
    $rectangle: $rectangle,
    destroy: function destroy() {
      $container.remove();
    },
    hide: function hide() {
      Object(dom_utils["setStyle"])($container, { display: 'none' });
    },
    show: function show() {
      Object(dom_utils["setStyle"])($container, { display: 'block' });
    }
  };
};

var createOverlay = function createOverlay(extraStyles) {
  var $overlay = select_area_createEl({
    style: select_area_extends({
      position: 'fixed',
      zIndex: 9000,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'transparent',
      cursor: 'crosshair'
    }, extraStyles)
  });

  document.documentElement.appendChild($overlay);

  return {
    $overlay: $overlay,
    destroy: function destroy() {
      return $overlay.remove();
    }
  };
};

var select_area_selectArea = function selectArea(_ref2) {
  var done = _ref2.done,
      _ref2$onDestroy = _ref2.onDestroy,
      onDestroy = _ref2$onDestroy === undefined ? function () {} : _ref2$onDestroy,
      _ref2$allowCursor = _ref2.allowCursor,
      allowCursor = _ref2$allowCursor === undefined ? function (e) {
    return true;
  } : _ref2$allowCursor,
      _ref2$overlayStyles = _ref2.overlayStyles,
      overlayStyles = _ref2$overlayStyles === undefined ? {} : _ref2$overlayStyles,
      _ref2$clickToDestroy = _ref2.clickToDestroy,
      clickToDestroy = _ref2$clickToDestroy === undefined ? true : _ref2$clickToDestroy,
      _ref2$preventGlobalCl = _ref2.preventGlobalClick,
      preventGlobalClick = _ref2$preventGlobalCl === undefined ? true : _ref2$preventGlobalCl;

  var go = function go(done) {
    var state = {
      box: null,
      activated: false,
      startPos: null,
      rect: null
    };
    var resetBodyStyle = function () {
      var userSelectKey = web_extension_default.a.isFirefox() ? '-moz-user-select' : 'user-select';
      var style = window.getComputedStyle(document.body);
      var oldCursor = style.cursor;
      var oldUserSelect = style[userSelectKey];

      Object(dom_utils["setStyle"])(document.body, _defineProperty({
        cursor: 'crosshair'
      }, userSelectKey, 'none'));
      return function () {
        return Object(dom_utils["setStyle"])(document.body, _defineProperty({ cursor: oldCursor }, userSelectKey, oldUserSelect));
      };
    }();

    var overlayApi = createOverlay(overlayStyles);
    var unbindDrag = Object(dom_utils["bindDrag"])({
      preventGlobalClick: preventGlobalClick,
      $el: overlayApi.$overlay,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        if (!allowCursor(e)) return;

        state.activated = true;
        state.startPos = {
          x: e.pageX,
          y: e.pageY
        };
      },
      onDragEnd: function onDragEnd(e) {
        e.preventDefault();

        state.activated = false;

        if (state.box) {
          state.box.moveAnchorEnd();

          var boundingRect = rectObj.$container.getBoundingClientRect();
          API.hide();

          // Note: API.hide() takes some time to have effect
          setTimeout(function () {
            state.box = null;

            return Promise.resolve(done(state.rect, boundingRect)).catch(function (e) {}).then(function () {
              return API.destroy();
            });
          }, 100);
        }
      },
      onDrag: function onDrag(e, _ref3) {
        var dx = _ref3.dx,
            dy = _ref3.dy;

        e.preventDefault();

        if (!allowCursor(e)) return;
        if (!state.activated) return;

        if (!state.box) {
          var rect = {
            x: state.startPos.x,
            y: state.startPos.y,
            width: dx,
            height: dy
          };
          state.rect = rect;
          state.box = new Box(select_area_extends({}, rect, {
            onStateChange: function onStateChange(_ref4) {
              var rect = _ref4.rect;

              state.rect = rect;
              API.show();
              API.updatePos(rect);
            }
          }));

          state.box.moveAnchorStart({
            anchorPos: BOX_ANCHOR_POS.BOTTOM_RIGHT
          });
        }

        state.box.moveAnchor({
          x: e.pageX,
          y: e.pageY
        });
      }
    });

    var rectObj = select_area_createRect({
      top: -999,
      left: -999,
      width: 0,
      height: 0,
      rectStyle: {
        border: '1px solid #ff0000',
        background: 'rgba(255, 0, 0, 0.1)'
      }
    });
    var API = {
      updatePos: function updatePos(rect) {
        Object(dom_utils["setStyle"])(rectObj.$container, {
          top: Object(dom_utils["pixel"])(rect.y),
          left: Object(dom_utils["pixel"])(rect.x),
          width: Object(dom_utils["pixel"])(rect.width),
          height: Object(dom_utils["pixel"])(rect.height)
        });
      },
      destroy: function destroy() {
        resetBodyStyle();
        unbindDrag();
        overlayApi.destroy();
        rectObj.destroy();

        setTimeout(function () {
          document.removeEventListener('click', onClick, true);
          document.removeEventListener('keydown', onKeyDown, true);
        }, 0);

        onDestroy();
      },
      hide: function hide() {
        rectObj.hide();
      },
      show: function show() {
        rectObj.show();
      }
    };

    var onClick = function onClick(e) {
      // If drag starts, we should ignore click event
      if (state.box) return;

      e.preventDefault();
      e.stopPropagation();
      API.destroy();
    };
    var onKeyDown = function onKeyDown(e) {
      return e.keyCode === 27 && API.destroy();
    };

    document.addEventListener('keydown', onKeyDown, true);

    if (clickToDestroy) {
      document.addEventListener('click', onClick, true);
    }

    API.hide();
    return API;
  };

  return go(done);
};

var selectAreaPromise = function selectAreaPromise(opts) {
  return new Promise(function (resolve, reject) {
    var wrappedDone = function wrappedDone() {
      resolve(opts.done.apply(opts, arguments));
    };
    var wrappedOnDestroy = function wrappedOnDestroy() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      try {
        if (opts.onDestroy) opts.onDestroy(args);
      } catch (e) {}

      resolve();
    };

    select_area_selectArea(select_area_extends({}, opts, {
      done: wrappedDone,
      onDestroy: wrappedOnDestroy
    }));
  });
};

/***/ }),

/***/ 427:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 196,
	"./af.js": 196,
	"./ar": 197,
	"./ar-dz": 198,
	"./ar-dz.js": 198,
	"./ar-kw": 199,
	"./ar-kw.js": 199,
	"./ar-ly": 200,
	"./ar-ly.js": 200,
	"./ar-ma": 201,
	"./ar-ma.js": 201,
	"./ar-sa": 202,
	"./ar-sa.js": 202,
	"./ar-tn": 203,
	"./ar-tn.js": 203,
	"./ar.js": 197,
	"./az": 204,
	"./az.js": 204,
	"./be": 205,
	"./be.js": 205,
	"./bg": 206,
	"./bg.js": 206,
	"./bm": 207,
	"./bm.js": 207,
	"./bn": 208,
	"./bn.js": 208,
	"./bo": 209,
	"./bo.js": 209,
	"./br": 210,
	"./br.js": 210,
	"./bs": 211,
	"./bs.js": 211,
	"./ca": 212,
	"./ca.js": 212,
	"./cs": 213,
	"./cs.js": 213,
	"./cv": 214,
	"./cv.js": 214,
	"./cy": 215,
	"./cy.js": 215,
	"./da": 216,
	"./da.js": 216,
	"./de": 217,
	"./de-at": 218,
	"./de-at.js": 218,
	"./de-ch": 219,
	"./de-ch.js": 219,
	"./de.js": 217,
	"./dv": 220,
	"./dv.js": 220,
	"./el": 221,
	"./el.js": 221,
	"./en-au": 222,
	"./en-au.js": 222,
	"./en-ca": 223,
	"./en-ca.js": 223,
	"./en-gb": 224,
	"./en-gb.js": 224,
	"./en-ie": 225,
	"./en-ie.js": 225,
	"./en-nz": 226,
	"./en-nz.js": 226,
	"./eo": 227,
	"./eo.js": 227,
	"./es": 228,
	"./es-do": 229,
	"./es-do.js": 229,
	"./es-us": 230,
	"./es-us.js": 230,
	"./es.js": 228,
	"./et": 231,
	"./et.js": 231,
	"./eu": 232,
	"./eu.js": 232,
	"./fa": 233,
	"./fa.js": 233,
	"./fi": 234,
	"./fi.js": 234,
	"./fo": 235,
	"./fo.js": 235,
	"./fr": 236,
	"./fr-ca": 237,
	"./fr-ca.js": 237,
	"./fr-ch": 238,
	"./fr-ch.js": 238,
	"./fr.js": 236,
	"./fy": 239,
	"./fy.js": 239,
	"./gd": 240,
	"./gd.js": 240,
	"./gl": 241,
	"./gl.js": 241,
	"./gom-latn": 242,
	"./gom-latn.js": 242,
	"./gu": 243,
	"./gu.js": 243,
	"./he": 244,
	"./he.js": 244,
	"./hi": 245,
	"./hi.js": 245,
	"./hr": 246,
	"./hr.js": 246,
	"./hu": 247,
	"./hu.js": 247,
	"./hy-am": 248,
	"./hy-am.js": 248,
	"./id": 249,
	"./id.js": 249,
	"./is": 250,
	"./is.js": 250,
	"./it": 251,
	"./it.js": 251,
	"./ja": 252,
	"./ja.js": 252,
	"./jv": 253,
	"./jv.js": 253,
	"./ka": 254,
	"./ka.js": 254,
	"./kk": 255,
	"./kk.js": 255,
	"./km": 256,
	"./km.js": 256,
	"./kn": 257,
	"./kn.js": 257,
	"./ko": 258,
	"./ko.js": 258,
	"./ky": 259,
	"./ky.js": 259,
	"./lb": 260,
	"./lb.js": 260,
	"./lo": 261,
	"./lo.js": 261,
	"./lt": 262,
	"./lt.js": 262,
	"./lv": 263,
	"./lv.js": 263,
	"./me": 264,
	"./me.js": 264,
	"./mi": 265,
	"./mi.js": 265,
	"./mk": 266,
	"./mk.js": 266,
	"./ml": 267,
	"./ml.js": 267,
	"./mr": 268,
	"./mr.js": 268,
	"./ms": 269,
	"./ms-my": 270,
	"./ms-my.js": 270,
	"./ms.js": 269,
	"./mt": 271,
	"./mt.js": 271,
	"./my": 272,
	"./my.js": 272,
	"./nb": 273,
	"./nb.js": 273,
	"./ne": 274,
	"./ne.js": 274,
	"./nl": 275,
	"./nl-be": 276,
	"./nl-be.js": 276,
	"./nl.js": 275,
	"./nn": 277,
	"./nn.js": 277,
	"./pa-in": 278,
	"./pa-in.js": 278,
	"./pl": 279,
	"./pl.js": 279,
	"./pt": 280,
	"./pt-br": 281,
	"./pt-br.js": 281,
	"./pt.js": 280,
	"./ro": 282,
	"./ro.js": 282,
	"./ru": 283,
	"./ru.js": 283,
	"./sd": 284,
	"./sd.js": 284,
	"./se": 285,
	"./se.js": 285,
	"./si": 286,
	"./si.js": 286,
	"./sk": 287,
	"./sk.js": 287,
	"./sl": 288,
	"./sl.js": 288,
	"./sq": 289,
	"./sq.js": 289,
	"./sr": 290,
	"./sr-cyrl": 291,
	"./sr-cyrl.js": 291,
	"./sr.js": 290,
	"./ss": 292,
	"./ss.js": 292,
	"./sv": 293,
	"./sv.js": 293,
	"./sw": 294,
	"./sw.js": 294,
	"./ta": 295,
	"./ta.js": 295,
	"./te": 296,
	"./te.js": 296,
	"./tet": 297,
	"./tet.js": 297,
	"./th": 298,
	"./th.js": 298,
	"./tl-ph": 299,
	"./tl-ph.js": 299,
	"./tlh": 300,
	"./tlh.js": 300,
	"./tr": 301,
	"./tr.js": 301,
	"./tzl": 302,
	"./tzl.js": 302,
	"./tzm": 303,
	"./tzm-latn": 304,
	"./tzm-latn.js": 304,
	"./tzm.js": 303,
	"./uk": 305,
	"./uk.js": 305,
	"./ur": 306,
	"./ur.js": 306,
	"./uz": 307,
	"./uz-latn": 308,
	"./uz-latn.js": 308,
	"./uz.js": 307,
	"./vi": 309,
	"./vi.js": 309,
	"./x-pseudo": 310,
	"./x-pseudo.js": 310,
	"./yo": 311,
	"./yo.js": 311,
	"./zh-cn": 166,
	"./zh-cn.js": 166,
	"./zh-hk": 312,
	"./zh-hk.js": 312,
	"./zh-tw": 313,
	"./zh-tw.js": 313
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 427;

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CommandScope;
(function (CommandScope) {
    CommandScope[CommandScope["All"] = 1] = "All";
    CommandScope[CommandScope["WebOnly"] = 2] = "WebOnly";
    CommandScope[CommandScope["DesktopOnly"] = 3] = "DesktopOnly";
})(CommandScope = exports.CommandScope || (exports.CommandScope = {}));
exports.commandScopes = {
    'open': CommandScope.WebOnly,
    'click': CommandScope.WebOnly,
    'clickAndWait': CommandScope.WebOnly,
    'select': CommandScope.WebOnly,
    'selectAndWait': CommandScope.WebOnly,
    'addSelection': CommandScope.WebOnly,
    'removeSelection': CommandScope.WebOnly,
    'type': CommandScope.WebOnly,
    'pause': CommandScope.All,
    'waitForPageToLoad': CommandScope.WebOnly,
    'selectFrame': CommandScope.WebOnly,
    'assertAlert': CommandScope.WebOnly,
    'assertConfirmation': CommandScope.WebOnly,
    'assertPrompt': CommandScope.WebOnly,
    'answerOnNextPrompt': CommandScope.WebOnly,
    'store': CommandScope.All,
    'storeText': CommandScope.WebOnly,
    'storeTitle': CommandScope.WebOnly,
    'storeAttribute': CommandScope.WebOnly,
    'storeXpathCount': CommandScope.WebOnly,
    'assertText': CommandScope.WebOnly,
    'assertTitle': CommandScope.WebOnly,
    'clickAt': CommandScope.WebOnly,
    'echo': CommandScope.All,
    'mouseOver': CommandScope.WebOnly,
    // 'storeEval',
    'verifyText': CommandScope.WebOnly,
    'verifyTitle': CommandScope.WebOnly,
    'sendKeys': CommandScope.WebOnly,
    'dragAndDropToObject': CommandScope.WebOnly,
    'selectWindow': CommandScope.WebOnly,
    'captureScreenshot': CommandScope.WebOnly,
    'captureDesktopScreenshot': CommandScope.DesktopOnly,
    'refresh': CommandScope.WebOnly,
    'assert': CommandScope.All,
    'assertElementPresent': CommandScope.WebOnly,
    'assertElementNotPresent': CommandScope.WebOnly,
    'assertEditable': CommandScope.WebOnly,
    'assertNotEditable': CommandScope.WebOnly,
    'verify': CommandScope.All,
    'verifyElementPresent': CommandScope.WebOnly,
    'verifyElementNotPresent': CommandScope.WebOnly,
    'verifyEditable': CommandScope.WebOnly,
    'verifyNotEditable': CommandScope.WebOnly,
    'deleteAllCookies': CommandScope.WebOnly,
    'label': CommandScope.All,
    'gotoLabel': CommandScope.All,
    //'gotoIf',
    'csvRead': CommandScope.All,
    'csvReadArray': CommandScope.All,
    'csvSave': CommandScope.All,
    'csvSaveArray': CommandScope.All,
    'storeValue': CommandScope.WebOnly,
    'assertValue': CommandScope.WebOnly,
    'verifyValue': CommandScope.WebOnly,
    'storeChecked': CommandScope.WebOnly,
    'captureEntirePageScreenshot': CommandScope.WebOnly,
    'onDownload': CommandScope.WebOnly,
    // 'assertError',
    // 'verifyError',
    'throwError': CommandScope.All,
    'comment': CommandScope.All,
    // 'waitForVisible',
    'waitForElementVisible': CommandScope.WebOnly,
    'waitForElementNotVisible': CommandScope.WebOnly,
    'waitForElementPresent': CommandScope.WebOnly,
    'waitForElementNotPresent': CommandScope.WebOnly,
    'onError': CommandScope.All,
    'sourceSearch': CommandScope.WebOnly,
    'sourceExtract': CommandScope.WebOnly,
    'storeImage': CommandScope.WebOnly,
    'localStorageExport': CommandScope.All,
    // 'visionFind',
    'visionLimitSearchArea': CommandScope.All,
    'visionLimitSearchAreaRelative': CommandScope.All,
    'visualSearch': CommandScope.All,
    'visualVerify': CommandScope.All,
    'visualAssert': CommandScope.All,
    'visualGetPixelColor': CommandScope.All,
    'editContent': CommandScope.WebOnly,
    'bringBrowserToForeground': CommandScope.All,
    'bringIDEandBrowserToBackground': CommandScope.All,
    //'resize',
    'setWindowSize': CommandScope.All,
    'prompt': CommandScope.WebOnly,
    'XRun': CommandScope.All,
    'XRunAndWait': CommandScope.All,
    'XClick': CommandScope.All,
    'XClickRelative': CommandScope.All,
    'XType': CommandScope.All,
    'XMove': CommandScope.All,
    'XMoveRelative': CommandScope.All,
    'XMouseWheel': CommandScope.All,
    'XDesktopAutomation': CommandScope.All,
    'OCRSearch': CommandScope.All,
    'OCRExtract': CommandScope.All,
    'OCRExtractRelative': CommandScope.All,
    'setProxy': CommandScope.All,
    'run': CommandScope.All,
    'executeScript': CommandScope.All,
    'executeScript_Sandbox': CommandScope.All,
    //  'executeAsyncScript',
    //  'executeAsyncScript_Sandbox',
    'check': CommandScope.WebOnly,
    'uncheck': CommandScope.WebOnly,
    'assertChecked': CommandScope.WebOnly,
    'assertNotChecked': CommandScope.WebOnly,
    'verifyChecked': CommandScope.WebOnly,
    'verifyNotChecked': CommandScope.WebOnly,
    //'while',
    // 'endWhile',
    'do': CommandScope.All,
    'repeatIf': CommandScope.All,
    //'if',
    'else': CommandScope.All,
    'elseif': CommandScope.All,
    // 'endif',
    'end': CommandScope.All,
    'if_v2': CommandScope.All,
    'while_v2': CommandScope.All,
    'gotoIf_v2': CommandScope.All,
    'times': CommandScope.All,
    'forEach': CommandScope.All,
    'break': CommandScope.All,
    'continue': CommandScope.All
};
exports.availableCommands = (() => {
    const list = Object.keys(exports.commandScopes);
    list.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    return list;
})();
exports.availableCommandsForDesktop = exports.availableCommands.filter(isCommandAvailableForDesktop);
function normalizeCommandName(str) {
    if (!str) {
        return '';
    }
    const lower = str.toLowerCase();
    const lowerCommands = exports.availableCommands.map(str => str.toLowerCase());
    const index = lowerCommands.findIndex(cmd => cmd === lower);
    return index === -1 ? str : exports.availableCommands[index];
}
exports.normalizeCommandName = normalizeCommandName;
function commandText(cmd) {
    switch (cmd) {
        case 'if':
        case 'while':
        case 'gotoIf':
            return cmd + '_v1_deprecated';
        case 'storeEval':
        case 'endif':
        case 'endwhile':
        case 'resize':
            return cmd + '_deprecated';
        default:
            return cmd;
    }
}
exports.commandText = commandText;
function isValidCmd(str) {
    return exports.availableCommands.indexOf(str) !== -1;
}
exports.isValidCmd = isValidCmd;
function isExtensionResourceOnlyCommand(str) {
    switch (str) {
        case 'if':
        case 'while':
        case 'gotoIf':
        case 'if_v2':
        case 'while_v2':
        case 'gotoIf_v2':
        case 'executeScript_Sandbox':
        case 'run':
        case 'store':
        case 'echo':
        case 'prompt':
        case 'throwError':
        case 'pause':
        case 'localStorageExport':
            return true;
        default:
            return false;
    }
}
exports.isExtensionResourceOnlyCommand = isExtensionResourceOnlyCommand;
function canCommandReadImage(str) {
    switch (str) {
        case 'visualSearch':
        case 'visualVerify':
        case 'visualAssert':
        case 'XClick':
        case 'XClickRelative':
        case 'XMove':
        case 'XMoveRelative':
        case 'OCRExtract':
        case 'OCRExtractRelative':
            return true;
        default:
            return false;
    }
}
exports.canCommandReadImage = canCommandReadImage;
function canCommandReadCsv(str) {
    switch (str) {
        case 'csvRead':
        case 'csvReadArray':
            return true;
        default:
            return false;
    }
}
exports.canCommandReadCsv = canCommandReadCsv;
function canCommandRunMacro(str) {
    switch (str) {
        case 'run':
            return true;
        default:
            return false;
    }
}
exports.canCommandRunMacro = canCommandRunMacro;
function doesCommandSupportTargetOptions(str) {
    switch (str) {
        case 'click':
        case 'clickAndWait':
        case 'select':
        case 'selectAndWait':
        case 'type':
        case 'mouseOver':
        case 'verifyText':
        case 'sendKeys':
        case 'dragAndDropToObject':
        case 'assertElementPresent':
        case 'assertEditable':
        case 'assertNotEditable':
        case 'verifyElementPresent':
        case 'verifyEditable':
        case 'verifyNotEditable':
        case 'storeValue':
        case 'assertValue':
        case 'verifyValue':
        case 'storeChecked':
        case 'waitForElementVisible':
        case 'waitForElementPresent':
        case 'XClick':
        case 'XClickRelative':
        case 'XMove':
        case 'XMoveRelative':
        case 'check':
        case 'uncheck':
        case 'assertChecked':
        case 'assertNotChecked':
        case 'verifyChecked':
        case 'verifyNotChecked':
            return true;
        default:
            return false;
    }
}
exports.doesCommandSupportTargetOptions = doesCommandSupportTargetOptions;
function canCommandFind(str) {
    switch (str) {
        case 'echo':
        case 'open':
        case 'pause':
        case 'waitForPageToLoad':
        case 'assertAlert':
        case 'assertConfirmation':
        case 'assertPrompt':
        case 'answerOnNextPrompt':
        case 'store':
        case 'storeTitle':
        case 'assertTitle':
        case 'verifyTitle':
        case 'selectWindow':
        case 'captureScreenshot':
        case 'captureDesktopScreenshot':
        case 'refresh':
        case 'deleteAllCookies':
        case 'label':
        case 'gotoLabel':
        case 'csvRead':
        case 'csvReadArray':
        case 'csvSave':
        case 'csvSaveArray':
        case 'captureEntirePageScreenshot':
        case 'onDownload':
        case 'throwError':
        case 'comment':
        case 'onError':
        case 'sourceSearch':
        case 'sourceExtract':
        case 'localStorageExport':
        case 'visionLimitSearchArea':
        case 'visionLimitSearchAreaRelative':
        case 'visualGetPixelColor':
        case 'bringBrowserToForeground':
        case 'bringIDEandBrowserToBackground':
        case 'setWindowSize':
        case 'prompt':
        case 'XRun':
        case 'XRunAndWait':
        case 'XDesktopAutomation':
        case 'setProxy':
        case 'run':
        case 'executeScript':
        case 'executeScript_Sandbox':
        case 'do':
        case 'repeatIf':
        case 'else':
        case 'elseif':
        case 'end':
        case 'if_v2':
        case 'while_v2':
        case 'gotoIf_v2':
        case 'times':
        case 'forEach':
            return false;
        default:
            return true;
    }
}
exports.canCommandFind = canCommandFind;
function canCommandSelect(str) {
    const canFind = canCommandFind(str);
    if (canFind) {
        return canFind;
    }
    switch (str) {
        case 'visualGetPixelColor':
            return true;
        default:
            return false;
    }
}
exports.canCommandSelect = canCommandSelect;
function isCommandAvailableForDesktop(command) {
    const scope = exports.commandScopes[command];
    if (!scope) {
        return false;
    }
    return scope === CommandScope.All || scope === CommandScope.DesktopOnly;
}
exports.isCommandAvailableForDesktop = isCommandAvailableForDesktop;
function indentCreatedByCommand(str) {
    switch (str) {
        case 'if':
        case 'if_v2':
        case 'while':
        case 'while_v2':
        case 'do':
        case 'times':
        case 'forEach':
            return {
                selfIndent: 0,
                nextIndent: 1
            };
        case 'else':
        case 'elseif':
            return {
                selfIndent: -1,
                nextIndent: 1
            };
        case 'end':
        case 'endif':
        case 'endwhile':
        case 'repeatIf':
            return {
                selfIndent: -1,
                nextIndent: 0
            };
        default:
            return {
                selfIndent: 0,
                nextIndent: 0
            };
    }
}
exports.indentCreatedByCommand = indentCreatedByCommand;
function parseImageTarget(target) {
    if (!target || !target.length) {
        return null;
    }
    const reg = /^([^@#]+?\.png)(?:@([\d.]+))?(?:#(\d+))?(?:\[([^\]]+)\])?$/;
    const m = target.match(reg);
    if (!m) {
        return null;
    }
    // throw new Error(`Target should be like 'abc.png@0.8#1'`)
    const fileName = m[1];
    const confidence = m[2] ? parseFloat(m[2]) : undefined;
    const index = m[3] ? (parseInt(m[3]) - 1) : undefined;
    const imageUrl = m[4];
    return { fileName, confidence, index, imageUrl };
}
exports.parseImageTarget = parseImageTarget;


/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHtml", function() { return toHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateEmptyHtml", function() { return generateEmptyHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHtmlDataUri", function() { return toHtmlDataUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromHtml", function() { return fromHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromJSONString", function() { return fromJSONString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toJSONString", function() { return toJSONString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toJSONDataUri", function() { return toJSONDataUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toBookmarkData", function() { return toBookmarkData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateMacroEntryHtml", function() { return generateMacroEntryHtml; });
/* harmony import */ var error_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(128);
/* harmony import */ var error_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var parse_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78);
/* harmony import */ var parse_json__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(parse_json__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(97);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(123);
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(url_parse__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(46);
/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_command__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _services_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _services_storage__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_services_storage__WEBPACK_IMPORTED_MODULE_5__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };








var joinUrl = function joinUrl(base, url) {
  var urlObj = new url_parse__WEBPACK_IMPORTED_MODULE_3___default.a(url, base);
  return urlObj.toString();
};

// HTML template from test case
function genHtml(_ref) {
  var name = _ref.name,
      baseUrl = _ref.baseUrl,
      commandTrs = _ref.commandTrs,
      noImport = _ref.noImport;

  var tableHtml = noImport ? '<h3>Starting Browser and UI.Vision...</h3>' : '\n    <table cellpadding="1" cellspacing="1" border="1">\n    <thead>\n    <tr><td rowspan="1" colspan="3">' + name + '</td></tr>\n    </thead><tbody>\n    ' + commandTrs.join('\n') + '\n    </tbody></table>\n  ';
  var baseLink = noImport ? '' : '<link rel="selenium.base" href="' + baseUrl + '" />';

  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head profile="http://selenium-ide.openqa.org/profiles/test-case">\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' + baseLink + '\n<title>' + name + '</title>\n</head>\n<body>\n' + tableHtml + '\n<script>\n(function() {\n  var isExtensionLoaded = function () {\n    const $root = document.documentElement\n    return !!$root && !!$root.getAttribute(\'data-kantu\')\n  }\n  var increaseCountInUrl = function (max) {\n    var url   = new URL(window.location.href)\n    var count = 1 + (parseInt(url.searchParams.get(\'reload\') || 0))\n\n    url.searchParams.set(\'reload\', count)\n    var nextUrl = url.toString()\n\n    var shouldStop = count > max\n    return [shouldStop, !shouldStop ? nextUrl : null]\n  }\n  var run = function () {\n    try {\n      var evt = new CustomEvent(\'kantuSaveAndRunMacro\', {\n        detail: {\n          html: document.documentElement.outerHTML,\n          noImport: ' + (noImport || 'false') + ',\n          storageMode: \'' + Object(_services_storage__WEBPACK_IMPORTED_MODULE_5__["getStorageManager"])().getCurrentStrategyType() + '\'\n        }\n      })\n\n      window.dispatchEvent(evt)\n      var intervalTimer = setInterval(() => window.dispatchEvent(evt), 1000);\n\n      if (window.location.protocol === \'file:\') {\n        var onInvokeSuccess = function () {\n          clearTimeout(timer)\n          clearTimeout(reloadTimer)\n          clearInterval(intervalTimer)\n          window.removeEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n        }\n        var timer = setTimeout(function () {\n          alert(\'Error #203: It seems you need to turn on *Allow access to file URLs* for Kantu in your browser extension settings.\')\n        }, 8000)\n\n        window.addEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n      }\n    } catch (e) {\n      alert(\'Kantu Bookmarklet error: \' + e.toString());\n    }\n  }\n  var reloadTimer = null\n  var main = function () {\n    if (isExtensionLoaded())  return run()\n\n    var MAX_TRY   = 3\n    var INTERVAL  = 1000\n    var tuple     = increaseCountInUrl(MAX_TRY)\n\n    if (tuple[0]) {\n      return alert(\'Error #204: It seems UI.Vision RPA is not installed yet - or you need to turn on *Allow access to file URLs* for UI.Vision RPA in your browser extension settings.\')\n    } else {\n      reloadTimer = setTimeout(function () {\n        window.location.href = tuple[1]\n      }, INTERVAL)\n    }\n  }\n\n  setTimeout(main, 500)\n})();\n</script>\n</body>\n</html>\n  ';
}

// generate data uri from html
function htmlDataUri(html) {
  return 'data:text/html;base64,' + window.btoa(unescape(encodeURIComponent(html)));
}

// generate data uri from json
function jsonDataUri(str) {
  return 'data:text/json;base64,' + window.btoa(unescape(encodeURIComponent(str)));
}

// generate html from a test case
function toHtml(_ref2) {
  var name = _ref2.name,
      commands = _ref2.commands;

  var copyCommands = commands.map(function (c) {
    return _extends({}, c);
  });
  var openTc = copyCommands.find(function (tc) {
    return tc.cmd === 'open';
  });

  // Note: Aug 10, 2018, no baseUrl when exported to html
  // so that `${variable}` could be used in open command, and won't be prefixed with baseUrl
  var origin = null;
  var replacePath = function replacePath(path) {
    return path;
  };
  // const url         = openTc && new URL(openTc.target)
  // const origin      = url && url.origin
  // const replacePath = (path) => {
  //   if (path.indexOf(origin) !== 0) return path
  //   const result = path.replace(origin, '')
  //   return result.length === 0 ? '/' : result
  // }

  if (openTc) {
    openTc.target = replacePath(openTc.target);
  }

  var commandTrs = copyCommands.map(function (c) {
    if (c.cmd === 'open') {
      // Note: remove origin if it's the same as the first open command
      c.target = replacePath(c.target);
    }

    return '\n      <tr>\n        <td>' + (c.cmd || '') + '</td>\n        <td>' + (c.target || '') + '</td>\n        <td>' + (c.value || '') + '</td>\n      </tr>\n    ';
  });

  return genHtml({
    name: name,
    commandTrs: commandTrs,
    baseUrl: origin || ''
  });
}

function generateEmptyHtml() {
  return genHtml({
    name: 'UI.Vision Autostart Page',
    commandTrs: [],
    baseUrl: '',
    noImport: true
  });
}

// generate data uri of html from a test case
function toHtmlDataUri(obj) {
  return htmlDataUri(toHtml(obj));
}

// parse html to test case
function fromHtml(html) {
  var $root = jquery__WEBPACK_IMPORTED_MODULE_2___default()('<div>' + html + '</div>');
  var $base = $root.find('link');
  var $title = $root.find('title');
  var $trs = $root.find('tbody > tr');

  var baseUrl = $base && $base.attr('href');
  var name = $title.text();

  if (!name || !name.length) {
    throw new Error('fromHtml: missing title');
  }

  var commands = [].slice.call($trs).map(function (tr) {
    var $el = jquery__WEBPACK_IMPORTED_MODULE_2___default()(tr);
    var trHtml = $el[0].outerHtml;

    // Note: remove any datalist option in katalon-like html file
    $el.find('datalist').remove();

    var $children = $el.children();
    var $cmd = $children.eq(0);
    var $tgt = $children.eq(1);
    var $val = $children.eq(2);
    var cmd = Object(_command__WEBPACK_IMPORTED_MODULE_4__["normalizeCommandName"])($cmd && $cmd.text());
    var value = $val && $val.text();
    var target = $tgt && $tgt.text();

    if (!cmd || !cmd.length) {
      throw new Error('missing cmd in ' + trHtml);
    }

    if (cmd === 'open') {
      // Note: with or without baseUrl
      target = baseUrl && baseUrl.length && !/:\/\//.test(target) ? joinUrl(baseUrl, target) : target;
    }

    return { cmd: cmd, target: target, value: value };
  });

  return { name: name, data: { commands: commands } };
}

// parse json to test case
// the current json structure doesn't provide fileName,
// so must provide a file name as the second parameter
function fromJSONString(str, fileName) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Note: Exported JSON from older version Kantu (via 'export to json')
  // has an invisible charactor (char code65279, known as BOM). It breaks JSON parser.
  // So it's safer to filter it out here
  var obj = parse_json__WEBPACK_IMPORTED_MODULE_1___default()(str.replace(/^\s*/, ''));
  var name = fileName ? fileName.replace(/\.json$/i, '') : obj.Name || '__imported__';

  if (obj.macros) {
    throw new Error('This is a test suite, not a macro');
  }

  if (!Array.isArray(obj.Commands)) {
    throw new Error('\'Commands\' field must be an array');
  }

  var commands = obj.Commands.map(function (c) {
    var obj = {
      cmd: Object(_command__WEBPACK_IMPORTED_MODULE_4__["normalizeCommandName"])(c.Command),
      target: c.Target,
      value: c.Value,
      description: c.Description || ''
    };

    if (Array.isArray(c.Targets)) {
      obj.targetOptions = c.Targets;
    }

    return obj;
  });

  return _extends({
    name: name,
    data: { commands: commands }
  }, opts.withStatus && obj.status ? { status: obj.status } : {}, opts.withId && obj.id ? { id: obj.id } : {});
}

// generate json from a test case
function toJSONString(obj) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var getToday = function getToday() {
    var d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  };
  var data = _extends({
    Name: obj.name,
    CreationDate: getToday(),
    Commands: obj.commands.map(function (c) {
      return {
        Command: c.cmd,
        Target: c.target || '',
        Value: c.value || '',
        Targets: opts.ignoreTargetOptions ? c.targetOptions : undefined,
        Description: c.description || ''
      };
    })
  }, opts.withStatus && obj.status ? { status: obj.status } : {}, opts.withId && obj.id ? { id: obj.id } : {});

  return JSON.stringify(data, null, 2);
}

// generate data uri of json from a test case
function toJSONDataUri(obj) {
  return jsonDataUri(toJSONString(obj));
}

function toBookmarkData(obj) {
  var path = obj.path,
      bookmarkTitle = obj.bookmarkTitle;


  if (!path) throw new Error('path is required to generate bookmark for macro');
  if (!bookmarkTitle) throw new Error('bookmarkTitle is required to generate bookmark for macro');

  // Note: for backward compatibility, still use `name` field (which makes sense in flat fs mode) to store `path`
  // after we migrate to standard folder mode
  //
  // Use `JSON.stringify(path)` so that it could escape "\" in win32 paths
  return {
    title: bookmarkTitle,
    url: ('javascript:\n      (function() {\n        try {\n          var evt = new CustomEvent(\'kantuRunMacro\', {\n            detail: {\n              name: ' + JSON.stringify(path.replace(/\.json$/i, '')) + ',\n              from: \'bookmark\',\n              storageMode: \'' + Object(_services_storage__WEBPACK_IMPORTED_MODULE_5__["getStorageManager"])().getCurrentStrategyType() + '\',\n              closeRPA: 1\n            }\n          });\n          window.dispatchEvent(evt);\n        } catch (e) {\n          alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n        }\n      })();\n    ').replace(/\n\s*/g, '')
  };
}

// It's a macro.html file that tries to open ui.vision.html which will be exported together
// with this entry html
function generateMacroEntryHtml(macroRelativePath) {
  return '<!doctype html>\n<html lang="en">\n  <head>\n    <title>UI.Vision Shortcut Page</title>\n  </head>\n  <body>\n    <h3>Command line:</h3>\n    <a id="run" href="ui.vision.html?direct=1&savelog=log.txt&macro=' + macroRelativePath + '">Click here</a>\n    <br>\n    <br>\n\t<!-- To start another macro just edit this HTML file and change the macro name in the command line above^. -->\n\t<!-- For more command line parameters see https://ui.vision/rpa/docs#cmd -->\n    <script>\n      window.location.href = document.getElementById("run").getAttribute("href");\n    </script>\n  </body>\n</html>\n';
}

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(139);
const kantu_file_access_host_1 = __webpack_require__(140);
const ts_utils_1 = __webpack_require__(12);
const log_1 = __importDefault(__webpack_require__(11));
const path_1 = __importDefault(__webpack_require__(29));
const utf8_1 = __webpack_require__(141);
const base64_1 = __webpack_require__(142);
const utils_1 = __webpack_require__(4);
const semver_1 = __importDefault(__webpack_require__(145));
const config_1 = __importDefault(__webpack_require__(34));
var SpecialFolder;
(function (SpecialFolder) {
    SpecialFolder[SpecialFolder["UserProfile"] = 0] = "UserProfile";
    SpecialFolder[SpecialFolder["UserDesktop"] = 1] = "UserDesktop";
})(SpecialFolder = exports.SpecialFolder || (exports.SpecialFolder = {}));
exports.getNativeFileSystemAPI = ts_utils_1.singletonGetter(() => {
    const nativeHost = new kantu_file_access_host_1.KantuFileAccessHost();
    let pReady = nativeHost.connectAsync().catch(e => {
        log_1.default.warn('pReady - error', e);
        throw e;
    });
    let pendingRequestCount = 0;
    const api = constants_1.MethodTypeInvocationNames.reduce((prev, method) => {
        const camel = ts_utils_1.snakeToCamel(method);
        if (prev[camel]) {
            return prev;
        }
        prev[camel] = (() => {
            const fn = (params) => pReady.then(() => {
                pendingRequestCount += 1;
                return nativeHost.invokeAsync(method, params);
            })
                .then((data) => {
                pendingRequestCount -= 1;
                return data;
            }, e => {
                pendingRequestCount -= 1;
                // Note: Looks like for now whenever there is an error, you have to reconnect native host
                // otherwise, all commands return "Disconnected" afterwards
                const typeSafeAPI = api;
                typeSafeAPI.reconnect().catch(() => { });
                throw e;
            });
            return fn;
        })();
        return prev;
    }, {
        reconnect: () => {
            return ts_utils_1.until('pendingRequestCount === 0', () => {
                return {
                    pass: pendingRequestCount === 0,
                    result: true
                };
            })
                .then(() => {
                log_1.default(`FileSystem - reconnect`, new Error().stack);
                nativeHost.disconnect();
                pReady = nativeHost.connectAsync();
                return pReady.then(() => api);
            });
        },
        getEntries: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.getFileSystemEntries(params)
                .then(res => {
                const { errorCode, entries } = res;
                if (params.brief) {
                    return Promise.resolve({
                        errorCode,
                        entries: entries.map((name) => ({
                            name,
                            length: 0,
                            isDirectory: false,
                            lastWriteTime: 0
                        }))
                    });
                }
                return Promise.all(entries.map((name) => {
                    const entryPath = path_1.default.join(params.path, name);
                    return typeSafeAPI.getFileSystemEntryInfo({ path: entryPath })
                        .then(info => ({
                        name,
                        length: info.length,
                        isDirectory: info.isDirectory,
                        lastWriteTime: info.lastWriteTime
                    }));
                }))
                    .then(entryInfos => ({
                    errorCode,
                    entries: entryInfos
                }));
            });
        },
        ensureDir: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.directoryExists({
                path: params.path
            })
                .then(exists => {
                if (exists)
                    return true;
                return typeSafeAPI.ensureDir({ path: path_1.default.dirname(params.path) })
                    .then(done => {
                    if (!done)
                        return false;
                    return typeSafeAPI.createDirectory({ path: params.path });
                });
            })
                .catch(e => false);
        },
        readBigFile: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.getFileSize(params)
                .then((fileSize) => {
                if (fileSize === 0) {
                    return new Uint8Array(0);
                }
                const content = [];
                const go = (pos) => {
                    return typeSafeAPI.readFileRange({
                        path: params.path,
                        rangeStart: pos
                    })
                        .then(result => {
                        const data = base64_1.base64.decode(result.buffer);
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                content.push(data[i]);
                            }
                        }
                        if (result.rangeEnd <= pos || result.rangeEnd >= fileSize) {
                            return new Uint8Array(content);
                        }
                        return go(result.rangeEnd);
                    });
                };
                return go(0);
            });
        },
        isReadBigFileSupported: () => {
            const typeSafeAPI = api;
            return typeSafeAPI.getVersion()
                .then(version => {
                return !semver_1.default.lt(version, config_1.default.xfile.minVersionToReadBigFile);
            });
        },
        readAllTextCompat: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.isReadBigFileSupported()
                .then(supported => {
                if (!supported) {
                    return typeSafeAPI.readAllText(params);
                }
                return typeSafeAPI.readBigFile(params)
                    .then(content => {
                    const text = utf8_1.utf8.decode(content);
                    return {
                        errorCode: 0,
                        content: text
                    };
                });
            });
        },
        readAllBytesCompat: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.isReadBigFileSupported()
                .then(supported => {
                if (!supported) {
                    return typeSafeAPI.readAllBytes(params);
                }
                return typeSafeAPI.readBigFile(params)
                    .then(content => {
                    return utils_1.blobToDataURL(new Blob([content]))
                        .then(dataUrl => ({
                        errorCode: 0,
                        content: dataUrl
                    }));
                });
            });
        },
    });
    return api;
});


/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringifyTestSuite", function() { return stringifyTestSuite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseTestSuite", function() { return parseTestSuite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateTestSuiteText", function() { return validateTestSuiteText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toBookmarkData", function() { return toBookmarkData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHtml", function() { return toHtml; });
/* harmony import */ var error_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(128);
/* harmony import */ var error_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var parse_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78);
/* harmony import */ var parse_json__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(parse_json__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _services_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _services_storage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_services_storage__WEBPACK_IMPORTED_MODULE_3__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };






var stringifyTestSuite = function stringifyTestSuite(testSuite) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var obj = _extends({
    creationDate: Object(_utils__WEBPACK_IMPORTED_MODULE_2__["formatDate"])(new Date()),
    name: testSuite.name,
    macros: testSuite.cases.map(function (item) {
      var loops = parseInt(item.loops, 10);

      return {
        macro: item.testCaseId,
        loops: loops
      };
    })
  }, opts.withFold ? { fold: !!testSuite.fold } : {}, opts.withId && testSuite.id ? { id: testSuite.id } : {}, opts.withPlayStatus && testSuite.playStatus ? { playStatus: testSuite.playStatus } : {});

  return JSON.stringify(obj, null, 2);
};

var parseTestSuite = function parseTestSuite(text) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Note: Exported JSON from older version Kantu (via 'export to json')
  // has an invisible charactor (char code65279, known as BOM). It breaks JSON parser.
  // So it's safer to filter it out here
  var obj = parse_json__WEBPACK_IMPORTED_MODULE_1___default()(text.replace(/^\s*/, ''));

  if (typeof obj.name !== 'string' || obj.name.length === 0) {
    throw new Error('name must be a string');
  }

  if (!Array.isArray(obj.macros)) {
    throw new Error('macros must be an array');
  }

  var cases = obj.macros.map(function (item) {
    if (typeof item.loops !== 'number' || item.loops < 1) {
      item.loops = 1;
    }

    return {
      testCaseId: item.macro,
      loops: item.loops
    };
  });

  var ts = _extends({
    cases: cases,
    name: opts.fileName ? opts.fileName.replace(/\.json$/i, '') : obj.name
  }, opts.withFold ? { fold: obj.fold === undefined ? true : obj.fold } : {}, opts.withId && obj.id ? { id: obj.id } : {}, opts.withPlayStatus && obj.playStatus ? { playStatus: obj.playStatus } : {});

  return ts;
};

var validateTestSuiteText = parseTestSuite;

var toBookmarkData = function toBookmarkData(obj) {
  var name = obj.name,
      bookmarkTitle = obj.bookmarkTitle;


  if (!name) throw new Error('name is required to generate bookmark for test suite');
  if (!bookmarkTitle) throw new Error('bookmarkTitle is required to generate bookmark for test suite');

  return {
    title: bookmarkTitle,
    url: ('javascript:\n      (function() {\n        try {\n          var evt = new CustomEvent(\'kantuRunTestSuite\', {\n            detail: {\n              name: \'' + name + '\',\n              from: \'bookmark\',\n              storageMode: \'' + Object(_services_storage__WEBPACK_IMPORTED_MODULE_3__["getStorageManager"])().getCurrentStrategyType() + '\',\n              closeRPA: 1\n            }\n          });\n          window.dispatchEvent(evt);\n        } catch (e) {\n          alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n        }\n      })();\n    ').replace(/\n\s*/g, '')
  };
};

var toHtml = function toHtml(_ref) {
  var name = _ref.name;

  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<title>' + name + '</title>\n</head>\n<body>\n<h1>' + name + '</h1>\n<script>\n(function() {\n  var isExtensionLoaded = function () {\n    const $root = document.documentElement\n    return !!$root && !!$root.getAttribute(\'data-kantu\')\n  }\n  var increaseCountInUrl = function (max) {\n    var url   = new URL(window.location.href)\n    var count = 1 + (url.searchParams.get(\'reload\') || 0)\n\n    url.searchParams.set(\'reload\', count)\n    var nextUrl = url.toString()\n\n    var shouldStop = count > max\n    return [shouldStop, !shouldStop ? nextUrl : null]\n  }\n  var run = function () {\n    try {\n      var evt = new CustomEvent(\'kantuRunTestSuite\', { detail: { name: \'' + name + '\', from: \'html\', storageMode: \'' + Object(_services_storage__WEBPACK_IMPORTED_MODULE_3__["getStorageManager"])().getCurrentStrategyType() + '\' } })\n\n      window.dispatchEvent(evt)\n      var intervalTimer = setInterval(() => window.dispatchEvent(evt), 1000);\n\n      if (window.location.protocol === \'file:\') {\n        var onInvokeSuccess = function () {\n          clearTimeout(timer)\n          clearTimeout(reloadTimer)\n          clearInterval(intervalTimer)\n          window.removeEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n        }\n        var timer = setTimeout(function () {\n          alert(\'Error #201: It seems you need to turn on *Allow access to file URLs* for Kantu in your browser extension settings.\')\n        }, 8000)\n\n        window.addEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n      }\n    } catch (e) {\n      alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n    }\n  }\n  var main = function () {\n    if (isExtensionLoaded())  return run()\n\n    var MAX_TRY   = 3\n    var INTERVAL  = 1000\n    var tuple     = increaseCountInUrl(MAX_TRY)\n\n    if (tuple[0]) {\n      return alert(\'Error #202: It seems UI.Vision RPA is not installed yet, *or* you need to turn on *Allow access to file URLs* for UI.Vision RPA.\')\n    } else {\n      setTimeout(function () {\n        window.location.href = tuple[1]\n      }, INTERVAL)\n    }\n  }\n\n  main()\n})();\n</script>\n</body>\n</html>\n  ';
};

/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(__webpack_require__(93));
const debounce = __webpack_require__(86);
const utils_1 = __webpack_require__(4);
const ts_utils_1 = __webpack_require__(12);
var FlatStorageEvent;
(function (FlatStorageEvent) {
    FlatStorageEvent["ListChanged"] = "list_changed";
    FlatStorageEvent["FilesChanged"] = "files_changed";
})(FlatStorageEvent = exports.FlatStorageEvent || (exports.FlatStorageEvent = {}));
class FlatStorage extends eventemitter3_1.default {
    constructor(options = {}) {
        super();
        this.encode = (x, fileName) => x;
        this.decode = (x, fileName) => x;
        // Q: Why do we need debounce for followingemitXXX?
        // A: So that there could be more than 1 invocation of emitXXX in one operation
        //    And it will just emit once. For downstream like React / Vue, it won't trigger
        //    unnecessary render
        // Note: list changed event is for move (rename) / remove / clear / write a new file
        this.emitListChanged = debounce(() => {
            this.list()
                .then(fileInfos => {
                this.emit(FlatStorageEvent.ListChanged, fileInfos);
            });
        }, 100);
        this.changedFileNames = [];
        this.__emitFilesChanged = debounce(() => {
            const fileNames = this.changedFileNames;
            // Note: clear changedFileNames right after this method is called,
            // instead of waiting till promise resolved
            // so that new file changes won't be blocked or affect current emit
            this.changedFileNames = [];
            return Promise.all(fileNames.map(fileName => {
                return this.read(fileName, 'Text')
                    .catch(() => null);
            }))
                .then(contents => {
                if (contents.length === 0)
                    return;
                // Note: in case some files don't exist any more, filter by content
                const changedFiles = contents.map((content, i) => ({
                    content,
                    fileName: fileNames[i]
                }))
                    .filter(item => !!item.content);
                this.emit(FlatStorageEvent.FilesChanged, changedFiles);
            });
        }, 100);
        if (options.decode) {
            this.decode = options.decode;
        }
        if (options.encode) {
            this.encode = options.encode;
        }
    }
    list() {
        return this.__list()
            .then(items => {
            items.sort((a, b) => {
                const aFileName = a.fileName.toLowerCase();
                const bFileName = b.fileName.toLowerCase();
                if (aFileName < bFileName)
                    return -1;
                if (aFileName > bFileName)
                    return 1;
                return 0;
            });
            return items;
        });
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list()
            .then(items => {
            return Promise.all(items.map(item => {
                return this.read(item.fileName, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.fileName
                }));
            }));
        });
    }
    bulkWrite(list) {
        return Promise.all(list.map(item => this.write(item.fileName, item.content)))
            .then(() => { });
    }
    write(fileName, content) {
        return this.exists(fileName)
            .then(isExist => {
            const next = () => {
                if (!isExist)
                    this.emitListChanged();
                this.emitFilesChanged([fileName]);
            };
            return this.__write(fileName, content)
                .then(next);
        });
    }
    overwrite(fileName, content) {
        return this.__overwrite(fileName, content)
            .then(() => {
            this.emitFilesChanged([fileName]);
        });
    }
    clear() {
        return this.__clear()
            .then(() => {
            this.emitListChanged();
        });
    }
    remove(fileName) {
        return this.__remove(fileName)
            .then(() => {
            this.emitListChanged();
        });
    }
    rename(fileName, newName) {
        return this.__rename(fileName, newName)
            .then(() => {
            this.emitListChanged();
            this.emitFilesChanged([newName]);
        });
    }
    copy(fileName, newName) {
        const pName = newName && newName.length
            ? Promise.resolve(newName)
            : ts_utils_1.uniqueName(fileName, {
                generate: (old, step = 1) => {
                    const reg = /-(\d+)$/;
                    const m = old.match(reg);
                    if (!m)
                        return `${old}-${step}`;
                    return old.replace(reg, (_, n) => `-${parseInt(n, 10) + step}`);
                },
                check: (fileName) => {
                    return this.exists(fileName).then(exists => !exists);
                },
                postfixReg: /(_relative)?\.\w+$/
            });
        return pName.then(name => {
            return this.__copy(fileName, name)
                .then(() => {
                this.emitListChanged();
                this.emitFilesChanged([name]);
            });
        });
    }
    // Note: files changed event is for write file only  (rename excluded)
    emitFilesChanged(fileNames) {
        this.changedFileNames = fileNames.reduce((prev, fileName) => {
            if (prev.indexOf(fileName) === -1)
                prev.push(fileName);
            return prev;
        }, this.changedFileNames);
        this.__emitFilesChanged();
    }
}
exports.FlatStorage = FlatStorage;
exports.readableSize = (byteSize) => {
    const kb = 1024;
    const mb = kb * kb;
    if (byteSize < kb) {
        return byteSize + ' byte';
    }
    if (byteSize < mb) {
        return (byteSize / kb).toFixed(1) + ' KB';
    }
    return (byteSize / mb).toFixed(1) + ' MB';
};
function checkFileName(fileName) {
    utils_1.withFileExtension(fileName, (baseName) => {
        try {
            utils_1.validateStandardName(baseName, true);
        }
        catch (e) {
            throw new Error(`Invalid file name '${fileName}'. File name ` + e.message);
        }
        return baseName;
    });
}
exports.checkFileName = checkFileName;


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DesktopScreenshot;
(function (DesktopScreenshot) {
    let RequestType;
    (function (RequestType) {
        RequestType["DisplayVisualResult"] = "display_visual_result";
        RequestType["DisplayOcrResult"] = "display_ocr_result";
        RequestType["Capture"] = "capture";
    })(RequestType = DesktopScreenshot.RequestType || (DesktopScreenshot.RequestType = {}));
    let ImageSource;
    (function (ImageSource) {
        ImageSource[ImageSource["Storage"] = 0] = "Storage";
        ImageSource[ImageSource["HardDrive"] = 1] = "HardDrive";
        ImageSource[ImageSource["CV"] = 2] = "CV";
        ImageSource[ImageSource["DataUrl"] = 3] = "DataUrl";
    })(ImageSource = DesktopScreenshot.ImageSource || (DesktopScreenshot.ImageSource = {}));
    let RectType;
    (function (RectType) {
        RectType[RectType["Match"] = 0] = "Match";
        RectType[RectType["Reference"] = 1] = "Reference";
        RectType[RectType["BestMatch"] = 2] = "BestMatch";
        RectType[RectType["ReferenceOfBestMatch"] = 3] = "ReferenceOfBestMatch";
    })(RectType = DesktopScreenshot.RectType || (DesktopScreenshot.RectType = {}));
})(DesktopScreenshot = exports.DesktopScreenshot || (exports.DesktopScreenshot = {}));


/***/ }),

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(340);
const ts_utils_1 = __webpack_require__(12);
const kantu_cv_host_1 = __webpack_require__(341);
const base64_1 = __webpack_require__(342);
const utils_1 = __webpack_require__(4);
const dom_utils_1 = __webpack_require__(22);
const log_1 = __importDefault(__webpack_require__(11));
const path_1 = __importDefault(__webpack_require__(29));
exports.getNativeCVAPI = ts_utils_1.singletonGetter(() => {
    const nativeHost = new kantu_cv_host_1.KantuCVHost();
    let pReady = nativeHost.connectAsync().catch(e => {
        log_1.default.warn('pReady - error', e);
        throw e;
    });
    const api = constants_1.MethodTypeInvocationNames.reduce((prev, method) => {
        const camel = ts_utils_1.snakeToCamel(method);
        prev[camel] = (() => {
            const fn = (params) => pReady.then(() => {
                return nativeHost.invokeAsync(method, params)
                    .catch(e => {
                    // Note: Looks like for now whenever there is an error, you have to reconnect native host
                    // otherwise, all commands return "Disconnected" afterwards
                    const typeSafeAPI = api;
                    typeSafeAPI.reconnect().catch(() => { });
                    // Note: For now, native host doesn't provide any useful error message if captureDesktop fails
                    // but for most cases it's due to directory not exist
                    if (camel === 'captureDesktop') {
                        const filePath = params.path;
                        if (filePath && /[\\/]/.test(filePath)) {
                            throw new Error(`Failed to captureDesktop, please confirm directory exists at '${path_1.default.dirname(filePath)}'`);
                        }
                    }
                    throw e;
                });
            });
            return fn;
        })();
        return prev;
    }, {
        reconnect: () => {
            nativeHost.disconnect();
            pReady = nativeHost.connectAsync();
            return pReady.then(() => api);
        },
        searchDesktopWithGuard: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.searchDesktop(params).then(guardSearchResult);
        },
        getImageFromDataUrl: (dataUrl, dpi) => {
            const typeSafeAPI = api;
            const removeBase64Prefix = (str) => {
                const b64 = 'base64,';
                const i = str.indexOf(b64);
                if (i === -1)
                    return str;
                return str.substr(i + b64.length);
            };
            return typeSafeAPI.getImageInfo({ content: removeBase64Prefix(dataUrl) })
                .then(info => {
                const DEFAULT_DPI = 96;
                const dpiX = info.dpiX || dpi || DEFAULT_DPI;
                const dpiY = info.dpiY || dpi || DEFAULT_DPI;
                return serializeDataUrl(dataUrl, dpiX, dpiY);
            });
        },
        readFileAsArrayBuffer: (filePath) => {
            const typeSafeAPI = api;
            const readMore = (filePath, totalSize = Infinity, rangeStart = 0, dataUrls = []) => {
                return typeSafeAPI.readFileRange({
                    rangeStart,
                    path: filePath
                })
                    .then(range => {
                    const result = range.rangeEnd > range.rangeStart ? dataUrls.concat([range.buffer]) : dataUrls;
                    if (range.rangeEnd >= totalSize || range.rangeEnd <= range.rangeStart)
                        return result;
                    return readMore(filePath, totalSize, range.rangeEnd, result);
                });
            };
            return typeSafeAPI.getFileSize({ path: filePath })
                .then(fileSize => readMore(filePath, fileSize, 0, []))
                .then(dataUrls => {
                const arr = ts_utils_1.concatUint8Array(...dataUrls.map(dataUrl => new Uint8Array(utils_1.dataURItoArrayBuffer(dataUrl))));
                return arr.buffer;
            });
        },
        readFileAsBlob: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsArrayBuffer(filePath)
                .then(buffer => new Blob([buffer]));
        },
        readFileAsDataURL: (filePath, withBase64Prefix = true) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsBlob(filePath)
                .then(blob => utils_1.blobToDataURL(blob, withBase64Prefix));
        },
        readFileAsText: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsBlob(filePath)
                .then(blob => utils_1.blobToText(blob));
        },
        readFileAsBinaryString: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsArrayBuffer(filePath)
                .then(buffer => utils_1.arrayBufferToString(buffer));
        }
    });
    return api;
});
function guardSearchResult(result) {
    switch (result.errorCode) {
        case 0 /* Ok */:
            return result;
        case 2 /* NoGreenPinkBoxes */:
            throw new Error('Cannot find green and/or pink boxes');
        case 3 /* NoPinkBox */:
            throw new Error('Pattern image contains green box but does not contain pink box');
        case 4 /* TooManyGreenBox */:
            throw new Error('Pattern image contains more than one green box');
        case 5 /* TooManyPinkBox */:
            throw new Error('Pattern image contains more than one pink box');
        case 1 /* Fail */:
            throw new Error('Unspecified error has occured');
        default:
            throw new Error(`Unknown error code ${result.errorCode}`);
    }
}
exports.guardSearchResult = guardSearchResult;
function convertImageSearchResult(result, scale = 1, searchArea) {
    const { errorCode, containsGreenPinkBoxes, regions } = result;
    const convert = (region) => {
        var _a, _b;
        const searchAreaX = (_a = searchArea === null || searchArea === void 0 ? void 0 : searchArea.x) !== null && _a !== void 0 ? _a : 0;
        const searchAreaY = (_b = searchArea === null || searchArea === void 0 ? void 0 : searchArea.y) !== null && _b !== void 0 ? _b : 0;
        // All x, y in relativeRect and matchedRect are relatve to the whole screen
        if (!region.relativeRect) {
            return {
                matched: {
                    offsetLeft: scale * region.matchedRect.x - scale * searchAreaX,
                    offsetTop: scale * region.matchedRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.matchedRect.x,
                    viewportTop: scale * region.matchedRect.y,
                    pageLeft: scale * region.matchedRect.x,
                    pageTop: scale * region.matchedRect.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                },
                reference: null
            };
        }
        else {
            return {
                matched: {
                    offsetLeft: scale * region.relativeRect.x - scale * searchAreaX,
                    offsetTop: scale * region.relativeRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.relativeRect.x,
                    viewportTop: scale * region.relativeRect.y,
                    pageLeft: scale * region.relativeRect.x,
                    pageTop: scale * region.relativeRect.y,
                    width: scale * region.relativeRect.width,
                    height: scale * region.relativeRect.height,
                    score: region.score
                },
                reference: {
                    offsetLeft: scale * region.matchedRect.x - scale * searchAreaX,
                    offsetTop: scale * region.matchedRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.matchedRect.x,
                    viewportTop: scale * region.matchedRect.y,
                    pageLeft: scale * region.matchedRect.x,
                    pageTop: scale * region.matchedRect.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                }
            };
        }
    };
    return regions.map(r => convert(r));
}
exports.convertImageSearchResult = convertImageSearchResult;
function serializeImageData(imageData, dpiX, dpiY) {
    // Convert RGBA -> RGB -> Base64
    const w = imageData.width;
    const h = imageData.height;
    const src = imageData.data;
    const rgb = new Uint8Array(w * h * 3);
    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            const base = y * w + x;
            const k = 3 * base;
            const j = 4 * base;
            rgb[k + 0] = src[j + 0];
            rgb[k + 1] = src[j + 1];
            rgb[k + 2] = src[j + 2];
        }
    }
    const data = base64_1.base64.encode(rgb);
    return {
        width: w,
        height: h,
        dpiX,
        dpiY,
        data
    };
}
exports.serializeImageData = serializeImageData;
function serializeDataUrl(dataUrl, dpiX, dpiY) {
    return dom_utils_1.imageDataFromUrl(dataUrl)
        .then(imageData => serializeImageData(imageData, dpiX, dpiY));
}
exports.serializeDataUrl = serializeDataUrl;


/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(__webpack_require__(37));
var XModuleTypes;
(function (XModuleTypes) {
    XModuleTypes["XFile"] = "xFile";
    XModuleTypes["XUserIO"] = "xClick";
    XModuleTypes["XDesktop"] = "xDesktop";
    XModuleTypes["XScreenCapture"] = "xScreenCapture";
})(XModuleTypes = exports.XModuleTypes || (exports.XModuleTypes = {}));
class XModule {
    constructor() {
        this.cachedConfig = {};
        this.initConfig();
    }
    getVersion() {
        return this.getAPI()
            .reconnect()
            .catch(e => {
            throw new Error(`${this.getName()} is not installed yet`);
        })
            .then(api => {
            return api.getVersion()
                .then(version => ({
                version,
                installed: true
            }));
        })
            .catch(e => ({
            installed: false
        }));
    }
    setConfig(config) {
        this.cachedConfig = Object.assign(Object.assign({}, this.cachedConfig), config);
        return this.getConfig()
            .then(oldConfig => {
            const nextConfig = Object.assign(Object.assign({}, oldConfig), config);
            return storage_1.default.set(this.getStoreKey(), nextConfig)
                .then(success => {
                if (success) {
                    this.cachedConfig = nextConfig;
                }
                return success;
            });
        });
    }
    getConfig() {
        return storage_1.default.get(this.getStoreKey())
            .then(data => {
            this.cachedConfig = data || {};
            return this.cachedConfig;
        });
    }
    getCachedConfig() {
        return this.cachedConfig;
    }
    getStoreKey() {
        return this.getName().toLowerCase();
    }
}
exports.XModule = XModule;


/***/ })

/******/ });