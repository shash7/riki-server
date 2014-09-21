
// Person == user
exports.person =  {
	name      : 'string',
	email     : 'string',
	password  : 'string',
	created   : 'string',
	notifications : [{ message : 'string', date : 'string' }],
	avatar : {
		avatarEncode : 'string',
		avatarType   : 'string'
	},
	personal : {
		bio     : 'string',
		website : 'string'
	}
};

exports.post = {
	title        : 'string',
	creator      : 'string',
	created      : 'string',
	likes        : 'number',
	type         : 'string',
	messsage     : 'string', // Base64 encoded image, url of image or text
	post         : 'string'
};

// File metadata
exports.element =  {
	name     : 'string',
	type     : 'string',
	ext      : 'string',
	creator  : 'string',
	created  : 'string',
	modified : 'string',
	group    : 'string'
};