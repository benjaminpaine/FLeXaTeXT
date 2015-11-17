mouseEvents = [];
cursor = [];

$( document ).ready(
    function( )
    {
        bindMouse( );
        bindLayers( );
        $( "div#objectLayer > div#tools > div#deleteLayer" ).css("opacity",0.3);
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
        $( "div#objectLayer > div#tools > div#insertBefore" ).on(
            "click",
            function( event )
            {
                rooms.splice(activeLayer,0,[]);
                $( "div#objectLayer div#tools div#layerMenu div.layer.active" ).before("<div class = \"layer\"></div>");
                $( "div#objectLayer > div#tools > div#deleteLayer" ).animate({"opacity":1},400);
                activeLayer++;
                bindLayers( );
                event.preventDefault( );
                event.stopPropagation( );
            }
        );
        $( "div#objectLayer > div#tools > div#deleteLayer" ).on(
            "click",
            function( event )
            {
                if( rooms.length > 1 )
                {
                    rooms.splice(activeLayer,1);
                    
                    var allLayers = $("div#objectLayer div#tools div#layerMenu div.layer");
                    var activeLayerObj = $("div#objectLayer div#tools div#layerMenu div.layer.active");
                    var currentIndex = $( allLayers ).index( activeLayerObj );
                    
                    if( currentIndex == 0 )
                    {
                        $( $( allLayers )[ currentIndex+1 ] ).addClass( "active" );
                        $( activeLayerObj ).remove( );
                    }
                    else
                    {
                         $( $( allLayers )[ currentIndex-1 ] ).addClass( "active" );
                         activeLayer--;
                         $( activeLayerObj ).remove( );
                    }
                    debug(activeLayer);
                    bindLayers( );
                    clearWorkspace( );
                    drawWorkspace( );
                    
                    if( rooms.length == 1 )
                    {
                        $( this ).animate({"opacity":0.3},400);
                    }
                }
                else return false;
            }
        );
        $( "div#objectLayer > div#tools > div#insertAfter" ).on(
            "click",
            function( event )
            {
                rooms.splice(activeLayer+1,0,[]);
                $( "div#objectLayer div#tools div#layerMenu div.layer.active" ).after("<div class = \"layer\"></div>");
                $( "div#objectLayer > div#tools > div#deleteLayer" ).animate({"opacity":1},400);
                bindLayers( );
                event.preventDefault( );
                event.stopPropagation( );
            }
        );
    }
);
$.fn.extend({
    bounceFade: function( callback )
    {
        callback = callback || function( ){};
        $( this ).stop( ).fadeIn(100).delay(300).fadeOut(500, callback);
    },
    grabMove: function( )
    {
        var clickable = this;
        var snapToleranceX = 50;
        var snapToleranceY = 50;
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
                            var newLeft = (objStart[0]-(cursorStart[0]-delta[0]));
                            var newTop = (objStart[1]-(cursorStart[1]-delta[1]));
                            var allObjects = $( obj ).siblings( );
                            
                            for( var i = 0 ; i < allObjects.length; i ++ )
                            {
                                if ( Math.abs( newLeft - parseFloat( $( allObjects[i] ).css( "left" ) ) ) <= snapToleranceX )
                                {
                                    newLeft = parseFloat( $( allObjects[i] ).css( "left" ) );
                                }
                                 if ( Math.abs( newTop - parseFloat( $( allObjects[i] ).css( "top" ) ) ) <= snapToleranceY )
                                {
                                    newTop = parseFloat( $( allObjects[i] ).css( "top" ) );
                                }
                            }
                            
                            $( obj ).css( 
                                {
                                    "left": newLeft+"px",
                                    "top":  newTop+"px"
                                }
                            );
                            redrawLines( );
                            event2.preventDefault();
                            event2.stopPropagation();
                            return false;
                        }
                    );
                    $( window ).on(
                        "mouseup",
                        function( event3 )
                        {
                            var xBase = $( obj ).offset( ).left / scaleFactor;
                            var yBase = $( obj ).offset( ).top / scaleFactor;
                            $( obj ).attr( "lbase" , xBase ).attr( "tbase" , yBase ).css(
                                {
                                    "z-index": "1",
                                    "opacity": "1"
                                }
                            );
                            
                            if( $( obj ).hasClass( "room" ) )
                            {
                                thisIndex = $( "div#objectLayer div#objects div.object.room" ).index( obj );
                                rooms[ activeLayer ][ thisIndex ].position = [ xBase, yBase ];
                            }
                            
                            redrawLines( );
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
                ).find ( "div.body" ).css(
                    {
                        "width": base[0] * scaleFactor + "px",
                        "height" : ( base[1] - 40 ) * scaleFactor + "px"
                    }
                );
                redrawLines( );
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
                                $( obj ).find( "div#decorations > div.line" ).each(
                                    function( )
                                    {
                                        var startLeft = $( this ).attr( "lbase" );
                                        var startTop = $( this ).attr( "tbase" );
                                        $( this ).css(
                                            {
                                                "left": startLeft - ( cursorStart[0] - delta[0] ),
                                                "top": startTop - ( cursorStart[1] - delta[1] )
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
                                        var xBase = $( this ).offset( ).left / scaleFactor;
                                        var yBase = $( this ).offset( ).top / scaleFactor;
                                        $( this ).attr( "lbase", xBase ).attr( "tbase", yBase );
                                        if( $( this ).hasClass( "room" ) )
                                        {
                                            thisIndex = $( "div#objectLayer div#objects div.object.room" ).index( this );
                                            rooms[ activeLayer ][ thisIndex ].position = [ xBase, yBase ];
                                        }
                                    }
                                );
                                $( obj ).find( "div#decorations > div.line" ).each(
                                    function( )
                                    {
                                        $( this ).attr( "lbase", parseFloat( $( this ).css( "left" ) ) ).attr( "tbase", parseFloat( $( this ).css( "top" ) ) );
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

function bindLayers( )
{
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
                function( event )
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
                    event.preventDefault( );
                    event.stopPropagation( );
                    
                    activeLayer = index;
                    clearWorkspace( );
                    drawWorkspace( );
                }
            );
        }
    );
}

function hideHandles( )
{
    clearInterval( debugInterval );
    $( "div#objectLayer > div#objects > div.object" ).each(
        function( )
        {
            $( this ).find( "div.objBar" ).fadeOut( 400 );
        }
    );
    $( "div#objectLayer > div#decorations > div.line" ).css(
        {
            "pointer-events" : "none"
        }
    );
}

function unbindMouse( )
{
    $( "div#objectLayer" ).off( "mouseup" ).off( "mousedown" ).off( "click" );
    $( "div#objectLayer > div#objects > div.object" ).off( "mouseup" ).off( "mousedown" ).off( "click" ).find( "div" ).each( 
        function( )
        {
            $( this ).off( "mouseup" ).off( "mousedown" ).off( "click" );
        }
    );
}

function unbindCursor( )
{
    $( "div#objectLayer, div#objectLayer > div#objects div" ).css(
        {
            "cursor" : "default"
        }
    );
}

function bindMouse( )
{
    unbindMouse( );
    unbindCursor( );
    hideHandles( );
    if( mouseEvents [ menu + "." + tool ] !== undefined )
    {
        mouseEvents[ menu + "." + tool ]();
    }
    else
    {
        debug( "Binding error with " + menu + " and " + tool );
    }
    
    if( cursor[ menu + "." + tool ] !== undefined )
    {
        cursor[ menu + "." + tool ]();
    }
    else
    {
        debug( "Cursor not found with " + menu + " and " + tool + ". Reverting to default." );
    }
}

function drawLine( x1, y1, x2, y2, weight, color, obj1, obj2, locked1, locked2 )
{
    weight = weight || 2;
    color = color || "black";
    var a = Math.abs(x2-x1);
    var b = Math.abs(y2-y1);
    var length = Math.sqrt((a*a)+(b*b));
    var angle = ( Math.atan2( b, a ) * 180 ) / Math.PI;
    
    if( x2 > x1 )
    {
        angle = 180 - angle;
    }
    if ( y2 > y1 ) 
    {
        angle = -1 * angle;
    }
    if( menu == "rooms" )
    {
        var newItem = $( "<div class=\"line\"><div class=\"mouseHandle\"></div><div class=\"rightArrow\"></div><div class=\"leftArrow\"></div></div>" );
    }
    else
    {
        var newItem = $( "<div class=\"line\"></div>" );
    }
    newItem.appendTo( $( "div#objectLayer div#decorations" ) );
    newItem.css(
        {
            "background-color" : color,
            "height" : weight + "px",
            "width" : length + "px",
            "left" : x2 + "px",
            "top" : y2 + "px",
            "transform" : "rotateZ(" + angle + "deg)",
            "transform-origin" : "0 0"
        }
    ).attr("lbase",x2).attr("tbase",y2);
    if( obj1 !== undefined )
    {
        newItem.attr("id1",obj1);
    }
    if( obj2 !== undefined )
    {
        newItem.attr("id2",obj2);
    }
    if( locked1 !== undefined && locked1 )
    {
        newItem.find( "div.rightArrow" ).addClass( "locked" );
    }
    if( locked2 !== undefined && locked2 )
    {
        newItem.find( "div.leftArrow" ).addClass( "locked" );
    }
    return newItem;
}

function redrawLines( id )
{
    if ( id === undefined )
    {
        $( "div#objectLayer > div#decorations > div.line" ).each(
            function( )
            {
                var args1 = $( this ).attr( "id1" ).split( ":" );
                var args2 = $( this ).attr( "id2" ).split( ":" );
                
                var object1 = $( "div#objects div.object" )[ args1[ 0 ] ];
                var object2 = $( "div#objects div.object" )[ args2[ 0 ] ];
                
                var link1 = $( object1 ).find( "div.handles div.link."+args1[ 1 ]+"Link" );
                var link2 = $( object2 ).find( "div.handles div.link."+args2[ 1 ]+"Link" );
                
                var x1 = $( link1 ).offset( ).left;
                var y1 = $( link1 ).offset( ).top;
                
                var x2 = $( link2 ).offset( ).left;
                var y2 = $( link2 ).offset( ).top;
                
                switch( args1[ 1 ] )
                {
                    case "north":
                        x1 += 2.5;
                        y1 += 2.5;
                        break;
                    case "east":
                        x1 += 25;
                        y1 += 2.5;
                        break;
                    case "west":
                        y1 += 2.5;
                        break;
                    case "south":
                        x1 += 2.5;
                        y1 += 25;
                        break;
                    default:
                        debug( "Drawing error!" );
                        break;
                }
                switch( args2[ 1 ] )
                {
                    case "north":
                        x2 += 2.5;
                        y2 += 2.5;
                        break;
                    case "east":
                        x2 += 25;
                        y2 += 2.5;
                        break;
                    case "west":
                        y2 += 2.5;
                        break;
                    case "south":
                        x2 += 2.5;
                        y2 += 25;
                        break;
                    default:
                        debug( "Drawing error!" );
                        break;
                }
                
               
                if( menu == "rooms" )
                {
                    var locked1 = $( this ).find( "div.rightArrow" ).hasClass( "locked" );
                    var locked2 = $( this ).find( "div.leftArrow" ).hasClass( "locked" );
                    $( this ).remove( );
                    var line = drawLine( x1, y1, x2, y2, 2, "black", args1[ 0 ] + ":" + args1[ 1 ], args2[ 0 ]+ ":" + args2[ 1 ], locked1, locked2 );
                }
                else
                {
                    $( this ).remove( );
                    var line = drawLine( x1, y1, x2, y2, 2, "black", args1[ 0 ] + ":" + args1[ 1 ], args2[ 0 ]+ ":" + args2[ 1 ] );
                }
                if( menu == "rooms" && tool == "connection" )
                {
                    line.css(
                        {
                            "pointer-events": "auto"
                        }
                    );
                }
            }
        );
    }
}

function clearWorkspace( )
{
    $( "div#objectLayer > div#objects" ).children( ).remove( );
    $( "div#objectLayer > div#decorations" ).children( ).remove( );
}

function drawWorkspace( )
{
    switch( menu )
    {
        case "rooms":
            var objectList = rooms[ activeLayer ];
            var type = "room";
            break;
        default:
            debug("Unimplemented Feature.");
            return;
    }
    for( var i = 0; i < objectList.length; i++ )
    {
        var child = $( "<div class=\"object " + type + "\"><div class=\"objBar\"><div class=\"grabBar\"></div><div class=\"objX\">x</div></div><div class=\"body\"></div></div>");
        child.appendTo( $( "div#objectLayer div#objects" ) );
        if( menu == "rooms" )
        {
            child.append("<div class=\"handles\"><div class=\"link westLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link eastLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link northLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link southLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div>");
        }
        child.css(
            {
                "left" : ( objectList[ i ].position[ 0 ] * scaleFactor ) + "px",
                "top" : ( objectList[ i ].position[ 1 ] * scaleFactor ) + "px",
                "width" : ( objBase[0] * scaleFactor ) + "px",
                "height" : ( objBase[1] * scaleFactor ) + "px"
            }
        )
        .attr("lbase",objectList[ i ].position[ 0 ])
        .attr("tbase",objectList[ i ].position[ 1 ])
        .scaleInPlace( objBase );
        
        if( tool != "move" )
        {
            child.find( "div.objBar" ).hide( );
        }
        
        switch(menu)
        {
            case "rooms" : 
                child.find( "div.body" ).html( printRoom( i ) );
                break;
            default:
                debug( "Unimplemented feature!" );
                break;
        }
    }
    if( menu == "rooms" )
    {
        var drawDirections = ["north","south","east","west"];
        for( var firstIndex = 0; firstIndex < objectList.length; firstIndex ++ )
        {
            var firstHandles = $( $( "div#objectLayer div#objects div.object.room" )[ firstIndex ]).find( "div.handles" );
            
            for( var j = 0; j < drawDirections.length; j++ )
            {
                var firstLink = drawDirections[ j ];
                if( objectList[ firstIndex ].connections[ firstLink ] !== null )
                {
                    var draw = true;
                    var checkVal = firstIndex + ":" + firstLink;
                    $( "div#decorations div.line" ).each(
                        function( )
                        {
                            if( $( this ).attr( "id2" ) == checkVal )
                            {
                                draw = false;
                            }
                        }
                    );
                    
                    if( draw )
                    {
                        var firstLinkObj = $( firstHandles ).find( "div.link."+firstLink+"Link" );
                        
                        var x1 = $( firstLinkObj ).offset( ).left;
                        var y1 = $( firstLinkObj ).offset( ).top;
                        
                        var secondIndex = objectList[ firstIndex ].connections[ firstLink ].room;
                        var secondLink = objectList[ firstIndex ].connections[ firstLink ].direction;
                        var secondHandles = $( $( "div#objectLayer div#objects div.object.room" )[ secondIndex ] ).find( "div.handles" );
                        var secondLinkObj = $( secondHandles ).find( "div.link."+secondLink+"Link" );
                        
                        var x2 = $( secondLinkObj ).offset( ).left;
                        var y2 = $( secondLinkObj ).offset( ).top;
                        
                        switch( firstLink )
                        {
                            case "north":
                                x1 += 2.5;
                                y1 += 2.5;
                                break;
                            case "east":
                                x1 += 25;
                                y1 += 2.5;
                                break;
                            case "west":
                                y1 += 2.5;
                                break;
                            case "south":
                                x1 += 2.5;
                                y1 += 25;
                                break;
                            default:
                                debug( "Drawing error!" );
                                break;
                        }
                        switch( secondLink )
                        {
                            case "north":
                                x2 += 2.5;
                                y2 += 2.5;
                                break;
                            case "east":
                                x2 += 25;
                                y2 += 2.5;
                                break;
                            case "west":
                                y2 += 2.5;
                                break;
                            case "south":
                                x2 += 2.5;
                                y2 += 25;
                                break;
                            default:
                                debug( "Drawing error!" );
                                break;
                        }
                        var locked2 = objectList[ firstIndex ].connections[ firstLink ].locked;
                        var locked1 = objectList[ secondIndex ].connections[ secondLink ].locked;
                        
                        var line = drawLine(x1,y1,x2,y2,2,"black",firstIndex+":"+firstLink,secondIndex+":"+secondLink, locked1, locked2);
                        if( menu == "rooms" && tool == "connection" )
                        {
                            line.css(
                                {
                                    "pointer-events": "auto"
                                }
                            );
                        }
                    }
                }
            }
        }
    }    
    bindMouse( );
}

Number.prototype.roundTo = function(num) {
    var resto = this%num;
    if (resto <= (num/2)) { 
        return this-resto;
    } else {
        return this+num-resto;
    }
}

cursor[ "rooms.move" ] = function( )
    {
        $( "div#objectLayer" ).css(
            {
                "cursor" : "url(images/cursors/rooms_move.png), auto"
            }
        );
        $( "div#objectLayer > div#objects > div.object > div.objBar > div.grabBar" ).css(
            {
                "cursor" : "url(images/cursors/rooms_move.png), auto"
            }
        );
        $( "div#objectLayer > div#objects > div.object > div.objBar > div.objX" ).css(
            {
                "cursor" : "url(images/cursors/rooms_delete.png), auto"
            }
        );
    };
    
cursor[ "rooms.add" ] = function( )
    {
        $( "div#objectLayer" ).css(
            {
                "cursor" : "url(images/cursors/rooms_add.png), auto"
            }
        );
    };

mouseEvents[ "rooms.move" ] = function( )
    {
        debugInterval = setInterval( function( ){ $( "div#menuLayer > div#rightMenu > div#container" ).html( printRooms( ) ) }, 500 );
        $( "div#objectLayer" ).grabSlide();
        $( "div#objectLayer > div#objects > div.object" ).each(
        function( )
            {
                var obj = this;
                $( this ).find( "div.objBar" ).fadeIn( 400 ).find( "div.grabBar" ).grabMove( );
                $( this ).find( "div.objBar" ).find( "div.objX" ).off( "click" ).on(
                    "click",
                    function( event )
                    {
                        var thisIndex = $( "div#objectLayer > div#objects > div.object" ).index( obj );
                        rooms[ activeLayer ].splice( thisIndex, 1 );
                        var checkConnections = ["north","south","east","west","up","down"];
                        var allLines = $( "div#objectLayer > div#decorations > div.line" );
                        for( var i = 0; i < rooms[ activeLayer ].length; i++ )
                        {
                            for( var j = 0; j < checkConnections.length; j++ )
                            {
                                if( rooms[ activeLayer ][ i ].connections[ checkConnections[ j ] ] !== null &&
                                    rooms[ activeLayer ][ i ].connections[ checkConnections[ j ] ].room == thisIndex )
                                {
                                    rooms[ activeLayer ][ i ].connections[ checkConnections[ j ] ] = null;
                                }
                            }
                        }
                        for( var i = 0; i < allLines.length; i++ )
                        {
                            var thisLine = allLines[ i ];
                            var checkVals = [ $( thisLine ).attr( "id1" ).split( ":" ), $( thisLine ).attr( "id2" ).split( ":" ) ];
                            if( checkVals [ 0 ][ 0 ] == thisIndex || checkVals [ 1 ][ 0 ] == thisIndex )
                            {
                                $( thisLine ).remove( );
                            }
                        }
                        $( obj ).remove( );
                    }
                );
            }
        );
    };
    
mouseEvents[ "rooms.add" ] = function( )
    {
        $( "div#objectLayer" ).on(
            "click",
            function( event )
            {
                rooms[ activeLayer ].push( new room( ) );
                var child = $( "<div class=\"object room\"><div class=\"objBar\"><div class=\"grabBar\"></div><div class=\"objX\">x</div></div><div class=\"body\"></div><div class=\"handles\"><div class=\"link westLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link eastLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link northLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div><div class=\"link southLink\"><div class = \"circle\"></div><div class = \"tri\"></div></div></div>");
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
                .find( "div.body" )
                .html( printRoom( rooms.length-1 ) )
                .parent( )
                .scaleInPlace( objBase );
                
                rooms[ activeLayer ][ rooms[ activeLayer ].length - 1 ].position = [ event.pageX, event.pageY ];
            }
        );   
    };
    
mouseEvents[ "rooms.connection" ] = function( )
    {
        $( "div#objectLayer div#decorations div.line" ).each(
            function( )
            {
                $( this ).css(
                    {
                        "pointer-events" : "auto"
                    }
                ).on(
                    "click",
                    function( )
                    {
                        var obj = this;
                        var attributes = [ $( this ).attr( "id1" ).split( ":" ), $( this ).attr( "id2" ).split( ":" ) ];
                        var room1 = rooms[ activeLayer ][ attributes [ 0 ][ 0 ] ];
                        var room2 = rooms[ activeLayer ][ attributes [ 1 ][ 0 ] ];
                        
                        var string = "<h1>Door</h1><div class=\"optionsBox\"><div class=\"title\">"+ room1.name + " (" + attributes[ 0 ][ 1 ]+ ") to " + room2.name + " (" + attributes [ 1 ][ 1 ] + ")</div><div class=\"checkBox\"><div class=\"box\">&nbsp;</div><div class=\"label\">Locked</div></div><h4>Locked Message:</h4><textarea></textarea></div><div class=\"optionsBox\"><div class=\"title\">"+ room2.name + " (" + attributes[ 1 ][ 1 ]+ ") to " + room1.name + " (" + attributes [ 0 ][ 1 ] + ")</div><div class=\"checkBox\"><div class=\"box\">&nbsp;</div><div class=\"label\">Locked</div></div><h4>Locked Message:</h4><textarea></textarea></div>";
                        var newBox = $( string );
                        
                        var locked = [ room1.connections[ attributes [ 0 ][ 1 ] ].locked, room2.connections[ attributes [ 1 ][ 1 ] ].locked ];
                        
                        if( locked[ 0 ] )
                        {
                            $( newBox.find( "div.checkBox > div.box" )[0] ).html( "&#10004;" );
                        }
                        
                        if( locked[ 1 ] )
                        {
                            $( newBox.find( "div.checkBox > div.box" )[1] ).html( "&#10004;" );
                        }
                        
                        $( newBox.find( "textarea" )[0] ).val( room1.connections[ attributes [ 0 ][ 1 ] ].lockedMessage );
                        $( newBox.find( "textarea" )[1] ).val( room2.connections[ attributes [ 1 ][ 1 ] ].lockedMessage );
                        
                        newBox.find( "div.checkBox > div.box" ).on(
                            "click",
                            function( event )
                            {
                                var thisIndex = $( "div#menuLayer > div#rightMenu > div#container > div.optionsBox" ).index($( this ).parent( ).parent( ));
                                if( locked[ thisIndex ] )
                                {
                                    rooms[ activeLayer ][ attributes [ thisIndex ][ 0 ] ].connections[ attributes [ thisIndex ][ 1 ] ].locked = false;
                                    locked[ thisIndex ] = false;
                                    $( this ).html( "&nbsp;" );
                                    switch( thisIndex )
                                    {
                                        case 1: $( obj ).find( "div.rightArrow" ).removeClass( "locked" ); break;
                                        case 0: $( obj ).find( "div.leftArrow" ).removeClass( "locked" ); break;
                                        default: debug( "Some error occurred in editing connection." ); break;
                                    }
                                }
                                else
                                {
                                    rooms[ activeLayer ][ attributes [ thisIndex ][ 0 ] ].connections[ attributes [ thisIndex ][ 1 ] ].locked = true;
                                    locked[ thisIndex ] = true;
                                    $( this ).html( "&#10004;" );
                                    switch( thisIndex )
                                    {
                                        case 1: $( obj ).find( "div.rightArrow" ).addClass( "locked" ); break;
                                        case 0: $( obj ).find( "div.leftArrow" ).addClass( "locked" ); break;
                                        default: debug( "Some error occurred in editing connection." ); break;
                                    }
                                }
                                
                                event.preventDefault( );
                                event.stopPropagation( );
                            }
                        );
                        
                        newBox.find( "textarea" ).on(
                            "blur",
                            function( )
                            {
                                var thisIndex = $( "div#menuLayer > div#rightMenu > div#container > div.optionsBox" ).index($( this ).parent( ));
                                rooms[ activeLayer ][ attributes [ thisIndex ][ 0 ] ].connections[ attributes [ thisIndex ][ 1 ] ].lockedMessage = $( this ).val( );
                            }
                        );
                        parameterDisplay( newBox );
                    }
                );
            }
        );
        $( "div#objectLayer div#objects div.object div.handles div.link"  ).on(
            "click",
            function( event )
            {
                
                var x1 = $( this ).offset( ).left;
                var y1 = $( this ).offset( ).top;
                var x2 = event.pageX;
                var y2 = event.pageY;
                
                
                var thisLink = this;
                
                var firstIndex = $( "div#objectLayer div#objects div.object" ).index( $( this ).parent( ).parent( ) );
                
                if( $( this ).hasClass( "northLink" ) )
                {
                    x1 += 2.5;
                    y1 += 2.5;
                    firstLink = "north"
                }
                else if ( $( this ).hasClass( "eastLink" ) )
                {
                    x1 += 25;
                    y1 += 2.5;
                    firstLink = "east"
                }
                else if ( $( this ).hasClass( "westLink" ) )
                {
                    y1 += 2.5;
                    firstLink = "west"
                }
                else if ( $( this ).hasClass( "southLink" ) )
                {
                    x1 += 2.5;
                    y1 += 25;
                    firstLink = "south"
                }
                
                if( rooms[ activeLayer ][ firstIndex ].connections[ firstLink ] !== null )
                {
                    rooms[ activeLayer ][ firstIndex ].connections[ firstLink ] = null;
                    $( "div#objectLayer div#decorations div.line" ).each(
                        function( )
                        {
                            if( $( this ).attr( "id1" ) == firstIndex + ":" + firstLink)
                            {
                                var otherLink = $( this ).attr( "id2" ).split( ":" );
                                rooms[ activeLayer ][ otherLink[ 0 ] ].connections[ otherLink[ 1 ] ] = null;
                                $( this ).remove( );
                            }
                            else if( $( this ).attr ( "id2" ) == firstIndex + ":" + firstLink )
                            {
                                var otherLink = $( this ).attr( "id1" ).split( ":" );
                                rooms[ activeLayer ][ otherLink[ 0 ] ].connections[ otherLink[ 1 ] ] = null;
                                $( this ).remove( );
                            }
                        }
                    );
                }
                
                var line = drawLine(x1,y1,x2,y2);
                event.preventDefault( );
                event.stopPropagation( );
                
                $( window ).on(
                    "mousemove",
                    function( event2 )
                    {
                        line.remove( );
                        x2 = event2.pageX;
                        y2 = event2.pageY;
                        line = drawLine(x1,y1,x2,y2);
                    }
                );
                $( "div#objectLayer" ).on(
                    "click",
                    function( event2 )
                    {
                        line.remove( );
                        $( window ).off( "mousemove" );
                        $( "div#objectLayer div#objects div.object div.handles div.link"  ).off( "click" );
                        event2.preventDefault( );
                        event2.stopPropagation( );
                        bindMouse( );
                    }
                );
                $( "div#objectLayer div#objects div.object div.handles div.link"  ).off( "click" ).on(
                    "click",
                    function( event2 )
                    {
                        if( thisLink === this )
                        {
                            $( "div#objectLayer" ).trigger( "click" );
                            return;
                        }
                        $( window ).off( "mousemove" );
                        x2 = $( this ).offset( ).left;
                        y2 = $( this ).offset( ).top;
                        
                        var secondIndex = $( "div#objectLayer div#objects div.object" ).index( $( this ).parent( ).parent( ) );
                        
                        if( $( this ).hasClass( "northLink" ) )
                        {
                            x2 += 2.5;
                            y2 += 2.5;
                            secondLink = "north"
                        }
                        else if ( $( this ).hasClass( "eastLink" ) )
                        {
                            x2 += 25;
                            y2 += 2.5;
                            secondLink = "east"
                        }
                        else if ( $( this ).hasClass( "westLink" ) )
                        {
                            y2 += 2.5;
                            secondLink = "west"
                        }
                        else if ( $( this ).hasClass( "southLink" ) )
                        {
                            x2 += 2.5;
                            y2 += 25;
                            secondLink = "south"
                        }
                        
                        if( rooms[ activeLayer ][ secondIndex ].connections[ secondLink ] !== null )
                        {
                            rooms[ activeLayer ][ secondIndex ].connections[ secondLink ] = null;
                            $( "div#objectLayer div#decorations div.line" ).each(
                                function( )
                                {
                                    if( $( this ).attr( "id1" ) == secondIndex + ":" + secondLink )
                                    {
                                        var otherLink = $( this ).attr( "id2" ).split( ":" );
                                        rooms[ activeLayer ][ otherLink[ 0 ] ].connections[ otherLink[ 1 ] ] = null;
                                        $( this ).remove( );
                                    }
                                    else if( $( this ).attr ( "id2" ) == secondIndex + ":" + secondLink )
                                    {
                                        var otherLink = $( this ).attr( "id1" ).split( ":" );
                                        rooms[ activeLayer ][ otherLink[ 0 ] ].connections[ otherLink[ 1 ] ] = null;
                                        $( this ).remove( );
                                    }
                                }
                            );
                        }
                        
                        rooms[ activeLayer ][ firstIndex ].connections[ firstLink ] = new door( secondIndex, secondLink, false );
                        rooms[ activeLayer ][ secondIndex ].connections[ secondLink ] = new door( firstIndex, firstLink, false );
                        
                        line.remove( );

                        line = drawLine(x1,y1,x2,y2,2,"black",firstIndex+":"+firstLink,secondIndex+":"+secondLink);
                        line.css(
                            {
                                "pointer-events": "auto"
                            }
                        );
                        event2.preventDefault( );
                        event2.stopPropagation( );
                        $( "div#objectLayer div#objects div.object div.handles div.link"  ).off( "click" );
                        bindMouse( );
                    }
                );
                
            }
        );
    };