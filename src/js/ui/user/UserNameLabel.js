function UserNameLabel (el, user) {
	this._user = user;
	this._el = el;

	this._updateText();
	this._user.on('login-status-change', this._updateText, this);
}

UserNameLabel.prototype = {

	_updateText: function () {
		this._el.innerHTML = this._user.get('username');
	}

}

module.exports = UserNameLabel;