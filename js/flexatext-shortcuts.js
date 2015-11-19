shortcut = function( combination, callback, wantedMenu )
{
    combination = combination.toLowerCase( );
    wantedMenu = wantedMenu || "none";
    $( window ).on(
        "keydown",
        function( event )
        {
            var tgt;
            if( event.target ) 
            {
                tgt = event.target;
            }
            else if( event.srcElement )
            {
                tgt = event.srcElement;
            }
            
            if( tgt.nodeType == 3 )
            {
                tgt = tgt.parentNode;
            }
            if( tgt.tagName == 'INPUT' || tgt.tagName == 'TEXTAREA' )
            {
                return;
            }
            else
            {
                if (event.keyCode)
                {
                    code = event.keyCode;
                }
                else if (e.which) 
                {
                    code = event.which;
                }
                
                var character = String.fromCharCode( code ).toLowerCase( );
                
                var keys = combination.split( "+" );
                var keyCount = 0;
                
                var modsWanted = { 
                    shift: false,
                    ctrl: false,
                    alt: false
                };
                var modsPressed = {
                    shift: false,
                    ctrl: false,
                    alt: false
                };
                            
                if (event.ctrlKey || event.metaKey )
                {
                    modsPressed.ctrl = true;
                }
                if( event.shiftKey )
                {
                    modsPressed.shift = true;
                }
                if( event.altKey )
                {
                    modsPressed.alt = true;
                }
                
                for( var i=0; i < keys.length; i++ ) {
                    if( keys[i] == 'ctrl' )
                    {
                        keyCount++;
                        modsWanted.ctrl = true;

                    } 
                    else if( keys[i] == 'shift' ) 
                    {
                        keyCount++;
                        modsWanted.shift = true;

                    } 
                    else if( keys[i] == 'alt' ) 
                    {
                        keyCount++;
                        modsWanted.alt = true;
                    } 
                    else if( keys[i] == character )
                    {
                        keyCount++;
                    }
                }
                
                if( keyCount == keys.length && 
                    modsWanted.ctrl == modsPressed.ctrl &&
                    modsWanted.shift == modsPressed.shift &&
                    modsWanted.alt == modsPressed.alt &&
                    ( wantedMenu == menu || wantedMenu == "none" )
                  )
                {
                    callback( );
                }
            }
        }
    );
};
$( document ).ready(
    function( )
    {
        $( "div, input" ).each(
            function( )
            {
                var combination = $( this ).attr( "shortcut" );
                var obj = this;
                if( combination !== undefined )
                {
                    if( $( this ).parent( ).hasClass( "contextSubMenu" ) )
                    {
                        shortcut( combination, function( ){ $( obj ).trigger( "click" ); }, $( obj ).parent( ).attr( "id" ) );
                    }
                    else
                    {
                        shortcut( combination, function( ){ $( obj ).trigger( "click" ); } );
                    }
                }
            }
        );
    }
);