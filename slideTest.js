var selected = -2;
var exchangeMode = false;
var one = -1;
var another = -1;
var clicked = function(e) {
	if (exchangeMode) {
		if (one == -1) {
			one = $(this).index();
		} else if (another == -1) {
			another = $(this).index();
		} else {
			one = another = -1;
			exchangeMode = false;
		}
			
	} else {
		selected = $(this).index();
	}
}

$(function() {
	
	var slideManager = new SlideManager();

	$('.add').click(function(){
		slideManager.add(new SlideSet(), selected+1);
		showSlides();
	});
	
	$('.rm').click(function() {
		slideManager.remove(selected);
		showSlides();
	});
	
	$('.exchange').click(function() {
		if (exchangeMode) {
			if (one != -1 && another != -1) {
				slideManager.exchange(one, another);
				showSlides();
			} else {
				exchangeMode = false;
			}
		} else {
			exchangeMode = true;
		}
	});
	
	function showSlides() {
		$('.output ul').empty();
		for (var i = 0;  i < slideManager.numSlide; i = i + 1) {
			$('.output ul').append("<li><label>add["+slideManager.slideSets[i].id+"]</label></li>");
		}
		$('.output li').click(clicked);
	}
	
});