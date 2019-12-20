
function* sum() {
    var x = 0;
    x += (yield '1st' + x)
    x += (yield '2st' + x)
    x += (yield '3st' + x)
    x += (yield '4st' + x)
}

var it = sum()

it.next('unused') // 由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。
it.next(1) // 第一个表达式 为x+=1
it.next(20) // 第二个表达式 为x+=20
it.next(300) // 第三个表达式为 x=+300