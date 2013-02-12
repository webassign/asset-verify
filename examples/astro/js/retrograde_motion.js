/**
 * @author Argosy Publishing, 2012
 */
External = {}; 
External.CAA = {};
External.CAA.canvas = null;
External.CAA.context = null;
External.CAA.bufferCanvas = null;
External.CAA.bufferContext = null;
External.CAA.animationInterval = "";
External.CAA.animationMS = 60;

External.CAA.initEngine = function(canvasID)
{
    External.CAA.canvas = document.getElementById(canvasID);
    External.CAA.context = External.CAA.canvas.getContext("2d");
    External.CAA.bufferCanvas = document.createElement("canvas");
    External.CAA.bufferContext = External.CAA.bufferCanvas.getContext("2d");

    External.CAA.bufferContext.canvas.width = External.CAA.context.canvas.width;
    External.CAA.bufferContext.canvas.height = External.CAA.context.canvas.height;
};

External.CAA.animate = function()
{
    External.CAA.update();
    External.CAA.draw();
};

External.CAA.startAnimation = function()
{
    if (External.CAA.animationInterval === "")
    {
        External.CAA.animationInterval = setInterval(External.CAA.animate, External.CAA.animationMS);
    }
};

External.CAA.stopAnimation = function()
{
    if (External.CAA.animationInterval !== "")
    {
        clearInterval(External.CAA.animationInterval);
        External.CAA.animationInterval = "";
    }
};

// Retrograde Motion code
External.CAA.backgroundImage = null;                             
External.CAA.earthImage = null;
External.CAA.earthImageSize = 18;
External.CAA.marsImage = null;
External.CAA.marsImageSize = 12;
External.CAA.apparentMarsImage = null;
External.CAA.apparentMarsImageSize = 12;
External.CAA.areAllImagesLoaded = false;
External.CAA.sun = { x:239, y:646 };                             // position of sun
External.CAA.marsRadius = 151;                                   // radius of mars's orbit
External.CAA.earthRadius = 104;                                  // radius of earth's orbit
External.CAA.earthDegrees = 0;                                   // current position of earth, in degrees from the sun
External.CAA.marsPositions = { start:-46, end:-134 };            // starting and ending positions of mars, in degrees from the sun
External.CAA.marsDegrees = External.CAA.marsPositions.start;              // current position of mars, in degrees from the sun
External.CAA.cycleAnimationInterval = "";
External.CAA.cycleAnimationExternalitMS = 500;
External.CAA.yPositions =   [
69, 69, 68, 68, 68, 68, 68, 68, 68, 69,
69, 70, 70, 71, 71, 72, 74, 75, 76, 78, 
80, 81, 84, 86, 88, 90, 92, 94, 97, 99,
100, 101, 102, 104, 105, 107, 107, 108, 109, 110,
110, 110, 110, 109, 108, 108, 107, 106, 106, 106,
107, 107, 108, 109, 109, 110, 112, 113, 114, 116,
124, 129, 130, 132, 133, 134, 135, 135, 135, 136,
137, 137, 137, 137, 137, 137, 137, 137, 137, 136,
136, 136, 135, 134, 134, 133, 133, 132, 131, 130,
130
];

External.CAA.init = function(canvasID) 
{
    // load one image after another until all images are loaded.
    External.CAA.backgroundImage = new Image();
    External.CAA.backgroundImage.onload = function()
    {
        External.CAA.earthImage = new Image();
        External.CAA.earthImage.onload = function()
        {
            External.CAA.marsImage = new Image();
            External.CAA.marsImage.onload = function()
            {
                External.CAA.apparentMarsImage = new Image();
                External.CAA.apparentMarsImage.onload = function()
                {
                    External.CAA.areAllImagesLoaded = true;
                    External.CAA.draw();
                };
                External.CAA.apparentMarsImage.src = "img/apparentMars.png";
            };
            External.CAA.marsImage.src = "img/mars.png";    
        };
        External.CAA.earthImage.src = "img/earth.png";
    };
    External.CAA.backgroundImage.src = "img/background.png";
    External.CAA.initEngine(canvasID);
};

External.CAA.update = function() 
{
    External.CAA.earthDegrees = External.CAA.earthDegrees - 2;
    
    var stepsSoFar = Math.abs(External.CAA.earthDegrees) / 2;
    var stepSize = (Math.abs(External.CAA.marsPositions.end) - Math.abs(External.CAA.marsPositions.start)) / 90;
    External.CAA.marsDegrees = External.CAA.marsPositions.start- (stepsSoFar * stepSize);
    
    if (External.CAA.earthDegrees <= -180)
    {
        External.CAA.stopAnimation();
        External.CAA.cycleAnimationInterval = setInterval(External.CAA.cycleAnimationStepOne, External.CAA.cycleAnimationExternalitMS);
    }
};

External.CAA.cycleAnimationStepOne = function()
{
    clearInterval(External.CAA.cycleAnimationInterval);
    External.CAA.cycleAnimationInterval = setInterval(External.CAA.cycleAnimationStepTwo, External.CAA.cycleAnimationExternalitMS);
    External.CAA.earthDegrees = 0;
    External.CAA.marsDegrees = External.CAA.marsPositions.start;
    External.CAA.draw();
};

External.CAA.cycleAnimationStepTwo = function()
{
    clearInterval(External.CAA.cycleAnimationInterval);
    External.CAA.startAnimation();
};

External.CAA.getAngle = function(x, y, radians, h) 
{
    return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) };
};

External.CAA.draw = function()
{
    if (External.CAA.areAllImagesLoaded)
    {
        External.CAA.context.save();
    
        var ctx = External.CAA.bufferContext;
    
        // draw the background image
        ctx.drawImage(External.CAA.backgroundImage, 0, 0);

        // calculate the positions of earth and mars
        var earthRadians = (Math.PI / 180) * External.CAA.earthDegrees;  
        var earthPoint = External.CAA.getAngle(External.CAA.sun.x, External.CAA.sun.y, earthRadians, External.CAA.earthRadius);
        
        var marsRadians = (Math.PI / 180) * External.CAA.marsDegrees;    
        var marsPoint = External.CAA.getAngle(External.CAA.sun.x, External.CAA.sun.y, marsRadians, External.CAA.marsRadius);

        // draw a white line from earth through mars to the y location of the ribbon at the top of the screen
        var stepsSoFar = Math.abs(External.CAA.earthDegrees) / 2;
        var topY = External.CAA.yPositions[stepsSoFar];
        var slope = (marsPoint.y - earthPoint.y) / (marsPoint.x - earthPoint.x);    // slope of the line from earth to mars
        var topX = ((topY - earthPoint.y) / slope) + earthPoint.x;                  // x coordinate of line at y=0
        
//      ctx.save();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(earthPoint.x, earthPoint.y);
        ctx.lineTo(topX, topY);
        ctx.stroke();
//      ctx.restore();
                        
        // draw earth along its orbital radius, rotated appropriately   
        ctx.save();
        ctx.translate(earthPoint.x, earthPoint.y);
        ctx.rotate(earthRadians);
        ctx.translate(-earthPoint.x, -earthPoint.y);
        ctx.drawImage(External.CAA.earthImage, earthPoint.x - (External.CAA.earthImageSize / 2), earthPoint.y - (External.CAA.earthImageSize / 2));
        ctx.restore();
        
        // draw mars along its orbital radius, rotated appropriately
        ctx.save();
        ctx.translate(marsPoint.x, marsPoint.y);
        ctx.rotate(marsRadians);
        ctx.translate(-marsPoint.x, -marsPoint.y);
        ctx.drawImage(External.CAA.marsImage, marsPoint.x - (External.CAA.marsImageSize / 2), marsPoint.y - (External.CAA.marsImageSize / 2));
        ctx.restore();
        
        // draw the apparent mars along the ribbon at the top of the screen
        ctx.drawImage(External.CAA.apparentMarsImage, topX - (External.CAA.apparentMarsImageSize / 2), topY - (External.CAA.apparentMarsImageSize / 2));
        
        // copy the entire rendered image from the buffer canvas to the visible one
        External.CAA.context.drawImage(External.CAA.bufferCanvas, 0, 0, External.CAA.bufferCanvas.width, External.CAA.bufferCanvas.height);
        External.CAA.context.restore();
    }
};

window.onload = function (evt) {
//    alert("hi");
    External.CAA.init('mainCanvas');
};