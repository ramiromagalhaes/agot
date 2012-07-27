(function( $ ) {

	//todo new feature: implement a 'onpop' and a 'onclose' handler?

	$.fn.mypopbox = function(options) {
		var settings = $.extend( //extend() merges 2 objects in its first argument
			{
				selector    : this.selector,
				clickTarget : this.parent() //clicks on this element will trigger the popup. By default it is this element's parent
			}
			, options
		);

		var methods = {
			//Displays the box. To do so, it sets its css 'position' to 'absolute' and its 'left' and 'top' to the mouse X and Y coordinates.
			open: function(event) {
				event.preventDefault(); //not following any links submitting forms, etc...
				var popbox = $(settings['selector']);
				popbox.css({
					'position':'absolute',
					'left': event.clientX,
					'top':event.clientY
				});
				popbox.fadeIn('fast');
				event.stopPropagation(); //avoiding this click to propagate the the document. not sure if this is a best practice though...
			},

			//Hides the box.
			close: function() {
				$(settings['selector']).fadeOut('fast');
			}
		};

		this.hide(); //hide the box

		//the box should pop only if the element's parent has been clicked
		$(settings['clickTarget']).bind('click', function(event) {
			if ( $(settings['selector']).is(':hidden') ) {
				methods.open(event);
			}
		});

		//now, if we click anywhere else, we should close the box
		$(document).bind('click', function(event){
			if ( $(settings['selector']).is(':visible') ) {
				if ( !$(event.target).closest(settings['selector']).length ) {
					methods.close();
				}
			}
		});

		//and why not allow a keystroke to close the popbox too?
		$(document).bind('keyup', function(event){
			if(event.keyCode == 27){ //magic number 27 is the escape key
				methods.close();
			}
		});

		return this.each(
			function() {
				//still didn't understand it very well. Gotta check http://docs.jquery.com/Plugins/Authoring
			}
		);

	};

})( jQuery );

