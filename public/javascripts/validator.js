function isUsernameValid(username){
	return /^[a-zA-Z][a-zA-Z0-9_]{6,18}$/.test(username);
}
