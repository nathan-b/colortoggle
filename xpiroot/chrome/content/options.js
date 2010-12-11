if (!addon9408) {
	var addon9408 = {};
}

addon9408.ctopts = {
	conlog: Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService),

	GetColorPref: function(control_id, prefstr, default_val, force_default)	{
		var control = document.getElementById(control_id);
		if (control) {
			if (force_default) {
				control.value = default_val;
			} else {
				control.value = nsPreferences.copyUnicharPref(prefstr, default_val);
			}
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not get control ' + control_id);
		}
	},

	GetNumericPref: function(control_id, prefstr, default_val, force_default) {
		var control = document.getElementById(control_id);
		if (control) {
			if (force_default) {
				control.value = default_val;
			} else {
				control.value = nsPreferences.getIntPref(prefstr, default_val);
			}
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not get control ' + control_id);
		}
	},

	GetCheckPref: function(control_id, prefstr, default_val, force_default) {
		var control = document.getElementById(control_id);
		if (control) {
			if (force_default) {
				control.checked = default_val;
			} else {
				control.checked = nsPreferences.getBoolPref(prefstr, default_val);
			}
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not get control ' + control_id);
		}
	},

	GetStringPref: function(control_id, prefstr, default_val, force_default) {
		var control = document.getElementById(control_id);
		if (control) {
			if (force_default) {
				control.value = default_val;
			} else {
				control.value = nsPreferences.copyUnicharPref(prefstr, default_val);
			}
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not get control ' + control_id);
		}
	},

	GetKeyPref: function(txt_id, ctrl_id, shift_id, alt_id, prefstr, default_val, force_default) {
		var txt_ctl = document.getElementById(txt_id);
		var ctrl_ctl = document.getElementById(ctrl_id);
		var shift_ctl = document.getElementById(shift_id);
		var alt_ctl = document.getElementById(alt_id);
		var prefarr = nsPreferences.copyUnicharPref(prefstr, default_val).split(',');
		if (force_default) {
			prefarr = default_val.split(',');
		}

		if (prefarr.length != 4) {
			this.conlog.logStringMessage('bgtoggle: Key combo string is corrupt: ' + prefarr.join(','));
			prefarr = default_val.split(','); /* Yeah, if the default val is corrupt then we're hosed */
		}

		if (txt_ctl && ctrl_ctl && shift_ctl && alt_ctl) {
			txt_ctl.value = prefarr[0];
			ctrl_ctl.checked = (prefarr[1] === 'true');
			shift_ctl.checked = (prefarr[2] === 'true');
			alt_ctl.checked = (prefarr[3] === 'true');
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not get controls for key combo');
		}
	},

	SaveColorPref: function(control_id, prefstr) {
		var control = document.getElementById(control_id);
		if (control) {
			nsPreferences.setUnicharPref(prefstr, control.getAttribute('value'));
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not save control ' + control_id);
		}
	},

	SaveNumericPref: function(control_id, prefstr) {
		var control = document.getElementById(control_id);
		if (control) {
			nsPreferences.setIntPref(prefstr, parseInt(control.value));
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not save control ' + control_id);
		}
	},

	SaveStringPref: function(control_id, prefstr) {
		var control = document.getElementById(control_id);
		if (control) {
			nsPreferences.setUnicharPref(prefstr, control.value);
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not save control ' + control_id);
		}
	},

	SaveCheckPref: function(control_id, prefstr) {
		var control = document.getElementById(control_id);
		if (control) {
			nsPreferences.setBoolPref(prefstr, control.checked);
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not save control ' + control_id);
		}
	},

	SaveKeyPref: function(txt_id, ctrl_id, shift_id, alt_id, prefstr) {
		var txt_ctl = document.getElementById(txt_id);
		var ctrl_ctl = document.getElementById(ctrl_id);
		var shift_ctl = document.getElementById(shift_id);
		var alt_ctl = document.getElementById(alt_id);
		var str = '';

		if (txt_ctl && ctrl_ctl && shift_ctl && alt_ctl) {
			str = txt_ctl.value + ',' + ctrl_ctl.checked + ',' + shift_ctl.checked + ',' + alt_ctl.checked;
			nsPreferences.setUnicharPref(prefstr, str);
		} else {
			this.conlog.logStringMessage('bgtoggle: Could not save key combo control states');
		}
	},

	DoMeUp: function(defaults) {
		//Get default firefox prefs for Scheme 1 (I don't provide default Firefox colors...those are up to the user)
		addon9408.ctopts.GetColorPref('cp1-fg', 'browser.display.foreground_color', '#0c0c0c', false);
		addon9408.ctopts.GetColorPref('cp1-bg', 'browser.display.background_color', '#c0c0c0', false);
		addon9408.ctopts.GetColorPref('cp1-ln', 'browser.anchor_color', '#66cccc', false);
		addon9408.ctopts.GetColorPref('cp1-vl', 'browser.visited_color', '#cc6666', false);
		addon9408.ctopts.GetCheckPref('cp1-sc', 'browser.display.use_system_colors', true, defaults);
		addon9408.ctopts.GetCheckPref('cp1-wp', 'browser.display.use_document_colors', true, defaults);

		//Get the user's stored prefs for Scheme 2
		addon9408.ctopts.GetColorPref('cp2-fg', 'extensions.bgtoggle.foreground_color', '#ffffff', defaults);
		addon9408.ctopts.GetColorPref('cp2-bg', 'extensions.bgtoggle.background_color', '#000000', defaults);
		addon9408.ctopts.GetColorPref('cp2-ln', 'extensions.bgtoggle.anchor_color', '#66cccc', defaults);
		addon9408.ctopts.GetColorPref('cp2-vl', 'extensions.bgtoggle.visited_color', '#c0c0c0', defaults);
		addon9408.ctopts.GetCheckPref('cp2-sc', 'extensions.bgtoggle.use_system_colors', false, defaults);
		addon9408.ctopts.GetCheckPref('cp2-wp', 'extensions.bgtoggle.use_document_colors', false, defaults);

		//Get prefs for statusbar widget
		addon9408.ctopts.GetKeyPref('bt-ct-key',
											 'bt-key-ctrl',
											 'bt-key-shift',
											 'bt-key-alt',
											 'extensions.bgtoggle.key_combo',
											 'u,true,true,false', defaults);
		addon9408.ctopts.GetStringPref('bt-sb-text', 'extensions.bgtoggle.widget_text', 'CT', defaults);
		addon9408.ctopts.GetCheckPref('bt-hide-ui', 'extensions.bgtoggle.hide_statusbar_widget', false, defaults);

	},

	SaveMeUp: function() {
		addon9408.ctopts.SaveColorPref('cp1-fg', 'browser.display.foreground_color');
		addon9408.ctopts.SaveColorPref('cp1-bg', 'browser.display.background_color');
		addon9408.ctopts.SaveColorPref('cp1-ln', 'browser.anchor_color');
		addon9408.ctopts.SaveColorPref('cp1-vl', 'browser.visited_color');
		addon9408.ctopts.SaveCheckPref('cp1-sc', 'browser.display.use_system_colors');
		addon9408.ctopts.SaveCheckPref('cp1-wp', 'browser.display.use_document_colors');
		addon9408.ctopts.SaveColorPref('cp2-fg', 'extensions.bgtoggle.foreground_color');
		addon9408.ctopts.SaveColorPref('cp2-bg', 'extensions.bgtoggle.background_color');
		addon9408.ctopts.SaveColorPref('cp2-ln', 'extensions.bgtoggle.anchor_color');
		addon9408.ctopts.SaveColorPref('cp2-vl', 'extensions.bgtoggle.visited_color');
		addon9408.ctopts.SaveCheckPref('cp2-sc', 'extensions.bgtoggle.use_system_colors');
		addon9408.ctopts.SaveCheckPref('cp2-wp', 'extensions.bgtoggle.use_document_colors');

		addon9408.ctopts.SaveKeyPref('bt-ct-key', 'bt-key-ctrl', 'bt-key-shift', 'bt-key-alt', 'extensions.bgtoggle.key_combo');
		addon9408.ctopts.SaveStringPref('bt-sb-text', 'extensions.bgtoggle.widget_text');
		addon9408.ctopts.SaveCheckPref('bt-hide-ui', 'extensions.bgtoggle.hide_statusbar_widget');

		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefService.savePrefFile(null);
	}
}
