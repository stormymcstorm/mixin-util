# mixin-util
A mixin utility for ES2015 Classes

## Basic usage
The function accepts the names of mixins or mixin fnctions
```javascript
const mixinUtil = require('mixin-util');

class MyCoolClass extends mixinUtil('settings', 'middleware') {
  constructor() {
    // nothing will work if super is not called
    super();
  }
}

let mcc = new MyCoolClass();

mcc.set('test', 'works');

// log -> works
console.log(mcc.get('test'));
```

## Mixins

### Middleware
this mixin adds middleware functionality similar to that of express.

#### .use
This method will add functions to the middleware stack. Any arrays passed will be flattened. For eaxmple,
```javascript
.use(function () {}, [function () {}, function () {}]);
```
... is the same as...
```javascript
.use(function () {}, function () {}, function () {});
```
Error handling middleware ware should accept and error, the expected arguments, and then next. To forward and error to the error handler simply pass it to the next function or throw the error.

#### .handle
This method will exacute the middleware stack. It accepts the arguments to be passed to the middle functions.

Example:
```javascript
const mixinUtil = require('mixinUtil');

class MyMiddleware extends mixinUtil('middleware') {
  constructor() {
    super();
  }
}

let middle = new MyMiddleware();

middle.use(function (err, icecream, next) {
  // called because of bacon
  // log -> eww bacon icecream
  console.log(err);
});

middle.use(function (icecream, next) {
  icecream.add('cherry');
  next();
});

middle.use(function (icecream, next) {
  icecream.add('bacon');
  next();
});

middle.use(function (icecream, next) {
  if(icecream.is('bacon'))
  next(new Error("eww bacon icecream"));

  // next can only be called once so this is ok
  next();
});

// call stack
middle.handle(icecream);
```

### Settings
This mixin adds setting functionality. For Each of these methods the instance methods applies to the instance and the static method applies to the prototype.

#### .set
This method accepts the name of the setting and the new value

```javascript
.set('test', 'works')
```

#### .get
This method accepts the name of the setting and returns the value of that setting

```javascript
.get('test')
// returns 'works'
```

#### .Setter
This method will assign a setter to a setting. The setter function should accept a value and return the transformed value.

```javascript
.Setter('name', function uppercase(name) {
  return name.toUpperCase();
});
```

#### .Getter
This method will assign a getter to a setting. You can think of a getter as a imaginary setting. The getter function should accept a object containing all of the settings.

```javascript
// Settings -> {
//   name: {
//     first: 'john',
//     last: 'doe',
//   }
// }

.Getter('name.full', function fullname(settings) {
  return `${settings.name.first} ${settings.name.last}`;
});
```

## Mixin Pattern

```javascript
function myMixin(parentClass) {
  // private variables
  let _private = Symbol("private");

  class MyMixin extends parentClass{
    constructor() {
      super();
      this[_private] = "hi";
    }
  }

  return MyMixin
}
```

## License
[MIT](./LICENSE)
