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

var paused = false;
var pauseButton = document.getElementById('slowdown');

pauseButton.addEventListener('click', function (){
    // setIntervalX(gradualSlow, 200, 5) 
    paused = !paused;
});

var clearButton = document.getElementById('clear');

clearButton.addEventListener('click', function(){
    collection = [];
})


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
        circle.y = circle.radius + 1;
        
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
        } 
    } else {
        if (circle.radius + circle.x > width){
            circle.x = width - circle.radius -1;
            circle.velocity = 0; // this creates floating effect when circles are made at right of screen
        } else if (circle.x - circle.radius <= 0){
            circle.x = 1 + circle.radius;
            circle.velocity = 0; // left of screen
        }
    } 
}

canvas.addEventListener('mousedown', randomColor);

function randomColor(){

    var r = Math.round(Math.random() * 250); // random colors
    var g = Math.round(Math.random() * 250);
    var b = Math.round(Math.random() * 250);
    var a = Math.ceil(Math.random() * 5); // random opacity that tends towards more opaque

    //literally 140 HTML/CSS named colors as objects with RGB keys sorted by color profile

    var gray = [{name: '#2C3539', r:44, g:53, b:57}, {name: '#A8B6BC', r:168, g:182, b:188}, {name: '#25383C', r:37, g:56, b:60}, {name: '#6D6968', r:109, g:105, b:104}, {name:'#CDCBCA', r:205, g:203, b:202}, {name: '#E5E4E2', r:229, g:228, b:226}, {name:'#98AFC7', r:152, g:175, b:199}, {name: '#DDE5ED', r:221, g:229, b:237}, {name:'#DCDCDC', r:47, g:79, b:79}, {name: '#C0C0C0', r:192, g:192, b:192}];

    var red = [{name: 'indianred', r:205, g:92, b:92}, {name: 'lightcoral', r:240, g:128, b:128}, {name: 'salmon', r:250, g:128, b:114}, {name: 'darksalmon', r:233, g:150, b:122}, {name: 'lightsalmon', r:255, g:160, b:122}, {name: 'crimson', r:220, g:20, b:60}, {name: 'red', r:255, g:0, b:0}, {name: 'firebrick', r:178, g:34, b:34}, {name: 'darkred', r:139, g:0, b:0}];

    var pink = [{name: 'pink', r:255, g:192, b:203}, {name: 'lightpink', r:255, g:182, b:193}, {name: 'hotpink', r:255, g:105, b:180}, {name: 'deeppink', r:255, g:20, b:147}, {name: 'mediumvioletred', r:199, g:21, b:133}, {name: 'palevioletred', r:219, g:112, b:147}, {name:'peachpuff', r:255, g:218, b:185}];

    var orange = [{name: 'lightsalmon', r:255, g:160, b:122}, {name: 'coral', r:255, g:127, b:80}, {name: 'tomato', r:255, g:99, b:71}, {name: 'orangered', r:255, g:69, b:0}, {name: 'darkorange', r:255, g:140, b:0}, {name: orange, r:255, g:165, b:0}, {name: 'papayawhip', r:255, g:239, b:213}, {name: 'moccasin', r:255, g:228, b:181}];

    var yellow = [{name: 'gold', r:255, g:215, b:0}, {name: 'yellow', r:255, g:255, b:0}, {name: 'lightyellow', r:255, g:255, b:224}, {name: 'lemonchiffon', r:255, g:250, b:205}, {name: 'lightgoldenrodyellow', r:250, g:250, b:210},  {name: 'palegoldenrod', r:238, g:232, b:170}, {name: 'khaki', r:240, g:230, b:140}, {name: 'cornsilk', r:255, g:248, b:220}]

    var green = [{name: 'olive', r:128, g:128, b:0}, {name: 'greenyellow', r:173, g:255, b:47}, {name: 'chartreuse', r:127, g:255, b:0}, {name: 'lawngreen', r:124, g:252, b:0}, {name: 'lime', r:0, g:255, b:0}, {name: 'limegreen', r:50, g:205, b:50}, {name: 'palegreen', r:152, g:251, b:152}, {name: 'lightgreen',r:144, g:238, b:144}, {name: 'mediumspringgreen', r:0, g:250, b:154}, {name: 'springgreen', r:0, g:255, b:127}, {name: 'mediumseagreen', r:60, g:179, b:113}, {name: 'seagreen', r:46, g:139, b:87}, {name: 'forestgreen', r:34, g:139, b:34}, {name:'green', r:0, g:128, b:0}, {name: 'darkgreen', r:0, g:128, b:0}, {name: 'yellowgreen', r:154, g:205, b:50}, {name: 'olivedrab', r:107, g:142, b:35}, {name: 'darkolivegreen', r:85, g:107, b:47}, {name: 'mediumaquamarine', r:102, g:205, b:170}, {name: 'darkseagreen', r:143, g:188, b:139}, {name: 'lightseagreen', r:32, g:178, b:170}, {name: 'darkcyan', r:0, g:139, b:139}, {name: 'teal', r:0, g:128, b:128}, {name: 'aquamarine', r:127, g:255, b:212}]

    var blue = [{name: 'aqua', r:0, g:255, b:255}, {name:'cyan', r:0, g:255, b:255}, {name: 'lightcyan', r:224, g:255, b:255}, {name: 'turquoise', r:64, g:224, b:208}, {name: 'mediumturquoise', r:72, g:209, b:204}, {name: 'darkturquoise', r:0, g:206, b:209}, {name:'cadetblue', r:95, g:158, b:160}, {name: 'steelblue', r:70, g:130, b:180}, {name: 'lightsteelblue', r:176, g:196, b:222}, {name: 'powderblue', r:176, g:224, b:230}, {name:'lightblue', r:173, g:216, b:230}, {name:'skyblue', r:135, g:206, b:235}, {name:'lightskyblue', r:135, g:206, b:250}, {name:'deepskyblue', r:0, g:191, b:255}, {name: 'dodgerblue', r:30, g:144, b:255}, {name: 'cornflowerblue', r:100, g:149, b:237}, {name: 'mediumslateblue', r:123, g:104, b:238}, {name:'royalblue',r:65, g:105, b:225}, {name:'blue', r:0, g:0, b:255}, {name: 'mediumblue', r:0, g:0, b:205}, {name: 'darkblue', r:0, g:0, b:139}, {name: 'navy', r:0, g:0, b:128}, {name:'midnight', r:25, g:25, b:112}]

    var purple = [{name: 'lavender', }]
    var brown = [{name: 'blanchedalmond', r:255, g:235, b:205}, {name: 'bisque', r:255, g:228, b:196}, {name: 'navajowhite', r:255, g:222, b:173}, {name: 'wheat', r:245, g:222, b:179}, {name: 'burlywood', r:222, g:184, b:135}, {name: 'tan', r:210, g:180, b:140}, {name:'rosybrown', r:188, g:143, b:143}, {name:'sandybrown', r:244, g:164, b:96}, {name: 'goldenrod', r:218, g:165, b:32}, {name: 'darkgoldenrod', r:184, g:134, b:11}, {name: 'peru', r:205, g:133, b:63}, {name: 'chocolate', r:210, g:105, b:30}, {name:'saddlebrown', r:139, g:69, b:19}, {name:'sienna', r:160, g:82, b:45}, {name:'brown', r:165, g:42, b:42}, {name:'maroon', r:128, b:0, g:0}, {name: 'darkkhaki', r:189, g:183, b:107}]
    thisOne = Math.floor(Math.random()*blue.length)
    r = blue[thisOne].r
    g = blue[thisOne].g
    b = blue[thisOne].b
    nextRandomColor = `rgba(${r},${g},${b},${(a/10)+ 0.4})`

}


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


