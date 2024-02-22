const chalk = require("chalk");
const _throw = require("./throw");
const regex = require("./regex");

function getRange(range) {
	return regex.type.extract.range
		.exec(range)
		.slice(1)
		.map((ele) => ele ?? "");
}

function toCSV(data) {
	return data
		.split(",")
		.filter((ele) => ele !== "")
		.map((ele) => {
			ele = ele.trim();
			if (ele.startsWith('"') && ele.endsWith('"'))
				ele = ele.slice(1, -1);
			return ele;
		});
}

function toNumber(type, regex, parser, data, min = "", max = "") {
	let low =
		min === ""
			? -Infinity
			: regex.test(min)
			? parser(min)
			: _throw(
					`Invalid minimum value for ${type} range, received ${chalk.red(
						min
					)}`
			  );
	let high =
		max === ""
			? Infinity
			: regex.test(max)
			? parser(max)
			: _throw(
					`Invalid maximum value for ${type} range, received ${chalk.red(
						max
					)}`
			  );

	if (low >= high)
		_throw("Invalid range, min should be less than max.");

	if (regex.test(data)) {
		data = parser(data);
		if (data >= low && data <= high) return data;
		_throw(
			`Required ${type} in ${chalk.yellow(
				`[${min}, ${max}]`
			)} range, received ${chalk.red(data)}`
		);
	}
	_throw(`Invalid ${type} value ${chalk.red(data)}`);
}

function toInt(data, min = "", max = "") {
	const int_regex = regex.value.int;
	return toNumber("integer", int_regex, parseInt, data, min, max);
}

function toFloat(data, min = "", max = "") {
	const float_regex = regex.value.float;
	return toNumber("float", float_regex, parseFloat, data, min, max);
}

function toBool(data) {
	const availableBool = [
		["n", "y"],
		["n", ""],
		["false", "true"],
	];

	const regexBoolValues = availableBool.reduce(
		(acc, curr) => [...acc, ...curr],
		[]
	);

	const bool_regex = regex.value.bool(regexBoolValues);

	if (bool_regex.test(data))
		return availableBool
			.map((ele) => ele[1])
			.includes(data.toLowerCase());
	_throw("Invalid boolean value " + chalk.red(data));
}

function castTo(type, data) {
	if (typeof data !== "string" || typeof type !== "string")
		_throw(
			`castTo only accepts ${chalk.yellow(
				"string"
			)} type parameters.`
		);

	const valid_str_type = regex.type.str;
	if (valid_str_type.test(type)) {
		return data;
	}

	const valid_int_type = regex.type.int;
	if (valid_int_type.test(type)) {
		return toInt(data, ...getRange(type));
	}

	const valid_float_type = regex.type.float;
	if (valid_float_type.test(type))
		return toFloat(data, ...getRange(type));

	const valid_bool_type = regex.type.bool;
	if (valid_bool_type.test(type)) return toBool(data);

	const valid_csv_type = regex.type.csv;

	if (valid_csv_type.test(type)) {
		const csvData = toCSV(data);
		if (type === "csv") return csvData;

		// match all the subtypes in csv bracket.
		const extract_subtypes = regex.type.extract.subtypes;
		let subtypes = [...type.matchAll(extract_subtypes)].map(
			(e) => e[0]
		);

		const valid_sub_types = regex.util.orJoin(
			valid_float_type,
			valid_int_type,
			valid_bool_type
		);

		let strSubtypeIx = -1;
		for (let [index, stype] of subtypes.entries()) {
			if (valid_str_type.test(stype)) strSubtypeIx = index;
			else if (!valid_sub_types.test(stype))
				_throw(`Invalid csv subtype ${chalk.red(stype)}.`);
		}

		if (strSubtypeIx !== -1)
			subtypes = [
				...subtypes.toSpliced(strSubtypeIx, 1),
				subtypes[strSubtypeIx],
			];

		const csvReturn = [];

		for (let value of csvData)
			for (let [index, stype] of subtypes.entries()) {
				try {
					csvReturn.push(castTo(stype, value));
					break;
				} catch (error) {
					if (index === subtypes.length - 1)
						_throw(
							`Invalid value for subtypes [ ${chalk.yellow(
								subtypes.join(", ")
							)} ], received ${chalk.red(value)}`
						);
				}
			}

		return csvReturn;
	}

	_throw(
		"Invalid data type, can only handle " +
			chalk.yellow(
				"int?[min,max], bool, float?[min,max], csv?[int|float|bool|str]"
			) +
			", received " +
			chalk.red(type)
	);
}

module.exports = castTo;
