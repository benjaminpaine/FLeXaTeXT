$( document ).ready(
    function( )
    {
        bindMouse( );
        $( window ).on(
            "mousewheel",
            function( event )
            {
                var up = event.deltaY > 0;
                if ( up && scaleFactor < 2 || !up && scaleFactor > 0.2 )
                {
                    scaleFactor = scaleGrid( up , gridBase )/100;
                    $( "div#alertLayer > div.alertBox#scaleBox" ).find( "div.text" ).find( "span#scaleNumber" ).html( Math.round( scaleFactor * 100 ) ).end( ).end( ).parent( ).show( ).find( "div.alertBox#scaleBox" ).bounceFade(function( ){ $( "div#alertLayer" ).hide( ); });
                }
            }
        );
        $( "div#objectLayer > div#tools > div#zoomPlus" ).on(
            "click",
            function( event )
            {
                var fakeEvent = $.Event( "mousewheel" );
                fakeEvent.deltaY = 1;
                $( window ).trigger( fakeEvent ); 
            }
        );
        $( "div#objectLayer > div#tools > div#zoomMinus" ).on(
            "click",
            function( event )
            {
                var fakeEvent = $.Event( "mousewheel" );
                fakeEvent.deltaY = -1;
                $( window ).trigger( fakeEvent ); 
            }
        );
        $( "div#objectLayer > div#objects > div.object" ).each(
            function( )
            {
                $( this ).scaleInPlace( objBase );
            }
        );
        $( "div#objectLayer div#tools div#layerMenu div.layer" ).each(
            function( )
            {
                var layers = $( "div#objectLayer div#tools div#layerMenu div.layer" ).length;
                var index = $( "div#objectLayer div#tools div#layerMenu div.layer" ).index( this );
                var z = 2*layers - index;
                var rotate = 70 + index * 2;
                var opacity = ( 0.6 - ( ( layers / z ) * 0.6 ) );
                $( this ).css(
                    {
                        "z-index" : z,
                        "color" : "rgba(0,0,0," + opacity + ")",
                        "border-color" : "rgba(196,198,175," + opacity + ")",
                        "background-color" : "rgba(255,255,255," + opacity + ")"
                    }
                ).html( index+1 );
                $( this ).on(
                    "click",
                    function( )
                    {
                        $( "div#objectLayer div#tools div#layerMenu div.layer" ).each(
                            function( )
                            {
                                var thisIndex = $( "div#objectLayer div#tools div#layerMenu div.layer" ).index( this );
                                var newZ = thisIndex > index ? 2*layers - ( thisIndex - index ) : 2*layers + ( thisIndex - index );
                                var newOpacity = ( 0.6 - ( ( layers / newZ ) * 0.6 ) );
                                $( this ).css( 
                                    {
                                        "color" : "rgba(0,0,0," + newOpacity + ")",
                                        "border-color" : "rgba(196,198,175," + newOpacity + ")",
                                        "background-color" : "rgba(255,255,255," + newOpacity + ")"
                                    }
                                ).removeClass( "active" );
                            }
                        );
                        $( this ).addClass( "active" );
                        $( "div#objectLayer div#tools div#layerMenu div.layer" ).animate(
                            {
                                "border-spacing" : rotate
                            },
                            {
                                step: function( now, fx )
                                    {
                                        $( this ).css( "transform" , "rotateX(" + now + "deg)" );
                                    },
                                duration: 200
                            },
                            "linear"
                        );
                        activeLayer = index + 1;
                    }
                );
            }
        );
    }
);
$.fn.extend({
    bounceFade: function( callback )
    {
        callback = callback || function( ){};
        $( this ).finish( ).fadeIn(100).delay(300).fadeOut(500, callback);
    },
    grabMove: function( )
    {
        var clickable = this;
        var obj = $( this ).parent( ).parent( );
        $( clickable ).on(
            "mousedown",
            function( event )
            {
                holdStarter = setTimeout(function() {
                    holdStarter = null;
                    holdActive = true;
                    var objStart = [ $( obj ).offset( ).left, $( obj ).offset( ).top ];
                    var cursorStart = [ event.pageX, event.pageY ];
                    $( window ).on(
                        "mousemove",
                        function( event2 )
                        {
                            var delta = [ event2.pageX, event2.pageY ];
                            $( obj ).css( 
                                {
                                    "left": (objStart[0]-(cursorStart[0]-delta[0]))+"px",
                                    "top":  (objStart[1]-(cursorStart[1]-delta[1]))+"px"
                                }
                            );
                            event2.preventDefault();
                            event2.stopPropagation();
                            return false;
                        }
                    );
                    $( window ).on(
                        "mouseup",
                        function( event3 )
                        {
                            $( obj ).attr( "lbase" , ( $( obj ).offset( ).left / scaleFactor ) ).attr( "tbase" , ( $( obj ).offset( ).top / scaleFactor ) ).css(
                                {
                                    "z-index": "1",
                                    "opacity": "1"
                                }
                            );
                            $( window ).off( "mousemove" ).off( "mouseup" );
                            
                            event3.preventDefault();
                            event3.stopPropagation();
                            return false;
                        }
                    );
                }, holdDelay);
                $( obj ).css(
                    {
                    "z-index": "2",
                    "opacity": "0.5"
                    }
                );
                event.stopPropagation( );
                event.preventDefault( );
                return false;
            }
        );
        $( clickable ).on(
            "mouseup",
            function( )
            {
                $( obj ).css(
                    {
                        "z-index": "1",
                        "opacity": "1"
                    }
                );
                if ( holdStarter ) 
                {
                    clearTimeout(holdStarter);
                }
                else if ( holdActive )
                {
                    holdActive = false;
                }
            }
        );
    },
    scaleInPlace: function( base )
    {
        var obj = this;
        $( window ).on(
            "mousewheel",
            function( event )
            {
                var startLeft = $( obj ).attr( "lbase" );
                var startTop = $( obj ).attr( "tbase" );
                $( obj ).css(
                    {
                        "width": base[0] * scaleFactor + "px",
                        "height" : base[1] * scaleFactor + "px",
                        "left" : startLeft * scaleFactor + "px",
                        "top" : startTop * scaleFactor + "px"
                    }
                );
            }
        );
    },
    grabSlide: function( )
    {
        var obj = this;
        buildString = function( vars )
        {
            var retVal = "";
            for( var i = 0; i < vars.length; i++ )
            {
                for( var j = 0; j < vars[i].length; j++ )
                {
                    retVal += vars[i][j] + "px ";
                }
                retVal = retVal.substring( 0, retVal.length-1 ) + ",";
            }
            return retVal.substring( 0, retVal.length-1 )
        };
        $( obj ).on(
            "mousedown",
            function( event )
            {
                holdStarter = setTimeout(
                    function( ) 
                    {
                        holdStarter = null;
                        holdActive = true;
                        objStart = $( obj ).css( "background-position" ).trim( ).split(",");
                        var objNew = [[],[],[],[]];
                        for( var i = 0; i < objStart.length; i++ )
                        {
                            var split = objStart[i].trim().split(" ");
                            for( var j = 0; j < split.length; j ++ )
                            {
                                split[j] = parseInt( split[j] );
                            }
                            objStart[i] = split;
                        }   
                        
                        var cursorStart = [ event.pageX, event.pageY ];      
                        $( window ).on(
                            "mousemove",
                            function( event2 )
                            {
                                var delta = [ event2.pageX, event2.pageY ];
                                
                                for( var i = 0; i < objStart.length; i++ )
                                {
                                    objNew[i][0] = objStart[i][0] - ( cursorStart[0] - delta[0] );
                                    objNew[i][1] = objStart[i][1] - ( cursorStart[1] - delta[1] );
                                }
                                $( obj ).css( 
                                    {
                                        "background-position": buildString( objNew )
                                    }
                                );
                                $( obj ).find( "div#objects > div.object" ).each(
                                    function( )
                                    {
                                        var startLeft = $( this ).attr( "lbase" ) * scaleFactor;
                                        var startTop = $( this ).attr( "tbase" ) * scaleFactor;
                                        $( this ).css(
                                            {
                                                "left": startLeft - ( cursorStart[0] - delta[0] ),
                                                "top":  startTop - ( cursorStart[1] - delta[1] )
                                            }
                                        );
                                    }
                                );
                                event2.preventDefault();
                                event2.stopPropagation();
                                return false;
                            }
                        );
                        $( window ).on(
                            "mouseup",
                            function( event3 )
                            {
                                $( window ).off( "mousemove" ).off( "mouseup" );
                                $( obj ).find( "div#objects > div.object" ).each(
                                    function( )
                                    {
                                        $( this ).attr( "lbase", $( this ).offset( ).left / scaleFactor ).attr( "tbase", $( this ).offset( ).top / scaleFactor );
                                    }
                                );
                                event3.preventDefault();
                                event3.stopPropagation();
                                return false;
                            }
                        );
                    }, 
                holdDelay);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        );
        $( obj ).on(
            "mouseup",
            function( )
            {
                if ( holdStarter ) 
                {
                    clearTimeout(holdStarter);
                }
                else if ( holdActive )
                {
                    holdActive = false;
                }
            }
        );
    }
});
function scaleGrid( up , base )
{
    var sizes = $( "div#objectLayer" ).css( "background-size" ).split(",");
    
    buildString = function( vars )
        {
            var retVal = "";
            for( var i = 0; i < vars.length; i++ )
            {
                for( var j = 0; j < vars[i].length; j++ )
                {
                    retVal += vars[i][j] + "px ";
                }
                retVal = retVal.substring( 0, retVal.length-1 ) + ",";
            }
            return retVal.substring( 0, retVal.length-1 )
        };
    
    for( var i = 0; i < sizes.length; i++ )
    {
        var split = sizes[i].trim().split(" ");
        for( var j = 0; j < split.length; j ++ )
        {
            split[j] = parseInt( split[j] );
        }
        sizes[i] = split;
    }
    
    if( up )
    {
        for( var i = 0; i < sizes.length; i++ )
        {
            var split = sizes[i];
            for( var j = 0; j < split.length; j ++ )
            {
                split[j] += ( base[i][j] * 0.1 );
            }
            sizes[i] = split;
        }
        $( "div#objectLayer" ).css( "background-size", buildString( sizes ) );
    }
    else
    {
        for( var i = 0; i < sizes.length; i++ )
        {
            var split = sizes[i];
            for( var j = 0; j < split.length; j ++ )
            {
                split[j] -= ( base[i][j] * 0.1 );
            }
            sizes[i] = split;
        }
        $( "div#objectLayer" ).css( "background-size", buildString( sizes ) );
    }
    return Math.round( (sizes[0][0] / base[0][0]) * 100 );
}

function hideHandles( )
{
    $( "div#objectLayer > div#objects > div.object" ).each(
        function( )
        {
            $( this ).find( ".objBar" ).fadeOut( 400 );
        }
    );
}

function unbindMouse( )
{
    $( "div#objectLayer" ).off( "mouseup" ).off( "mousedown" ).off( "click" );
    $( "div#objectLayer > div#objects > div.objects" ).off( "mouseup" ).off( "mousedown" ).off( "click" ).find( "div" ).each( 
        function( )
        {
            $( this ).off( "mouseup" ).off( "mousedown" ).off( "click" );
        }
    );
}

function bindMouse( )
{
    unbindMouse( );
    hideHandles( );
    switch( menu )
    {
        case "rooms":
            switch( tool )
            {
                case "move":
                    $( "div#objectLayer" ).grabSlide();
                    $( "div#objectLayer > div#objects > div.object" ).each(
                        function( )
                        {
                            $( this ).find( ".objBar" ).fadeIn( 400 ).find( ".grabBar" ).grabMove( );
                        }
                    );
                    break;
                case "add":
                    $( "div#objectLayer" ).on(
                        "click",
                        function( event )
                        {
                            var child = $( "<div class=\"object room\"><div class=\"objBar\"><div class=\"grabBar\"></div><div class=\"objX\">x</div></div><div class=\"body\"></div></div>");
                            child.appendTo( $( this ).find( "div#objects" ) );
                            child.css(
                                {
                                    "left" : event.pageX+"px",
                                    "top" : event.pageY+"px"
                                }
                            )
                            .attr("lbase",event.pageX)
                            .attr("tbase",event.pageY)
                            .find( "div.objBar" )
                            .hide( )
                            .parent( )
                            .scaleInPlace( objBase );
                            rooms.push( new room( ) );
                        }
                    );
                    break;
                default: console.log("Binding error!"); break;
            }
            break;
        default: console.log("Binding error!"); break;
    }
}

Number.prototype.roundTo = function(num) {
    var resto = this%num;
    if (resto <= (num/2)) { 
        return this-resto;
    } else {
        return this+num-resto;
    }
}