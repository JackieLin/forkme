/**
 * @author jackielin
 * @description self page javascript
 * @return {[type]} [description]
 */
$(function() {
	/**
	 * g_wrap mousewheel element
	 * g_pagestr page element ids
	 * $g_page page element jquery object
	 * g_step animation step
	 * g_pagetop one page top
	 * $g_nav navigation
	 */
	var g_wrap = $('.wrap')[0],
		g_pagestr = ['index', 'about', 'work', 'ability', 'contract'],
		$g_page = [],
		g_step = 20,
		g_onepagetop = $(document).height(),
		$g_nav = $('#nav');

	/**
	 * bind mouse wheel event
	 * @param {DOM} obj [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	var bind_mousewheel = function(obj, callback) {

		/**
		 * To set wheel event
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		var _eventCompat = function(event) {
			event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
			return event;
		}; 

		/* firefox or chrome or IE11 */
		if(document.addEventListener) {
			if(window.onmousewheel === undefined) {
				/* firefox */
				obj.addEventListener('DOMMouseScroll', 
					function(event) {
						callback.call(obj, _eventCompat(event));
					},false);
			} else {
				/* chrome or IE11*/
				obj.addEventListener('mousewheel', 
					function(event) {
						callback.call(obj, _eventCompat(event));
					},false);
			}
		} else if(document.attachEvent){
			/* lt IE 10 */
			obj.attachEvent('onmousewheel', function(event) {
				event = event || window.event;
                callback.call(obj, _eventCompat(event));
			});
		}
	},
	/**
	 * navigation bar bind click events
	 * @return {[type]} [description]
	 */
	navigation = function(event) {
		if($g_nav === []) {
			return;
		}
		var target = event.target || event.srcElement, 
		      $target = $(target), 
		      index = $target.parent().index();
		for (var i = 0; i < $g_page.length; i++) {
			var $t = $g_page[i],
			      distance = (i - index) * 100;
			$t.addClass('contentTransition');
			$t.css('top', distance + '%');
		};
	},
	/**
	 * To handler the page event
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	pageEventHandler = function(event) {
		var delta = event.delta ||　-1,
			length = $g_page.length,
			firstPageTop = parseFloat($g_page[0].css('top').replace('px', '')),
			lastPageTop = parseFloat($g_page[length - 1].css('top').replace('px', ''));

		// ps: it can not wheel top element and last element
		if (delta >= 1 && firstPageTop >= 0) {
			$g_page[0].css('top', 0)
			return false;
		}

		if (delta <= -1 && lastPageTop <= 0) {
			$g_page[length - 1].css('top', 0)
			return false;
		}

		for (var i = 0; i < length; i++) {
			var $t = $g_page[i],
				topstr = $t.css('top').replace('px', ''),
				top = parseFloat(topstr);
			// mouse wheel up and down
			if(delta <= -1) {
				top = (Math.abs(top - g_step) < g_step) ? 0 : top - g_step;
			} else if(delta >= 1) {
				top = (Math.abs(top + g_step) < g_step) ? 0 : top + g_step;
			}
			$t.removeClass('contentTransition');
			$t.css('top', top);
		}
	};

	/**
	 * init function
	 */
	(function() {
		for (var i = 0, length = g_pagestr.length; i < length; i++) {
			var t = g_pagestr[i];
			$g_page.push($('#' + t));
		}
		$g_nav.children().children().bind('click', navigation);
	})();

	/**
	 * binding wrap scroll event
	 */
	bind_mousewheel(g_wrap, pageEventHandler);
	/**
	 * binding keypress event
	 */
	$(document).keydown(function(event) {
		var keycode = event.keyCode || 40;
		
		switch(keycode) {
			case 40:
				event.delta = -1;
				pageEventHandler.call(this, event);
				break;
			case 38:
				event.delta = 1;
				pageEventHandler.call(this, event);
				break;
			default:
				break;
		}
	});
});