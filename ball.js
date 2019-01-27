//setting context to 2d every time I draw something
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var test = document.getElementById('test');

var canvasDiv = document.getElementById('canvas-background'); // adjusting the canvas size to always equal the size of the container div removes distortion
var width = canvasDiv.clientWidth;
var height = canvasDiv.clientHeight; 

canvas.width = width;
canvas.height = height;

var position = {}; // 
var nextRandomColor = null;


//with each click, a new circle is drawn
canvas.addEventListener('mousemove', getMousePosition);
canvas.addEventListener('mouseup', createCircle);
canvas.addEventListener('mouseleave', createCircle);


function getMousePosition(){// this should return an OBJECT with the x and y coords of mouse relative to canvas
    var canvasBoundary = canvas.getBoundingClientRect(); 

    test.innerText = `
    ${Math.floor(event.clientX - canvasBoundary.left)} 
    ${Math.floor(event.clientY - canvasBoundary.top)}
    `
    position = {
        x: Math.floor(event.clientX - canvasBoundary.left),
        y: Math.floor(event.clientY - canvasBoundary.top)
    };
}

var counter = -1;       // counter set to -1 so that onclick even triggers 0 position of array
var collection = [];    // array to keep all the circle objects created
function createCircle(){
    var newCircle = circle();
        if (adjustedRad > 10){
        collection.push(newCircle)
        if (collection.length < 25){
        counter++;
        collection[counter].update();
        } else {
            collection.shift();
            collection[counter].update();
        }
    }
}


function circle(){ // this creates information for movement, position, size, and behavior of circle.

    
    var circle = {
        color: nextRandomColor,
        radius: /*(Math.random()*30) + 10,*/ adjustedRad,
        x: position.x,
        y: position.y,
        dy:(Math.random() * 4) - 2, // this will add movement on Y axis
        dx:Math.round((Math.random() - 0.5) * 10), // add movement on X axis
        velocity:Math.random() /5, // this will create a smooth bouncing effect when added to dy (dy += velocity = gain in momentum) and -dy (-dy += velocity = loss in momentum)
    };
        // if (!circle.hasOwnProperty('original_dy')){
        //     circle.original_dy = circle.dy;
        //     circle.original_dx = circle.dy;
        //     circle.original_vel = circle.velocity;
        // }
        // circle.dy_gradient = circle.original_dy/5; // need these to slow down time later in gradualSlow()
        // circle.dx_gradient = circle.original_dx/5;
        // circle.vel_gradient = circle.original_vel/5;
    
        circle.update = function(){ // this function will be called when the collection array is iterated through and will use the information provided by the object
        context.fillStyle = circle.color;
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
        context.fill();
    }
        
    fitInTheBox(circle);
    
    console.log(circle)
    return circle;
}

function fitInTheBox(circle){
    
    // DEALING WITH EDGE CASES. clicking on the edge moves the X and Y axes out from the edge so the balls won't get stuck. deals with corners too.
    if (circle.y + circle.radius > height){
        circle.y = height - circle.radius - 1;
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
        }
    } else if (circle.y - circle.radius <= 0){
        circle.y = circle.radius + 10;
        
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
        } 
    } else {
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
        }
    } 
}

canvas.addEventListener('mousedown', randomColor);

function randomColor(){

    var r = Math.round(Math.random() * 250); // random colors
    var g = Math.round(Math.random() * 250);
    var b = Math.round(Math.random() * 250);
    var a = Math.ceil(Math.random() * 5); // random opacity that tends towards more opaque
    
    
    nextRandomColor = `rgba(${r},${g},${b},${(a/10)+ 0.4})`

}

var paused = false;

var pauseButton = document.getElementById('slowdown');

pauseButton.addEventListener('click', function (){
    // setIntervalX(gradualSlow, 200, 5) 
    paused = !paused;
});


// function setIntervalX(callback, delay, repetitions) { //Stack Overflow: this allows for setting of intervals for X amount of times before quitting
//     var x = 0;
//     var intervalID = window.setInterval(function () {

//        callback();

//        if (++x === repetitions) {
//            window.clearInterval(intervalID);
//        }
//     }, delay);
// }

// function gradualSlow(){
//     for (i=0; i < collection.length; i++){
//         collection[i].dy -= collection[i].dy_gradient
//         collection[i].dx -= collection[i].dx_gradient
//         collection[i].velocity -= collection[i].vel_gradient
//     }
// }


function animate() { 
        
    

    if (canvas.width !== canvasDiv.clientWidth || canvas.height != canvasDiv.clientHeight) { // this makes it so that 
        
        width = canvasDiv.clientWidth;
        height = canvasDiv.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

        requestAnimationFrame(animate);
        context.clearRect(0, 0, width, height);

        if (mouseIsDown === true){
        context.fillStyle = nextRandomColor;
        context.beginPath();
        context.arc(position.x, position.y, adjustedRad, 0, 2*Math.PI);
        context.fill();
        }

    for (var i = 0; i < collection.length; i++) {
        collection[i].update();
            if (paused === false){
                collection[i].y += collection[i].dy;
                collection[i].x += collection[i].dx;
            if (collection[i].x + collection[i].radius > width || collection[i].x - collection[i].radius <= 0){
                collection[i].dx = -collection[i].dx;
                }
            if (collection[i].y + collection[i].radius >= height || collection[i].y - collection[i].radius <=0){
                collection[i].dy = -collection[i].dy;
            } else {
                collection[i].dy += collection[i].velocity;
            }
        
        }
    }
}
animate();
var mouseIsDown = false;
var adjustedRad = 10;

canvas.addEventListener('mousedown', adjustRadius);

function adjustRadius(){
    mouseIsDown = true;
    var intervalID = window.setInterval(function () {

            if (adjustedRad < 250){
            adjustedRad += 0.3
            }
            if (mouseIsDown === false) {
                window.clearInterval(intervalID);
                console.log(adjustedRad);
                
                }
        }, 4);
    
};

canvas.addEventListener('mouseup', mouseIsNotDown)
canvas.addEventListener('mouseleave', mouseIsNotDown)

function mouseIsNotDown(){
    mouseIsDown = false;
    setTimeout(function(){
        adjustedRad = 10
    }, 10);
};


