/**
 * csv.js
 *
 * https://github.com/henix/csv.js
 *
 * License: MIT License
 */

var CSV = {
    DefaultOptions: {
        delim: ',',
        quote: '"',
        rowdelim: '\n'
        // rowdelim: '\r\n'
    }
};

function CSVSyntaxError(msg) {
    this.message = msg;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, arguments.callee);
    }
}
CSVSyntaxError.prototype = new Error();
CSVSyntaxError.prototype.constructor = CSVSyntaxError;
CSVSyntaxError.prototype.name = 'CSVSyntaxError';
if (new Error().toString() == '[object Error]') { // IE 6 7
    CSVSyntaxError.prototype.toString = function () {
        return this.name + ': ' + this.message;
    };
}

function CSVParser(str, options) {
    this.str = str;
    this.options = CSV.DefaultOptions;
    if (options) {
        options.delim = options.delim || CSV.DefaultOptions.delim;
        options.quote = options.quote || CSV.DefaultOptions.quote;
        if (options.quote.length != 1) {
            throw new RangeError('options.quote should be only 1 char');
        }
        options.rowdelim = options.rowdelim || CSV.DefaultOptions.rowdelim;
        this.options = options;
    }

    this.pos = 0;
    this.endpos = str.length;

    this.lineNo = 1;
}

CSVParser.prototype.next = function (s) {
    if (this.pos < this.endpos) {
        var len = s.length;
        if (this.str.substring(this.pos, this.pos + len) == s) {
            this.pos += len;
            return true;
        }
    }
    return false;
};

CSVParser.prototype.ahead = function (s) {
    if (this.pos < this.endpos) {
        if (!s) {
            return true;
        }
        var len = s.length;
        if (this.str.substring(this.pos, this.pos + len) == s) {
            return true;
        }
    }
    return false;
};

function countMatches(str, patt) {
    var count = 0;
    var i = str.indexOf(patt);
    while (i > 0) {
        count++;
        i = str.indexOf(patt, i + patt.length);
    }
    return count;
}

/**
 * quotedField: '"' * ((1 - '"') + P'""')^0 * '"'
 */
CSVParser.prototype.quotedField = function () {
    var mark = this.pos;
    if (!this.next(this.options.quote)) {
        this.pos = mark;
        return null;
    }
    var tmp = [];
    var start = this.pos;
    while (start < this.endpos) {
        var end = this.str.indexOf(this.options.quote, start);
        if (end < 0) {
            throw new CSVSyntaxError('line ' + this.lineNo + ': missing close quote');
        }
        var part = this.str.substring(start, end);
        this.lineNo += countMatches(part, '\n');
        tmp.push(part);
        if ((end + 1 < this.endpos) && (this.str.charAt(end + 1) == this.options.quote)) {
            start = end + 2;
            end = this.str.indexOf(this.options.quote, start);
        } else {
            this.pos = end + 1;
            break;
        }
    }
    return tmp.join(this.options.quote);
};

/**
 * normalField: (1 - S(",\n"))^0
 */
CSVParser.prototype.normalField = function () {
    var begin = this.pos;
    var idelim = this.str.indexOf(this.options.delim, begin);
    if (idelim < 0) {
        idelim = this.endpos;
    }
    var irowdelim = this.str.indexOf(this.options.rowdelim, begin);
    if (irowdelim < 0) {
        irowdelim = this.endpos;
    }
    this.pos = Math.min(idelim, irowdelim);
    return this.str.substring(begin, this.pos);
};

/**
 * nextField: quotedField + normalField
 */
CSVParser.prototype.nextField = function () {
    var tmp = this.quotedField();
    if (tmp !== null) return tmp;
    return this.normalField();
};

/**
 * nextRow_0: ',' * nextField
 */
CSVParser.prototype.nextRow_0 = function () {
    var mark = this.pos;
    if (!this.next(this.options.delim)) {
        this.pos = mark;
        return null;
    }
    var tmp = this.nextField();
    if (tmp === null) {
        this.pos = mark;
        return null;
    }
    return tmp;
};

/**
 * nextRow: nextField * (',' * nextField)^0 * (P'\n' + -1)
 *
 * @return String[]
 * @throws CSVSyntaxError
 */
CSVParser.prototype.nextRow = function () {
    var ar = [];
    var mark = this.pos;
    var tmp = this.nextField();
    if (tmp === null) {
        this.pos = mark;
        return null;
    }
    ar.push(tmp);
    tmp = this.nextRow_0();
    while (tmp !== null) {
        ar.push(tmp);
        tmp = this.nextRow_0();
    }
    if (!(this.next(this.options.rowdelim) || !this.ahead())) {
        throw new CSVSyntaxError('line ' + this.lineNo + ': ' + this.str.substring(Math.max(this.pos - 5, 0), this.pos + 5));
        this.pos = mark;
        return null;
    }
    if (this.str.charAt(this.pos - 1) == '\n') {
        this.lineNo++;
    }
    return ar;
};

/**
 * nextRow: nextField * (',' * nextField)^0 * (P'\n' + -1)
 * @returns String or String[]
 */
CSVParser.prototype.nextRowSimple = function () {
    var ar = [];
    var mark = this.pos;
    var tmp = this.nextField();
    if (tmp === null) {
        this.pos = mark;
        return null;
    }
    ar.push(tmp);
    tmp = this.nextRow_0();
    while (tmp !== null) {
        ar.push(tmp);
        tmp = this.nextRow_0();
    }
    if (!(this.next(this.options.rowdelim) || !this.ahead())) {
        throw new CSVSyntaxError('line ' + this.lineNo + ': ' + this.str.substring(Math.max(this.pos - 5, 0), this.pos + 5));
        this.pos = mark;
        return null;
    }
    if (this.str.charAt(this.pos - 1) == '\n') {
        this.lineNo++;
    }

    return ar.length === 1 ? ar[0] : ar;
};

/**
 * @return boolean
 */
CSVParser.prototype.hasNext = function () {
    return this.ahead();
};

CSV.CSVSyntaxError = CSVSyntaxError;
CSV.CSVParser = CSVParser;

/**
 * @return String[] or null
 */
CSV.parseOne = function (str, options) {
    var parser = new CSVParser(str, options);
    if (parser.hasNext()) {
        return parser.nextRow();
    }
    return null;
};

/**
 *
 * @returns String or String[] or null
 */
CSV.parseOneSimple = function (str, options) {
    var parser = new CSVParser(str, options);
    if (parser.hasNext()) {
        return parser.nextRowSimple();
    }
    return null;
};

/**
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;
        if (this === null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

module.exports = CSVParser;
