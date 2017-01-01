//generic object in space with a mass
//
//If overriding the display function, also override the checkMouse function
var Mover = function(pos){
  this.pos = pos === undefined ? createVector(0, 0) : pos;
  this.v = createVector(0, 0);
  this.a = createVector(0, 0);

  this.m = 10;

  this.draggable = false;
  this.dragged = false;
};

Mover.prototype = {
  applyForce : function(force){
    this.a.add(p5.Vector.div(force, this.m));
  },

  update : function() {
    if(this.dragged){
      return;
    }

    this.v.add(this.a);
    this.pos.add(this.v);
    this.a.mult(0);
  },

  checkEdges : function(){
    if (this.pos.x > width) {
      this.v.x *= -1;
      this.pos.x = width;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x *= -1;
    }

    if (this.pos.y > height) {
      this.v.y *= -1;
      this.pos.y = height;
    }
  },

  display: function(){
    stroke(0);
    fill(175);
    ellipse(this.pos.x,this.pos.y, 24, 24);
  },

  debugDraw: function(){
    stroke(255);
    point(this.pos.x, this.pos.y);
  },

  checkMouse: function(){
    if(this.draggable){
      //draggable flag must be set for us to do this calculation
      var mouseDistX = (this.pos.x) - mouseX;
      var mouseDistY = (this.pos.y) - mouseY;
      if(Math.sqrt(Math.pow(mouseDistX, 2) + Math.pow(mouseDistY, 2)) < 24 / 2){
        this.dragged = true;
        return;
      }
    }
    this.dragged = false;
  }
};
