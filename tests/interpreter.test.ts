import interpreteSource from '../src/routes/interpreter'
import { findIndexEndOfExpression, scanTokens } from '../src/routes/interpreter'

test('Interprete statement (+ 1 1)', () => {
    expect(interpreteSource("(+ 1 1)")).toBe(2)
})

test('Interprete statement (+ (+ 1 1) 1)', () => {
    expect(interpreteSource("(+ (+ 1 1) 1)")).toBe(3)
})

test('Interprete statement (+ 1 (+ 2 2)))', () => {
    expect(interpreteSource("(+ 1 (+ 2 2)))")).toBe(5)
})

test('Interprete statement (+(+(+ 1 1)1)1)', () => {
    expect(interpreteSource("(+(+(+ 1 1)1)1)")).toBe(4)
})
//Implement this test
test('Test for all ints', () => {
    expect(interpreteSource("(+(+(+ 43 1)1)1)")).toBe(46)
})

test('Test for all ints', () => {
    expect(interpreteSource("(+(+(+ 4 1)1)1)")).toBe(7)
})


test('FindIndexEndOFexpression', () => {
    expect(findIndexEndOfExpression(2,scanTokens('(+ ( + 1 1 ) 1)'))).toBe(6)
})
