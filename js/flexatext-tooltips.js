var tooltipTimer;
$( document ).ready(
    function( )
    {
        $( "body" ).append( "<div id=\"toolTip\"></div>" );
        $( "div#toolTip" ).hide( );
        $( "div, input" ).each(
            function( )
            {
                var tip = $( this ).attr( "tooltip" );
                var obj = this;
                if( tip !== undefined )
                {
                    $( this ).on(
                        "mouseenter",
                        function( event )
                        {
                            tooltipTimer = setTimeout(
                                function( )
                                {
                                    $( "div#toolTip" ).css(
                                        {
                                            "left" : $( obj ).offset( ).left + $( obj ).width( ) + 10 + "px",
                                            "top" : $( obj ).offset( ).top + "px"
                                        }
                                    ).html(tip).fadeIn(200);
                                },500
                            );
                        }
                    );
                    $( this ).on(
                        "mouseleave",
                        function( event )
                        {
                            clearTimeout( tooltipTimer );
                            $( "div#toolTip" ).finish( ).fadeOut( 100 );
                        }
                    );
                }
            }
        );
    }
);