const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

function handleFangDou(){ 
  console.log("不要抖",new Date());
}

var handleFangDou = debounce(handleFangDou, 500);

var oInput = document.querySelector("#input"); // 获取input元素
oInput.addEventListener('keyup',handleFangDou);
