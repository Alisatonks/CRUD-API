/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/dotenv/lib/main.js":
/*!*****************************************!*\
  !*** ./node_modules/dotenv/lib/main.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst os = __webpack_require__(/*! os */ \"os\")\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\nconst packageJson = __webpack_require__(/*! ../package.json */ \"./node_modules/dotenv/package.json\")\n\nconst version = packageJson.version\n\nconst LINE = /(?:^|^)\\s*(?:export\\s+)?([\\w.-]+)(?:\\s*=\\s*?|:\\s+?)(\\s*'(?:\\\\'|[^'])*'|\\s*\"(?:\\\\\"|[^\"])*\"|\\s*`(?:\\\\`|[^`])*`|[^#\\r\\n]+)?\\s*(?:#.*)?(?:$|$)/mg\n\n// Parse src into an Object\nfunction parse (src) {\n  const obj = {}\n\n  // Convert buffer to string\n  let lines = src.toString()\n\n  // Convert line breaks to same format\n  lines = lines.replace(/\\r\\n?/mg, '\\n')\n\n  let match\n  while ((match = LINE.exec(lines)) != null) {\n    const key = match[1]\n\n    // Default undefined or null to empty string\n    let value = (match[2] || '')\n\n    // Remove whitespace\n    value = value.trim()\n\n    // Check if double quoted\n    const maybeQuote = value[0]\n\n    // Remove surrounding quotes\n    value = value.replace(/^(['\"`])([\\s\\S]*)\\1$/mg, '$2')\n\n    // Expand newlines if double quoted\n    if (maybeQuote === '\"') {\n      value = value.replace(/\\\\n/g, '\\n')\n      value = value.replace(/\\\\r/g, '\\r')\n    }\n\n    // Add to object\n    obj[key] = value\n  }\n\n  return obj\n}\n\nfunction _parseVault (options) {\n  const vaultPath = _vaultPath(options)\n\n  // Parse .env.vault\n  const result = DotenvModule.configDotenv({ path: vaultPath })\n  if (!result.parsed) {\n    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)\n    err.code = 'MISSING_DATA'\n    throw err\n  }\n\n  // handle scenario for comma separated keys - for use with key rotation\n  // example: DOTENV_KEY=\"dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod\"\n  const keys = _dotenvKey(options).split(',')\n  const length = keys.length\n\n  let decrypted\n  for (let i = 0; i < length; i++) {\n    try {\n      // Get full key\n      const key = keys[i].trim()\n\n      // Get instructions for decrypt\n      const attrs = _instructions(result, key)\n\n      // Decrypt\n      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)\n\n      break\n    } catch (error) {\n      // last key\n      if (i + 1 >= length) {\n        throw error\n      }\n      // try next key\n    }\n  }\n\n  // Parse decrypted .env string\n  return DotenvModule.parse(decrypted)\n}\n\nfunction _log (message) {\n  console.log(`[dotenv@${version}][INFO] ${message}`)\n}\n\nfunction _warn (message) {\n  console.log(`[dotenv@${version}][WARN] ${message}`)\n}\n\nfunction _debug (message) {\n  console.log(`[dotenv@${version}][DEBUG] ${message}`)\n}\n\nfunction _dotenvKey (options) {\n  // prioritize developer directly setting options.DOTENV_KEY\n  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {\n    return options.DOTENV_KEY\n  }\n\n  // secondary infra already contains a DOTENV_KEY environment variable\n  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {\n    return process.env.DOTENV_KEY\n  }\n\n  // fallback to empty string\n  return ''\n}\n\nfunction _instructions (result, dotenvKey) {\n  // Parse DOTENV_KEY. Format is a URI\n  let uri\n  try {\n    uri = new URL(dotenvKey)\n  } catch (error) {\n    if (error.code === 'ERR_INVALID_URL') {\n      const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development')\n      err.code = 'INVALID_DOTENV_KEY'\n      throw err\n    }\n\n    throw error\n  }\n\n  // Get decrypt key\n  const key = uri.password\n  if (!key) {\n    const err = new Error('INVALID_DOTENV_KEY: Missing key part')\n    err.code = 'INVALID_DOTENV_KEY'\n    throw err\n  }\n\n  // Get environment\n  const environment = uri.searchParams.get('environment')\n  if (!environment) {\n    const err = new Error('INVALID_DOTENV_KEY: Missing environment part')\n    err.code = 'INVALID_DOTENV_KEY'\n    throw err\n  }\n\n  // Get ciphertext payload\n  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`\n  const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION\n  if (!ciphertext) {\n    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`)\n    err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT'\n    throw err\n  }\n\n  return { ciphertext, key }\n}\n\nfunction _vaultPath (options) {\n  let possibleVaultPath = null\n\n  if (options && options.path && options.path.length > 0) {\n    if (Array.isArray(options.path)) {\n      for (const filepath of options.path) {\n        if (fs.existsSync(filepath)) {\n          possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`\n        }\n      }\n    } else {\n      possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`\n    }\n  } else {\n    possibleVaultPath = path.resolve(process.cwd(), '.env.vault')\n  }\n\n  if (fs.existsSync(possibleVaultPath)) {\n    return possibleVaultPath\n  }\n\n  return null\n}\n\nfunction _resolveHome (envPath) {\n  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath\n}\n\nfunction _configVault (options) {\n  _log('Loading env from encrypted .env.vault')\n\n  const parsed = DotenvModule._parseVault(options)\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsed, options)\n\n  return { parsed }\n}\n\nfunction configDotenv (options) {\n  const dotenvPath = path.resolve(process.cwd(), '.env')\n  let encoding = 'utf8'\n  const debug = Boolean(options && options.debug)\n\n  if (options && options.encoding) {\n    encoding = options.encoding\n  } else {\n    if (debug) {\n      _debug('No encoding is specified. UTF-8 is used by default')\n    }\n  }\n\n  let optionPaths = [dotenvPath] // default, look for .env\n  if (options && options.path) {\n    if (!Array.isArray(options.path)) {\n      optionPaths = [_resolveHome(options.path)]\n    } else {\n      optionPaths = [] // reset default\n      for (const filepath of options.path) {\n        optionPaths.push(_resolveHome(filepath))\n      }\n    }\n  }\n\n  // Build the parsed data in a temporary object (because we need to return it).  Once we have the final\n  // parsed data, we will combine it with process.env (or options.processEnv if provided).\n  let lastError\n  const parsedAll = {}\n  for (const path of optionPaths) {\n    try {\n      // Specifying an encoding returns a string instead of a buffer\n      const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }))\n\n      DotenvModule.populate(parsedAll, parsed, options)\n    } catch (e) {\n      if (debug) {\n        _debug(`Failed to load ${path} ${e.message}`)\n      }\n      lastError = e\n    }\n  }\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsedAll, options)\n\n  if (lastError) {\n    return { parsed: parsedAll, error: lastError }\n  } else {\n    return { parsed: parsedAll }\n  }\n}\n\n// Populates process.env from .env file\nfunction config (options) {\n  // fallback to original dotenv if DOTENV_KEY is not set\n  if (_dotenvKey(options).length === 0) {\n    return DotenvModule.configDotenv(options)\n  }\n\n  const vaultPath = _vaultPath(options)\n\n  // dotenvKey exists but .env.vault file does not exist\n  if (!vaultPath) {\n    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`)\n\n    return DotenvModule.configDotenv(options)\n  }\n\n  return DotenvModule._configVault(options)\n}\n\nfunction decrypt (encrypted, keyStr) {\n  const key = Buffer.from(keyStr.slice(-64), 'hex')\n  let ciphertext = Buffer.from(encrypted, 'base64')\n\n  const nonce = ciphertext.subarray(0, 12)\n  const authTag = ciphertext.subarray(-16)\n  ciphertext = ciphertext.subarray(12, -16)\n\n  try {\n    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)\n    aesgcm.setAuthTag(authTag)\n    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`\n  } catch (error) {\n    const isRange = error instanceof RangeError\n    const invalidKeyLength = error.message === 'Invalid key length'\n    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'\n\n    if (isRange || invalidKeyLength) {\n      const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)')\n      err.code = 'INVALID_DOTENV_KEY'\n      throw err\n    } else if (decryptionFailed) {\n      const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY')\n      err.code = 'DECRYPTION_FAILED'\n      throw err\n    } else {\n      throw error\n    }\n  }\n}\n\n// Populate process.env with parsed values\nfunction populate (processEnv, parsed, options = {}) {\n  const debug = Boolean(options && options.debug)\n  const override = Boolean(options && options.override)\n\n  if (typeof parsed !== 'object') {\n    const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')\n    err.code = 'OBJECT_REQUIRED'\n    throw err\n  }\n\n  // Set process.env\n  for (const key of Object.keys(parsed)) {\n    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {\n      if (override === true) {\n        processEnv[key] = parsed[key]\n      }\n\n      if (debug) {\n        if (override === true) {\n          _debug(`\"${key}\" is already defined and WAS overwritten`)\n        } else {\n          _debug(`\"${key}\" is already defined and was NOT overwritten`)\n        }\n      }\n    } else {\n      processEnv[key] = parsed[key]\n    }\n  }\n}\n\nconst DotenvModule = {\n  configDotenv,\n  _configVault,\n  _parseVault,\n  config,\n  decrypt,\n  parse,\n  populate\n}\n\nmodule.exports.configDotenv = DotenvModule.configDotenv\nmodule.exports._configVault = DotenvModule._configVault\nmodule.exports._parseVault = DotenvModule._parseVault\nmodule.exports.config = DotenvModule.config\nmodule.exports.decrypt = DotenvModule.decrypt\nmodule.exports.parse = DotenvModule.parse\nmodule.exports.populate = DotenvModule.populate\n\nmodule.exports = DotenvModule\n\n\n//# sourceURL=webpack://crud-api/./node_modules/dotenv/lib/main.js?");

/***/ }),

/***/ "./src/db/memoryDB.ts":
/*!****************************!*\
  !*** ./src/db/memoryDB.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeUsers: () => (/* binding */ initializeUsers),\n/* harmony export */   users: () => (/* binding */ users)\n/* harmony export */ });\nlet users = [];\nconst initializeUsers = (initialUsers = []) => {\n    users = initialUsers;\n};\n\n\n//# sourceURL=webpack://crud-api/./src/db/memoryDB.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ \"./node_modules/dotenv/lib/main.js\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _methods_get_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./methods/get-request */ \"./src/methods/get-request.ts\");\n/* harmony import */ var _methods_delete_request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./methods/delete-request */ \"./src/methods/delete-request.ts\");\n/* harmony import */ var _methods_put_request__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./methods/put-request */ \"./src/methods/put-request.ts\");\n/* harmony import */ var _methods_post_request__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./methods/post-request */ \"./src/methods/post-request.ts\");\n/* harmony import */ var _utils_loadUsers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/loadUsers */ \"./src/utils/loadUsers.ts\");\n/* harmony import */ var _db_memoryDB__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./db/memoryDB */ \"./src/db/memoryDB.ts\");\n/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/constants */ \"./src/utils/constants.ts\");\n\n\n\n\n\n\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_1___default().config();\nconst PORT = process.env.PORT || 4002;\nasync function startServer() {\n    try {\n        await (0,_utils_loadUsers__WEBPACK_IMPORTED_MODULE_6__[\"default\"])();\n        const server = http__WEBPACK_IMPORTED_MODULE_0___default().createServer((req, res) => {\n            req.users = _db_memoryDB__WEBPACK_IMPORTED_MODULE_7__.users;\n            try {\n                switch (req.method) {\n                    case 'GET':\n                        (0,_methods_get_request__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(req, res);\n                        break;\n                    case 'POST':\n                        (0,_methods_post_request__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(req, res);\n                        break;\n                    case 'PUT':\n                        (0,_methods_put_request__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(req, res);\n                        break;\n                    case 'DELETE':\n                        (0,_methods_delete_request__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(req, res);\n                        break;\n                    default:\n                        res.statusCode = 404;\n                        res.setHeader('Content-Type', 'application/json');\n                        res.end(JSON.stringify({ title: 'Not found', message: 'Route not found' }));\n                }\n            }\n            catch (error) {\n                console.error(_utils_constants__WEBPACK_IMPORTED_MODULE_8__.SERVER_ERROR, error);\n                res.statusCode = 500;\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.end(JSON.stringify({\n                    title: _utils_constants__WEBPACK_IMPORTED_MODULE_8__.SERVER_ERROR,\n                    message: _utils_constants__WEBPACK_IMPORTED_MODULE_8__.SERVER_ERROR_MSG\n                }));\n            }\n        });\n        server.listen(PORT, () => {\n            console.log(`Server started on PORT: ${PORT}`);\n        });\n    }\n    catch (error) {\n        console.error('Error starting the server:', error);\n    }\n}\nstartServer();\n\n\n//# sourceURL=webpack://crud-api/./src/index.ts?");

/***/ }),

/***/ "./src/methods/delete-request.ts":
/*!***************************************!*\
  !*** ./src/methods/delete-request.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBaseUrlAndID */ \"./src/utils/getBaseUrlAndID.ts\");\n/* harmony import */ var _utils_checkId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/checkId */ \"./src/utils/checkId.ts\");\n/* harmony import */ var _db_memoryDB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../db/memoryDB */ \"./src/db/memoryDB.ts\");\n/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/constants */ \"./src/utils/constants.ts\");\n\n\n\n\nconst deleteRequest = (req, res) => {\n    const { baseUrl, id } = (0,_utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(req.url || '');\n    if (baseUrl === '/api/users') {\n        if (id) {\n            if (!(0,_utils_checkId__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(id)) {\n                res.statusCode = 400;\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.ID_NOT_VALID }));\n            }\n            else if ((0,_utils_checkId__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(id)) {\n                const index = _db_memoryDB__WEBPACK_IMPORTED_MODULE_2__.users.findIndex(user => user.id === id);\n                if (index === -1) {\n                    res.statusCode = 404;\n                    res.setHeader(\"Content-Type\", \"application/json\");\n                    res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.USER_NOT_FOUND }));\n                }\n                else {\n                    _db_memoryDB__WEBPACK_IMPORTED_MODULE_2__.users.splice(index, 1);\n                    res.writeHead(204, { \"Content-Type\": \"application/json\" });\n                    res.end();\n                }\n            }\n        }\n        else {\n            res.statusCode = 400;\n            res.setHeader(\"Content-Type\", \"application/json\");\n            res.end(JSON.stringify({ title: 'Error', message: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.USER_ID_MISSING }));\n        }\n    }\n    else {\n        res.statusCode = 404;\n        res.setHeader(\"Content-Type\", \"application/json\");\n        res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_3__.ROUTE_NOT_FOUND }));\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deleteRequest);\n\n\n//# sourceURL=webpack://crud-api/./src/methods/delete-request.ts?");

/***/ }),

/***/ "./src/methods/get-request.ts":
/*!************************************!*\
  !*** ./src/methods/get-request.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBaseUrlAndID */ \"./src/utils/getBaseUrlAndID.ts\");\n/* harmony import */ var _utils_checkId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/checkId */ \"./src/utils/checkId.ts\");\n/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/constants */ \"./src/utils/constants.ts\");\n\n\n\nconst getRequest = (req, res) => {\n    const { baseUrl, id } = (0,_utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(req.url || '');\n    if (baseUrl === '/api/users') {\n        if (!id) {\n            res.statusCode = 200;\n            res.setHeader(\"Content-Type\", \"application/json\");\n            res.write(JSON.stringify(req.users));\n            res.end();\n        }\n        else {\n            if (!(0,_utils_checkId__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(id)) {\n                res.statusCode = 400;\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.ID_NOT_VALID }));\n            }\n            else if ((0,_utils_checkId__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(id)) {\n                const filteredUsers = req.users?.filter(user => user.id === id);\n                if (filteredUsers && filteredUsers.length > 0) {\n                    res.statusCode = 200;\n                    res.setHeader(\"Content-Type\", \"application/json\");\n                    res.write(JSON.stringify(filteredUsers[0]));\n                    res.end();\n                }\n                else {\n                    res.statusCode = 404;\n                    res.setHeader(\"Content-Type\", \"application/json\");\n                    res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.USER_NOT_FOUND }));\n                }\n            }\n        }\n    }\n    else {\n        res.statusCode = 404;\n        res.setHeader(\"Content-Type\", \"application/json\");\n        res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.ROUTE_NOT_FOUND }));\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRequest);\n\n\n//# sourceURL=webpack://crud-api/./src/methods/get-request.ts?");

/***/ }),

/***/ "./src/methods/post-request.ts":
/*!*************************************!*\
  !*** ./src/methods/post-request.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ \"node:crypto\");\n/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ \"./src/utils/constants.ts\");\n/* harmony import */ var _utils_bodyParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/bodyParser */ \"./src/utils/bodyParser.ts\");\n/* harmony import */ var _db_memoryDB__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../db/memoryDB */ \"./src/db/memoryDB.ts\");\n\n\n\n\nconst postRequest = async (req, res) => {\n    if (req.url === '/api/users') {\n        try {\n            const body = await (0,_utils_bodyParser__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(req);\n            if (!body.username || !body.age || !body.hobbies) {\n                res.statusCode = 400;\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.BODY_NOT_VALID }));\n                return;\n            }\n            body.id = node_crypto__WEBPACK_IMPORTED_MODULE_0___default().randomUUID();\n            const newUser = body;\n            _db_memoryDB__WEBPACK_IMPORTED_MODULE_3__.users.push(newUser);\n            res.writeHead(201, { \"Content-Type\": \"application/json\" });\n            res.end();\n        }\n        catch (e) {\n            console.log(e);\n            res.statusCode = 400;\n            res.setHeader(\"Content-Type\", \"application/json\");\n            res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.BODY_NOT_VALID }));\n        }\n    }\n    else {\n        res.statusCode = 404;\n        res.setHeader(\"Content-Type\", \"application/json\");\n        res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.ROUTE_NOT_FOUND }));\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (postRequest);\n\n\n//# sourceURL=webpack://crud-api/./src/methods/post-request.ts?");

/***/ }),

/***/ "./src/methods/put-request.ts":
/*!************************************!*\
  !*** ./src/methods/put-request.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_bodyParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/bodyParser */ \"./src/utils/bodyParser.ts\");\n/* harmony import */ var _db_memoryDB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../db/memoryDB */ \"./src/db/memoryDB.ts\");\n/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/constants */ \"./src/utils/constants.ts\");\n/* harmony import */ var _utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBaseUrlAndID */ \"./src/utils/getBaseUrlAndID.ts\");\n/* harmony import */ var _utils_checkId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/checkId */ \"./src/utils/checkId.ts\");\n\n\n\n\n\nconst putRequest = async (req, res) => {\n    const { baseUrl, id } = (0,_utils_getBaseUrlAndID__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(req.url || '');\n    if (baseUrl === '/api/users') {\n        if (id) {\n            if (!(0,_utils_checkId__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(id)) {\n                res.statusCode = 400;\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.ID_NOT_VALID }));\n            }\n            else if ((0,_utils_checkId__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(id)) {\n                const index = _db_memoryDB__WEBPACK_IMPORTED_MODULE_1__.users.findIndex(user => user.id === id);\n                if (index === -1) {\n                    res.statusCode = 404;\n                    res.setHeader(\"Content-Type\", \"application/json\");\n                    res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.USER_NOT_FOUND }));\n                }\n                else {\n                    try {\n                        const body = await (0,_utils_bodyParser__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(req);\n                        if (!body.username || !body.age || !body.hobbies) {\n                            res.statusCode = 400;\n                            res.setHeader(\"Content-Type\", \"application/json\");\n                            res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.VALIDATION_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.BODY_NOT_VALID }));\n                            return;\n                        }\n                        _db_memoryDB__WEBPACK_IMPORTED_MODULE_1__.users[index] = {\n                            ..._db_memoryDB__WEBPACK_IMPORTED_MODULE_1__.users[index],\n                            ...body,\n                            id\n                        };\n                        res.writeHead(204, { \"Content-Type\": \"application/json\" });\n                        res.end();\n                    }\n                    catch (error) {\n                        res.statusCode = 500;\n                        res.setHeader(\"Content-Type\", \"application/json\");\n                        res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.SERVER_ERROR, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.SERVER_ERROR }));\n                    }\n                }\n            }\n        }\n        else {\n            res.statusCode = 400;\n            res.setHeader(\"Content-Type\", \"application/json\");\n            res.end(JSON.stringify({ title: 'Error', message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.USER_ID_MISSING }));\n        }\n    }\n    else {\n        res.statusCode = 404;\n        res.setHeader(\"Content-Type\", \"application/json\");\n        res.end(JSON.stringify({ title: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.NOT_FOUND, message: _utils_constants__WEBPACK_IMPORTED_MODULE_2__.ROUTE_NOT_FOUND }));\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (putRequest);\n\n\n//# sourceURL=webpack://crud-api/./src/methods/put-request.ts?");

/***/ }),

/***/ "./src/utils/bodyParser.ts":
/*!*********************************!*\
  !*** ./src/utils/bodyParser.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst bodyParser = (req) => {\n    return new Promise((resolve, reject) => {\n        let body = '';\n        req.on('data', chunk => body += chunk);\n        req.on('end', () => {\n            try {\n                const parsedBody = JSON.parse(body);\n                resolve(parsedBody);\n            }\n            catch (e) {\n                console.error('Error parsing request body:', e);\n                reject(e);\n            }\n        });\n        req.on('error', (err) => {\n            console.error('Request error:', err);\n            reject(err);\n        });\n    });\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bodyParser);\n\n\n//# sourceURL=webpack://crud-api/./src/utils/bodyParser.ts?");

/***/ }),

/***/ "./src/utils/checkId.ts":
/*!******************************!*\
  !*** ./src/utils/checkId.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst checkID = (id) => {\n    const regExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;\n    return regExp.test(id);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (checkID);\n\n\n//# sourceURL=webpack://crud-api/./src/utils/checkId.ts?");

/***/ }),

/***/ "./src/utils/constants.ts":
/*!********************************!*\
  !*** ./src/utils/constants.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BODY_NOT_VALID: () => (/* binding */ BODY_NOT_VALID),\n/* harmony export */   FAIL: () => (/* binding */ FAIL),\n/* harmony export */   ID_NOT_VALID: () => (/* binding */ ID_NOT_VALID),\n/* harmony export */   INVALID_DATA: () => (/* binding */ INVALID_DATA),\n/* harmony export */   NOT_FOUND: () => (/* binding */ NOT_FOUND),\n/* harmony export */   ROUTE_NOT_FOUND: () => (/* binding */ ROUTE_NOT_FOUND),\n/* harmony export */   SERVER_ERROR: () => (/* binding */ SERVER_ERROR),\n/* harmony export */   SERVER_ERROR_MSG: () => (/* binding */ SERVER_ERROR_MSG),\n/* harmony export */   SUCCESS: () => (/* binding */ SUCCESS),\n/* harmony export */   USER_CREATED: () => (/* binding */ USER_CREATED),\n/* harmony export */   USER_ID_MISSING: () => (/* binding */ USER_ID_MISSING),\n/* harmony export */   USER_NOT_FOUND: () => (/* binding */ USER_NOT_FOUND),\n/* harmony export */   VALIDATION_ERROR: () => (/* binding */ VALIDATION_ERROR)\n/* harmony export */ });\nconst VALIDATION_ERROR = 'Validation Error';\nconst ID_NOT_VALID = 'UUID is not valid';\nconst NOT_FOUND = 'Not Found';\nconst ROUTE_NOT_FOUND = 'Route not found';\nconst USER_NOT_FOUND = 'User is not found';\nconst USER_CREATED = 'User created successfully';\nconst SUCCESS = 'Successful operation';\nconst FAIL = 'Operation failed';\nconst INVALID_DATA = 'Invalid JSON data';\nconst SERVER_ERROR = 'Server error';\nconst SERVER_ERROR_MSG = 'Something went wrong on the server. Please try again later.';\nconst BODY_NOT_VALID = 'Request body is not valid';\nconst USER_ID_MISSING = 'User ID is missing';\n\n\n//# sourceURL=webpack://crud-api/./src/utils/constants.ts?");

/***/ }),

/***/ "./src/utils/getBaseUrlAndID.ts":
/*!**************************************!*\
  !*** ./src/utils/getBaseUrlAndID.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst getBaseUrlAndID = (url) => {\n    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;\n    const parts = normalizedUrl.split('/');\n    const baseUrl = parts.slice(0, 3).join('/');\n    const id = parts[3] || undefined;\n    return { baseUrl, id };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getBaseUrlAndID);\n\n\n//# sourceURL=webpack://crud-api/./src/utils/getBaseUrlAndID.ts?");

/***/ }),

/***/ "./src/utils/loadUsers.ts":
/*!********************************!*\
  !*** ./src/utils/loadUsers.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:fs */ \"node:fs\");\n/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _db_memoryDB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../db/memoryDB */ \"./src/db/memoryDB.ts\");\n\n\n\nasync function loadUsers() {\n    try {\n        const __dirname = /* unsupported import.meta.dirname */ undefined;\n        const usersPath = node_path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, '..', 'data', 'users.json');\n        const usersData = await node_fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(usersPath, 'utf-8');\n        const initialUsers = JSON.parse(usersData);\n        (0,_db_memoryDB__WEBPACK_IMPORTED_MODULE_2__.initializeUsers)(initialUsers);\n    }\n    catch (e) {\n        console.error('Error loading initial users:', e);\n        (0,_db_memoryDB__WEBPACK_IMPORTED_MODULE_2__.initializeUsers)([]);\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadUsers);\n\n\n//# sourceURL=webpack://crud-api/./src/utils/loadUsers.ts?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "./node_modules/dotenv/package.json":
/*!******************************************!*\
  !*** ./node_modules/dotenv/package.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = /*#__PURE__*/JSON.parse('{\"name\":\"dotenv\",\"version\":\"16.4.5\",\"description\":\"Loads environment variables from .env file\",\"main\":\"lib/main.js\",\"types\":\"lib/main.d.ts\",\"exports\":{\".\":{\"types\":\"./lib/main.d.ts\",\"require\":\"./lib/main.js\",\"default\":\"./lib/main.js\"},\"./config\":\"./config.js\",\"./config.js\":\"./config.js\",\"./lib/env-options\":\"./lib/env-options.js\",\"./lib/env-options.js\":\"./lib/env-options.js\",\"./lib/cli-options\":\"./lib/cli-options.js\",\"./lib/cli-options.js\":\"./lib/cli-options.js\",\"./package.json\":\"./package.json\"},\"scripts\":{\"dts-check\":\"tsc --project tests/types/tsconfig.json\",\"lint\":\"standard\",\"lint-readme\":\"standard-markdown\",\"pretest\":\"npm run lint && npm run dts-check\",\"test\":\"tap tests/*.js --100 -Rspec\",\"test:coverage\":\"tap --coverage-report=lcov\",\"prerelease\":\"npm test\",\"release\":\"standard-version\"},\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/motdotla/dotenv.git\"},\"funding\":\"https://dotenvx.com\",\"keywords\":[\"dotenv\",\"env\",\".env\",\"environment\",\"variables\",\"config\",\"settings\"],\"readmeFilename\":\"README.md\",\"license\":\"BSD-2-Clause\",\"devDependencies\":{\"@definitelytyped/dtslint\":\"^0.0.133\",\"@types/node\":\"^18.11.3\",\"decache\":\"^4.6.1\",\"sinon\":\"^14.0.1\",\"standard\":\"^17.0.0\",\"standard-markdown\":\"^7.1.0\",\"standard-version\":\"^9.5.0\",\"tap\":\"^16.3.0\",\"tar\":\"^6.1.11\",\"typescript\":\"^4.8.4\"},\"engines\":{\"node\":\">=12\"},\"browser\":{\"fs\":false}}');\n\n//# sourceURL=webpack://crud-api/./node_modules/dotenv/package.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;