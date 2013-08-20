var truthy = require('truthy');
var each = require('each');

/**
 * Expose 'Chain'
 */

module.exports = function(data){
  //it could be cool to mixin data and create a chain from this data
  return new Chain(data);
};


/**
 * Initialize a new Chain
 */

function Chain(data) {
  this.stack = [];
  //should work with somne kind of sequence
  this.from(data);
  this.iterate = true;
}


/**
 * Add chaining sequence
 * @param {Object} data Object to filter
 * @param {Boolean} each true, iterate through each attribute of the object
 * 
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.from = function(data, bool) {
  this.iterate = truthy(bool) || this.iterate;
  this.data = data || [];
  return this;
};


Chain.prototype.before = function() {
  //work on the data not the item
};


Chain.prototype.after = function() {
  //work on the data not the item
};


/**
 * Add chaining filter
 * 
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.use = function(fn, scope) {
  this.stack.push([fn, scope]);
  return this;
};


/**
 * Execute filter callback filter
 * 
 * @return {Chain} Chain
 * @api private
 */

Chain.prototype.handle = function(item) {
  var index = 0,
      self = this;

  (function next(data, severity) {
    var handler = self.stack[index++];
    if(handler) {
      handler[0].call(handler[1], next, data);
    }

  })(item);
  return this;
};


/**
 * Add chaining bucket
 * 
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.bucket = function(buffer) {
  this.use(function(next, data){
    buffer.push(data);
    next(data);
  });
  return this;
};


/**
 * Lazy evaluation.
 *
 * @param {Function} fn optional callback function
 * @param {Object} optional callback scope
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.done = function(callback, scope) {

  if(this.iterate) {
    //may be refactor each, don't like the that
    var that = this;
    each(this.data, function(item, i){
      that.handle(item);
    });
  } else {
    this.handle(this.data);
  }

  if(typeof callback === 'function') callback.call(scope);

};

/**
 * Execute callback when error(s) occured
 * 
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.error = function(fn, scope) {

};
