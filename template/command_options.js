class CommandOptions {
	static AUDIO_EXT = { name: "audio", alias: "a", type: "csv" };
	static IMAGE_EXT = { name: "image", alias: "i", type: "csv" };
	static VIDEO_EXT = { name: "video", alias: "v", type: "csv" };
	static IGNORE_FILES = {
		name: "ignore",
		alias: "r",
		type: "csv",
	};
	static PORT = { name: "port", alias: "p", type: "int[0,65535]" };
	static THUMBNAIL = {
		name: "thumbnail",
		alias: "t",
		type: "bool",
	};
	static DATA = {
		name: "data",
		alias: "d",
		type: "csv[bool|int[20,100]|float[1.1414,3.14]]",
	};
	static BROWSER = { name: "browser", alias: "b", type: "bool" };
	static DEFAULT = { name: "default", alias: "d", type: "bool" };
	static HELP = { name: "help", alias: "h", type: "bool" };
	static SILENT = { name: "silent", alias: "s", type: "bool" };
	static ALL = { name: "all", alias: "l", type: "bool" };
	static CURRENT = { name: "current", alias: "c", type: "bool" };
}

module.exports = CommandOptions;
