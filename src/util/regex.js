module.exports = {
	command: {
		flag: /^(--[a-zA-Z][a-zA-Z0-9-]+|-[a-zA-Z])$/,
		flaghead: /^(--?)/,
	},
	type: {
		int: /^int(\[.*?,.*?\])?$/,
		float: /^float(\[.*?,.*?\])?$/,
		bool: /^bool$/,
		// https://stackoverflow.com/questions/32852857/javascript-conditional-regular-expression-if-then-else
		// I have used if-else here, if | is ahead then match it or else match ]
		csv: /^csv(\[(([a-z0-9_]+(\[[^\]]+\])?)((?=\|)\||(?!\|)\]))+)?$/,
		extract: {
			range: /^.+?(?:\[(.*?),(.*?)\])?$/,
			subtypes:
				/(?<=\[|\|)(?:[a-z0-9_]+(?:\[[^\]]+\])?)(?=\]|\|)/g,
		},
	},
	value: {
		int: /^-?[0-9]+$/,
		float: /^-?[0-9]+(.[0-9]+)?$/,
		bool: (bool_values) => {
			const regexBoolValues = bool_values.join("|");
			return new RegExp(`^(${regexBoolValues})$`, "i");
		},
	},
	util: {
		getParts: (regex) => {
			const regstr = regex.toString();
			const parts = /\/(.*)\/(.*)/.exec(regstr);
			return parts.slice(1);
		},
		orJoin: function (...regexs) {
			const modifiedRegexs = regexs.map(this.getParts);

			return new RegExp(
				modifiedRegexs.map((ele) => ele[0]).join("|"),
				modifiedRegexs.map((ele) => ele[1]).join("")
			);
		},
	},
};
