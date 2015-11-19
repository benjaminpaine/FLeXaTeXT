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
                if( tip !== undefined )
                {
                    $( this ).toolTip( tip );
                }
            }
        );
    }
);

$.fn.extend(
    {
        toolTip: function( message )
        {
            var obj = this;
            $( this ).on(
                "mouseenter",
                function( event )
                {
                    if( $( obj ).offset( ).left > $( window ).width( ) / 2 )
                    {
                        tooltipTimer = setTimeout(
                            function( )
                            {
                                $( "div#toolTip" ).css(
                                    {
                                        "left" : "auto",
                                        "right" : ( $( window ).width( ) - $( obj ).offset( ).left ) + 10 + "px",
                                        "top" : $( obj ).offset( ).top + "px"
                                    }
                                ).html( message ).fadeIn( 200 );
                            },500
                        ); 
                    }
                    else
                    {
                        tooltipTimer = setTimeout(
                            function( )
                            {
                                $( "div#toolTip" ).css(
                                    {
                                        "right" : "auto",
                                        "left" : $( obj ).offset( ).left + $( obj ).width( ) + 10 + "px",
                                        "top" : $( obj ).offset( ).top + "px"
                                    }
                                ).html( message ).fadeIn( 200 );
                            },500
                        ); 
                    }
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