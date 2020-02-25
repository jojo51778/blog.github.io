var regex = new RegExp('xyz', 'i')
// 等价于
var regex = /xyz/i;

var regex = new RegExp(/xyz/i)

var regex = new RegExp(/xyz/, 'i');
// Uncaught TypeError: Cannot supply flags when constructing one RegExp from another

new RegExp(/abc/ig, 'i').flags
// "i"
