$(function() {
	var selected = -1;
	var slideManager = new SlideManager();
	/* サムネイルをフォーカスする */
	var focusPreview = function(pre, cur) {
		//window.alert("p: "+pre+" cur: "+cur);
		if (pre >= 0)
			$('.pagePreview:eq('+pre+')').removeClass('focused');
		/* 選択したサムネイルをフォーカスする */
		if (cur >= 0)
			$('.pagePreview:eq('+cur+')').addClass('focused')
	};
	/* サムネイルを選択したとき */
	var clickedPreview = function(e) {
		/* これまで選択していたスライドを保存 */
		slideManager.save(selected, $('.slideBase').html());
		/* サムネイルをフォーカス */
		focusPreview(selected, $(e.target).index());
		/* サムネイルを選択状態にする */
		selected = $(e.target).index();
		/* 選択したスライドを表示する */
		$('.slideBase').empty(); //現在表示しているスライドを削除
		$('.slideBase').append(slideManager.slideSets[selected].slide.el);
	};
	/* 新規スライドを追加 */
	$('.addPage').click(function(){
		selected = selected + 1;
		slideManager.add(new SlideSet(), selected); //新規スライドを追加
		showSlideSet(); //スライドとサムネイルを表示
		focusPreview(selected-1, selected); //新規追加したスライドをフォーカス
	});
	/* スライドを削除 */
	$('.rmPage').click(function(){
		slideManager.remove(selected);
		showSlideSet();
		focusPreview(-1, selected);
	});
	/* スライドとサムネイルを表示 */
	function showSlideSet() {
		/* サムネイルを表示 */
		$('.previewArea').empty(); //現在表示しているサムネイルを削除
		for (var i = 0; i < slideManager.numSlide; i = i + 1) {
			$('.previewArea').append(slideManager.slideSets[i].thumbnail.el);
		}
		$('.pagePreview').click(clickedPreview);
		
		/* スライドを表示 */
		$('.slideBase').empty(); //現在表示しているスライドを削除
		$('.slideBase').append(slideManager.slideSets[selected].slide.el);
	}






});