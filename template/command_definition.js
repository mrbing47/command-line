const CommandOptions = require("./command_options");
const { Command } = require("../index");

const init = new Command({
	name: "init",
	description:
		"This command initialises the parameters for the stream.",
	args: [CommandOptions.DEFAULT],
	action: (data, args, kwargs) => {
		console.log("Inside init");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

const reset = new Command({
	name: "reset",
	description: "This command resets the stream parameters.",
	args: [
		CommandOptions.AUDIO_EXT,
		CommandOptions.VIDEO_EXT,
		CommandOptions.IMAGE_EXT,
		CommandOptions.PORT,
		CommandOptions.BROWSER,
		CommandOptions.THUMBNAIL,
		CommandOptions.ALL,
	],
	action: (data, args, kwargs) => {
		console.log("Inside reset");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

const update = new Command({
	name: "update",
	description: "This command updates the existing stream parameters.",
	args: [
		CommandOptions.AUDIO_EXT,
		CommandOptions.VIDEO_EXT,
		CommandOptions.IMAGE_EXT,
		CommandOptions.PORT,
		CommandOptions.BROWSER,
		CommandOptions.THUMBNAIL,
	],
	kwargs: [
		CommandOptions.AUDIO_EXT,
		CommandOptions.VIDEO_EXT,
		CommandOptions.IMAGE_EXT,
		CommandOptions.PORT,
		CommandOptions.BROWSER,
		CommandOptions.THUMBNAIL,
	],
	action: (data, args, kwargs) => {
		console.log("Inside update");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

const help = new Command({
	name: "help",
	description: "This command prints the help menu for stream.",
	action: (data, args, kwargs) => {
		console.log("Inside help");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

const run = new Command({
	name: "run",
	description:
		"This command runs the application in given directory.",
	kwargs: [
		CommandOptions.AUDIO_EXT,
		CommandOptions.VIDEO_EXT,
		CommandOptions.IMAGE_EXT,
		CommandOptions.PORT,
		CommandOptions.BROWSER,
		CommandOptions.THUMBNAIL,
	],
	action: (data, args, kwargs) => {
		console.log("Inside run");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

const config = new Command({
	name: "config",
	description:
		"This command displays the configurations for given directory.",
	args: [CommandOptions.DEFAULT, CommandOptions.CURRENT],
	action: (data, args, kwargs) => {
		console.log("Inside config");
		console.log("data: ", data);
		console.log("args:", args);
		console.log("kwargs:", kwargs);
	},
});

module.exports = { init, update, run, help, reset, config };
