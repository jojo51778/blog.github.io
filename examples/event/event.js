class EventEmeitter {
  constructor() {
    this._events = this._events || new Map(); //存储事件
    this._maxListeners = this._maxListeners || 10; // 监听上限
  }
}

EventEmeitter.prototype.emit = function(type, ...args) {
  let handler = this._events.get(type);
  if (Array.isArray(handler)) {
    handler.map(fn => {
      if (args.length > 0) {
        fn.apply(this, args);
      } else {
        fn.call(this);
      }
    }) 
  } else {
    if (args.length > 0) {
      handler.apply(this, args);
    } else {
      handler.call(this);
    }
  }
  
  return true;
}

EventEmeitter.prototype.addListener = function(type, fn) {
  // 将事件在_events存储
  const handler = this._events.get(type);
  if (!handler) {
    this._events.set(type, fn);
  } else if (handler && typeof handler === 'function') {
    this._events.set(type, [handler, fn]); // 用数组存起来
  } else {
    handler.push(fn); //超过两个直接存
  }
}

const emitter = new EventEmeitter()
// 只会触发一个
emitter.addListener('dio', man => {
  console.log(`dio and ${man}`)
})

emitter.addListener('dio', man => {
  console.log(`dio ${man}`)
})

emitter.emit('dio', 'jojo')

