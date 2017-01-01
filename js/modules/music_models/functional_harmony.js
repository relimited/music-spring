// model of fuctional harmony built over our chord, key and note absractions
define(["chord", "scale"], function(Chord, Scale){
  var functHarmonyModel = function(){
    //a model of functional harmony.  Defines tension values for chords built
    //on perticular degrees

    this.chordTensions = {
      "I" : 0,
      "vi" : 20,
      "IV" : 40,
      "ii": 60,
      "vii°": 80,
      "V" : 100
    };

    this.movementDics = {
      "positiveTension" : {
        "I" : ["ii", "IV", "V", "vi", "vii°"],
        "ii" : ["vii°", "V"],
        "IV" : ["ii", "vii°", "V"],
        "V" : [],
        "vi" : ["IV", "ii", "vii°", "V"],
        "vii°" : ["V"]
      },

      "negativeTension" : {
        "I" : [],
        "ii" : ["vi"], //this isn't actually true, but we need to get OUT of ii, ii-vi-I is a little weird, but works
        "IV" : ['I'], //not technically in funct harmony, but it's a plagal cadance, so fight me
        "V" : ['IV', 'V', 'I'],
        "vi" : ['I'],
        "vii°": ['I']
      }
    };

    this.functionalLabels = {
      "I" : "T",
      "vi" : "T",
      "IV" : "S",
      "ii": "S",
      "vii°": "D",
      "V" : "D"
    };

    this.curDegree = "I"; //start the model at the root
    this.curTension = 0;

    //some other tension constants, we might need to move stuff into different
    //domains
    this.minTension = 0;
    this.maxTension = 100;
  };

  functHarmonyModel.prototype = {
    /**
     * Increase the tension in the model by a particular amount
     * @param  {Number} incAmount amount to increase the tension in the model by
     * @return {String}           current chord the model is on, via label
     */
    increaseTension : function(incAmount){
      var pastTension = this.curTension;
      this.curTension += incAmount;

      //FIXME probably should replace this with a linear scaling metric, but MEH.
      if(curTension > this.maxTension){
        //ceiling!
        this.curTension = this.maxTension;
      }

      //ok, now we need to move chords.  THIS IS THE HARD BIT.
      //find the nearest chord that is less than the current tension level
      var nearestChord = "I"; //roots got the lowest amount of tension
      for(var chord in this.chordTensions){
        if(this.chordTensions.hasOwnProperty(chord)){
          if(this.chordTensions[chord] > this.curTension && this.curTension >= this.chordTensions[nearestChord]){
            nearestChord = chord;
          }
        }
      }

      this.curDegree = nearestChord;
      return this.curDegree;
    },

    /**
     * decrease the tension in the model by a particular amount
     * @param  {Number} decAmount amount to decrease the tension in the model by
     * @return {String}           current degree the model is on, via label
     */
    decreaseTension: function(decAmount){
      var pastTension = this.curTension;
      this.curTension -= incAmount;

      //FIXME probably should replace this with a linear scaling metric, but MEH.
      if(curTension < this.minTension){
        //floor!
        this.curTension = this.minTension;
      }

      //ok, now we need to move chords.  THIS IS THE HARD BIT.
      //find the nearest chord that is greater than the current tension level
      var nearestChord = "V"; //dominant got the lowest amount of tension (because, right now, seventh chords don't exist)
      for(var chord in this.chordTensions){
        if(this.chordTensions.hasOwnProperty(chord)){
          if(this.chordTensions[chord] < this.curTension && this.curTension <= this.chordTensions[nearestChord]){
            nearestChord = chord;
          }
        }
      }

      this.curDegree = nearestChord;
      return this.curDegree;
    },

    resolveTensionLevel: function(tension){
      throw "Not Implemented";
    },

    getTensionFromChord: function(label){
      throw "Not Implemented";
    }
  };

  return functHarmonyModel;
});
