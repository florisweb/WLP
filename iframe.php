<?php
	if (!isset($_COOKIE["WLP_firstTimeMessageSeen"]))
	{
		header("Location: iframeFirstTime.php");
	}
	setcookie("WLP_firstTimeMessageSeen", true, time() + 60 * 60 * 24 * 365);
?>
<!DOCTYPE html>
<html>
	<head>
		<meta content='width=device-width, initial-scale=0.6, maximum-scale=0.7, user-scalable=0' name='viewport'/>
		<style>
			html {background: #000}
			body {
				position: relative;
				height: 100vh;
				width: 100vw;
				margin: 0;
				padding: 0;
				background: linear-gradient(to bottom, rgba(25, 33, 89, 0.4), rgba(0, 100, 220, 0.8));
			}


			#WLPIframe {
				position: fixed;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
				border: none;
			}

			#feeDBExtensionackMessageHolder {
				position: fixed;
				float: bottom;
				bottom: 0;
				left: 0;
				width: calc(100% - 20px);
				height: auto;

				padding: 10px;

				background: rgba(0, 0, 0, 0.8);
				color: #ddd;
				font-size: 20px;
				transition: all 1s;
			}
			
			#feeDBExtensionackMessageHolder.hide {
				bottom: -400px;
			}

			#feeDBExtensionackMessage {
				position: relative; 
				float: left; 
				top: 10px; 
				max-width: calc(100% - 200px);
			}



			.boxButton {
				position: relative;
				width: auto;
				padding: 7px 15px;
				border: 1px solid #ddd;
				
				font-size: 20px;
				color: #ddd;
				text-align: center;

				cursor: pointer;
				transition: all 0.5s;
			}

			.boxButton.important {
				background: #ddd;
				color: #222;
			}

			.boxButton:hover {
				border: 1px solid #aaa;
				background: #ddd;
				color: #222;
			}
			.boxButton.important:hover {
				background: none;
				color: #ddd;
			}


			@media screen and (max-width: 940px) {
				#feeDBExtensionackMessage {
					top: 0;
				}

				.boxButton {
					padding: 10px 15px;
				}
			}
			@media screen and (max-width: 600px) {
				#feeDBExtensionackMessage {
					top: 0;
					max-width: 100%;
					margin-top: 10px;

					margin-bottom: 20px;

				}

				.boxButton {
					width: calc(50% - 32px);
				}
			}


			#darkenOverlay {
				position: fixed;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
				background: rgba(0, 0, 0, 0.7);
				transition: all 0.5s;
			}

			#darkenOverlay.hide {
				opacity: 0;
				pointer-events: none;
			}

			#messageHolder {
				position: relative;
				top: calc(50vh - 180px);
				width: calc(95vw - 40px);
				max-width: 400px;
				
				height: auto;
				margin: auto;
				padding: 20px;
				border-radius: 5px;

				background: rgb(54, 57, 63);
				text-align: center;
				transition: all 0.3s;
			}

			#messageHolder.hide {
				transform: scale(0.2);
				opacity: 0;
				pointer-events: none;
			}


			.text {
				color: #aaa;
				line-height: 30px;
			}

			.text.header {
				color: #ddd;
				font-size: 30px;
			}

			.text.messageTitle {
				font-size: 25px;
				font-weight: bolder;
			}

			.icon {
				position: relative;
				/*float: left;*/
				margin: auto;
				width: 100px;
				height: auto;
				opacity: 0.8;
			}
		</style>

		<link rel="shortcut icon" href="https://florisweb.dev/pictures/favicon.ico">
		<title>WLP - florisweb.dev (0.9.2)</title>
	</head>
	<body>
		<iframe src="https://florisweb.dev/PC/WLP" id="WLPIframe"></iframe>


		<div id="darkenOverlay" class="hide">
		</div>
		<div style="text-align: center">
			<div id="messageHolder" class="hide">
				<br>
				<img src="images/updateIcon.png" class="icon">
				<br>
				<br>
				<a class="text header">Release 0.9.2</a>
				<br>
				<a class="text">WLP has been updated to version 0.9.2</a>
				<br>
				<br>
				<br>
				<div class="boxButton" style="width: 50%; margin: auto" onclick="hideMessage()">Continue</div>
			</div>
		</div>
		<script>
			let messageVersion = 2;
			if (!localStorage.WLP_lastMessage || parseInt(localStorage.WLP_lastMessage) < messageVersion) setTimeout(showMessage, 1);

			function showMessage() {
				document.getElementById("messageHolder").classList.remove("hide");
				document.getElementById("darkenOverlay").classList.remove("hide");
			}

			function hideMessage() {
				localStorage.WLP_lastMessage = messageVersion;
				document.getElementById("messageHolder").classList.add("hide");
				document.getElementById("darkenOverlay").classList.add("hide");
			}
		</script>



		<div id="feeDBExtensionackMessageHolder" class="hide">
			<div id="feeDBExtensionackMessage">Hey there!, We see you've been enjoying WLP, would you like to give us some feeDBExtensionack?</div>
			<div class="boxButton important" style="float: right" onclick='
				hideFeeDBExtensionackMessage(); 
				localStorage.WLP_feeDBExtensionackGiven = true;
				dontAskAgain = true;
				window.open("https://docs.google.com/forms/d/e/1FAIpQLSfOP9sgYQJA98B8yEaXjkHRp5roMeyrXNJtNUQ18fp7pfec8w/viewform?usp=sf_link")
			'>Sure</div>
			<div class="boxButton" style="float: right" onclick="hideFeeDBExtensionackMessage(); dontAskAgain = true;">Not now</div>
		</div>
		<script>

			let lastFeeDBExtensionackQuestion = new Date();
			let dontAskAgain = false;
			let askAfterS = 1000 * 60 * 60 * 5; //15 minutes
			function checkTime() {
				if (new Date() - lastFeeDBExtensionackQuestion > askAfterS) document.getElementById("feeDBExtensionackMessageHolder").classList.remove("hide");
				if (!dontAskAgain) var loopTimer = setTimeout(checkTime, 1000 * 60);
			}
			function hideFeeDBExtensionackMessage() {
				document.getElementById("feeDBExtensionackMessageHolder").classList.add("hide");
			}
			if (localStorage.WLP_feeDBExtensionackGiven !== "true") checkTime();



			 // Enable the 'are you sure you want to leave'-text
			  window.onbeforeunload = function(e) {
			    return false;
			  }
			  window.onunload = function () {
			    return false;
			  }

		</script>
	</body>
</html>