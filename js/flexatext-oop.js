function door(room, destDirection, locked)
{
    this.room = room;
    this.direction = destDirection;
    this.locked = locked || false;
    this.lockedMessage = "That way is locked.";
    this.unlock = function( message )
    {
        this.locked = false;
        return message;
    }
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
    this.layer = activeLayer;
    this.objects = new objectList( );
    this.connections = new connections( );
    this.nopath = new nopath( );
    this.position = [0,0];
    this.go = function( direction )
        {
            if( connections[ direction ] === null )
            {
                return nopath[ direction ];
            }
            else if ( connections[ direction ].locked )
            {
                return connections[ direction ].lockedMessage;
            }
            else
            {
                if( direction == "up" )
                {
                    return rooms[ layer + 1 ][ connections[ direction ].room ];
                }
                else if( direction == "down" )
                {
                    return rooms[ layer - 1 ][ connections[ direction ].room ];
                }
                else
                {
                    return rooms[ layer ][ connections[ direction ].room ];
                }
            }
        };
}

// Debug Functions

function printRoom( index )
{
    var string = "";
    
    string += "<strong>Room Name:</strong> " + rooms[ activeLayer ][ index ].name + "<br />";
    
    if ( rooms[ activeLayer ][ index ].objects.list.length == 0 )
    {
        string += "<strong>Objects:</strong> None <br />";
    }
    else
    {
        // TODO
    }
    string += "<strong>Room Description:</strong><br />" + rooms[ activeLayer ][ index ].description;
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