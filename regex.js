module.exports = {
	command: {
		flag: /^(--[a-zA-Z][a-zA-Z0-9-]+|-[a-zA-Z])$/,
		flaghead: /^(--?)/,
	},
	value: { number: /^-?[0-9]+(.[0-9]+)?$/ },
};
