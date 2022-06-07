/*
 * ##########################################################
 * #                         TYPES                          #
 * ##########################################################
 */

export type Token = {
    tokenType: TokenType;
    lexeme: string;
    value: number;
    line: number;
}

export enum TokenType {
    // Single charachters
    PLUS = '+',
    MINUS = '-',
    DIVSION = '/',
    MULTIPLY = '*',
    LEFT_PARAN = '(',
    RIGHT_PARAN = ')',

    // Literals
    STRING = 'string',
    NUMBER = 'number',
    CELL_REFERENCE = 'cell-reference',

    // Null
    NULL = 'null',
    SPACE = ' '
}

export type Expr = {
    operator: Token;
    left: Expr;
    right: Expr;
} | Token;

/*
 * ##########################################################
 * #                         CONSTRUCTORS                   #
 * ##########################################################
 */
export const newToken = (tokenType: TokenType, lexeme: string, value: number, line: number): Token => {
    return { tokenType, lexeme, value, line }
}

/*
 * ##########################################################
 *                          SCANNER
 * ##########################################################
 */

export const scanToken = (source: string, location: number, line: number): Token | Error => {
    const indexScanStart = source[location]
    if (indexScanStart === undefined)
        return Error('Out of index')

    const numberRegExp = new RegExp(/^\d+/)
    if (numberRegExp.test(indexScanStart)) {
        //@ts-ignore
        // All relevant variables have been tested, will not return null
        const valueString: string = numberRegExp.exec(source.slice(location))[0]
        const value: number = parseInt(valueString);
        return newToken(TokenType.NUMBER, value.toString(), value, line)
    }


    const cellRegExp = new RegExp(/^(([A-Z])+([0-9])+)/)
    if (cellRegExp.test(source.slice(location))) {
        //@ts-ignore
        // All relevant variables have been tested
        const lexeme: string = cellRegExp.exec(source.slice(location))[0]
        return newToken(TokenType.CELL_REFERENCE, lexeme, 0, line)
    }

    switch (source[location]) {
        case '+':
            return newToken(TokenType.PLUS, '+', 0, line)
        case '-':
            return newToken(TokenType.MINUS, '-', 0, line)
        case '/':
            return newToken(TokenType.DIVSION, '/', 0, line)
        case '*':
            return newToken(TokenType.MULTIPLY, '*', 0, line)
        case '(':
            return newToken(TokenType.LEFT_PARAN, '(', 0, line)
        case ')':
            return newToken(TokenType.RIGHT_PARAN, ')', 0, line)
    }
    return newToken(TokenType.NULL, '', 0, line)
}

export const scanTokens = (source: string): Token[] => {
    const tokens: Token[] = [];
    const line = 1;

    for (let current = 0; current < source.length; current++) {
        const token = scanToken(source, current, line)
        if (token instanceof Error)
            throw token
        if (token.tokenType != TokenType.NULL) {
            tokens.push(token)
            current += token.lexeme.length - 1
        }
    }
    return tokens
}


/*
 * ##########################################################
 *                          PARSER
 * ##########################################################
 */

export const isNumber = (expr: Expr): expr is Token => {
    return (expr as Token).tokenType !== undefined
}

export const findIndexEndOfExpression = (startIndex: number, stream: Token[]): number => {

    if (stream[startIndex]?.tokenType !== TokenType.LEFT_PARAN) {
        return startIndex;
    }

    const index: number[] = [];
    let numberOpening: number = 0;
    let numberClosing: number = 0;

    stream.slice(startIndex).forEach((t: Token, i: number): void => {
        if (t.tokenType === TokenType.LEFT_PARAN)
            numberOpening++
        if (t.tokenType === TokenType.RIGHT_PARAN)
            numberClosing++
        if (numberClosing === numberOpening)
            index.push(i)
    })
    return startIndex + (index[0] ? index[0] : 0)
}

export const tokenStreamToAST = (stream: Token[]): Expr => {
    if (!stream[0])
        throw Error('')
    switch (stream[0].tokenType) {
        case (TokenType.NUMBER):
            return stream[0]
        case (TokenType.CELL_REFERENCE):
            return stream[0]
        case (TokenType.LEFT_PARAN):
            return tokenStreamToAST(stream.slice(1, -1))
        default:
            return {
                operator: stream[0],
                left: tokenStreamToAST(stream.slice(1, findIndexEndOfExpression(1, stream) + 1)),
                right: tokenStreamToAST(stream.slice(findIndexEndOfExpression(1, stream) + 1))
            }
    }
}

/*
 * ##########################################################
 *                          EVALUATE
 * ##########################################################
 */

export const evaluateAST = (expr: Expr, getCellValue?: (arg0: string) => any , state?: object): number => {
    if (isNumber(expr)) {
        switch (expr.tokenType) {
            case (TokenType.NUMBER):
                return expr.value
            case (TokenType.CELL_REFERENCE):
                if (getCellValue)
                    return parseInt(getCellValue(expr.lexeme).value as string)
        }
    } else {
        switch (expr.operator.tokenType) {
            case (TokenType.PLUS):
                return evaluateAST(expr.left, getCellValue) + evaluateAST(expr.right, getCellValue)
            case (TokenType.MINUS):
                return evaluateAST(expr.left, getCellValue) - evaluateAST(expr.right, getCellValue)
            case (TokenType.DIVSION):
                return evaluateAST(expr.left, getCellValue) / evaluateAST(expr.right, getCellValue)
            case (TokenType.MULTIPLY):
                return evaluateAST(expr.left, getCellValue) * evaluateAST(expr.right, getCellValue)
        }
    }
    throw Error('Could not evaluate')
}

export const evaluateSource = (stream: string, callback?: (arg0: string) => object, state?: object): number => {
    return evaluateAST(tokenStreamToAST(scanTokens(stream)), callback, state);
}
