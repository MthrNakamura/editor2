var id = 0;
/* スライドの管理クラス */
var SlideManager = function() {
	this.length = 0; //スライドの枚数
	this.slideSets = []; //スライドセットを格納
	this.clipBoard = []; //スライドコピー用のバッファ
};

SlideManager.prototype = {
	/* 初期化 */
	init: function() {
		id = 0;
		this.length = 0;
		this.slideSets = [];
		this.clipBoard = [];	
	},
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
			for (var i = this.length; i > dest; i = i - 1) {
				this.slideSets[i] = this.slideSets[i-1];
			}
			/* 張りつけ後もクリップボードの内容は残しておく */
			this.slideSets[dest] = this.clipBoard.pop();
			var temp = new SlideSet();
			temp.slide = $.extend(true, {},this.slideSets[dest].slide);
			temp.thumbnail = $.extend(true, {}, this.slideSets[dest].thumbnail);
			this.clipBoard.push(temp);
		}
		this.length = this.length + 1;
	},
	/* スライドをローカルファイルに保存 */
	saveSlides: function(fileName) {
		if (!window.localStorage) {
			window.alert("ファイルを保存できません。");
			return ;
		}
		window.localStorage.setItem(fileName, this.getJSON());
	},
	/* 保持するスライドのJSON形式のデータを返す */
	getJSON: function() {
		var json = '{"all":{"len":'+this.length+'},"indiv":[';
		for (var i = 0; i < this.length; i = i + 1) {
			json = json + this.slideSets[i].getJSON() + ',';
		}
		json = json.slice(0,-1);//末尾の','を削除
		json = json + ']}';
		return json;
	},
	/* 保持するスライドのデータサイズを取得する */
	getDataSize: function() {
		var size = 0;
		for (var i = 0; i < this.length; i = i + 1) {
			size = size + this.slideSets[i];
		}
		return size;
	},
	/* 与えられたJSONファイルからスライドを構成する */
	loadPageFromJSON: function(json) {
		/* JSONデータをパース */
		var loadData = JSON.parse(json);
		/* パース結果からスライドを構成 */
		this.init();
		/* スライド全体データ */
		this.length = loadData.all.len; //スライド枚数
		/* スライドセットごと */
		for (var i = 0; i < this.length; i = i + 1) {
			this.slideSets[i] = new SlideSet();
			this.slideSets[i].slide.initWithData(loadData.indiv[i].set[0].type, loadData.indiv[i].set[0].slide.data);
			this.slideSets[i].thumbnail.initWithData(loadData.indiv[i].set[0].thumb.data);
		}
	}
};

/* スライド本体 */
var Slide = function(type) {
	this.slideType = type;
	this.el = "<div class='slide' contenteditable='true'></div>";
};

Slide.prototype = {
	/* データを設定 */
	initWithData: function(type, data) {
		this.type = type;
		this.el = data;	
	},
	/* データサイズを返す */
	getDataSize: function() {
		return this.el.length /* データのバイト数 */
				+ 1;          /* スライドタイプのバイト数 */
	},
	/* JSON形式のデータを返す */
	getJSON: function() {
		var data = (this.el).replace(/"/g, '\\"');
		return '{"slide":{"type":"'+this.type+'","data":"'+data+'"}';
	}
};

/* スライドのサムネイル */
var Thumbnail = function() {
	this.el = "<li class='pagePreview'></li>";
};

Thumbnail.prototype = {
	/* 初期化 */
	initWithData: function(data) {
		this.el = data;	
	},
	/* データサイズを返す */
	getDataSize: function() {
		return this.el.length; /* データのバイト数 */
	},
	/* JSON形式のデータを返す */
	getJSON: function() {
		var data = (this.el).replace(/"/g, '\\"');
		return '"thumb":{"data":"'+data+'"}}';
	}
};

/* スライドとサムネイルのセット */
var SlideSet = function(slideType) {
	this.id = id; id = id + 1;
	this.slide = new Slide(slideType);
	this.thumbnail = new Thumbnail();
};

SlideSet.prototype = {
	/* JSON形式のデータを返す */	
	getJSON: function() {
		return '{"set":['+this.slide.getJSON()+','+this.thumbnail.getJSON()+']}';
	}
};

