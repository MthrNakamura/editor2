$(function(){
	//var returnValue = -1;
	/* 保存されているスライドの1枚目のスライドのプレビューを表示 */
	for (var i = 0; i < localStorage.length; i = i + 1) {
		var fileIcon = '<div class="fileIcon"></div>';
		$('body').append(fileIcon);
	}
	/* クリックしたスライドを親画面で開く */
	$('.fileIcon').click(function(evt) {
		window.returnValue = $(evt.target).index();
		window.close();
	});
	
});