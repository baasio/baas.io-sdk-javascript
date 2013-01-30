(function() {
	
	var root = this;
	var Baas = root.Baas || {};

	root.console = root.console || {};
	root.console.log = root.console.log || function() {};

	// Current version.
	Baas.VERSION = '@@version';

	// AMD 모듈 방식 - require() -과 Node.js 모듈 시스템을 위한 코드 
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Baas;
		}

		exports.Baas = Baas;
	} else {
		root.Baas = Baas;
	}

