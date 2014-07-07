/**
 * @author jackielin
 * @description self page javascript
 * @return {[type]} [description]
 */
$(function() {
	/**
	 * $g_wrap mousewheel element
	 * g_pagestr page element ids
	 * $g_page page element jquery object
	 * g_step animation step
	 * g_pagetop one page top
	 * @type {[type]}
	 */
	var $g_wrap = $('.wrap'),
		g_pagestr = ['index', 'about', 'work'],
		$g_page = [],
		g_step = 10,
		g_pagetop = $(document).height();

	/**
	 * init function
	 */
	(function() {
		for (var i = 0, length = g_pagestr.length; i < length; i++) {
			var t = g_pagestr[i];
			$g_page.push($('#' + t));
		}
	})();

	/**
	 * binding wrap scroll event
	 */
	$g_wrap.bind('mousewheel', function(event) {
		var originalEvent = event['originalEvent'],
			wheelDelta = originalEvent.wheelDelta,
			length = $g_page.length,
			firstPageTop = parseFloat($g_page[0].css('top').replace('px', '')),
			lastPageTop = parseFloat($g_page[length - 1].css('top').replace('px', ''));

		// ps: it can not wheel top element and last element
		if (wheelDelta >= 120 && firstPageTop >= 0) {
			$g_page[0].css('top', 0)
			return false;
		}

		if (wheelDelta <= -120 && lastPageTop <= 0) {
			$g_page[length - 1].css('top', 0)
			return false;
		}

		for (var i = 0; i < length; i++) {
			var $t = $g_page[i],
				topstr = $t.css('top').replace('px', ''),
				top = parseFloat(topstr);
			console.log(top);
			// mouse wheel up and down
			if(wheelDelta <= -120) {
				top = (Math.abs(top - g_step) < g_step) ? 0 : top - g_step;
			} else if(wheelDelta >= 120) {
				top = (Math.abs(top + g_step) < g_step) ? 0 : top + g_step;
			}
			
			$t.css('top', top);
		};
	});
});