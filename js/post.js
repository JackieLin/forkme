/**
 * @author linbin
 * @content To generate the post page
 * @url    http://beiyuu.com/js/post.js
 * @thanks beiyuu
 * */
$(function() {
	var menu = function () {
		// init
		var h2 = [], h3 = [], h2index = 0, list = '<aside><nav class="menulist"><ul>';
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

		// DOM操作，添加到文件中
		// 采用事件委托机制来实现事件
		$('.main_content').append(list).delegate('a', 'click', function (event) {
			// 阻止事件冒泡
			event.preventDefault();
			var scroll = $(this).attr('data-top') || $('#' + $(this).attr('data-id')).offset().top;
			$('body').animate({scrollTop: scroll - 30}, 400, 'swing');
		});
		
		$(window).scroll(function() {
			alert(document.scrollTop());
		});
	};
	// 调用
	menu();
});
