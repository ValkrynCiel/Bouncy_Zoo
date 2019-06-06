//inspired by Roger van Hout's "Happy Bouncing Balls" @ https://codepen.io/b4rb4tron/full/wjyXNJ


var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var test = document.getElementById('test');

var canvasDiv = document.getElementById('canvas-background'); // adjusting the canvas size to always equal the size of the container div removes distortion
var width = canvasDiv.clientWidth;
var height = canvasDiv.clientHeight; 

canvas.width = width;
canvas.height = height;


var nextRandomColor = null;

var paused = false;
var pauseButton = document.getElementById('pause');

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

var position = {};

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

var counter = -1;       // counter set to -1 so that onclick triggers 0 position of array
var collection = [];    // array to keep all the circle objects

function createCircle(){
    var newCircle = defineCircleObj();
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


function defineCircleObj(){ // this creates information for movement, position, size, and behavior of circle.

    let dyVal = (Math.random() * 4) - 2
    let dxVal = Math.round((Math.random() - 0.5) * 10)
    let velVal = Math.random() /5
    
    var circle = {
        color: nextRandomColor,
        radius: /*(Math.random()*30) + 10,*/ adjustedRad,
        x: position.x,
        y: position.y,
        dy: dyVal, // this will add movement on Y axis
        dx: dxVal, // add movement on X axis
        velocity: velVal// this will create a smooth bouncing effect when added to dy (dy += velocity = gain in momentum) and -dy (-dy += velocity = loss in momentum)
    
        // original_vel: velVal
    };
        

        circle.update = function(){ // this function will be called when the collection array is iterated through and will use the information provided by the object
        context.fillStyle = circle.color;
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
        context.fill();
    }
        
    adjustXnYToFit(circle);
    
    return circle;
}

function adjustXnYToFit(circle){
    
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
            circle.velocity = 0; // '' '' left of screen
        }
    } 
}

canvas.addEventListener('mousedown', randomColor);

function randomColor(){

    var r;// random colors
    var g;
    var b;
    var a = Math.ceil(Math.random() * 5); // random opacity that tends towards more opaque

    //140 HTML/CSS named colors as objects with RGB keys sorted by color profile 
    var whites = [{name:'white', r:255, g:255, b:255}, {name:'snow', r:255, g:250, b:250}, {name:'honeydew', r:240, g:255, b:240}, {name:'mintcream', r:245, g:255, b:250}, {name:'azure', r:240, g:255, b:255}, {name:'aliceblue', r:240, g:248, b:255}, {name:'ghostwhite', r:248, g:248, b:255}, {name:'whitesmoke', r:245, g:245, b:245}, {name:'seashell', r:255, g:245, b:238}, {name:'beige', r:245, g:245, b:220}, {name:'oldlace',r:253, g:245, b:230}, {name:'floralwhite', r:255, g:250, b:240}, {name:'ivory', r:255, g:255, b:240}, {name:'antiquewhite',	r:250, g:235, b:215}, {name:'linen',r:250, g:240, b:230}];

    var grays = [{name:'gainsboro',r:220, g:220, b:220}, {name:'lightgray', r:211, g:211, b:211}, {name:'silver', r:192, g:192, b:192}, {name:'darkgray',r:169, g:169, b:169}, {name: 'gray', r:128, g:128, b:128}, {name:'dimgray',r:105, g:105, b:105}, {name:'lightslategray', r:119, g:136, b:153}, {name:'slategray', r:112, g:128, b:144}, {name:'darkslategray',r:47, g:79, b:79}, {name: 'black', r:0, g:0, b:0}];

    var reds = [{name: 'indianred', r:205, g:92, b:92}, {name: 'lightcoral', r:240, g:128, b:128}, {name: 'salmon', r:250, g:128, b:114}, {name: 'darksalmon', r:233, g:150, b:122}, {name: 'lightsalmon', r:255, g:160, b:122}, {name: 'crimson', r:220, g:20, b:60}, {name: 'red', r:255, g:0, b:0}, {name: 'firebrick', r:178, g:34, b:34}, {name: 'darkred', r:139, g:0, b:0}];

    var pinks = [{name: 'pink', r:255, g:192, b:203}, {name: 'lightpink', r:255, g:182, b:193}, {name: 'hotpink', r:255, g:105, b:180}, {name: 'deeppink', r:255, g:20, b:147}, {name: 'mediumvioletred', r:199, g:21, b:133}, {name: 'palevioletred', r:219, g:112, b:147}, {name:'peachpuff', r:255, g:218, b:185}, {name: 'plum',r:221, g:160, b:221}, {name:'violet', r:238, g:130, b:238},{name: 'magenta', r:255, g:0, b:255}, {name:'lavenderblush', r:255, g:240, b:245}, {name:'mistyrose', r:255, g:228, b:225}];

    var oranges = [{name: 'lightsalmon', r:255, g:160, b:122}, {name: 'coral', r:255, g:127, b:80}, {name: 'tomato', r:255, g:99, b:71}, {name: 'orangered', r:255, g:69, b:0}, {name: 'darkorange', r:255, g:140, b:0}, {name: 'orange', r:255, g:165, b:0}, {name: 'papayawhip', r:255, g:239, b:213}, {name: 'moccasin', r:255, g:228, b:181}];

    var yellows = [{name: 'gold', r:255, g:215, b:0}, {name: 'yellow', r:255, g:255, b:0}, {name: 'lightyellow', r:255, g:255, b:224}, {name: 'lemonchiffon', r:255, g:250, b:205}, {name: 'lightgoldenrodyellow', r:250, g:250, b:210},  {name: 'palegoldenrod', r:238, g:232, b:170}, {name: 'khaki', r:240, g:230, b:140}, {name: 'cornsilk', r:255, g:248, b:220}]

    var greens = [{name: 'olive', r:128, g:128, b:0}, {name: 'greenyellow', r:173, g:255, b:47}, {name: 'chartreuse', r:127, g:255, b:0}, {name: 'lawngreen', r:124, g:252, b:0}, {name: 'lime', r:0, g:255, b:0}, {name: 'limegreen', r:50, g:205, b:50}, {name: 'palegreen', r:152, g:251, b:152}, {name: 'lightgreen',r:144, g:238, b:144}, {name: 'mediumspringgreen', r:0, g:250, b:154}, {name: 'springgreen', r:0, g:255, b:127}, {name: 'mediumseagreen', r:60, g:179, b:113}, {name: 'seagreen', r:46, g:139, b:87}, {name: 'forestgreen', r:34, g:139, b:34}, {name:'green', r:0, g:128, b:0}, {name: 'darkgreen', r:0, g:128, b:0}, {name: 'yellowgreen', r:154, g:205, b:50}, {name: 'olivedrab', r:107, g:142, b:35}, {name: 'darkolivegreen', r:85, g:107, b:47}, {name: 'mediumaquamarine', r:102, g:205, b:170}, {name: 'darkseagreen', r:143, g:188, b:139}, {name: 'lightseagreen', r:32, g:178, b:170}, {name: 'darkcyan', r:0, g:139, b:139}, {name: 'teal', r:0, g:128, b:128}, {name: 'aquamarine', r:127, g:255, b:212}]

    var blues = [{name: 'aqua', r:0, g:255, b:255}, {name:'cyan', r:0, g:255, b:255}, {name: 'lightcyan', r:224, g:255, b:255}, {name: 'turquoise', r:64, g:224, b:208}, {name: 'mediumturquoise', r:72, g:209, b:204}, {name: 'darkturquoise', r:0, g:206, b:209}, {name:'cadetblue', r:95, g:158, b:160}, {name: 'steelblue', r:70, g:130, b:180}, {name: 'lightsteelblue', r:176, g:196, b:222}, {name: 'powderblue', r:176, g:224, b:230}, {name:'lightblue', r:173, g:216, b:230}, {name:'skyblue', r:135, g:206, b:235}, {name:'lightskyblue', r:135, g:206, b:250}, {name:'deepskyblue', r:0, g:191, b:255}, {name: 'dodgerblue', r:30, g:144, b:255}, {name: 'cornflowerblue', r:100, g:149, b:237}, {name: 'mediumslateblue', r:123, g:104, b:238}, {name:'royalblue',r:65, g:105, b:225}, {name:'blue', r:0, g:0, b:255}, {name: 'mediumblue', r:0, g:0, b:205}, {name: 'darkblue', r:0, g:0, b:139}, {name: 'navy', r:0, g:0, b:128}, {name:'midnight', r:25, g:25, b:112}, {name: 'slateblue', r:106, g:90, b:205}, {name:'darkslateblue',r:72, g:61, b:139}]

    var purples = [{name: 'lavender', r:230, g:230, b:250}, {name: 'thistle', r:216, g:191, b:216},  {name:'orchid', r:218, g:112, b:214}, {name: 'mediumorchid',r:186, g:85, b:211}, {name: 'mediumpurple', r:147, g:112, b:219}, {name:'rebeccapurple', r:102, g:51, b:153}, {name:'blueviolet',r:138, g:43, b:226}, {name: 'darkviolet', r:148, g:0, b:211}, {name:'darkorchid', r:153, g:50, b:204}, {name:'darkmagenta', r:139, g:0, b:139}, {name:'purple', r:128, g:0, b:128}, {name: 'indigo', r:75, g:0, b:130}]

    var browns = [{name: 'blanchedalmond', r:255, g:235, b:205}, {name: 'bisque', r:255, g:228, b:196}, {name: 'navajowhite', r:255, g:222, b:173}, {name: 'wheat', r:245, g:222, b:179}, {name: 'burlywood', r:222, g:184, b:135}, {name: 'tan', r:210, g:180, b:140}, {name:'rosybrown', r:188, g:143, b:143}, {name:'sandybrown', r:244, g:164, b:96}, {name: 'goldenrod', r:218, g:165, b:32}, {name: 'darkgoldenrod', r:184, g:134, b:11}, {name: 'peru', r:205, g:133, b:63}, {name: 'chocolate', r:210, g:105, b:30}, {name:'saddlebrown', r:139, g:69, b:19}, {name:'sienna', r:160, g:82, b:45}, {name:'brown', r:165, g:42, b:42}, {name:'maroon', r:128, b:0, g:0}, {name: 'darkkhaki', r:189, g:183, b:107}]

    var colorArr = [whites, grays, reds, pinks, oranges, yellows, greens, blues, purples, browns];

    var colorChoice = document.querySelectorAll('[name = "color"]');

    for (i=0; i<colorChoice.length; i++){
    if (colorChoice[i].checked){

        if (colorChoice[i].value != 'random'){

        thisColor = colorArr[+colorChoice[i].value]
        thisHue = Math.floor(Math.random()*thisColor.length)

            r = thisColor[thisHue].r
            g = thisColor[thisHue].g
            b = thisColor[thisHue].b
        } else {
            r = Math.floor(Math.random() * 256); // random colors
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
        }

        break;
    }
}
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

var timeIsSlowed = false;

var slowDownButton = document.getElementById('slowDown')

slowDownButton.addEventListener('click', toggleSlow)

function toggleSlow(){
    timeIsSlowed = !timeIsSlowed
}

function animate() { 

    if (canvas.width !== canvasDiv.clientWidth || canvas.height != canvasDiv.clientHeight) { // this resets canvas height/width if window is resized
        
        width = canvasDiv.clientWidth;
        height = canvasDiv.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
        requestAnimationFrame(animate);

        context.clearRect(0, 0, width, height);

    for (let i = 0; i < collection.length; i++) {
            collection[i].update();

        if (timeIsSlowed === true){
            
            
            var intervalID = window.setInterval(() => {
        
            for (let i=0; i < collection.length; i++){
                collection[i].dy_gradient = collection[i].dy /500
                collection[i].dx_gradient = collection[i].dx /500
                collection[i].vel_gradient = collection[i].velocity /500

                collection[i].dy -= collection[i].dy_gradient
                collection[i].dx -= collection[i].dx_gradient
                collection[i].velocity -= collection[i].vel_gradient

                
            }
            if (Math.abs(collection[0].dx) < Math.abs(collection[0].original_dx/10)) {
                window.clearInterval(intervalID);
            }  
            }, 300);

        }
        
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

    if (mouseIsDown === true){
        growCircleOnDownClick();
        }
}
animate();

function growCircleOnDownClick() {

    context.fillStyle = nextRandomColor;
        context.beginPath();
        context.arc(position.x, position.y, adjustedRad, 0, 2*Math.PI);
        context.fill();
}


var mouseIsDown = false;
var adjustedRad = 10;

canvas.addEventListener('mousedown', adjustRadius);

function adjustRadius(){
    mouseIsDown = true;
    var intervalID = window.setInterval(function () {

            if (adjustedRad < 250){
            adjustedRad += 0.5
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
