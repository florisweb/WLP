<?php
 	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
	include "$root/PHP/PacketManager.php";
	$PM->includePacket("SESSION", "1.0");

	if (!$SESSION->get("userId"))header("Location: /user/login.php?redirect=/PC/WLP");
?>




<!DOCTYPE html>
<html>
	<head>
		<meta content='width=device-width, initial-scale=0.6, maximum-scale=0.7, user-scalable=0' name='viewport'/>
		<link rel="stylesheet" type="text/css" href="main.css">
		<script type="text/javascript" src="/JS/jQuery.js" asy nc></script>
		<script type="text/javascript" src="/JS/request.js" asy nc></script>
		<script src="js/main_min.js" async></script>
	</head>	
	<body>
		<div id="backgroundHolder"></div>

		
		<div id="PL_toggleButton" class="op en hide" onclick="client.action.playList.toggle()">
			<img class="PLB_itemImg" src="images/folderIcon.png">
			<div class="textHolder"></div>
			<img class="directionButton" src="images/playList_arrowRight.png">
		</div>

		<div id="playlistBar" class="hide">
			<div id="PLB_headerHolder">
				<div class="PLB_itemHolder">
					<img class="PLB_itemImg" src="images/folderIcon.png">
				    <div class="PL_itemText modernFont" id="PL_titleHolder"><a></a></div>
				</div>
			</div>
			
			<div id="PL_functionHolder">
				<!-- skip prepare page -->
				<div class="PL_FHItem" style="width: 25px" onclick="client.action.playList.list.startTest(0)">
					<img class="PL_FHImage" src="images/restartIcon.png" style="left: -10px; height: 200%; top: -50%">
				</div>

				<div class="PL_FHItem toggledOff" on="0" onclick="
					if (this.on == '0') 
					{
						this.on = '1'; 
						this.classList.add('toggledOn');
						this.classList.remove('toggledOff');
					} else {
						this.on = '0'; 
						this.classList.add('toggledOff');
						this.classList.remove('toggledOn');
					}
					client.action.playList.settings.skipPreparePage = this.on == '1' ? false : true;
				">
					Prepare
				</div>

				<div class="PL_FHItem toggledOn" on="1" onclick="
					if (this.on == '0') 
					{
						this.on = '1'; 
						this.classList.add('toggledOn');
						this.classList.remove('toggledOff');
					} else {
						this.on = '0'; 
						this.classList.add('toggledOff');
						this.classList.remove('toggledOn');
					}
					client.action.playList.settings.autoPlay = this.on == '1' ? true : false;
				">
					Autoplay
				</div>
			</div>

			<div id="PL_contentHolder">
			</div>
		</div>




		<div id="topBar">
			<div id="navigateBar">
				<div class="TB_item" onclick="client.page.recents.open()">
					<img class="TB_item_icon" src="/pictures/trippleEquals.svg">
				</div>
				<div class="TB_item" onclick="client.page.search.open()">
					<img class="TB_item_icon" src="images/searchIcon.png">
				</div>

				<div class="TB_item" onclick="client.page.create.open()">
					<img class="TB_item_icon" src="images/addIcon.png">
					<a class="TB_item_text">Test</a>
				</div>
				<div class="TB_item" onclick="Navigator.folder.creator.open()">
					<img class="TB_item_icon" src="images/addIcon.png">
					<a class="TB_item_text">Folder</a>
				</div>
				<!-- <div class="TB_item" onclick="client.page.create.open()">
					<img class="TB_item_icon" src="images/addIcon.png">
				</div> -->
			</div>

			<div id="titleBar">
				<div id="titleBarTextHolder">No title</div>
			</div>
		</div>


		<div id="functionBarHolder"> 
			<div id="functionBar">
				<div id="functionBar_normalViewHolder">
					<div class="FB TB_item FB_boxless" id="FB_openExtraOptionsViewButton" onclick="FB.openExtraOptionsView()">
						<img class="TB_item_icon" src="/pictures/trippleEquals.svg">
					</div>

					<div class="FB TB_item FB_boxless showByIndex0" onclick="Navigator.select.startPlayListWithSelectedItems()">
						<img class="TB_item_icon" src="images/startIcon.png">
					</div>

					<div class="FB TB_item FB_boxless showByIndex0" onclick="Navigator.select.removeSelectedItems()">
						<img class="TB_item_icon" src="images/removeIcon.png">
					</div>

					<div class="FB TB_item FB_boxless showByIndex0" onclick="Navigator.folder.selector.open()">
						<img class="TB_item_icon" src="images/moveToFolderIcon.png">
					</div>

					<div class="FB TB_item FB_boxless showByIndex0" id="FB_removeItemsFromFolderButton" onclick="client.page.folderContent.removeSelectedItemsFromFolder()">
						<img class="TB_item_icon" src="images/removeFromFolderIcon.png">
					</div>
					
					<div class="FB TB_item FB_boxless showByIndex0" onclick="Navigator.select.toggleAllItems()">
						<img class="TB_item_icon" src="images/toggleAllTestsIcon.png">
					</div>

					



					
					<div class="FB TB_item FB_boxless showByIndex1" onclick="client.action.test.startTest()">
						<a class="TB_item_text FB_loneText">Start Test</a>
					</div>
					


					<div class="FB TB_item FB_boxless showByIndex2 showByIndex3" onclick="client.action.test.restartTest()">
						<img class="TB_item_icon" src="images/quitIcon2.png">
						<a class="TB_item_text">Exit</a>
					</div>

					<div class="FB TB_item FB_boxless showByIndex2 showByIndex3" onclick="client.action.test.restartTest(true)">
						<img class="TB_item_icon" src="images/restartIcon2.png">
						<a class="TB_item_text">Restart</a>
					</div>



					<div class="FB TB_item FB_boxless showByIndex4" onclick="client.action.test.restartTest()">
						<img class="TB_item_icon" src="images/restartIcon2.png">
						<a class="TB_item_text">Restart</a>
					</div>

					<div class="FB TB_item FB_boxless showByIndex4" onclick="client.action.test.restartTest(true)">
						<img class="TB_item_icon" src="images/restartIcon2.png">
						<a class="TB_item_text">Force Restart</a>
					</div>




					<div class="FB TB_item FB_boxless showByIndex5 MC_page_createButton" onclick="client.page.create.createTest()">
						<a class="TB_item_text FB_loneText">Create</a>
					</div>
					
					<div class="FB TB_item FB_boxless showByIndex5 MC_page_changeButton" onclick="client.page.change.saveChanges()">
						<a class="TB_item_text FB_loneText">Change</a>
					</div>
				</div>


				<div id="functionBar_extraOptionsViewHolder">
					<div class="FB TB_item FB_boxless FB_extraOptionsView showByIndex4 optionGrayedOut" onclick="client.page.results.startListWithWrongAnswers(); FB.closeExtraOptionsView()">
						<img class="TB_item_icon" src="images/restartIcon2.png">
						<a class="TB_item_text">Start list with wrong answers</a>
					</div>
					<br>
					<div class="FB TB_item FB_boxless FB_extraOptionsView showByIndex4" onclick="client.page.results.startListWithWrongAnswers(true); FB.closeExtraOptionsView()">
						<img class="TB_item_icon" src="images/addIcon.png">
						<a class="TB_item_text">Add list with wrong answers</a>
					</div>

					<br>
					<br>
					<br>
					<br>
					<br>
					<div class="FB TB_item FB_boxless FB_extraOptionsView showByAllIndexes" style="margin-bottom: 0" onclick="FB.closeExtraOptionsView()">
						<a class="TB_item_text" style='color: #aaa'>Cancel</a>
					</div>
				</div>
			</div>
		</div>
		





		






		<div id="WS_toggleButton" onclick="SL.WS.toggle()" style="display: none">
			<a style="
				position: relative;
				top: -12.5px;
				left: 2px;
				color: rgba(255, 255, 255, 0.4); 
				font-size: 35px
			">></a>
		</div>

		<div id="wordSugestionHolder" class="hide">	
			<div class="SB_item" id="SB_WSHolder">
				<div class="modernFont SB_item_header">SUGGESTIONS</div>
				<div class="modernFont WS_item_sItem searchStyle"></div>
				<img class="WS_item_sItem arrowRightStyle" src="images/arrowRight.png">
				<div id="WS_itemList"></div>
			</div>
		</div>

















		<div id="navigator_folderMenuHolder" class="hide">
			<div id="navigator_folderMenu">
				<div style="
					position: relative;
					width: calc(100% - 20px);
					padding: 15px 10px; 
					text-align: center;
				">
					<a id="navigator_FM_title">
						Select a folder
					</a>
					<div id="navigator_FM_listCount">
						0 lists
					</div>
				

					<div id="navigator_FM_cancelButton" onclick="Navigator.folder.close()">
				 		Cancel
					</div>
				</div>
	 
				<div id="navigator_FM_contentHolder">
				</div>
			</div>
		</div>








		<div id="mainContentHolder">
			<div id="mainContent">

				
				<div class="MC page_contentPage holder"> 
					
					<!-- Navigator Recents/overview -->
					<div class="contentPage hide" style="overflow: auto">
					</div>



					<!-- prepare for test page-->
					<div class="contentPage hide">

						<!-- optionholder -->
						<div class="MC page_prepare optionHolder">
							<div class="MC page_prepare itemHolder modernFont">
								<a class="MC page_prepare optionHeaderText">Test Method</a>
								<br>
								<select class="MC page_prepare testTypeHolder">
									<option value="0" selected>Text</option>
									<option value="1">Multiple choice</option>
								</select>
							</div>
							
							<div class="MC page_prepare itemHolder modernFont">
								<a class="MC page_prepare optionHeaderText">Question-Answer Relation</a>
								<br>
								<select class="MC page_prepare questionAnswerRelationHolder">
									<option value="0">question -> answer</option>
									<option value="1">answer -> question</option>
									<option value="2">question <-> answer</option>
								</select>
							</div>
						</div>

						<div class="MC page_prepare optionHolder">
							<div class="MC page_prepare itemHolder modernFont">
								<a class="MC page_prepare optionHeaderText">Ignore Caps</a>					
								<br>
								<form class="MC page_prepare ignoreCapsHolder optionText modernFont">
								  <input type="radio" name="_" value="1">On<br>
								  <input type="radio" name="_" value="0" checked>Off  
								</form> 
							</div>

							<div class="MC page_prepare itemHolder modernFont">
								<a class="MC page_prepare optionHeaderText">Shuffle words</a>					
								<br>
								<form class="MC page_prepare shuffleWordsHolder optionText modernFont">
								  <input type="radio" name="_" value="1" checked>On<br>
								  <input type="radio" name="_" value="0">Off  
								</form> 
							</div>
						</div>
					</div>


					<!--test by options page-->
					<div class="contentPage hide">
						<br>
						<div class="inputItem MC_page_test_textHolder MC page_test questionHolder" style="left: 0">Question</div>
						<br>
						<div class="MC page_testByOption optionHolder">
							<div class="MC page_testByOption optionItem holder" onclick="client.action.test.next(this)"></div>
							<div class="MC page_testByOption optionItem holder" onclick="client.action.test.next(this)"></div>
							
							<div class="MC page_testByOption optionItem holder" onclick="client.action.test.next(this)"></div>
							<div class="MC page_testByOption optionItem holder" onclick="client.action.test.next(this)"></div>
						</div>

						<br>
						<br>
						<div class="boxButton important MC_page_test_nextButton hide" onclick="client.action.test.next()">
							next
						</div>
						<div class="boxButton hide MC_page_test_iWasRightButton" onclick="client.action.test.iWasRight()">
							I was right
						</div>

						
						<div class="MC page testtestInfoHolder">
							<a class="MC page_test testInfo title">Right answers: 
								<a class="MC page_test testInfo rightAnswers value">0</a>
							</a>
							<br>
							<a class="MC page_test testInfo title">Wrong answers: 
								<a class="MC page_test testInfo wrongAnswers value">0</a>
							</a>
							<br>
							<a class="MC page_test testInfo title">Progress:
								<a class="MC page_test testInfo progress value">0 left</a>
							</a>
						</div>

						<div class="MC page_test progressBar_holder">
							<div class="MC page_test progressBar_text"></div>
							<div class="MC page_test progressBar"></div>
						</div>
					</div>


					<!--test by text page-->
					<div class="contentPage hide">
						
						<div class="MC_page_test answerWrongHolder hide">
							<div style="font-size: 21px;
									color: #eff">
								Oops, you entered the wrong answer, 
								<br>
								the right answer was: 
								<div class="MC_page_test_textHolder MC_page_test_rightanswerHolder">Aber naturlich wilkommen ich dir gerne in der neue Schule, es ist mir wirklich angebeited dass Sie da können sein,</div>
							</div>
						</div>
						<br>

						<div class="inputItem MC_page_test_textHolder MC page_test questionHolder" style="left: 0">Question</div>
						<br>
						
						<br>
						<input class="inputItem" placeholder="Your answer" id="MC_page_test_answerHolder" autocomplete="off">
						<br>
						<br>
						<div class="boxButton important" onclick="client.action.test.next()">
							next
						</div>
						<div class="boxButton hide MC_page_test_iWasRightButton" onclick="client.action.test.iWasRight()">
							I was right
						</div>

						
						<div class="MC page testtestInfoHolder">
							<a class="MC page_test testInfo title">Right answers: 
								<a class="MC page_test testInfo rightAnswers value">0</a>
							</a>
							<br>
							<a class="MC page_test testInfo title">Wrong answers: 
								<a class="MC page_test testInfo wrongAnswers value">0</a>
							</a>
							<br>
							<a class="MC page_test testInfo title">Progress:
								<a class="MC page_test testInfo progress value">0 left</a>
							</a>
						</div>

						<div class="MC page_test progressBar_holder">
							<div class="MC page_test progressBar_text">progress: 0/0</div>
							<div class="MC page_test progressBar"></div>
						</div>
					</div>



					<!-- results of test page-->
					<div class="contentPage hide">
						<input 	id="MC_page_test_results_noteHolder" 
								class="inputItem" 
								style="left: 0; font-size: 25px; height: 30px"; 
								readonly value="Your score:">
						<div class="MC_list_holder">
							<div id="MC_page_test_results_resultsHolder">
							</div>
						</div>
					</div>

					

					



					<!--create page-->
					<div class="contentPage hide">
						<div class="MC_list_holder" style="height: calc(100%)">
							<div class="MC_list_item MC page_create titleAndSubjectsHolder">
								<input 	id="MC_page_create_title"; 
										class="MC page_create subjectClass" 
										placeholder="Title" 
										style="width: calc(100% - 10px); margin-bottom: 10px; color: #ccc">
								<br>
								<input id="MC_page_create_subA"; placeholder="Subject 1" class="MC page_create subjectClass">
								<input id="MC_page_create_subB"; placeholder="Subject 2" class="MC page_create subjectClass">
							</div>
							<div class="MC page_create questionAndAnswerHolder">
							</div>
							<br>
							<div style="height: 100px"></div>
						</div>
					</div>
				</div>
			</div>
		</div>





		<script>
			// temperarelly so things don't get cached

			// let antiCache = Math.random() * 100000000;
			// 	$.getScript("js/client.js?antiCache=" 			+ antiCache, function() {});
			// 	$.getScript("js/server.js?antiCache=" 			+ antiCache, function() {});
			// 	$.getScript("js/test.js?antiCache=" 			+ antiCache, function() {});
			// 	$.getScript("js/smartLearning.js?antiCache="	+ antiCache, function() {});


			// 				$.getScript("js/data.js?antiCache=" 			+ antiCache, function() {});//will be removed soon
				
			// $.getScript("js/playList.js?antiCache=" 		+ antiCache, function() {});


			// $.getScript("js/app.js?antiCache=" 				+ antiCache, function() {});
			// $.getScript("js/index.js?antiCache=" 			+ antiCache, function() {});

		</script>
		
		<!-- <script src="js/main_min.js" async></script> -->
<!-- 		<script src="js/client.js"></script>
		<script src="js/server.js"></script>
		<script src="js/test.js"></script>


		<script src="js/data.js"></script>
		<script src="js/smartLearning.js"></script>
		
		<script src="js/playList.js"></script>

		<script src="js/app.js"></script>
		<script src="js/index.js"></script>
 -->




	</body>
</html>	


<script>
	// Enable navigation prompt
	// window.onbeforeunload = function(e) {
 //    return 'Are you sure ?'; 
 //  }

	// window.onunload = function () {
	//  alert("x");
	//  return false;
	// }
</script>