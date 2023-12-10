class Command {
	constructor({
		name = "",
		description = "",
		args = [],
		kwargs = [],
		action = () => {},
	}) {
		if (typeof action !== "function")
			throw new Error(
				"action must be a valid function in Command."
			);

		if (typeof name !== "string")
			throw new Error("name must be a string in Command.");

		if (typeof description !== "string")
			throw new Error("name must be a string in Command.");

		this.name = name;
		this.description = description;
		this.args = args ?? [];
		this.kwargs = kwargs ?? [];
		this.action = action;
	}
}

module.exports = Command;
