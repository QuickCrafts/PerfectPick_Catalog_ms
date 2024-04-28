module.exports = class ServerError extends Error {
	constructor(message, code) {
		super(message);
		this._code = code;
	}

	get code(){
		return this._code;
	}
}