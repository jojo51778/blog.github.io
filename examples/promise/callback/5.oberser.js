// 观察者模式，被观察者状态发送变化时，通知所有得观察者
class Subject { //被观察者
  constructor(name) {
    this.name = name
    this.state = '开心'
    this.observers = []
  }
  attach(o) {
    this.observers.push(o)
  }
  setState(state) {
    this.state = state
    this.observers.forEach(o => {
      o.update(this)
    })
  }
}
class Observer { //观察者
  constructor(name) {
    this.name = name
  }
  update(s) { //被观察者状态发生变化时调用这个方法
    console.log(this.name + ':' + s.name +'当前的状态是：'+ s.state)
  }
}

let baby = new Subject('小宝宝')
let parent = new Observer('爸爸')
baby.attach(parent)
baby.setState('不开心')
baby.setState('开心')