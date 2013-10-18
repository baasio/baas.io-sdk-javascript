
/**
 * validation is a Singleton that provides methods for validating common field types
 *
 * @class Baas.validation
 * @author Rod Simpson (rod@apigee.com)
**/
Baas.validation = (function () {

  var usernameRegex = new RegExp("^([0-9a-zA-Z.-]){1,80}$");
  var nameRegex     = new RegExp("^[a-zA-Z0-9]+[a-zA-Z0-9_\.]{0,80}$");
  var emailRegex    = new RegExp("^(([0-9a-zA-Z]+[_\+.-]?)+@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$");
  var passwordRegex = new RegExp("^([0-9a-zA-Z`@#$%^&!?<>;:.,'\"~*-=+_\[\\](){}/\]{6,20}$)");
  var pathRegex     = new RegExp("^[a-zA-Z0-9\-\.\/]{2,80}$");
  var collectionNameRegex = new RegExp("^[0-9a-z\-]+[0-9a-z\-_]{3,80}$");


  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validateUsername
    * @param {string} username - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validateUsername(username, failureCallback) {
    if (usernameRegex.test(username) && checkLength(username, 1, 80)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getUsernameAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getUsernameAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getUsernameAllowedChars(){
    return '1 ~ 80자까지 입력가능, 입력가능문자: "A-Z, a-z, 0-9, dot, and dash"';
  }

  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validateName
    * @param {string} name - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validateName(name, failureCallback) {
    if (nameRegex.test(name) && checkLength(name, 0, 80)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getNameAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getNameAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getNameAllowedChars(){
    return '1 ~ 80자까지 입력가능, 입력가능문자: "A-Z, a-z, 0-9, dot, and dash"';
  }

  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validatePassword
    * @param {string} password - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validatePassword(password, failureCallback) {
    if (passwordRegex.test(password) && checkLength(password, 5, 16)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getPasswordAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getPasswordAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getPasswordAllowedChars(){
    return '6 ~ 20자까지 입력가능, 입력가능문자: "A-Z, a-z, 0-9", 입력가능특수문자 : "`@#$%^&!?<>;:.,\'"~*-=+_[](){}/"';
  }

  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validateEmail
    * @param {string} email - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validateEmail(email, failureCallback) {
    if (emailRegex.test(email)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getEmailAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getEmailAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getEmailAllowedChars(){
    return 'Email 기본 형태: e.g. baas@Baas.io';
  }

  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validatePath
    * @param {string} path - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validatePath(path, failureCallback) {
    if (pathRegex.test(path) && checkLength(path, 2, 80)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getPathAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getPathAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getPathAllowedChars(){
    return '2 ~ 80자까지 입력가능, 입력가능문자: "/, a-z, 0-9, dot, and dash"';
  }

  /**
    * Tests the string against the allowed chars regex
    *
    * @public
    * @method validateTitle
    * @param {string} title - The string to test
    * @param {function} failureCallback - (optional), the function to call on a failure
    * @return {boolean} Returns true if string passes regex, false if not
    */
  function validateCollectionName(name, failureCallback) {
    if (collectionNameRegex.test(name) && checkLength(name, 4, 80)) {
      return true;
    } else {
      if (failureCallback && typeof(failureCallback) === "function") {
        failureCallback(this.getCollectionNameAllowedChars());
      }
      return false;
    }
  }

  /**
    * Returns the regex of allowed chars
    *
    * @public
    * @method getTitleAllowedChars
    * @return {string} Returns a string with the allowed chars
    */
  function getCollectionNameAllowedChars(){
    return '"a-z,0-9,dash" 로 시작하고 "_,dash,0-9,a-z" 로 구성된 4~80의 문자열';
  }

  /**
    * Tests if the string is the correct length
    *
    * @public
    * @method checkLength
    * @param {string} string - The string to test
    * @param {integer} min - the lower bound
    * @param {integer} max - the upper bound
    * @return {boolean} Returns true if string is correct length, false if not
    */
  function checkLength(string, min, max) {
    if (string.length > max || string.length < min) {
      return false;
    }
    return true;
  }

  /**
    * Tests if the string is a uuid
    *
    * @public
    * @method isUUID
    * @param {string} uuid The string to test
    * @returns {Boolean} true if string is uuid
    */
  function isUUID (uuid) {
    var uuidValueRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuid) return false;
    return uuidValueRegex.test(uuid);
  }

  return {
    validateUsername:validateUsername,
    getUsernameAllowedChars:getUsernameAllowedChars,
    validateName:validateName,
    getNameAllowedChars:getNameAllowedChars,
    validatePassword:validatePassword,
    getPasswordAllowedChars:getPasswordAllowedChars,
    validateEmail:validateEmail,
    getEmailAllowedChars:getEmailAllowedChars,
    validatePath:validatePath,
    getPathAllowedChars:getPathAllowedChars,
    validateCollectionName:validateCollectionName,
    getCollectionNameAllowedChars:getCollectionNameAllowedChars,
    isUUID:isUUID
  }
})();
