'use strict';

var utils = require('./utils.js');

var UpdateProfile = function() {
  this.config = null;
  this.webappsDir = null;
  this.webapps20 = null;
  this.webapps13ByManifestURL = {
    "app://browser.gaiamobile.org/manifest.webapp": "browser.gaiamobile.org",
    "app://video.gaiamobile.org/manifest.webapp": "video.gaiamobile.org",
    "app://system.gaiamobile.org/manifest.webapp": "system.gaiamobile.org",
    "app://bluetooth.gaiamobile.org/manifest.webapp": "bluetooth.gaiamobile.org",
    "app://filemanager.gaiamobile.org/manifest.webapp": "filemanager.gaiamobile.org",
    "app://camera.gaiamobile.org/manifest.webapp": "camera.gaiamobile.org",
    "app://clock.gaiamobile.org/manifest.webapp": "clock.gaiamobile.org",
    "app://communications.gaiamobile.org/manifest.webapp": "communications.gaiamobile.org",
    "app://music.gaiamobile.org/manifest.webapp": "music.gaiamobile.org",
    "app://wappush.gaiamobile.org/manifest.webapp": "wappush.gaiamobile.org",
    "app://pdfjs.gaiamobile.org/manifest.webapp": "pdfjs.gaiamobile.org",
    "app://setringtone.gaiamobile.org/manifest.webapp": "setringtone.gaiamobile.org",
    "app://settings.gaiamobile.org/manifest.webapp": "settings.gaiamobile.org",
    "app://alcatelhelp.gaiamobile.org/manifest.webapp": "alcatelhelp.gaiamobile.org",
    "app://calendar.gaiamobile.org/manifest.webapp": "calendar.gaiamobile.org",
    "app://homescreen.gaiamobile.org/manifest.webapp": "homescreen.gaiamobile.org",
    "app://mmitest.gaiamobile.org/manifest.webapp": "mmitest.gaiamobile.org",
    "app://sms.gaiamobile.org/manifest.webapp": "sms.gaiamobile.org",
    "app://jrdlog.gaiamobile.org/manifest.webapp": "jrdlog.gaiamobile.org",
    "app://costcontrol.gaiamobile.org/manifest.webapp": "costcontrol.gaiamobile.org",
    "app://fm.gaiamobile.org/manifest.webapp": "fm.gaiamobile.org",
    "app://fl.gaiamobile.org/manifest.webapp": "fl.gaiamobile.org",
    "app://email.gaiamobile.org/manifest.webapp": "email.gaiamobile.org",
    "app://wallpaper.gaiamobile.org/manifest.webapp": "wallpaper.gaiamobile.org",
    "app://keyboard.gaiamobile.org/manifest.webapp": "keyboard.gaiamobile.org",
    "app://ringtones.gaiamobile.org/manifest.webapp": "ringtones.gaiamobile.org",
    "app://gallery.gaiamobile.org/manifest.webapp": "gallery.gaiamobile.org",
    "https://marketplace.firefox.com/app/9f96ce77-5b2d-42ca-a0d9-10a933dd84c4/manifest.webapp": "calculator",
    "https://marketplace.firefox.com/app/9493e490-6201-474b-afe9-63964c2e56a6/manifest.webapp": "aviary",
    "http://m.weather.co.uk/twcintl.webapp?par=mozilla": "theweatherchannel",
    "https://marketplace.firefox.com/app/f4ed9018-1529-465c-a31b-84e338537053/manifest.webapp": "jumpingmarcelo",
    "https://m.facebook.com/openwebapp/manifest.webapp": "facebook",
    "https://marketplace.firefox.com/packaged.webapp": "marketplace.firefox.com",
    "https://marketplace.firefox.com/app/a22e0277-35bc-434d-9371-1568c75fc726/manifest.webapp": "cuttherope",
    "https://marketplace.firefox.com/app/dcdaeefc-26f4-4af6-ad22-82eb93beadcd/manifest.webapp": "notes",
    "https://marketplace.firefox.com/app/f042b917-18c0-4676-b2d4-bee04b6bb6d8/manifest.webapp": "ageofbarbarians",
    "https://marketplace.firefox.com/app/134b968d-3566-4564-9b78-e02369eb9d01/manifest.webapp": "latch",
    "http://m.youtube.com/mozilla_youtube_webapp": "youtube",
    "https://mobile.twitter.com/cache/twitter.webapp": "twitter",
    "https://marketplace.firefox.com/app/7eccfd71-2765-458d-983f-078580b46a11/manifest.webapp": "m.here.com",
    "https://marketplace.firefox.com/app/8bcde521-3e5b-4e0c-879d-26eccfa0b607/manifest.webapp": "line",
    "app://testbox.gaiamobile.org/manifest.webapp": "testbox.gaiamobile.org"
  };
};

UpdateProfile.prototype.setOptions = function(config) {
  this.config = config;
};

UpdateProfile.prototype.getAppDir = function(appId) {
  var dir = this.webappsDir.clone();
  dir.append(appId);
  return dir;
}

// Moves an app dir to another.
UpdateProfile.prototype.mvApp = function(source, dest) {
  console.log("Moving app " + source + " to " + dest);
  // Physically move the directory
  var sourceDir = this.getAppDir(source);
  utils.copyDirTo(sourceDir, this.webappsDir.path, dest, false);
  utils.deleteFile(sourceDir.path, true);

  // And change the webapps link
  this.webapps20[dest] = this.webapps20[source];
  delete this.webapps20[source];
  if (this.webapps20[dest].origin.startsWith('app://')) {
    this.webapps20[dest].origin = "app://" + dest;
  }
};

UpdateProfile.prototype.execute = function(config) {
  this.setOptions(config);
  this.webappsDir = utils.getFile(this.config.PROFILE_DIR, "webapps");

  var webapps20File = this.webappsDir.clone();
  webapps20File.append("webapps.json");

  this.webapps20 = JSON.parse(utils.getFileContent(webapps20File));
  var webapps20 = this.webapps20;

  var appIdIn13;
  for(var appIdIn20 in webapps20) {
    appIdIn13 = this.webapps13ByManifestURL[webapps20[appIdIn20].manifestURL];
    if ((!webapps20[appIdIn20].removable) ||
        (!appIdIn13) || (appIdIn13 === appIdIn20)) {
      console.log("# Skipped " + appIdIn20 + " because " +
                  (!appIdIn13 ? "it doesn't exist on 1.3" :
                   ((appIdIn13 === appIdIn20) ? "it has the same id in 1.3 and 2.0" :
                     "it's not removable, or it has the same id")));
      continue;
    }
    // If we're here, then we have an app in 2.0 that lives on a different directory than the equivalent app in 1.3. Let's fix it
    // We *could* have a problem...
    if (webapps20[appIdIn13]) {
        console.error("####### We have a problem!!! (2.0: " + appIdIn20 + ", 1.3: " + appIdIn13 +")");
      continue;
    }

    this.mvApp(appIdIn20, appIdIn13);
  }

  utils.writeContent(webapps20File, JSON.stringify(webapps20, null, 2) + '\n');

};

function execute(config) {
  var updateProfile = new UpdateProfile().execute(config);



}

exports.execute = execute;
exports.UpdateProfile = UpdateProfile;



