const { Processor } = require("../index");
const commands = require("./command_definition.js");
const argv = process.argv.slice(2);

const processor = new Processor(
	Object.values(commands),
	commands.help.name
);
processor.process(argv);
