"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const units_1 = require("./units");
describe('Pretty Print from camelCase', () => {
    it('should make simple headlines nice', () => {
        (0, chai_1.expect)((0, units_1.prettyFromCamelCase)('foo')).to.eq('Foo');
    });
    it('should make simple headlines nice with two words', () => {
        (0, chai_1.expect)((0, units_1.prettyFromCamelCase)('fooBar')).to.eq('Foo Bar');
    });
});
