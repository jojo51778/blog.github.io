// 执行模板字符串
let func = (name) => `Hello ${name}!`;
func('Jack') // "Hello Jack!"

console.log`123` // ["123", raw: Array[1]]

String.fromCharCode(0x20BB7)
String.fromCodePoint(0x20BB7)
String.raw`Hi\u000A!`;