$( document ).ready(
    function( )
    {
        $( "#alertLayer" ).children( ).hide( );
        // dialog( "<h1>Welcome to FLeXaTeXT!</h1>This appears to be your first time. Don't worry, I'll be gentle." );
    }
);
function dialog( text )
{
    $( "div#alertLayer" ).show( ).css(
        {
            "background" : "rgba(255,255,255,0.75)",
            "pointer-events" : "auto",
        }
    )
    .find( "div.alertDialog" )
    .fadeIn( 200 )
    .find( "div.text" )
    .html( text )
    .parent( )
    .find( "input.alertButton" )
    .on(
        "click",
        function( event )
        {
            var obj = $( this ).parent( );
            $( this ).parent( ).parent( ).fadeOut( 500, 
                function ( ) 
                {
                    $( obj ).find( "div.text" )
                    .html( "" )
                    .parent( )
                    .hide( )
                    .parent( )
                    .css(
                        {
                            "background": "transparent",
                            "pointer-events": "none"
                        }
                    ); 
                }
            );
            $( this ).off( "click" );
        }
    );
}
function input( text, inputElement )
{

}