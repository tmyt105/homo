export const NumberTable = {
  656100: "810*810",
  65610: "810*(81-0)",
  6561: "(81+0)*(81+0)",
  828: "810+8+10",
  810: "810",
  729: "810-81+0",
  162: "81+0+81+0",
  161: "81-0+81-0-8*1-0+8-1+0",
  90: "8+1+0+81-0",
  81: "81+0",
  80: "8*10",
  74: "-8+1-0+81+0",
  63: "(8+1+0)*(8-1+0)",
  18: "8+10",
  16: "810/(81+0)+8-10+8*1-0",
  15: "8*1+0+8-1-0",
  14: "8-1+0+8-1-0",
  11: "8+1-0+8+1+0-8+1-0",
  10: "810/(81+0)",
  9: "8+1+0",
  8: "8*1+0",
  7: "8-1+0",
  6: "8-10+8*1-0",
  4: "(8*1+0)/(8+1+0-8+1+0)",
  3: "(8-10+8*1-0)/(8+1+0-8+1-0)",
  2: "8+1+0-8+1-0",
  1: "8+1+0-8*1-0",
  0: "8*1*0",
  [-1]: "8*1+0-8-1-0"
}

/**
 * @description homo
 * @param {number} number
 * @returns {DemolishResult}
 */
const homo = () => {
  const numsReversed = Object.keys(NumberTable)
    .map(x => +x)
    .filter(x => x > 0)
  const getMinDiv = num => {
    for (let i = numsReversed.length | 0; i >= 0; i = (i - 1) | 0) {
      if (num >= numsReversed[i]) {
        return numsReversed[i]
      }
    }

    return null
  }
  const isDotRegex = /\.(\d+?)0{0,}$/
  const demolish = num => {
    if (num === Infinity || Number.isNaN(num) || typeof num !== "number")
      return {
        success: false,
        result: "Invalid Number"
      }

    if (num < 0) {
      const demolishRevResult = demolish(num * -1)
      if (!demolishRevResult.success) return demolishRevResult

      return {
        success: true,
        result: `(-1)*(${demolishRevResult.result})`.replace(/\*\(1\)/g, "")
      }
    }

    if (!Number.isInteger(num)) {
      const match = num.toFixed(16).match(isDotRegex)

      if (!match) {
        return {
          success: false,
          result: "Invalid Number"
        }
      }

      const n = match[1].length

      const demolishDecResult = demolish(num * Math.pow(10, n))

      if (!demolishDecResult) return demolishDecResult

      return {
        success: true,
        result: `(${demolishDecResult.result})/(10)^(${n})`
      }
    }

    if (num in NumberTable) {
      return {
        success: true,
        result: String(num)
      }
    }

    const div = getMinDiv(num)

    if (!div) {
      return {
        success: false,
        result: "Impossible number"
      }
    }

    const demolishQuoResult = demolish(Math.floor(num / div))
    if (!demolishQuoResult.success) return demolishQuoResult

    const demolishRemResult = demolish(num % div)
    if (!demolishRemResult.success) return demolishRemResult

    return {
      success: true,
      result: (
        `${div}*(${demolishQuoResult.result})+` +
        `(${demolishRemResult.result})`
      ).replace(/\*\(1\)|\+\(0\)$/g, "")
    }
  }

  const finisher = expr => {
    expr = expr
      .replace(/\d+|-1/g, n => (n in NumberTable ? NumberTable[Number(n)] : ""))
      .replace("^", "**")
    while (expr.match(/[\*|\/]\([^\+\-\(\)]+\)/))
      expr = expr.replace(
        /([\*|\/])\(([^\+\-\(\)]+)\)/,
        (_m, $1, $2) => $1 + $2
      )
    while (expr.match(/[\+|\-]\([^\(\)]+\)[\+|\-|\)]/))
      expr = expr.replace(
        /([\+|\-])\(([^\(\)]+)\)([\+|\-|\)])/,
        (_m, $1, $2, $3) => $1 + $2 + $3
      )
    while (expr.match(/[\+|\-]\(([^\(\)]+)\)$/))
      expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)$/, (_m, $1, $2) => $1 + $2)
    if (expr.match(/^\([^\(\)]+?\)$/))
      expr = expr.replace(/^\(([^\(\)]+)\)$/, "$1")

    expr = expr.replace(/\+-/g, "-")
    return expr
  }

  return num => {
    const demolishResult = demolish(num)

    if (demolishResult.success) {
      return {
        success: true,
        result: finisher(demolishResult.result)
      }
    } else {
      return demolishResult
    }
  }
}

export { homo }
