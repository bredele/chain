var is = require('is');
var each = require('each');

/**
 * Expose 'Chain'
 */

module.exports = function(data, bool){
  //it could be cool to mixin data and create a chain from this data
  return new Chain(data, bool);
};


/**
 * Initialize a new Chain
 * @param {Object} data Object to filter
 * @param {Boolean} each true, iterate through each attribute of the object
 */

function Chain(data, bool) {
  this.stack = [];
  this.iterate = true;

  this.from(data, is.defined(bool) ? bool : this.iterate);

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
  this.iterate = is.truthy(is.defined(bool) ? bool : this.iterate);
  this.data = data || [];
  return this;
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

  var value = (function next(data, int) {
    // var severity = is.type('number', int) || 0;

    // if(data instanceof Error) {
    //   if(severity > 0) {
    //     //execute filter but do something
    //   } else {
    //     return data;
    //   }
    // }

    var handler = self.stack[index++];
    if(handler) {
      handler[0].call(handler[1], next, data);
    }
    return data;
    
  })(item);

  return value;
};


/**
 * Add chaining bucket.
 * 
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
  var data = null;
  if(this.iterate) {
    //may be refactor each, don't like the that
    var that = this;
    each(this.data, function(item, i){
      data = that.handle(item);
    });
  } else {
    data = this.handle(this.data);
  }
  console.log('done data=', data);
  if(typeof callback === 'function') callback.call(scope, data);

};

/**
 * Execute callback when error(s) occured
 * 
 * @return {Chain} Chain
 * @api public
 */

Chain.prototype.error = function(fn, scope) {

};
