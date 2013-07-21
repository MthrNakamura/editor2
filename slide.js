var id = 0;
/* スライドの管理クラス */
var SlideManager = function() {
	this.numSlide = 0; //スライドの枚数
	this.slideSets = []; //スライドセットを格納
};

SlideManager.prototype = {
	/* 新しいスライドセットを追加する */
	add: function(slideSet, idx) {
		if (idx==null || idx < 0 || idx > this.slideSets.length) {
			this.slideSets.push(slideSet);
		} else {
			this.slideSets.splice(idx, 0, slideSet);
		}
		this.numSlide = this.numSlide + 1;
	},
	/* スライドセットを削除 */
	remove: function(idx) {
		if (idx==null || idx < 0 || idx > this.slideSets.length) {
			this.slideSets.pop();
		} else {
			this.slideSets.splice(idx, 1);
		}
		this.numSlide = this.numSlide - 1;
	},
	/* スライドを並べ替え */
	exchange: function(one, another) {
		if ((one >= 0 && one < this.slideSets.length)&&
			(another >= 0 && another < this.slideSets.length)) {
				var temp = this.slideSets[one];
				this.slideSets[one] = this.slideSets[another];
				this.slideSets[another] = temp;
		}
	}
};

/* スライド本体 */
var Slide = function(slideType) {
	this.slideType = slideType;
};

/* スライドのサムネイル */
var Thumbnail = function() {};

/* スライドとサムネイルのセット */
var SlideSet = function(slideType) {
	this.id = id; id = id + 1;
	this.slide = new Slide(slideType);
	this.Thumbnail = new Thumbnail();
};