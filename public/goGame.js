(function(exports){

  function GoGame() {
    this.tellName = function() {
      return "Common game";
    }
  }
  exports.game = GoGame;

})(typeof exports === 'undefined'? this['GoGame']={}: exports);
