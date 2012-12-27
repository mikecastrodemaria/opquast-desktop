/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Opquast Desktop.
 *
 * The Initial Developer of the Original Code is
 * Temesis SAS.
 * Portions created by the Initial Developer are Copyright (C) 2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fabrice Bonny <fabrice.bonny@temesis.com>
 *   Olivier Meunier <olivier.meunier@temesis.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

const {PageMod} = require("page-mod");
const {prefs} = require("simple-prefs");
const self = require("self");
const tabs = require("tabs");

const {checklists} = require("app/tester");

const openAbout = exports.openAbout = function() {
    tabs.open(self.data.url('content/about.html'));
};

const openChangelog = exports.openChangelog = function() {
    tabs.open(self.data.url('content/changelog.html'));
};

const openPreferences = exports.openPreferences = function() {
    tabs.open(self.data.url('content/preferences.html'));
};

// About pageMod
PageMod({
    include: self.data.url('content/about.html'),
    contentScriptWhen: "ready",
    contentScriptFile: [
        self.data.url('lib/jquery-1.8.0.min.js'),
        self.data.url('lib/doT.js'),
        self.data.url('content/about.js')
    ],
    contentScriptOptions: {
        "version": self.version,
        "platform": require("api-utils/system").platform
    },
    onAttach: function(worker) {
        let lang = require("api-utils/l10n/core").language();
        let tpl_lang = (lang == "fr") ? "fr" : "en";
        let template = self.data.load("content/templates/about-" + tpl_lang + ".tpl");
        worker.port.emit("attached", template);
    }
});

// Preferences pageMod
PageMod({
    include: self.data.url('content/preferences.html'),
    contentScriptWhen: "ready",
    contentScriptFile: [
        self.data.url('lib/jquery-1.8.0.min.js'),
        self.data.url('lib/doT.js'),
        self.data.url('content/preferences.js')
    ],
    contentScriptOptions: {
        "locales": require("@l10n/data").hash,
        "prefs": prefs,
        "checklists": checklists,
        "template": self.data.load("content/templates/preferences.tpl")
    },
    onAttach: function(worker) {
        worker.port.on("setPref", function(name, value) {
            prefs[name] = value;
        });
    }
});