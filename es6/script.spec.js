'use strict';

describe("JSON Cycle", () => {

    it("it should encode cycles when are present", function () {
        let JSONCycle = new JsonCycle();
        let myArray = [1, 'a'];
        myArray[2] = myArray;

        let myArrayEncoded = JSONCycle.encodeCycles(myArray);
        expect(myArrayEncoded).toEqual([1, 'a', { '$ref': '$' }]);
    });

    it("it should encode cycles when are present (2 reference repetitions)", function () {
        let JSONCycle = new JsonCycle();
        let myArray = [1, 'a'];
        myArray[2] = myArray;
        myArray[3] = myArray[2];

        let myArrayEncoded = JSONCycle.encodeCycles(myArray);
        expect(myArrayEncoded).toEqual([1, 'a', { '$ref': '$' }, { '$ref': '$' }]);
    });

    it("it should encode cycles when are present (2 difference reference repetitions)", function () {
        let JSONCycle = new JsonCycle();
        let myArray = [1, 'a'];
        myArray[2] = myArray;
        let myArray2 = [2, 'b'];
        myArray2[2] = myArray2;
        
        let myArray3 = myArray.concat(myArray2);
        var myArrayEncoded = JSONCycle.encodeCycles(myArray3);

        expect(myArrayEncoded).toEqual([1, 'a', [1, 'a', { '$ref': '$[2]' }], 2, 'b', [2, 'b', { '$ref': '$[5]' }]]);
    });

    it("it should return the same object when no cycles are present", function () {
        var JSONCycle = new JsonCycle();
        var myArray = [1, 'a'];
        myArray[2] = [2, 'b'];

        var myArrayEncoded = JSONCycle.encodeCycles(myArray);
        expect(myArrayEncoded).toEqual([1, 'a',  [2, 'b']]);
    });
});