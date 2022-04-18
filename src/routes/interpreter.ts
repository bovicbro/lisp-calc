type Token = {
    tokenType: tokenType;
    lexeme: string;
    value: number;
    line: number;
}

enum tokenType {
    // Single charachters
    PLUS = '+',
    LEFT_PARAN = '(',
    RIGHT_PARAN = ')',
    // Literals
    STRING = 'string',
    NUMBER = 'number',
    //Null
    NULL = 'null',
    SPACE = ' '
}

type Expr = {
    operator: Token;
    left: Expr;
    right: Expr;
} | Token;

const newToken = (tokenType: tokenType, lexeme: string, value: number, line: number): Token => {
    return { tokenType, lexeme, value, line }
}

const scanToken = (source: string, location: number, line: number): Token => {
    // if (source[location].match(/d/))
    //     return newToken(tokenType.NUMBER, source[location], parseInt(source[location]),line)

    switch (source[location]) {
        case '+':
            return newToken(tokenType.PLUS, '+', 0, line)
        case '1':
            return newToken(tokenType.NUMBER, '1', 1, line)
        case '2':
            return newToken(tokenType.NUMBER, '1', 2, line)
        case '3':
            return newToken(tokenType.NUMBER, '1', 3, line)
        case '(':
            return newToken(tokenType.LEFT_PARAN, '(', 0, line)
        case ')':
            return newToken(tokenType.RIGHT_PARAN, ')', 0, line)
        case '':
            return newToken(tokenType.SPACE, ' ', 0, line)
    }
    return newToken(tokenType.NULL, '', 0, line)
}

export const scanTokens = (source: string): Token[] => {
    let startOfLexeme = 0;
    const tokens: Token[] = [];
    const line = 1;

    for (let current = 0; current < source.length; current++) {
        const token: Token = scanToken(source, current, line)
        if (token.tokenType != tokenType.NULL)
            tokens.push(token)
    }
    return tokens
}

const isNumber = (expr: Expr): expr is Token => {
    return (expr as Token).tokenType !== undefined
}

export const findIndexEndOfExpression = (startIndex: number, stream: Token[]): number => {

    if (stream[startIndex].tokenType !== tokenType.LEFT_PARAN) {
        return startIndex;
    }
    let index: number[] = [];
    let numberOpening: number = 0;
    let numberClosing: number = 0;

    stream.slice(startIndex).forEach((t: Token, i: number): void => {
        if (t.tokenType === tokenType.LEFT_PARAN)
            numberOpening++
        if (t.tokenType === tokenType.RIGHT_PARAN)
            numberClosing++
        if (numberClosing === numberOpening)
            index.push(i)
    })
    return startIndex + index[0]
}

const tokenStreamToAST = (stream: Token[]): Expr => {
    switch (stream[0].tokenType) {
        case (tokenType.NUMBER):
            return stream[0]
        case (tokenType.LEFT_PARAN):
            return tokenStreamToAST(stream.slice(1, -1))
        default:
            return {
                operator: stream[0],
                left: tokenStreamToAST(stream.slice(1, findIndexEndOfExpression(1, stream) + 1)),
                right: tokenStreamToAST(stream.slice(findIndexEndOfExpression(1, stream) + 1))
            }
    }
}

const evaluateAST = (expr: Expr): number => {
    if (isNumber(expr)) {
        return expr.value
    } else {
        return evaluateAST(expr.left) + evaluateAST(expr.right)
    }
}

const interpreteSource = (stream: string): number => {
    return evaluateAST(tokenStreamToAST(scanTokens(stream)));
}

export default interpreteSource
