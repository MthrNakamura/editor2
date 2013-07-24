$(function() {
	var selected = -1;
	var slideManager = new SlideManager();
	var slideEditMode = false;

	/* スライド編集モード */
	$('.slideBase').click(function() {
		slideEditMode = true;
	});


	/* キーイベント */
	$(window).keydown(function(e) {
		if (slideEditMode) return ;
		//window.alert(selected);
		switch (e.keyCode) {
			case 38: //up
				if (selected > 0) {
					/* これまで選択していたスライドを保存 */
					slideManager.save(selected, $('.slideBase').html());
					selected = selected - 1;
				}
				showSlideSet();
				/* サムネイルをフォーカス */
				focusPreview(selected+1, selected);
				break;
			case 40: //down
				if (selected >= 0 && selected < slideManager.length-1) {
					/* これまで選択していたスライドを保存 */
					slideManager.save(selected, $('.slideBase').html());
					selected = selected + 1;
				}
				showSlideSet();
				/* サムネイルをフォーカス */
				focusPreview(selected-1, selected);
				break;
			case 46: //delete
				removeSlide();
				break;
			case 67: //C or CMD-C
				copySlide();
				break;
			case 86: //V or CMD-V
				pasteSlide();
				break;
			default: 
				break;
		}
	});

	/* 選択したスライドをコピーする */
	var copySlide = function() {
		if (selected >= 0) {
			slideManager.copy(selected);
		}
	};
	
	var pasteSlide = function() {
		if (selected >= -1) {
			slideManager.paste(selected+1);
			showSlideSet();
		}
	}
	
	/* 選択したスライドを削除する */
	var removeSlide = function() {
		slideEditMode = false;
		if (selected == -1) return ;
		slideManager.remove(selected);
		selected = selected - 1;
		showSlideSet();
		focusPreview(-1, selected);
	};
	
	/* サムネイルをフォーカスする */
	var focusPreview = function(pre, cur) {
		if (pre >= 0) {
			$('.pagePreview:eq('+pre+')').removeClass('focused');
		}
		/* 選択したサムネイルをフォーカスする */
		if (cur >= 0) {
			$('.pagePreview:eq('+cur+')').addClass('focused');
		}
	};
	/* サムネイルを選択したとき */
	var clickedPreview = function(e) {
		slideEditMode = false;
		if (selected != -1) {
			/* これまで選択していたスライドを保存 */
			slideManager.save(selected, $('.slideBase').html());
		}
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
		slideEditMode = false;
		selected = selected + 1;
		slideManager.add(new SlideSet(), selected); //新規スライドを追加
		showSlideSet(); //スライドとサムネイルを表示
		focusPreview(selected-1, selected); //新規追加したスライドをフォーカス
	});
	/* スライドを削除 */
	$('.rmPage').click(removeSlide);
	
	/* スライドとサムネイルを表示 */
	function showSlideSet() {
		/* サムネイルを表示 */
		$('.previewArea').empty(); //現在表示しているサムネイルを削除
		for (var i = 0; i < slideManager.length; i = i + 1) {
			$('.previewArea').append(slideManager.slideSets[i].thumbnail.el);
		}
		$('.pagePreview').click(clickedPreview);
		
		$('.sortable').sortable({
			start: function(e, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(e, ui) {
				/* 表示中のものをソートさせたとき */
				if (ui.item.startPos == selected) {
					slideManager.save(selected, $('.slideBase').html());
					selected = ui.item.index();
				} else if (ui.item.startPos < selected) { /* 表示中でなく表示中のスライドより前のスライドをソートさせたとき */
					selected = selected - 1;
				}
				slideManager.sort(ui.item.startPos, ui.item.index());
				showSlideSet();
				focusPreview(-1, selected);
			}
			
		});	
		
		/* スライドを表示 */
		$('.slideBase').empty(); //現在表示しているスライドを削除
		if (slideManager.slideSets[selected]!=undefined) {
			$('.slideBase').append(slideManager.slideSets[selected].slide.el);
		}
	}
	
});