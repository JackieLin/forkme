/**
 * @author jackieLin
 * @content To show all the catagories
 */
$(function () {
	var parentwin = window.opener, hash = location.hash.substring(1), datas = hash.split('&'), item = null, args = {}, params = null, results = null,htmls = "", search = $('.search > ul'), host = location.host;
	// 解析url 参数
	for (var i = 0, t; t = datas[i]; i++) {
		item = t.split('=');
		args[item[0]] = item[1];
	}

	// 日期
	if(args['type'] === 'date') {
		params = parentwin.dates;
		results = params[parseInt(args['q'])];	     
	   	for(var i = 0, t; t = results[i]; i++) {
			htmls += "<li><div><a href='" + t.url + "'>" + t.title + "</a></div><div class='searurl'>" + host + t.url + "</div><div class='seardate'>" + t.date + "</div></li>";
		}
		search.html(htmls);
	} else if(args['type'] === 'cata') {
		params = parentwin.tags;
		results = params[parseInt(args['q'])];
		if(results) {
			for(var i = 0, t; t = results[i]; i++) {
				htmls += "<li><div><a href='" + t.url + "'>" + t.title + "</a></div><div class='searurl'>" + host + t.url + "</div><div class='seardate'>" + t.date + "</div></li>";
			}
		} else {
			htmls += "<li>对不起，你所搜索的内容不存在！！</li>";
		}
		search.html(htmls);
	}
});

