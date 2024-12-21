const homo = ((Nums) => {
	const numsReversed = Object.keys(Nums).map(x => +x).filter(x => x > 0)
	const getMinDiv = (num) => {
		for (let i = numsReversed.length; i >= 0; i--)
			if (num >= numsReversed[i])
				return numsReversed[i]
	}
	const isDotRegex = /\.(\d+?)0{0,}$/
	const demolish = (num) => {
		if (typeof num !== "number")
			return ""

		if (num === Infinity || Number.isNaN(num))
			return `这么恶臭的${num}有必要论证吗`

		if (num < 0)
			return `(⑨)*(${demolish(num * -1)})`.replace(/\*\(1\)/g, "")

		if (!Number.isInteger(num)) {
			// abs(num) is definitely smaller than 2**51
			// rescale
			const n = num.toFixed(16).match(isDotRegex)[1].length
			return `(${demolish(num * Math.pow(10, n))})/(10)^(${n})`
		}

		if (Nums[num])
			return String(num)

		const div = getMinDiv(num)
		return (`${div}*(${demolish(Math.floor(num / div))})+` +
			`(${demolish(num % div)})`).replace(/\*\(1\)|\+\(0\)$/g, "")
	}
	//Finisher
	const finisher = (expr) => {
		expr = expr.replace(/\d+|⑨/g, (n) => Nums[n]).replace("^", "**")
		//As long as it matches ([\*|\/])\(([^\+\-\(\)]+)\), replace it with $1$2
		while (expr.match(/[\*|\/]\([^\+\-\(\)]+\)/))
			expr = expr.replace(/([\*|\/])\(([^\+\-\(\)]+)\)/, (m, $1, $2) => $1 + $2)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)([\+|\-|\)]), replace it with $1$2$3
		while (expr.match(/[\+|\-]\([^\(\)]+\)[\+|\-|\)]/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)([\+|\-|\)])/, (m, $1, $2, $3) => $1 + $2 + $3)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)$, replace it with $1$2
		while (expr.match(/[\+|\-]\(([^\(\)]+)\)$/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)$/, (m, $1, $2) => $1 + $2)
		//If there is a bracket in the outermost part, remove it
		if (expr.match(/^\([^\(\)]+?\)$/))
			expr = expr.replace(/^\(([^\(\)]+)\)$/, "$1")

		expr = expr.replace(/\+-/g,'-')
		return expr
	}
	return (num) => finisher(demolish(num))
})({
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
  [-1]: "8*1+0-8-1-0",
})

if (typeof module === 'object' && module.exports)
	module.exports = homo
