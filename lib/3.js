async function s(){
	await new Promise(function(resolve){
		setTimeout(function(){
			console.log(1);
			resolve();
		},4000);
	});
	console.log(3);
	await new Promise(function(resolve){
		setTimeout(function(){
			console.log(4);
			resolve();
		},1000);
	});
	console.log(5);
}
s();
console.log(2);
