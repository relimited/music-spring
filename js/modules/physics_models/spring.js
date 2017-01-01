//Springs!
//Model only applies spring forces to the first object provided in the param list

//writen to work with P5
var Spring = function(moverA, moverB) {
  this.startObj = moverA;
  this.endObj = moverB;
  this.k = 0.1;
  this.b = 0.97;
  this.force = undefined;
  this.damper = undefined;
};

Spring.prototype = {
  update: function(){
    this.force = p5.Vector.mult(p5.Vector.sub(this.startObj.pos, this.endObj.pos), -this.k);
    this.damper = p5.Vector.mult(p5.Vector.sub(this.startObj.v, this.endObj.v), -this.b);

    if(!this.startObj.dragged && !this.endObj.dragged){
      this.startObj.applyForce(p5.Vector.add(this.force, this.damper));
    }
  },

  display: function(){
    stroke(0);
    line(this.startObj.pos.x, this.startObj.pos.y, this.endObj.pos.x, this.endObj.pos.y);
  },

  debugDraw: function(){
    if(this.force.mag() > 1){
      stroke('lime');
    }else{
      stroke('red');
    }

    line(this.startObj.pos.x, this.startObj.pos.y, this.startObj.pos.x + this.force.x, this.startObj.pos.y + this.force.y);
  },

  calculateMaxForce: function(minPos, maxPos){
      //calculate the maximum amount of force that this spring can exert
      //we first need to have some contraints on the spring's position, these are provided
      //by an external source
      var maxForce = p5.Vector.mult(p5.Vector.sub(minPos, maxPos), -this.k);
      return maxForce;
  }
};
