//Functional Harmony Abstraction!

var Harmony = function(min, max, forceRef){
  this.forceRef = forceRef; //harmony is controlled by a force in the system!

  this.pastForce = undefined;

  this.synths = [];
  for(var i = 0; i < 3; i++){
    this.synths.push(new p5.Oscillator());
    this.synths[i].setType('sine');
    this.synths[i].amp(0);
  }

  this.minTensionRange = min;
  this.maxTensionRange = max;
  println(this.minTensionRange, this.maxTensionRange);
  this.degree = "I";
  this.tolerance = 1;
  this.sounding = false;

  this.chordFreqMap = {
    "I" : [261.63, 329.63, 392.00],
    "ii" : [293.66, 349.23, 440.00],
    "IV" : [349.23, 440.00, 523.25 / 2],
    "V": [392.00, 493.88, 293.66], //cheating a bit by making this a V_6
    "vi": [261.63, 329.63, 440.00],
    "vii°" :[493.88, 293.66, 349.23] //vii°_6
  };

  this.chordTensionMap = {
    "V" : 90,
    "vii°": 70,
    "ii": 60,
    "IV" : 40,
    "vi" : 30,
    "I" : 0

  };

  this.chordColorMap = {
    "V" : color(191, 0 ,28),
    "vii°": color(198, 0, 82),
    "ii": color(206, 0, 142),
    "IV": color(213, 0, 205),
    "vi": color(170, 0, 221),
    "I": color(113, 0, 229)
  };

  this.chordMovementMap = {
    "incTension" : {
      "I" : ["ii", "IV", "V", "vi", "vii°"],
      "ii" : ["vii°", "V"],
      "IV" : ["ii", "vii°", "V"],
      "V" : [],
      "vi" : ["IV", "ii", "vii°", "V"],
      "vii°" : ["V"]
    },

    "decTension" : {
      "I" : [],
      "ii" : ["vi"], //this isn't actually true, but we need to get OUT of ii, ii-vi-I is a little weird, but works
      "IV" : ['I'],  //not technically in funct harmony, but it's a plagal cadance, so fight me
      "V" : ['IV', 'V', 'I'],
      "vi" : ['I'],
      "vii°": ['I']
    }
  };

  //initialize each synth to the 1 chord
  var self = this;
  this.synths.forEach(function(synth, i){
    var freq = self.chordFreqMap[self.degree][i];
    synth.freq(freq);
    synth.start();
  });
};

Harmony.prototype = {
  setDegree: function(degree){
    this.degree = degree;
    this.updateOsc();
  },

  update: function(){
    var curForce = this.forceRef.force.mag();
    if(curForce < this.tolerance){
      return;
    }
    //FIXME: make sure this work
    var curTension = map(curForce, this.minTensionRange,
      this.maxTensionRange, 0, 100);
    curTension = constrain(curTension, 0, 100);

    //get a direction on tension
    var tensionDir = this.pastTension - curTension;
    if(tensionDir < 0){
      //increasing tension.  Use upper limits.
      //get the nearest chord
      this.degree = this.getNearestLowerDegree(curTension);
    }else if(tensionDir > 0){
      //console.log(curTension);
      //decreasing tension.  Use lower limits;
      this.degree = this.getNearestUpperDegree(curTension);
      console.log(this.degree);
    }

    this.updateOsc();
    this.pastTension = curTension;
    //console.log("Chord: ", this.degree);
  },

  getNearestUpperDegree: function(curTension){
    //this is hard.  we can't go to every tension value.
    //get a list of acceptable chords:
    //console.log("Starting at chord:", this.degree);
    var highestDegree = "I";
    for(var chordTension in this.chordTensionMap){
      if(this.chordTensionMap.hasOwnProperty(chordTension)){
        var value = this.chordTensionMap[chordTension];
        if(value < curTension){
          //console.log("vs", curTension, value);
          if(value >= this.chordTensionMap[highestDegree]){
            if(this.chordMovementMap.decTension[this.degree].indexOf(chordTension) > -1 || this.degree == chordTension){
              highestDegree = chordTension;
            }
          }
        }
      }
    }

    return highestDegree;

    /**
    var degreeList = this.chordMovementMap.decTension[this.degree];
    console.log(degreeList);
    var highestDegree = this.degree;
    var self = this;

    degreeList.forEach(function(newDegree, i){
      var tension = self.chordTensionMap[newDegree];
      if(tension < curTension){
        //console.log("Comp:", self.degree);
        //console.log("Against: ", newDegree);
        if(tension >= self.chordTensionMap[highestDegree]){
          highestDegree = newDegree;
        }
      }
    });

    //console.log("Decreasing To Chord:", highestDegree);
    return highestDegree;
    */
  },

  getNearestLowerDegree: function(curTension){
    //This one's easy!  chords can always move to more tense states,
    //so move to the most tense one!
    var lowestDegree = "V";
    for(var chordTension in this.chordTensionMap){
      if(this.chordTensionMap.hasOwnProperty(chordTension)){
        var value = this.chordTensionMap[chordTension];
        if(value > curTension){
          //console.log("vs", curTension, value);
          if(value <= this.chordTensionMap[lowestDegree]){
            lowestDegree = chordTension;
          }
        }
      }
    }
    return lowestDegree;
  },

  updateOsc : function(){
    //TODO add crossfading to do smooth chordal transisions.  Right now, we're gonna make it jaring
    var newFreq = this.chordFreqMap[this.degree];
    this.synths.forEach(function(synth, i){
      synth.freq(newFreq[i]);
    });
  },

  flipVolume: function(){
      this.sounding = !this.sounding;
      if(!this.sounding){
        this.synths.forEach(function(synth){
          synth.amp(0, 0.2);
        });
      }else if(this.sounding){
        this.synths.forEach(function(synth){
          synth.amp(0.2, 0.2);
        });
      }
  },

  display : function(maxDist){
    var colorIdx = 0;

    for(var chord in this.chordTensionMap){
      if(this.chordTensionMap.hasOwnProperty(chord)){
        var tension = this.chordTensionMap[chord];
        var radius = map(tension, 0, 100, 0, maxDist);
        stroke(0);
        fill(this.chordColorMap[chord]);
        ellipse(this.forceRef.endObj.pos.x, this.forceRef.endObj.pos.y,
          radius * 2, radius * 2);
      }
    }
  },

  debugDraw : function(){

  }
};
