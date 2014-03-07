/**
 * @author  jackieLin
 * @content The index page js
 **/
$(function () {

	// 为所有的链接添加target="_blank"属性
	$('a[href^="http"]').each(function() {
		//console.log(this);
		$(this).attr('target', '_blank');
	});
	
	// 添加跳转到顶部逻辑
	$('a.atop').bind('click', function() {
		// 在一定的时间内跳转 The window does not has a scrollbar it belongs the body or the html tag
		$('body, html').animate({scrollTop: 0}, 800);
	});
	
	// 显示评论次数
	 /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'jackielin'; // required: replace example with your forum shortname
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);

	var atop = $('a.atop'), elems = $(document);
	
	// 设置跳转到顶部的显示时间
	$(window).scroll(function() {
		var top = elems.scrollTop();
		if(top > 400) {
			// 显示返回到顶部
			atop.css({display: 'block'});
		} else {
			// 隐藏显示按钮
			atop.css({display: 'none'});
		}
	});
	
	// 代码高亮
	$('pre').addClass('prettyprint linenums');
	// tag分类
	var aside = function() {
		var tags = [], dates = [], excerpts = [], 
		// 存放对应日期序号
		dateSeq = [], dateShow = ['Jan', 'Feb', 'Mar', 'Apirl', 'May', 'June', 'July', 'Aug', 'Sep',
		'Oct', 'Nov', 'Dec'], flag = 0, tagsSeq = [], archives = $('.archives > nav > ul'), categories = $('.categories > nav > ul'),
		origin = window.location.origin;

		// 赋值
		tagsSeq['我的生活'] = 0;
		tagsSeq['美文分享'] = 1;
		tagsSeq['前端开发'] = 2;
		tagsSeq['后台开发'] = 3;
		
		$.each($('.type > .lists'), function(item, entry) {
			var child = $(entry).children(), tagText = $(child[2]).text(), tmpText = tagText.split(','),
				excerptText = $(child[4]).text(), excerptTextArr = excerptText.split(','),
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

			// 封装excerpt
			for(var i = 0, t; t = excerptTextArr[i]; i++) {
				if(!excerpts[t]) {
					excerpts[t] = new Array;
				}
				
				excerpts[t].push(mess);
			}

			// 封装date
			if(!dateSeq[date]) {
				dateSeq[date] = ++flag;
			}
			
			tmpdate = dateSeq[date];
			if(!dates[tmpdate]) {
				dates[tmpdate] = new Array;
			}

			dates[tmpdate].push(mess);
		});
		// 将数据插入
		var tmpArr = [], tmpdate = null, lis = '', search = null, str = null;
		for(var dd in dateSeq) {
			search = '"' + origin + '/search.html#q=';
			tmpdate = dd.split('-');
			search += dateSeq[dd];
			search += '&type=date"';
			str = "<li><a href='javascript:;' onclick='window.open(" + search + ");'>" 
				+ dateShow[tmpdate[1] - 1] + " " + tmpdate[0] + "(" +  dates[dateSeq[dd]].length + ")" + "</a></li>";
			tmpArr.push(str);
		}
		for(var i = tmpArr.length - 1, t; t = tmpArr[i]; i--) {
			lis += t;
		}
		archives.html(lis);

		// catagories数据插入
		lis = '', num = null, taglen = null, search = null;
		for(var dd in tagsSeq) {
			search = '"' + origin + '/search.html#q=';
			taglen = tags[tagsSeq[dd]];
			num = (taglen) ? "(" + taglen.length + ")" : "(0)";
			search += tagsSeq[dd];
			search += '&type=cata"';
			lis += "<li><a href='javascript:;' onclick='window.open(" + search + ");'>" + dd + " " + num + "</a></li>";		
		}
		categories.html(lis);

		// 添加tags点击事件
		$('a.tag').click(function(event) {
			var target = event.currentTarget, content = target.innerText, search = origin + "/search.html#q=";
			if(content) {
				search += content;
				search += "&type=tag";
				window.open(search);
			}
		});

		// 添加到window对象中，给次级页面使用
		window.tags = tags;
		window.dates = dates;
		window.excerpts = excerpts;
	};
	prettyPrint();
	aside();	
});
