function door(room, destDirection, locked)
{
    this.room = room;
    this.direction = destDirection;
    this.locked = locked || false;
}

function connections( )
{
    
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.up = null;
    this.down = null;  
    
    this.none = function( )
    {
        
        if (    
            this.north === null && 
            this.south === null && 
            this.east === null && 
            this.west === null && 
            this.up === null && 
            this.down === null
        )
        {
            return true;
        }
        return false;
    }
}

function object( )
{
    this.name = "An unknowable object";
    this.closeup = "You look at at it, and immediately after looking away, you forget what it looks like.";
    this.faraway = "There's something in the corner. Maybe it's worth looking at?";
    this.canPickup = false;
    this.pickupMessage = "You reach for it, but forget what you were doing. Maybe you left the iron on?";
    this.pickup = function( )
        {
            return canPickup?pickupMessage:false;
        }
}

function objectList( object )
{
    this.list = [];
    this.emptyMessage = "There isn't anything here.";
    this.describe = function( )
        {
            if( this.list.length == 0 )
            {
                return emptyMessage;
            }
            else
            {
                returnMessage = "<br /><br />";
                for( var i=0; i < list.length; i++ )
                {
                    returnMessage += list[i].faraway + "<br /><br />";
                }
                return returnMessage;
            }
        };
}

function locked( n, s, e, w, u, d )
{
    this.north = n || "That way is locked.";
    this.south = s || "That way is locked.";
    this.east = e || "That way is locked.";
    this.west = w || "That way is locked.";
    this.up = u || "That way is locked.";
    this.down = d || "That way is locked.";
}

function nopath( n, s, e, w, u, d )
{
    this.north = n || "There's no path to go that way.";
    this.south = s || "There's no path to go that way.";
    this.east = e || "There's no path to go that way.";
    this.west = w || "There's no path to go that way.";
    this.up = u || "There's no path to go that way.";
    this.down = d || "There's no path to go that way.";
}

function room( )
{
    this.name = "My Room";
    this.description = "It's a room. The walls are white, the floor is solid. Why are you here?";
    this.objects = new objectList( );
    this.connections = new connections( );
    this.nopath = new nopath( );
    this.locked = new locked( );
    this.position = [0,0];
    this.go = function( direction )
        {
            if( connections.direction === null )
            {
                return nopath.direction;
            }
            else if ( connections.direction.locked )
            {
                return locked.direction;
            }
            else return rooms[ connections.direction.room ];
        };
}

// Debug Functions

function printRoom( index )
{
    var string = "";
    
    string += "<strong>Room Index:</strong> " + index + "<br />";
    string += "<strong>Room Name:</strong> " + rooms[ activeLayer ][ index ].name + "<br />";
    if ( rooms[ activeLayer ][ index ].objects.list.length == 0 )
    {
        string += "<strong>Objects:</strong> None <br />";
    }
    else
    {
        // TODO
    }
    string += "<strong>Object Position:</strong> (" + rooms[ activeLayer ][ index ].position[0] + "," + rooms[ activeLayer ][ index ].position[1] + ") <br />";
    
    if ( rooms[ activeLayer ][ index ].connections.none() )
    {
        string += "<strong>Connections:</strong> None<br />";
    }
    else
    {
        if ( rooms[ activeLayer ][ index ].connections.north !== null )
        {
            string += "<strong>North:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.north.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.north.room ].name + " (" + rooms[ activeLayer ][ index ].connections.north.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.north.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
        if ( rooms[ activeLayer ][ index ].connections.south !== null )
        {
            string += "<strong>South:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.south.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.south.room ].name + " (" + rooms[ activeLayer ][ index ].connections.south.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.south.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
        if ( rooms[ activeLayer ][ index ].connections.west !== null )
        {
            string += "<strong>West:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.west.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.west.room ].name + " (" + rooms[ activeLayer ][ index ].connections.west.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.west.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
        if ( rooms[ activeLayer ][ index ].connections.east !== null )
        {
            string += "<strong>East:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.east.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.east.room ].name + " (" + rooms[ activeLayer ][ index ].connections.east.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.east.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
        if ( rooms[ activeLayer ][ index ].connections.down !== null )
        {
            string += "<strong>Down:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.down.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.down.room ].name + " (" + rooms[ activeLayer ][ index ].connections.down.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.down.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
        if ( rooms[ activeLayer ][ index ].connections.up !== null )
        {
            string += "<strong>Up:</strong>" + "[" + rooms[ activeLayer ][ index ].connections.up.room + "] " + rooms[ activeLayer ][ rooms[ activeLayer ] [ index ].connections.up.room ].name + " (" + rooms[ activeLayer ][ index ].connections.up.direction + ")";
            if( rooms[ activeLayer ][ index ].connections.up.locked )
            {
                string += " <strong>LOCKED</strong>";
            }
            else
            {
                string += " <strong>UNLOCKED</strong>";
            }
            string += "<br />";
        }
    }
    return string;
}
function printRooms( )
{
    string = "";
    for( var i = 0; i < rooms[ activeLayer ].length; i++ )
    {
        string += printRoom( i ) + "<br /><br />";
    }
    return string;
}