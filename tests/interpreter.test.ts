import interpreteSource from '../src/lib/interpreter'
import { findIndexEndOfExpression, scanTokens } from '../src/lib/interpreter'

test('Interprete statement (+ 5 5)', () => {
    expect(interpreteSource("(+ 5 5)")).toBe(10)
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

test('Interprete statement (+(*(- 1 1)1)1)', () => {
    expect(interpreteSource("(+(*(- 1 1)1)1)")).toBe(1)
})

test('Interprete statement (+ 13 13)', () => {
    expect(interpreteSource("(+ 13 13)")).toBe(26)
})

//How big number should the program support?
test('Big numbers', () => {
    expect(interpreteSource("(* 1000000000000000000 1000000000000000000)")).toBe(1000000000000000000000000000000000000)})

test('FindIndexEndOFexpression', () => {
    expect(findIndexEndOfExpression(2,scanTokens('(+ ( + 1 1 ) 1)'))).toBe(6)
})
