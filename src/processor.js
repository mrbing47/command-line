const chalk = require("chalk");
const { castTo, _throw, regex } = require("./util");

class Processor {
	constructor(commands = [], fallback) {
		if (!Array.isArray(commands)) {
			_throw("commands must be an array in Processor.");
		}

		this.commands = commands.reduce(
			(acc, curr) => ({
				...acc,
				[curr.name]: curr,
			}),
			{}
		);

		if (fallback) {
			if (!(typeof fallback === "string"))
				_throw(
					`fallback must be of type ${chalk.yellow(
						"string"
					)}, received ${chalk.red(typeof fallback)}`
				);

			if (!Object.hasOwn(this.commands, fallback))
				_throw(
					`fallback command must exist in ${chalk.yellow(
						"commands"
					)} array, received ${chalk.red(fallback)}`
				);
		}

		this.fallback = fallback;
	}

	/*
		This function takes an array of argv and
		then separates command, data, args and kwargs.
	*/
	normaliseCommand(argv) {
		const kwargs = [];
		const args = [];

		const number_regex = regex.value.float;

		let data;
		let command;

		let reset = true;

		for (let i of argv) {
			if (i.startsWith("-") && !number_regex.test(i)) {
				args.push(i);
				reset = true;
			} else {
				if (args.length > 0) {
					if (reset) {
						kwargs.push([args.pop(), i]);
						reset = false;
					} else _throw(`Invalid token ${chalk.red(i)}`);
				} else {
					if (command) {
						if (data)
							_throw(`Invalid token ${chalk.red(i)}`);
						data = i;
					} else command = i;
				}
			}
		}

		return [command, data, args, kwargs];
	}

	/*
		This function takes the command, args and kwargs
		and then checks them if they exist for the command
		and if they do, convert the values to
	*/
	normaliseFlags(command, args, kwargs) {
		const return_arg = command.args.reduce(
			(acc, curr) => ({
				...acc,
				[curr.name]: { type: curr.type, value: false },
			}),
			{}
		);

		const return_kwarg = command.kwargs.reduce(
			(acc, curr) => ({
				...acc,
				[curr.name]: { type: curr.type, value: undefined },
			}),
			{}
		);

		for (let [index, flags] of [args, kwargs].entries()) {
			const store = index === 1 ? return_kwarg : return_arg;

			for (let arg of flags) {
				if (index === 0) arg = [arg, true];

				const commandArg = index
					? command.kwargs
					: command.args;

				const flaghead_regex = regex.command.flaghead;
				const compareArg = arg[0].replace(flaghead_regex, "");
				const isName = arg[0].startsWith("--");
				let isFound = false;

				for (let carg of commandArg) {
					const checker = isName ? carg.name : carg.alias;

					if (compareArg === checker) {
						isFound = true;
						store[carg.name].value = index
							? castTo(carg.type, arg[1])
							: arg[1];
						break;
					}
				}
				if (!isFound)
					_throw(
						`Invalid ${
							arg[0].startsWith("--") ? "long" : "short"
						} ${index ? "kwarg" : "arg"} ${chalk.red(
							arg[0]
						)} for command ${chalk.yellow(command.name)}`
					);
			}
		}

		return [return_arg, return_kwarg];
	}

	process(argv) {
		let [command, data, args, kwargs] = this.normaliseCommand(argv);

		if (command) {
			if (!Object.hasOwn(this.commands, command))
				_throw(`Invalid command ${chalk.red(command)}`);
		} else {
			if (this.fallback) command = this.fallback;
			else
				_throw("Unable to fallback, please provide a command.");
		}

		const [normalisedArgs, normalisedKwargs] = this.normaliseFlags(
			this.commands[command],
			args,
			kwargs
		);

		this.commands[command].action(
			data,
			normalisedArgs,
			normalisedKwargs
		);
	}
}

module.exports = Processor;
