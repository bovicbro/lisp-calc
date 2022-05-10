import { findIndexEndOfExpression, scanTokens, evaluateSource } from './interpreter'

test('Interprete statements', () => {
    expect(evaluateSource("(+ 5 5)")).toBe(10)
    expect(evaluateSource("(+ (+ 1 1) 1)")).toBe(3)
    expect(evaluateSource("(+ (+ 1 1) 1)")).toBe(3)
    expect(evaluateSource("(+ 1 (+ 2 2)))")).toBe(5)
    expect(evaluateSource("(+(+(+ 1 1)1)1)")).toBe(4)
    expect(evaluateSource("(+(*(- 1 1)1)1)")).toBe(1)
    expect(evaluateSource("(+ 13 13)")).toBe(26)
    expect(evaluateSource("(+ 13 (+ 10 ( + 1 1 )))")).toBe(25)
})

test('Interprete statement that includes whitespace', () => {
    expect(evaluateSource('(       *       (      *     1  2     )    2  )')).toBe(4)
})
test('Interprete statement with reference', () => {
    expect(evaluateSource("(+ A1 1)")).toBe(1)
})
//
// How big number should the program support?
test('Interprete statement with big numbers', () => {
    expect(evaluateSource("(* 1000000000000000000 1000000000000000000)")).toBe(1000000000000000000000000000000000000)})

test('Associativity', () => {
    expect(evaluateSource("(+ 1 (+ 1 1))")).toBe(evaluateSource("(+ (+ 1 1) 1)"))
})

test('FindIndexEndOFexpression', () => {
    expect(findIndexEndOfExpression(2,scanTokens('(+ ( + 1 1 ) 1)'))).toBe(6)
})
