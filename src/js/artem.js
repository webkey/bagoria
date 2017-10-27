$(document).ready(function(){

	jQuery.fn.reset_form = function() {

		$(this).find('input:text, input:password, input:file, textarea').val('');
    	$(this).find('input:radio, input:checkbox, select>option').removeAttr('checked').removeAttr('selected');

    	$(this).find('input[name=chosenSize]').val('');
    	$(this).find('.chosenSize').html('');

	};
	
});