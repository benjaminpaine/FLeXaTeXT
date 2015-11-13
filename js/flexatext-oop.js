function door(room, locked)
{
    this.room = room || null;
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

function room( )
{
    this.name = "My Room";
    this.description = "It's a room. The walls are white, the floor is solid. Why are you here?";
    this.objects = new objectList( );
    this.connections = new connections( );
    this.nopath = "You can't seem to go that way."
    this.locked = "That door is locked."
    this.go = function( direction )
        {
            if( connections.direction === null )
            {
                return cantGo;
            }
            else if ( connections.direction.locked )
            {
                return locked;
            }
            else return connections.direction.room;
        };
}