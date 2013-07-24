var id = 0;
/* スライドの管理クラス */
var SlideManager = function() {
	this.length = 0; //スライドの枚数
	this.slideSets = []; //スライドセットを格納
	this.clipBoard = []; //スライドコピー用のバッファ
};

SlideManager.prototype = {
	/* 新しいスライドセットを追加する */
	add: function(slideSet, idx) {
		if (idx==null || idx < 0 || idx > this.slideSets.length) {
			this.slideSets.push(slideSet);
		} else {
			this.slideSets.splice(idx, 0, slideSet);
		}
		this.length = this.length + 1;
	},
	/* スライドセットを削除 */
	remove: function(idx) {
		if (idx==null || idx < 0 || idx > this.slideSets.length) {
			this.slideSets.pop();
		} else {
			this.slideSets.splice(idx, 1);
		}
		this.length = this.length - 1;
	},
	/* スライドを並べ替え */
	exchange: function(one, another) {
		if ((one >= 0 && one < this.slideSets.length)&&
			(another >= 0 && another < this.slideSets.length)) {
				var temp = this.slideSets[one];
				this.slideSets[one] = this.slideSets[another];
				this.slideSets[another] = temp;
		}
	},
	/* 指定したスライドを指定した場所へ挿入する */
	sort: function(one, dest) {
		var temp = this.slideSets[one];
		if (one < dest) {
			for (var i = one; i < dest; i = i + 1) {
				this.slideSets[i] = this.slideSets[i+1];
			}
		} else {
			for (var i = one; i > dest; i = i - 1) {
				this.slideSets[i] = this.slideSets[i-1];
			}
		}
		this.slideSets[dest] = temp;
	},
	/* スライドを保存 */
	save: function(idx, data) {
		this.slideSets[idx].slide.el = data;
	},
	/* スライドをクリップボードにコピー */
	copy: function(idx) {
		this.clipBoard.pop();
		var temp = new SlideSet();
		temp.slide = $.extend(true, {}, this.slideSets[idx].slide);
		temp.thumbnail = $.extend(true, {}, this.slideSets[idx].thumbnail);
		this.clipBoard.push(temp);
	},
	/* スライドを指定した場所へペーストする */
	paste: function(dest) {
		/* 末尾に追加するとき */
		if (dest == this.length) {
			this.slideSets.push(this.clipBoard.pop());
		} else { /* 間に追加するとき */
			for (var i = dest; i < this.length; i = i + 1) {
				this.slideSets[i+1] = this.slideSets[i];
			}
			this.slideSets[dest] = this.clipBoard.pop();
		}
		this.length = this.length + 1;
	}
};

/* スライド本体 */
var Slide = function(slideType) {
	this.slideType = slideType;
	this.el = '<div class="slide" contenteditable="true"></div>';
};

/* スライドのサムネイル */
var Thumbnail = function() {
	this.el = '<li class="pagePreview"></li>';
};

/* スライドとサムネイルのセット */
var SlideSet = function(slideType) {
	this.id = id; id = id + 1;
	this.slide = new Slide(slideType);
	this.thumbnail = new Thumbnail();
};