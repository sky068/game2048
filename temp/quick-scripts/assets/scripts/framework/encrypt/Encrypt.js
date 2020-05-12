(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/encrypt/Encrypt.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd01c6ZTO/VDm45rxncbJpPQ', 'Encrypt', __filename);
// scripts/framework/encrypt/Encrypt.js

/*!
 * Copyright (c) 2015 Sri Harsha <sri.harsha@zenq.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (name, definition) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && _typeof(define.amd) === 'object') {
        define(definition);
    } else if (typeof define === 'function' && _typeof(define.petal) === 'object') {
        define(name, [], definition);
    } else {
        this[name] = definition();
    }
})('encryptjs', function (encryptjs) {
    var rl = void 0;
    //Electron doesnt support stdin, so dont setup CLI if its not available.

    encryptjs = { version: '1.0.0' };

    //Right before exporting the validator object, pass each of the builtins
    //through extend() so that their first argument is coerced to a string
    encryptjs.init = function () {
        console.log("--------------------Applying Encryption Algorithm------------------ ");
    };

    var Algo = null;
    if (typeof module != 'undefined' && module.exports) {
        Algo = require('./Algo'); // CommonJS (Node.js)
    }

    encryptjs.encrypt = function (plaintext, password, nBits) {
        var blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4)
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return ''; // standard allows 128/192/256 bit keys
        plaintext = String(plaintext).utf8Encode();
        password = String(password).utf8Encode();

        // use AES itself to encrypt password to get cipher key (using plain password as source for key
        // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
        var nBytes = nBits / 8; // no bytes in key (16/24/32)
        var pwBytes = new Array(nBytes);
        for (var i = 0; i < nBytes; i++) {
            // use 1st 16/24/32 chars of password for key
            pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
        }
        var key = Algo.cipher(pwBytes, Algo.keyExpansion(pwBytes)); // gives us 16-byte key
        key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

        // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A �B.2): [0-1] = millisec,
        // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
        var counterBlock = new Array(blockSize);

        var nonce = new Date().getTime(); // timestamp: milliseconds since 1-Jan-1970
        var nonceMs = nonce % 1000;
        var nonceSec = Math.floor(nonce / 1000);
        var nonceRnd = Math.floor(Math.random() * 0xffff);
        // for debugging: nonce = nonceMs = nonceSec = nonceRnd = 0;

        for (var _i = 0; _i < 2; _i++) {
            counterBlock[_i] = nonceMs >>> _i * 8 & 0xff;
        }for (var _i2 = 0; _i2 < 2; _i2++) {
            counterBlock[_i2 + 2] = nonceRnd >>> _i2 * 8 & 0xff;
        }for (var _i3 = 0; _i3 < 4; _i3++) {
            counterBlock[_i3 + 4] = nonceSec >>> _i3 * 8 & 0xff;
        } // and convert it to a string to go on the front of the ciphertext
        var ctrTxt = '';
        for (var _i4 = 0; _i4 < 8; _i4++) {
            ctrTxt += String.fromCharCode(counterBlock[_i4]);
        } // generate key schedule - an expansion of the key into distinct Key Rounds for each round
        var keySchedule = Algo.keyExpansion(key);

        var blockCount = Math.ceil(plaintext.length / blockSize);
        var ciphertxt = new Array(blockCount); // ciphertext as array of strings

        for (var b = 0; b < blockCount; b++) {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
            for (var c = 0; c < 4; c++) {
                counterBlock[15 - c] = b >>> c * 8 & 0xff;
            }for (var _c = 0; _c < 4; _c++) {
                counterBlock[15 - _c - 4] = b / 0x100000000 >>> _c * 8;
            }var cipherCntr = Algo.cipher(counterBlock, keySchedule); // -- encrypt counter block --

            // block size is reduced on final block
            var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
            var cipherChar = new Array(blockLength);

            for (var _i5 = 0; _i5 < blockLength; _i5++) {
                // -- xor plaintext with ciphered counter char-by-char --
                cipherChar[_i5] = cipherCntr[_i5] ^ plaintext.charCodeAt(b * blockSize + _i5);
                cipherChar[_i5] = String.fromCharCode(cipherChar[_i5]);
            }
            ciphertxt[b] = cipherChar.join('');
        }

        // use Array.join() for better performance than repeated string appends
        var ciphertext = ctrTxt + ciphertxt.join('');
        // ciphertext = ciphertext.base64Encode();
        ciphertext = encryptjs.base64Encode(ciphertext);

        return ciphertext;
    };

    encryptjs.decrypt = function (ciphertext, password, nBits) {
        var blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits == 128 || nBits == 192 || nBits == 256)) return ''; // standard allows 128/192/256 bit keys
        // ciphertext = String(ciphertext).base64Decode();
        ciphertext = encryptjs.base64Decode(String(ciphertext));
        password = String(password).utf8Encode();

        // use AES to encrypt password (mirroring encrypt routine)
        var nBytes = nBits / 8; // no bytes in key
        var pwBytes = new Array(nBytes);
        for (var i = 0; i < nBytes; i++) {
            pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
        }
        var key = Algo.cipher(pwBytes, Algo.keyExpansion(pwBytes));
        key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

        // recover nonce from 1st 8 bytes of ciphertext
        var counterBlock = new Array(8);
        var ctrTxt = ciphertext.slice(0, 8);
        for (var _i6 = 0; _i6 < 8; _i6++) {
            counterBlock[_i6] = ctrTxt.charCodeAt(_i6);
        } // generate key schedule
        var keySchedule = Algo.keyExpansion(key);

        // separate ciphertext into blocks (skipping past initial 8 bytes)
        var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
        var ct = new Array(nBlocks);
        for (var b = 0; b < nBlocks; b++) {
            ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
        }ciphertext = ct; // ciphertext is now array of block-length strings

        // plaintext will get generated block-by-block into array of block-length strings
        var plaintxt = new Array(ciphertext.length);

        for (var _b = 0; _b < nBlocks; _b++) {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            for (var c = 0; c < 4; c++) {
                counterBlock[15 - c] = _b >>> c * 8 & 0xff;
            }for (var _c2 = 0; _c2 < 4; _c2++) {
                counterBlock[15 - _c2 - 4] = (_b + 1) / 0x100000000 - 1 >>> _c2 * 8 & 0xff;
            }var cipherCntr = Algo.cipher(counterBlock, keySchedule); // encrypt counter block

            var plaintxtByte = new Array(ciphertext[_b].length);
            for (var _i7 = 0; _i7 < ciphertext[_b].length; _i7++) {
                // -- xor plaintxt with ciphered counter byte-by-byte --
                plaintxtByte[_i7] = cipherCntr[_i7] ^ ciphertext[_b].charCodeAt(_i7);
                plaintxtByte[_i7] = String.fromCharCode(plaintxtByte[_i7]);
            }
            plaintxt[_b] = plaintxtByte.join('');
        }

        // join array of blocks into single plaintext string
        var plaintext = plaintxt.join('');
        plaintext = plaintext.utf8Decode(); // decode from UTF8 back to Unicode multi-byte chars

        return plaintext;
    };

    //----------------base64 start---------------
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    encryptjs.base64Encode = function (input) {
        var output = "";
        var chr1 = void 0,
            chr2 = void 0,
            chr3 = void 0,
            enc1 = void 0,
            enc2 = void 0,
            enc3 = void 0,
            enc4 = void 0;
        var i = 0;
        input = encryptjs._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };
    encryptjs.base64Decode = function (input) {
        var output = "";
        var chr1 = void 0,
            chr2 = void 0,
            chr3 = void 0;
        var enc1 = void 0,
            enc2 = void 0,
            enc3 = void 0,
            enc4 = void 0;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = encryptjs._utf8_decode(output);
        return output;
    };

    // private method for UTF-8 encoding
    encryptjs._utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }
        return utftext;
    };

    // private method for UTF-8 decoding
    encryptjs._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }
        return string;
    };
    //------------------base64 end----------------

    encryptjs.getTextEncryptAndSaveToTextFile = function (filePath, password, nBits) {
        if (!rl) throw Error("Command line not supported on this platform");
        rl.question("Enter the text to be encrypted: ", function (answer) {
            // TODO: Log the answer in a database
            console.log("'" + answer + "' This text will be encrypted and stored in a text file 'encrypted.txt'");
            var cipherText = encryptjs.encrypt(answer, password, nBits);
            rl.close();
        });
    };

    encryptjs.getTextEncryptAndSaveToJSONFile = function (filePath, password, nBits) {
        if (!rl) throw Error("Command line not supported on this platform");
        rl.question("Enter the text to be encrypted: ", function (answer) {
            // TODO: Log the answer in a database
            console.log("'" + answer + "' This text will be encrypted and stored in a text file 'encrypted.txt'");
            var cipherText = encryptjs.encrypt(answer, password, nBits);
            encryptjs.writeCipherTextToJSON(filePath, { EncryptedText: cipherText }, function () {
                console.log("'encryptedText.JSON' File created in your local directory, if not present refresh your project");
            });
            rl.close();
        });
    };

    encryptjs.writeCipherTextToJSON = function (file, obj, options, callback) {
        if (callback == null) {
            callback = options;
            options = {};
        }

        var spaces = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options !== null ? 'spaces' in options ? options.spaces : this.spaces : this.spaces;

        var str = '';
        try {
            str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n';
        } catch (err) {
            if (callback) return callback(err, null);
        }
    };

    if (typeof String.prototype.utf8Encode == 'undefined') {
        String.prototype.utf8Encode = function () {
            return unescape(encodeURIComponent(this));
        };
    }

    if (typeof String.prototype.utf8Decode == 'undefined') {
        String.prototype.utf8Decode = function () {
            try {
                return decodeURIComponent(escape(this));
            } catch (e) {
                return this; // invalid UTF-8? return as-is
            }
        };
    }

    if (typeof String.prototype.base64Encode == 'undefined') {
        String.prototype.base64Encode = function () {
            if (typeof btoa != 'undefined') return btoa(this); // browser
            if (typeof Buffer != 'undefined') return new Buffer(this, 'utf8').toString('base64'); // Node.js
            throw new Error('No Base64 Encode');
        };
    }

    if (typeof String.prototype.base64Decode == 'undefined') {
        String.prototype.base64Decode = function () {
            if (typeof atob != 'undefined') return atob(this); // browser
            if (typeof Buffer != 'undefined') return new Buffer(this, 'base64').toString('utf8'); // Node.js
            throw new Error('No Base64 Decode');
        };
    }

    encryptjs.init();

    return encryptjs;
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Encrypt.js.map
        