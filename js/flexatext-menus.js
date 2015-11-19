menuFunctions = [];

$( document ).ready( 
    function( )
    {
        $( "div#menuLayer > div#leftMenu, div#menuLayer > div#leftMenu div, div#menuLayer > div#headMenu, div#menuLayer > div#headMenu div" ).disableTextSelect( );
        $( document ).on(
            "click",
            function( event )
            {
                $( "div#menuLayer > div#headMenu > div.menuItem.active" ).removeClass( "active" );
                $( "div#menuLayer > div#headMenu > div.menuItem > div.pulldownMenu" ).fadeOut(100);
                $( "div#menuLayer > div#headMenu > div.menuItem" ).off( "mouseenter" );
                event.preventDefault( );
                event.stopPropagation( );
            }
        );
        $( "div#menuLayer > div#leftMenu > div#contextMenu > div.contextSubMenu" ).each(
            function( )
            {
                if( ! $( this ).hasClass( "active" ) )
                {
                    $( this ).hide( );
                }
            }
        );
        $( "div#menuLayer > div#headMenu > div.menuItem" ).each(
            function( )
            {
                $( this ).find( "div.pulldownMenu" ).hide( );
                $( this ).on(
                    "click",
                    function( event )
                    {
                        if( !$( this ).hasClass( "active" ) )
                        {
                            $( this ).addClass( "active" );
                            $( this ).find( "div.pulldownMenu" ).fadeIn(200);
                            $( "div#menuLayer > div#headMenu > div.menuItem" ).on(
                                "mouseenter",
                                function( )
                                {
                                    $( this ).siblings( ).each( 
                                        function ( )
                                        {
                                            $( this ).removeClass( "active" );
                                            $( this ).find( "div.pulldownMenu" ).fadeOut(100);
                                        }
                                    );
                                    $( this ).addClass( "active" );
                                    $( this ).find( "div.pulldownMenu" ).fadeIn(200);
                                }
                            );
                            event.preventDefault( );
                            event.stopPropagation( );
                        }
                    }
                );
                if( mac )
                {
                    $( this ).find( "div.pulldownMenu" ).find( "div.pulldownItem" ).find( "span.keyboardShortcut" ).find( "span.ctrl" ).html( "&#8984" );
                }
            }
        );
        $( "div#menuLayer > div#headMenu > div.menuItem > div.pulldownMenu > div.pulldownItem" ).each(
            function( )
            {
                $( this ).on(
                    "click",
                    function( event )
                    {
                        var thisMenu = $( this ).parent( ).attr( "id" );
                        var thisItem = $( this ).attr( "id" );
                        if( menuFunctions[ thisMenu+"."+thisItem ] !== undefined && ! $( this ).hasClass( "disabled" ) )
                        {
                            menuFunctions[ thisMenu+"."+thisItem ]( event );
                            event.preventDefault( );
                            event.stopPropagation( );
                        }
                    }
                );
            }
        );
        $( "div#menuLayer > div#leftMenu div.menuItem" ).each(
            function( )
            {
                $( this ).on(
                    "click",
                    function( event )
                    {
                        $( this ).siblings( ).each(
                            function( )
                            {
                                $( this ).removeClass( "active" );
                            }
                        );
                        $( this ).addClass( "active" );
                        if( $( this ).parent( ).attr( "id" ) == "layerMenu" )
                        {
                            menu = $( this ).attr( "id" );
                            tool = $( "div#menuLayer > div#leftMenu > div#contextMenu > div.contextSubMenu.active" ).removeClass( "active" ).fadeOut( 500 ).finish( ).parent( ).find( "div.contextSubMenu#"+menu ).fadeIn( 500 ).addClass( "active" ).find( "div.menuItem.active" ).attr( "id" );
                        }
                        else
                        {
                            tool = $( this ).attr( "id" );
                        }
                        bindMouse( );
                    }
                );
            }
        );
        $( "div#menuLayer > div#rightMenu > div#rightMenuGrab" ).on(
            "mousedown",
            function( event )
            {
                var cursorStart = event.pageX;
                var widthStart = $( "div#rightMenu" ).width( );
                var objectStart = $( "div#objectLayer" ).width( );
                $( window ).on(
                    "mousemove",
                    function( event2 )
                    {
                        var deltaX = event2.pageX;
                        var newPx = widthStart + (cursorStart - deltaX);
                        if( newPx >= 60 && newPx <= objectStart )
                        {
                            $( "div#rightMenu" ).css("width",newPx+"px");
                            $( "div#rightMenu > div#container" ).css("width",( newPx - 20 )+"px");
                            $( "div#objectLayer" ).css("right",newPx+"px");
                        }
                    }
                );
                $( window ).on(
                    "mouseup",
                    function( )
                    {
                        $( window ).off( "mouseup" ).off( "mousemove" );
                    }
                );
                event.preventDefault( );
                event.stopPropagation( );
            }
        );
        /* Special cases for specific browsers: */
        if( isFirefox )
        {
            $( "div#menuLayer > div#headMenu > div.menuItem > div.pulldownMenu > div.pulldownItem#increaseMenu" ).addClass( "disabled" ).attr("tooltip","This feature is not available in Firefox. Use browser zoom instead.");
            $( "div#menuLayer > div#headMenu > div.menuItem > div.pulldownMenu > div.pulldownItem#decreaseMenu" ).addClass( "disabled" ).attr("tooltip","This feature is not available in Firefox. Use browser zoom instead.");
        }
    }
);

$.fn.extend(
    {
        disableTextSelect: function( ) 
        {
            return this.each(
                function( )
                {
                    if( isFirefox )
                    {
                        $( this ).css(
                            {
                                "MozUserSelect" : "none"
                            }
                        );
                    }
                    else if( isIE )
                    {
                        $( this ).on(
                            "selectstart",
                            function( )
                            {
                                return false;
                            }
                        );
                    }
                    else{
                        $( this ).on(
                            "mousedown",
                            function( )
                            {
                                return false;
                            }
                        );
                    }
                }
            );
        }
    }
);

function parameterDisplay( content )
{
    $( "div#menuLayer > div#rightMenu > div#container" ).html( content );
}

menuFunctions[ "window.increaseMenu" ] = function ( event )
    {
        currentZoom = parseFloat( $( "body" ).css( "zoom" ) );
        $( "body" ).css(
            {
                "zoom" : (currentZoom + 0.1)
            }
        );
    };
menuFunctions[ "window.decreaseMenu" ] = function ( event )
    {
        currentZoom = parseFloat( $( "body" ).css( "zoom" ) );
        $( "body" ).css(
            {
                "zoom" : (currentZoom - 0.1)
            }
        );
    };