

const {
	SyncHook,			/*同步串行 不关心监听函数的返回值*/
	SyncBailHook,       /*同步串行 只要监听函数中有一个函数的返回值不为 null，则跳过剩下所有的逻辑*/
	SyncWaterfallHook,	/*同步串行 上一个监听函数的返回值可以传给下一个监听函数 如果不返回，或者返回undefined，则透传上一个返回值*/
	SyncLoopHook,		/*同步循环 当监听函数被触发的时候，如果该监听函数返回true时则这个监听函数会反复执行，如果返回 undefined 则表示退出循环*/
	AsyncParallelHook,  /*异步并发 不关心监听函数的返回值*/
	AsyncParallelBailHook, /*异步并发 只要监听函数的返回值不为 null，就会忽略后面的监听函数执行，直接跳跃到callAsync等触发函数绑定的回调函数，然后执行这个被绑定的回调函数*/
	AsyncSeriesHook,	/*异步串行 不关心callback()的参数*/
	AsyncSeriesBailHook, /*异步串行 callback()的参数不为null，就会直接执行callAsync等触发函数绑定的回调函数*/
	AsyncSeriesWaterfallHook /*AsyncSeriesWaterfallHook 上一个监听函数的中的callback(err, data)的第二个参数,可以作为下一个监听函数的参数*/
} = require("../index.js");


/*SyncHook*/
let queue = new SyncHook(['name']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。
// 订阅
queue.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
	console.log(name, name2, 1);
	return '1'
});
queue.tap('2', function (name) {
	console.log(name, 2);
});
queue.tap('3', function (name) {
	console.log(name, 3);
});

// 发布
queue.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数


/*SyncBailHook*/
queue = new SyncBailHook(['name']);

queue.tap('1', function (name) {
	console.log(name, 1);
});
queue.tap('2', function (name) {
	console.log(name, 2);
	return 'wrong'
});
queue.tap('3', function (name) {
	console.log(name, 3);
});

queue.call('webpack');


/*SyncWaterfallHook*/
queue = new SyncWaterfallHook(['name2']);

// 上一个函数的返回值可以传给下一个函数
queue.tap('1', function (name) {
	console.log(name, 1);
	return 1;
});
queue.tap('2', function (data) {
	console.log(data, 2);
	return 2;
});
queue.tap('3', function (data) {
	console.log(data, 3);
});

queue.call('webpack');


let queue2 = new AsyncParallelBailHook(['name']);
console.time('cost1');
queue2.tapAsync('1', function (name, cb) {
	setTimeout(() => {
		console.log(name, 1);
		cb();
	}, 1000);
});
queue2.tapAsync('2', function (name, cb) {
	setTimeout(() => {
		console.log(name, 2);
		cb();
		return "wrong";// 最后的回调就不会调用了
	}, 2000);
});
queue2.tapAsync('3', function (name, cb) {
	setTimeout(() => {
		console.log(name, 3);
		cb();
	}, 3000);
});

queue2.callAsync('webpack', () => {
	console.log('over');
	console.timeEnd('cost1');
});
