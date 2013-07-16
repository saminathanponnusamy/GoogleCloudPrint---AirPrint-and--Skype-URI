var isDocDownloaded = false;
var downloadedFile;

try {
	var GCP = require('ti.gcp');

	if (OS_IOS)
		AirPrint = require('ti.airprint');

} catch(e) {
	alert("Cant load Module" + e);
}

function doPrintRemoteDoc(e) {
	GCP.open({
		title : 'Remote PDF',
		type : 'url', // Hint: the URL you specify must be internet accessible; local urls will not work!
		data : 'http://www.keynote.com/docs/whitepapers/WP_Testing_Strategies.pdf'
	});
}

function doPrintLocalDoc(e) {

	if (OS_ANDROID) {
		var myAppDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);
		var sdcardDir = myAppDir.getParent().getNativePath();
		downloadedFile = sdcardDir + "/Sample.pdf";
	} else {

		if (isDocDownloaded === false) {
			alert('Please download Document then print it');
			return;
		}
		downloadedFile = downloadedFile.nativePath;
	}
	alert("path" + downloadedFile);
	try {
		GCP.open({
			title : 'Local PDF',
			type : 'application/pdf',
			data : '' + Ti.Utils.base64encode(Ti.Filesystem.getFile(downloadedFile).read()),
			encoding : 'base64'
		});
	} catch(e) {

		alert("Error" + e);
	}
}

function doAirPrint(e) {
	try {
		if (isDocDownloaded === true) {

			AirPrint.print({
				url : downloadedFile.nativePath,
				showsPageRange : true,
				view : $.airPrint
			});
		} else {
			alert('Please download Document then print it');
		}
	} catch(e) {

		alert("Error" + e);
	}

}

function downloadDocument(e) {

	var xhr = Titanium.Network.createHTTPClient({
		timeout : 10000,
		onload : function(e) {
			isDocDownloaded = true;
			downloadedFile = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "Sample.pdf");
			downloadedFile.write(this.responseData);
			alert("Download Completed")

		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		ondatastream : function(e) {
			Ti.API.info("Downloading...");
		}
	});

	xhr.open('GET', 'http://178.239.16.28/fzs/sites/default/files/dokumenti-vijesti/sample.pdf');
	xhr.send();

}

function doVideoSkypeCall(e) {

	var username = $.username.value.trim();
	if (username === null || username.length === 0) {
		alert('Please Enter Skype User name to initiate Skype Video call');
		return;
	}
	Titanium.Platform.openURL("skype:" + username + "?call&video=true");
}

function doAudioSkypeCall(e) {
	var username = $.username.value.trim();
	if (username === null || username.length === 0) {
		alert('Please Enter Skype User name to initiate Skype Audio call');
		return;
	}
	Titanium.Platform.openURL("skype:" + username + "?call");
}

$.index.open();
