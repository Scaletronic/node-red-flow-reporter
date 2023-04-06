import { expect } from "chai"
import { prettyFromCamelCase } from "./units"

describe('Pretty Print from camelCase', () => {
    it('should make simple headlines nice', () => {
        expect(prettyFromCamelCase('foo')).to.eq('Foo')
    })
    it('should make simple headlines nice with two words', () => {
        expect(prettyFromCamelCase('fooBar')).to.eq('Foo Bar')
    })
})
