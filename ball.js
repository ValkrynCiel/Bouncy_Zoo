//setting context to 2d every time I draw something
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var test = document.getElementById('test');

var canvasDiv = document.getElementById('canvas-background'); // adjusting the canvas size to always equal the size of the container div removes distortion
var width = canvasDiv.clientWidth;
var height = canvasDiv.clientHeight; 

canvas.width = width;
canvas.height = height;


//with each click, a new circle is drawn
canvas.addEventListener('mousemove', getMousePosition);
canvas.addEventListener('click', createCircle);


function getMousePosition(){// this should return an OBJECT with the x and y coords of mouse relative to canvas
    var canvasBoundary = canvas.getBoundingClientRect(); 

    test.innerText = `
    ${Math.floor(event.clientX - canvasBoundary.left)} 
    ${Math.floor(event.clientY - canvasBoundary.top)}
    `
    return {
        x: Math.floor(event.clientX - canvasBoundary.left),
        y: Math.floor(event.clientY - canvasBoundary.top)
    };
}

var counter = -1;       // counter set to -1 so that onclick even triggers 0 position of array
var collection = [];    // array to keep all the circle objects created
function createCircle(){
    var newCircle = circle();

    collection.push(newCircle)
    if (collection.length < 25){
    counter++;
    collection[counter].update();
    } else {
        collection.shift();
        collection[counter].update();
    }
}


function circle(){ // this creates information for movement, position, size, and behavior of circle.

    var position = getMousePosition();
    var circle = {
        color: randomColor(),
        radius: (Math.random()*30) + 10,
        x: position.x,
        y: position.y,
        dy:(Math.random() * 4) - 2, // this will add movement on Y axis
        dx:Math.round((Math.random() - 0.5) * 10), // add movement on X axis
        velocity:Math.random() /5 // this will create a smooth bouncing effect when added to dy (dy += velocity = gain in momentum) and -dy (-dy += velocity = loss in momentum)
    };
    circle.update = function(){ // this function will be called when the collection array is iterated through and will use the information provided by the object
        context.fillStyle = circle.color;
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
        context.fill();
    }
    if (circle.y + circle.radius > height){
        circle.y = height - circle.radius - 1;
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
        }
    } else if (circle.y - circle.radius <= 0){
        circle.y = circle.radius + 1;
        if (circle.dy < 0){
            circle.dy = circle.dy;
        }
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

    console.log(circle)
    return circle;
}

function randomColor(){
    var r = Math.round(Math.random() * 250); // random colors
    var g = Math.round(Math.random() * 250);
    var b = Math.round(Math.random() * 250);
    var a = Math.ceil(Math.random() * 5); // random opacity that tends towards more opaque
    
    return `rgba(${r},${g},${b},${(a/10)+ 0.4})`

}

function animate() {    
    if (canvas.width !== canvasDiv.clientWidth || canvas.height != canvasDiv.clientHeight) { // this makes it so that 
        
        width = canvasDiv.clientWidth;
        height = canvasDiv.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    requestAnimationFrame(animate);

    context.clearRect(0, 0, width, height);
    for (var i = 0; i < collection.length; i++) {
        collection[i].update();
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
animate();

var mouseIsDown = false;
var adjustedRad = 0;

canvas.addEventListener('mousedown', function(){
    mouseIsDown = true;
});

canvas.addEventListener('mouseup', function(){
    mouseIsDown = false;
});

