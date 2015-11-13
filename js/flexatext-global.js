var mac = false;
var gridBase = [ [ 100, 100 ],[ 100, 100 ],[ 20, 20 ],[ 20, 20 ] ];
var objBase = [ 300, 200 ];
var holdDelay = 200;
var holdStarter = null;
var holdActive = false;
var scaleFactor = 1;

var menu = "rooms";
var tool = "move";
var activeLayer = 1;

var rooms = [];
var actions = [];
var events = [];
var settings = [];

$( document ).ready(
    function( )
    {
        if (navigator.userAgent.indexOf('Mac OS X') != -1) {
            mac = true;
        }
    }
);