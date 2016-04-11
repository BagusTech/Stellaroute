// field - what to sort by
// reverse - bool eaxmple: a-z or z-a
// primer - augmenting the result
// primer - example if primer was  function(a){return a.toUpperCase()})
// primar - then asia => Asia
var sortBy = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}

module.exports = sortBy;