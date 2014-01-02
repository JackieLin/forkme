/**
 * @author linbin
 * @content To generate the post page
 * @url    http://beiyuu.com/js/post.js
 * @thanks beiyuu
 * */
$(function() {
	
	// 代码高亮
	$('pre').addClass('prettyprint linenums');
	// 加载评论
    var disqus_shortname = 'jackielin'; 
    
	// 为所有的链接添加target="_blank"属性
	$('a[href^="http"]').each(function() {
		$(this).attr('target', '_blank');
	});
	
	(function() {
	   var disqus = $('.comment');
	   // 加上加载中字体。。。。
	   disqus.html('评论加载中...');
       var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
	   
	   // 加载完取消字体
	   dsq.onload = dsq.onreadystatechange = function() {
			if(!this.readyState || this.readyState === 'loaded' ||　this.readyState === 'complete') {
				disqus.remove();
			}
	   };
	   
	   // 添加到body或head中
       (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	   
    })();

	/*加载菜单*/
	var menu = function () {
		// init
		var h2 = [], h3 = [], h2index = 0, list = '<aside><nav class="menulist"><ul>', menulist = null;
		$.each($("h2,h3",$('.articles')), function (index, entry) {
			/* 处理h2 */
			if(entry.tagName.toLowerCase() === 'h2') {
				var temph2 = {};
				temph2.name = $(entry).text();
				temph2.id = 'menu' + index;
				h2.push(temph2);
				h2index++;
			} else {
				var temph3 = {};
				temph3.name = $(entry).text();
				temph3.id = 'menu' + index;
				// 查看父节点并设置子节点
				if(!h3[h2index - 1]) {
					h3[h2index - 1] = [];
				}

				h3[h2index - 1].push(temph3);
			}
			entry.id = 'menu' + index;
		});
		// 添加主标题
		list += '<li><a href="#" class="h1" data-top="0">' + $('.arti_title').text() + '</a></li>';

		// 添加h2标签
		for(var i = 0, temp2; temp2 = h2[i]; i++) {
			list += '<li><a href="#" class="h2" data-id="'+ temp2.id + '">' + temp2.name + '</a></li>';
			// 添加h3标签
			if(h3[i]) {
				for(var j = 0, temp3; temp3 = h3[i][j]; j++) {
					list += '<li><a href="#" class="h3" data-id="' + temp3.id + '">' + temp3.name + '</a></li>';
				}
			}
		}

		// 封闭
		list += '</ul></nav></aside>';
		
		$('.main_content').append(list);
		
		// 获取列表项
		menulist = $('.menulist');
		
		// DOM操作，添加到文件中
		// 采用事件委托机制来实现事件
		menulist.delegate('a', 'click', function (event) {
			// 阻止事件冒泡
			event.preventDefault();
			//console.log(this);
			//console.log($('#' + $(this).attr('data-id')));
			var scroll = $(this).attr('data-top') || $('#' + $(this).attr('data-id')).offset().top;
			$('body').animate({scrollTop: scroll - 30}, 400, 'swing');
		});
	};
	// 调用
		prettyPrint();
		menu();
});
