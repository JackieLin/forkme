/**
 * @author  jackieLin
 * @content The index page js
 **/
(function () {
	// tag分类
	var aside = function() {
		var tags = [], dates = [], 
		// 存放对应日期序号
		dateSeq = [], dateShow = ['Jan', 'Feb', 'Mar', 'Apirl', 'May', 'June', 'July', 'Aug', 'Sep',
		'Oct', 'Nov', 'Dec'], tagsSeq = [], archives = $('.archives > nav > ul'), categories = $('.categories');
		// 赋值
		tagsSeq['我的生活'] = 0;
		tagsSeq['美文分享'] = 1;
		tagsSeq['前端开发'] = 2;
		tagsSeq['后台开发'] = 3;
		
		$.each($('.type > .lists'), function(item, entry) {
			var child = $(entry).children(), tagText = $(child[2]).text(), tmpText = tagText.split(','),
				atitle = $(child[0]).text(), url = $(child[1]).text(), date = $(child[3]).text(),
				mess = {}, tmpdate = null;

			mess.title = atitle;
			mess.url = url;
			mess.date = date;
			// 封装tags
			for(var i = 0, t; t = tmpText[i]; i++) {
				var temp = tagsSeq[t];
				if(!tags[temp]) {
					tags[temp] = new Array;
				}
				tags[temp].push(mess);
			}
			// 封装date
			if(!dateSeq[date]) {
				dateSeq[date] = dateSeq.length;
			}
			
			tmpdate = dateSeq[date];
			if(!dates[tmpdate]) {
				dates[tmpdate] = new Array;
			}

			dates[tmpdate].push(mess);
		});

		// 将数据插入
		var tmpArr = [], tmpdate = null, lis = '';
		for(var dd in dateSeq) {
			tmpdate = dd.split('-');
			str = 'window.open("www.baidu.com")';
			tmpArr.push('<li><a href="javascript:;" onclick="'+ str + ';">' + dateShow[tmpdate[1] - 1] + ' ' + tmpdate[0] + '(' +  dates[dateSeq[dd]].length + ')' + '</a></li>');
		}
		for(var i = tmpArr.length - 1, t; t = tmpArr[i]; i--) {
			lis += t;
		}
		archives.html(lis);
	};
	aside();	
})();
