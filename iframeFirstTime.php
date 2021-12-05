<!DOCTYPE html>
<html>
	<head>
		<meta content='width=device-width, initial-scale=0.6, maximum-scale=0.7, user-scalable=0' name='viewport'/>
		<style>
			#WLPImg {
				position: fixed;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
			}
			
			#overLayMenu {transition: all 0.5s;}
			#overLayMenu.hide {
				top: -5vh;
				opacity: 0;
				pointer-events: none;
			}

			#shadowBackground {
				position: fixed;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
				background: rgba(0, 0, 0, 0.5);
			}

			#messageHolder {
				position: relative;
				margin: auto;
				top: 10vh;
				width: 70vw;
				padding: 5vw;
				height: auto;
				background: linear-gradient(to bottom, #fff, #ddd);
				text-align: center;
				max-width: 900px;
			}
			

			.text {
				/*font-family: "Courier New", Courier, monospace;*/
				font-family: Verdana, Geneva, sans-serif;
				color: #444;
				line-height: 23px;
			}

			.text.smallHeader {
				position: relative;
				top: 2px;
				font-size: 20px;
				font-weight: bolder;
				font-family: "Lucida Console", Monaco, monospace;		
				color: #112;	
			}
			.text.header {
				font-size: 27px;
				font-weight: bolder;
				font-family: "Lucida Console", Monaco, monospace;	
				color: #000;
			}

			.text.superHeader {
				font-size: 30px;
				font-weight: bolder;
				font-family: "Lucida Console", Monaco, monospace;
			}
			.text.subTitle {
				color: #666;
			}





			#navigationHolder {
				position: relative;
				width: 90%;
				left: 5%;
				overflow-x: hidden;
			}

			.imageOnRightSide {
				position: relative;
				float: left;
				top: 60px;
				width: 45%;
				height: auto;
				margin: 2.5%;

				margin-bottom: 60px;
				box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
			}


			.navigationItem {
				position: relative;
				float: right;
				width: 45%;
				margin: calc(2.5% - 11px);
				padding: 10px;


				text-align: left;


			}

			.navigationItem_icon {
				position: relative;
				left: 0;
				float: left;
				margin-right: 15px;
				box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
				border-radius: 4px;
			}
			
			.navigationItem_text {
				position: relative;
				left: 3%;
				width: 94%;
			}	





			
				
			.boxButton {
				position: relative;
				float: left;
				width: auto;
				padding: 10px 25px;
				border: 1px solid #ddd;


				background: rgba(0, 0, 0, 0.7);
				
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
				border: 1px solid #ddd;
				background: #ddd;
				color: #222;
			}
			.boxButton.important:hover {
				background: none;
				color: #ddd;
			}





			@media screen and (max-width: 800px) {
				.navigationItem {
					width: 95%;
				}
				.imageOnRightSide {
					width: 95%;
					margin-bottom: 80px;
					margin-top: -40px;
				}

				
			}
			@media screen and (max-width: 600px) {
				.navigationItem {
					margin-bottom: 5%;
				}
				#messageHolder {
					top: 0;
					width: 90%;
				}
			}

			
		</style>

		<title>WLP - florisweb.dev</title>
	</head>
	<body>
		<image src="images/createPage.png" id="WLPImg">
		
		<div id="overLayMenu">
			<div id="shadowBackground"></div>

			<div id="messageHolder">
				<div style="
					position: fixed;
					z-index: 1000;
					top: -25px;
					left: -30px;
					width: calc(100%);
					
					text-align: center;
					/*background: rgba(30, 30, 30, 0.9);*/
					box-shadow: inset 0px 50px 30px 30px rgba(0, 0, 0, 0.5);
					padding: 30px;
				">
					<div style="position: relative; width: 400px; margin: auto">
						<a href="https://wlp.florisweb.dev">
							<div class="boxButton important" style="position: relative">
								Start using WLP
							</div>
						</a>
						<div class="boxButton" style="
							position: relative; 
						" onclick='window.open("https://docs.google.com/forms/d/e/1FAIpQLSfOP9sgYQJA98B8yEaXjkHRp5roMeyrXNJtNUQ18fp7pfec8w/viewform?usp=sf_link")'>
							Give us feeDBExtensionack
						</div>
					</div>
				</div>

				<br>
				<a class="text superHeader" style="line-height: 45px">Welcome</a>
				<br>
				<a class="text subTitle">It looks like this is your first time here, <br>so we'll give you a quick overview,</a>

				<br>
				<br>
				<?php
					// if (!isset($_SESSION["userId"])) 
					echo '<br><br><a class="text">First things first, <br>In order to use WLP you\'ll have to have a florisweb.dev account, <br> if you don\'t have one yet, create one:</a><br><br><a href="" onclick="window.open(\'https://florisweb.dev/user/register.php\')"><img src="images/registerIcon.png" style="width: 14%; height: auto; min-width: 100px"></a><br><br><br><br><a class="text">Secondly, we\'ll give you a short tour of the basics.</a>';
				?>
				<br>
				<br>
				<br>
				<div id="navigationHolder">
					<div class="navigationItem" style="text-align: center;">
						<a class="text header">Navigation</a>
						<br>
						<br>
						<div class="text subTitle">
							You'll find the navigation in the top left.
						</div>
					</div>
					<br>
					<br>

					<img src="images/navigation.png" class="imageOnRightSide">
					<div class="navigationItem">
						<img src="images/recents.png" class="navigationItem_icon">
						<a class="text smallHeader">Recents / overview</a>
						<br>
						<br>
						<div class="text navigationItem_text">
							<i>Recents</i> is the place where you'll find all your tests and folders.
						</div>
					</div>
					<br>
					<div class="navigationItem">
						<img src="images/search.png" class="navigationItem_icon">
						<a class="text smallHeader">Search</a>
						<br>
						<br>
						<div class="text navigationItem_text">
							<i>Search</i> is pretty straight forward, it's the place where you can search for tests.
						</div>
					</div>
					<br>
					<img src="images/createPage.png" class="imageOnRightSide" style="margin-bottom: 300px">
					<br>
					<div class="navigationItem">
						<img src="images/addTest.png" class="navigationItem_icon">
						<a class="text smallHeader">Add tests</a>
						<br>
						<br>
						<div class="text navigationItem_text">
							<i>Add tests</i> is the way to add lists in WLP, 
							you do so as follows:
							<ol>
								<li>
									Fill in the tittle and the subjects (Languages)
								</li>
								<br>
								<li>
									Fill in the words you want to learn and their translations.
								</li>
								<br>
								<li>
									Click the Create button and start the testing process!
								</li>
							</ol>
						</div>
					</div>
					<br>
					<div class="navigationItem">
						<img src="images/addFolder.png" class="navigationItem_icon">
						<a class="text smallHeader">Add Folders</a>
						<br>
						<br>
						<a class="text navigationItem_text">
							Add Folders allows you to add folders in which you can order and sort tests.
						</a>
					</div>
				</div>
				<br>
				<a class="text subTitle">We hope you can figure the rest out on your own, <br>but if you still have questions, feel free to email <i><a href="mailto:support.wlp@florisweb.dev?subject=My question:"">support.wlp@florisweb.dev</a></i>.</a>
			</div>
		</div>

	</body>
</html>