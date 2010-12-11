/* Work around the firefox namespace pollution issue */
if (!addon9408) {
	var addon9408 = {};
}
addon9408.ctmain =
{
	btDoToggle: function() {
		var current = new Object();
		var custom = new Object();

		//Get the current colors
		current.fg = nsPreferences.copyUnicharPref('browser.display.foreground_color', '');
		current.bg = nsPreferences.copyUnicharPref('browser.display.background_color', '');
		current.ln = nsPreferences.copyUnicharPref('browser.anchor_color', '');
		current.vl = nsPreferences.copyUnicharPref('browser.visited_color', '');
		current.sc = nsPreferences.getBoolPref('browser.display.use_system_colors');
		current.wp = nsPreferences.getBoolPref('browser.display.use_document_colors');

		//Get the custom colors
		custom.fg = nsPreferences.copyUnicharPref('extensions.bgtoggle.foreground_color', '#ffffff');
		custom.bg = nsPreferences.copyUnicharPref('extensions.bgtoggle.background_color', '#000000');
		custom.ln = nsPreferences.copyUnicharPref('extensions.bgtoggle.anchor_color', '#66cccc');
		custom.vl = nsPreferences.copyUnicharPref('extensions.bgtoggle.visited_color', '#c0c0c0');
		custom.sc = nsPreferences.getBoolPref('extensions.bgtoggle.use_system_colors', false);
		custom.wp = nsPreferences.getBoolPref('extensions.bgtoggle.use_document_colors', false);

		//Save the custom colors to the current colors
		nsPreferences.setUnicharPref('browser.display.foreground_color', custom.fg);
		nsPreferences.setUnicharPref('browser.display.background_color', custom.bg);
		nsPreferences.setUnicharPref('browser.anchor_color', custom.ln);
		nsPreferences.setUnicharPref('browser.visited_color', custom.vl);
		nsPreferences.setBoolPref('browser.display.use_system_colors', custom.sc);
		nsPreferences.setBoolPref('browser.display.use_document_colors', custom.wp);

		//Save the previously current colors as the new custom colors
		nsPreferences.setUnicharPref('extensions.bgtoggle.foreground_color', current.fg);
		nsPreferences.setUnicharPref('extensions.bgtoggle.background_color', current.bg);
		nsPreferences.setUnicharPref('extensions.bgtoggle.anchor_color', current.ln);
		nsPreferences.setUnicharPref('extensions.bgtoggle.visited_color', current.vl);
		nsPreferences.setBoolPref('extensions.bgtoggle.use_system_colors', current.sc);
		nsPreferences.setBoolPref('extensions.bgtoggle.use_document_colors', current.wp);

		//Apply it
		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefService.savePrefFile(null);
	},

	btOnStartup: function() {
		var widget = document.getElementById('bt-widget-of-DOOM');
		if (!widget) {
			conlog.logStringMessage('bgtoggle: Could not get statusbar widget');
			return;
		}
		widget.label = nsPreferences.copyUnicharPref('extensions.bgtoggle.widget_text', 'CT');
		widget.position = nsPreferences.getIntPref('extensions.bgtoggle.widget_pos', 10);
		widget.hidden = nsPreferences.getBoolPref('extensions.bgtoggle.hide_statusbar_widget', false);
		this.btSetKey();
	},

	/**
	 * Apparently changing a key combo on the fly involves deleting the entire
	 * keyset and creating a new one. There's probably an API to do this as
	 * well, but if so it's not extremely discoverable.
	 */
	btSetKey: function() {
		var conlog = Components.classes['@mozilla.org/consoleservice;1']
									.getService(Components.interfaces.nsIConsoleService);
		var keyset = document.getElementById('bt-ks-main');
		var ksparent;
		var keyelem;
		var keyarr = nsPreferences.copyUnicharPref('extensions.bgtoggle.key_combo', 'u,true,true,false').split(',');
		var key = keyarr[0];
		var ctrl = (keyarr[1] === 'true');
		var shift = (keyarr[2] === 'true');
		var alt = (keyarr[3] === 'true');
		var modstr = [];

		if (ctrl) {
			modstr.push('control');
		}
		if (shift) {
			modstr.push('shift');
		}
		if (alt) {
			modstr.push('alt');
		}
		modstr = modstr.join(',');

		if (!keyset) {
			conlog.logStringMessage('bgtoggle: Could not get keyset element');
			return;
		}
		ksparent = keyset.parentNode;
		if (!ksparent) {
			conlog.logStringMessage('bgtoggle: Keyset has no parent');
			return;
		}

		if (key.length > 1) {
			conlog.logStringMessage('bgtoggle: Key length > 1');
			return;
		}

		for (var i = 0; i < keyset.childNodes.length; ++i) {
			if (keyset.childNodes.item(i).id == 'bt-key-toggle') {
				keyset.removeChild(keyset.childNodes.item(i));
				break;
			}
		}
		ksparent.removeChild(keyset);

		keyset = document.createElement('keyset');
		keyset.id = 'bt-ks-main';

		keyelem = document.createElement('key');
		keyelem.setAttribute('id', 'bt-key-toggle');
		keyelem.setAttribute('command', 'bt-cmd-toggle');
		keyelem.setAttribute('key', key);
		keyelem.setAttribute('modifiers', modstr);

		keyset.appendChild(keyelem);
		ksparent.appendChild(keyset);
	},

	/*
	 * We use an observer to detect when preferences have been updated and then
	 * apply them.
	 */
	btPrefObserver :
	{
		register: function() {
			var prefService = Components.classes['@mozilla.org/preferences-service;1']
											  .getService(Components.interfaces.nsIPrefService);
			this._pref_branch = prefService.getBranch('extensions.bgtoggle.');
			this._pref_branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
			this._pref_branch.addObserver('', this, false);
		},

		unregister: function() {
			if (this._pref_branch) {
				this._pref_branch.removeObserver('', this);
			}
		},

		observe: function(branch, event, name)
		{
			var conlog = Components.classes['@mozilla.org/consoleservice;1']
											.getService(Components.interfaces.nsIConsoleService);
			var widget = document.getElementById('bt-widget-of-DOOM');
			if (!widget) {
				conlog.logStringMessage('bgtoggle: Could not get statusbar widget');
				return;
			}

			if (event == 'nsPref:changed') {
				switch (name) {
				case 'widget_text':
					widget.label = nsPreferences.copyUnicharPref('extensions.bgtoggle.widget_text', '');
					break;
				case 'key_combo':
					addon9408.ctmain.btSetKey();
					break;
				case 'widget_pos':
					widget.position = nsPreferences.getIntPref('extensions.bgtoggle.widget_pos', 10);
					break;
				case 'hide_statusbar_widget':
					widget.hidden = nsPreferences.getBoolPref('extensions.bgtoggle.hide_statusbar_widget', false);
					break;
				}
			 }
		}
	}
}

addon9408.ctmain.btPrefObserver.register();


window.addEventListener('load', function(e) { addon9408.ctmain.btOnStartup(); }, false);
