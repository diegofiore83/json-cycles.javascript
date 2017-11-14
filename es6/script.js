'use strict';

class JsonCycle {
    encodeCycles(input) {

      /* Array of references (reference and path) for every object/array found */
      let references = [];   
    
      /* Use recursion to iteratate through the elements tree */
      return (function fn(element, path) {
    
        let newJsonElement = element;

        /* Transform the new element to JSON */
        if (element && typeof element.toJSON === 'function') {
            newJsonElement = element.toJSON();
        }

        /* Exit Condition of Recursion */
        if (newJsonElement !== null && typeof newJsonElement === 'object') {

          /* Check if the reference has already been found */
          for (let i = 0; i < references.length; i++) {
            if (references[i].reference === newJsonElement) {
              return {$ref: references[i].path};
            }
          }
    
          /* New reference found and added*/ 
          references.push({ reference : newJsonElement, path });
    
          /* Check if it is a new array or a new object */    
          if (Array.isArray(newJsonElement)) {
            
            let newArray = [];
            /* If it is an array, call the function recursively to every element of the array */
            for (let i = 0; i < newJsonElement.length; i++) {
              newArray[i] = fn(newJsonElement[i], path + '[' + i + ']');
            }
            return newArray;

          } else {

            let newObject = {};
            /* If it is an object, call the function recursively to every property of the object */
            for (let name in newJsonElement) {
              if (Object.prototype.hasOwnProperty.call(newJsonElement, name)) {
                newObject[name] = fn(newJsonElement[name], path + '[' + JSON.stringify(name) + ']');
              }
            }
            return newObject;

          }
        }

        return newJsonElement;

      }(input, '$'));
    }

    decodeCycles($) {

      /* Regular Expression to identify JSON path */
      const regExJsonPath = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

      (function fn(element){
        debugger;
        if (element && typeof element === 'object') {

          if (Array.isArray(element)) {
            /* If it is an array, call the function recursively to every element of the array */
            for (let i = 0; i < element.length; i ++) {
              const item = element[i];
              if (item && typeof item === 'object') {
                const path = item.$ref;
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
              if (typeof element[name] === 'object') {
                const item = element[name];
                if (item) {
                  const path = item.$ref;
                  if (typeof path === 'string' && regExJsonPath.test(path)) {
                    element[name] = eval(path);
                  } else {
                    fn(item);
                  }
                }
              }
            }
          }
        }

      }($));
  
      return $;
    }
}