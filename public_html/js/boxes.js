// Last updated August 2010 by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc


// holds all our rectangles

var canvas;
var image;
var ctx;
var WIDTH;
var HEIGHT;
var INTERVAL = 20;  // how often, in milliseconds, we check to see if a redraw is needed

var isDrag = false;
var mx, my; // mouse coordinates

// when set to true, the canvas will redraw everything
// invalidate() just sets this to false right now
// we want to call invalidate() whenever we make a change
var canvasValid = false;

// The node (if any) being selected.
// If in the future we want to select multiple objects, this will get turned into an array
var mySel;

// The selection color and width. Right now we have a red selection with a small width
var mySelColor = '#CC0000';
var mySelWidth = 2;

var textColor = '#000';
var textFont = 'bold 16px Arial';

// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx; // fake canvas context

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

// initialize our canvas, add a ghost canvas, set draw loop
// then add everything we want to intially exist on the canvas
function init(imagePath) {
    canvas = document.getElementById('canvas');
    image = new Image();
    image.src = imagePath;
    image.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        HEIGHT = canvas.height;
        WIDTH = canvas.width;
        ctx = canvas.getContext('2d');
        ghostcanvas = document.createElement('canvas');
        ghostcanvas.height = HEIGHT;
        ghostcanvas.width = WIDTH;
        gctx = ghostcanvas.getContext('2d');
        // make draw() fire every INTERVAL milliseconds
        setInterval(draw, INTERVAL);
        invalidate();
    };

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.onselectstart = function() {
        return false;
    }

    // fixes mouse co-ordinate problems when there's a border or padding
    // see getMouse for more detail
    if (document.defaultView && document.defaultView.getComputedStyle) {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
        stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
        styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }


    // set our events. Up and down are for dragging,
    // double click is for making new motor.zuordnungen()
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;

    // add custom initialization here:
    
}

//wipes the canvas context
function clear(c) {
    c.clearRect(0, 0, WIDTH, HEIGHT);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function draw() {
    if (canvasValid == false) {
        clear(ctx);

        // Add stuff you want drawn in the background all the time here
        if (image != null) {
            ctx.drawImage(image, 0, 0);
        }

        // draw all motor.zuordnungen()
        var l = motor.zuordnungen().length;
        for (var i = 0; i < l; i++) {
            drawshape(ctx, motor.zuordnungen()[i]);
            ctx.font = textFont;
            ctx.fillStyle = textColor;
            ctx.fillText(motor.zuordnungen()[i].baugruppe() + motor.zuordnungen()[i].einzelteil(), motor.zuordnungen()[i].x(), motor.zuordnungen()[i].y()-2);
        }

        // draw selection
        // right now this is just a stroke along the edge of the selected box
        if (motor.selectedZuordnung() != null) {
            ctx.strokeStyle = mySelColor;
            ctx.lineWidth = mySelWidth;
            ctx.strokeRect(motor.selectedZuordnung().x(), 
                           motor.selectedZuordnung().y(), 
                           motor.selectedZuordnung().width(), 
                           motor.selectedZuordnung().height());
        }

        // Add stuff you want drawn on top all the time here


        canvasValid = true;
    }
}

// Draws a single shape to a single context
// draw() will call this with the normal canvas
// myDown will call this with the ghost canvas
function drawshape(context, shape) {
    context.fillStyle = 'rgba(2,165,165,0.7)';

    // We can skip the drawing of elements that have moved off the screen:
    if (shape.x() > WIDTH || shape.y() > HEIGHT)
        return;
    if (shape.x() + shape.width() < 0 || shape.y() + shape.height() < 0)
        return;

    context.fillRect(shape.x(), shape.y(), shape.width(), shape.height());
}

// Happens when the mouse is moving inside the canvas
function myMove(e) {
    if (isDrag) {
        $('#canvas').css({cursor: 'none'});
        getMouse(e);

        mySel.x(mx - offsetx);
        mySel.y(my - offsety);

        // something is changing position so we better invalidate the canvas!
        invalidate();
    }
}

// Happens when the mouse is clicked in the canvas
function myDown(e) {
    getMouse(e);
    clear(gctx);
    var l = motor.zuordnungen().length;
    for (var i = l - 1; i >= 0; i--) {
        // draw shape onto ghost context
        drawshape(gctx, motor.zuordnungen()[i]);
        // get image data at the mouse x,y pixel
        var imageData = gctx.getImageData(mx, my, 1, 1);
        var index = (mx + my * imageData.width) * 4;

        // if the mouse pixel exists, select and break
        if (imageData.data[3] > 0) {
            mySel = motor.zuordnungen()[i];
            offsetx = mx - mySel.x();
            offsety = my - mySel.y();
            mySel.x(mx - offsetx);
            mySel.y(my - offsety);
            motor.selectedZuordnung(mySel);
            isDrag = true;
            canvas.onmousemove = myMove;
            invalidate();
            clear(gctx);
            return;
        }

    }
    // havent returned means we have selected nothing
    mySel = null;
    // clear the ghost canvas for next time
    clear(gctx);
    // invalidate because we might need the selection border to disappear
    invalidate();
}

function myUp() {
    if (isDrag) {
        // TODO push selected box
        var url = 'http://explodedview.scooter-attack.com/insert.php?baugruppe='+mySel.baugruppe()+'&einzelteil='+mySel.einzelteil()+'&motortyp='+mySel.motor()+'&x='+mySel.x()+'&y='+mySel.y()+'&w='+mySel.width()+'&h='+mySel.height();
        $.get(url, function(data){
        });
        $('#canvas').css({cursor: 'default'});
    }
    isDrag = false;
    canvas.onmousemove = null;
}

function invalidate() {
    canvasValid = false;
}

// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about padding and borders
function getMouse(e) {
    var element = canvas, offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element == element.offsetParent));
    }

    // Add padding and border style widths to offset
    offsetX += stylePaddingLeft;
    offsetY += stylePaddingTop;

    offsetX += styleBorderLeft;
    offsetY += styleBorderTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();