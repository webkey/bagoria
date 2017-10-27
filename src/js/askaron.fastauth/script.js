var askaron_fastauth = function(event)
{
	event = event || window.event; // IE

	if ( event.ctrlKey )
	{
		var key = ('which' in event) ? event.which : event.keyCode;

		if ( key == 121 )
		{
			var backurl = document.location.href;
			if ( backurl.indexOf( "?" ) >= 0 )
			{
				backurl = backurl + "&";
			}
			else
			{
				backurl = backurl + "?";
			}
			backurl = backurl + 'bitrix_include_areas=Y';

			document.location.href = '/bitrix/admin/index.php?askaron_fastauth_backurl=' + escape(backurl);
		}
	}
}

if ( document.addEventListener )
{
	document.addEventListener( "keydown", askaron_fastauth, false );
}
else
{
	if( document.attachEvent ) // IE
	{
		document.attachEvent( "onkeydown", askaron_fastauth );
	}
	else
	{
		document.onkeydown = askaron_fastauth;
	}
}