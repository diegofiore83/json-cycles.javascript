'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonCycle = function () {
  function JsonCycle() {
    _classCallCheck(this, JsonCycle);
  }

  _createClass(JsonCycle, [{
    key: 'encodeCycles',
    value: function encodeCycles(input) {

      /* Array of references (reference and path) for every object/array found */
      var references = [];

      /* Use recursion to iteratate through the elements tree */
      return function fn(element, path) {

        var newJsonElement = element;

        /* Transform the new element to JSON */
        if (element && typeof element.toJSON === 'function') {
          newJsonElement = element.toJSON();
        }

        /* Exit Condition of Recursion */
        if (newJsonElement !== null && (typeof newJsonElement === 'undefined' ? 'undefined' : _typeof(newJsonElement)) === 'object') {

          /* Check if the reference has already been found */
          for (var i = 0; i < references.length; i++) {
            if (references[i].reference === newJsonElement) {
              return { $ref: references[i].path };
            }
          }

          /* New reference found and added*/
          references.push({ reference: newJsonElement, path: path });

          /* Check if it is a new array or a new object */
          if (Array.isArray(newJsonElement)) {

            var newArray = [];
            /* If it is an array, call the function recursively to every element of the array */
            for (var _i = 0; _i < newJsonElement.length; _i++) {
              newArray[_i] = fn(newJsonElement[_i], path + '[' + _i + ']');
            }
            return newArray;
          } else {

            var newObject = {};
            /* If it is an object, call the function recursively to every property of the object */
            for (var _name in newJsonElement) {
              if (Object.prototype.hasOwnProperty.call(newJsonElement, _name)) {
                newObject[_name] = fn(newJsonElement[_name], path + '[' + JSON.stringify(_name) + ']');
              }
            }
            return newObject;
          }
        }

        return newJsonElement;
      }(input, '$');
    }
  }, {
    key: 'decodeCycles',
    value: function decodeCycles($) {

      /* Regular Expression to identify JSON path */
      var regExJsonPath = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

      (function fn(element) {
        debugger;
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {

          if (Array.isArray(element)) {
            /* If it is an array, call the function recursively to every element of the array */
            for (var i = 0; i < element.length; i++) {
              var item = element[i];
              if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                var path = item.$ref;
                if (typeof path === 'string' && regExJsonPath.test(path)) {
                  element[i] = eval(path);
                } else {
                  fn(item);
                }
              }
            }
          } else {
            /* If it is an object, call the function recursively to every property of the object */
            for (name in element) {
              if (_typeof(element[name]) === 'object') {
                var _item = element[name];
                if (_item) {
                  var _path = _item.$ref;
                  if (typeof _path === 'string' && regExJsonPath.test(_path)) {
                    element[name] = eval(_path);
                  } else {
                    fn(_item);
                  }
                }
              }
            }
          }
        }
      })($);

      return $;
    }
  }]);

  return JsonCycle;
}();
