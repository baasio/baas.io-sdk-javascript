var root = this;

var baasio = root.baasio || {};

baasio = Usergrid;

// Current version.
baasio.VERSION = '0.1.0';

// AMD 모듈 방식 - require() -과 Node.js 모듈 시스템을 위한 코드 
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = baasio;
	}

	exports.baasio = baasio;
} else {
	root.baasio = baasio;
}

