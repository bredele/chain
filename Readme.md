# Chain

Simple lazy chaining API.
  

## Installation

    $ component install leafs/chain

## API

```js
    var bucket = [],
        scope = {
          melanie  : '21',
          lindsey : '24',
        }

      Chain()
        .use(function(next, data){
          next(data + ' is' + this[data] + '!');
        }, scope)
        .use(function(next, data){
          next(data + '! Wouqw!');
        })
        .from(['melanie', 'lindsey',])
        .bucket(bucket)
        .done(function(){
          console.log(bucket);
        });
```


### Chain#use(event, listener, [scope])

  Register a callback handler  in an optional scope.

### Chain#bucket(bucket)

  Push chain result in a bucket array.

### Chain#done([callback], [scope])

  Lazy evaluation.
  Execute an optional callback.

## License

  MIT
