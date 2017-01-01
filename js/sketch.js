//Gonna try this from the processing side, which is probably what I should have done at the start?

var forces = [];
var objects = [];
var synths = [];

var ball, anchor;
var spring;
var harmony;

function setup(){
  //env setup
  frameRate(60);
  createCanvas(640, 480);

  //create physics / graphics
  anchor = new Mover(createVector(width / 2, height / 2));
  ball = new Mover(createVector(0, 0));
  ball.draggable = true;

  objects.push(anchor);
  objects.push(ball);

  spring = new Spring(ball, anchor);
  forces.push(spring);

  //calculate some max potential forces on the spring based on movement constraints
  //TODO probably also calcualte min forces too?
  var maxForce = spring.calculateMaxForce(anchor.pos, createVector(width, height));

  //create audio
  harmony = new Harmony(0, maxForce.mag(), spring);
}

function draw(){
  clear();
  //do background stuff
  background(51);
  harmony.display(anchor.pos.dist(createVector(width, height))); //draw the harmony tension rings

  //fill(color('blue'));
  //ellipse(width / 2, height / 2, width / 2.5, width / 2.5);

  forces.forEach(function(force){
    force.update();
    force.display();
  });

  objects.forEach(function(object){
    object.update();
    object.display();
    object.checkEdges();
  });

  harmony.update();

 forces.forEach(function(force){
   force.debugDraw();
 });
}

//------------------- MOUSE UI ----------------------
function mousePressed(){
  objects.forEach(function(object, i){
    object.checkMouse();
  });
}

function mouseReleased(){
  objects.forEach(function(object){
    object.dragged = false;
  });
}

function mouseDragged(){
  objects.forEach(function(object, i){
    if(object.dragged){
      object.pos.set(createVector(mouseX, mouseY));
    }
  });
}

//--------------- Button UI -----------------------
function keyPressed(){
  if(keyCode === 16){ //shift key
    harmony.flipVolume();
  }
}
