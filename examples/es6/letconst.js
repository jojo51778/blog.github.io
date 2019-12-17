// 暂时性死区,只要变量在还没有声明完成前使用，就会报错
// var tmp = '123'
// if (true) {
//     // TDZ开始
//     tmp = 'abc' // ReferenceError
//     console.log(tmp) // ReferenceError

//     let tmp //TDZ结束
// }

// typeof x
// let x

// function bar(x = y, y = 2) {
//     return [x, y]
//   }
  
// bar() // 报错

// 块级作用域
var tmp = new Date();

// 变量提升
function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }
}

f(); // undefined
// let为js新增了块级作用域
function f1() {
	let n = 5;
	if (true) {
			let n = 10;
	}
	console.log(n); // 5
}