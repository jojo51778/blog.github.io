const throttle = (fn, delay = 500) => {
  // 当前时间间隔内是否有方法执行,设置一个开关标识
  let flag = false;
  return (...args) => {
    // 判断当前是否有方法执行,有则什么都不做,若为true,则跳出
    if (flag) return;
    flag = true;
    // 添加定时器,在到达时间间隔时重置锁的状态
    setTimeout(() => {
      fn.apply(this, args);
      // 执行完毕后,声明当前没有正在执行的方法,方便下一个时间调用
      flag = false;
    }, delay);
  };
};

function handleJieLiu1(){
  console.log("节流方式1", new Date());
}   

 var handleJieLiu1 = throttle(handleJieLiu1, 500);
 document.addEventListener('mousewheel', handleJieLiu1);