// regex object

let regex = new RegExp('name?') // no forward slash

// work on regex or string:

// search  string.search(reg) 
// i case incensitive
console.log('my name is anas'.search(/8/)) // doesn't skip
console.log('my Name is anas'.search(regex)) 
console.log('my name is anas'.indexOf('a',12)) // skips indexof


//match  string.match(regex)
console.log("hello is this DD105 is it not DD205".match(/DD\d{3}/g))


// matchAll string.match(regex) must use global
console.log(Array.from("hello is this DDDD105 is it not DD205".matchAll(/(DD)\1(\d{3})/g)))

// replace string.replace(rgex,str) can use g or not
console.log("hello is this DD105 is it not DD205".replace(/DD\d{3}/,"Dev"))

// capture group
console.log("hello is this DD105 is it not DD205".replace(/(DD)(\d{3})/g,"$1-1-$2"))


// replace string.replaceAll(regex,str)  must use g
console.log("hello is this DD105 is it not DD205".replaceAll(/DD\d{3}/g,"Dev"))


//split string.split(regex)
console.log("Hello   my name is Anas DD-105 Anas/mahfoud".split(/[ -/]+/))


// work only in regex

// test regex.test()
console.log(/DD\d{3}/.test("hello is this DDDD105 is it not DD205")) //the same 
console.log(/DD\d{3}/g.test("hello is this DDDD105 is it not DD205"))
console.log(/^Anas-\d{2}$/.test("Anas-20"))


// exec
console.log(/(?<group>DD\d{3})/g.exec("hello is this DDDD105 is it not DD205")) //  
console.log(/(?<group>DD)(?<digits>\d{3})/.exec("hello is this DDDD105 is it not DD205"))


// lookahead
// \d{3}(?=hello)
// \d{3}(?!hello)


// look behind
// (?<!hello)\d{3}
// (?<=hello)\d{3}

// conditional
//doesn't work in js
// (\d+)(?(?=\d{3})-\d{2}|\.\d{2})

// not capture group
//(?: name|day)

// atomic groups
//\b(?>integer|insert|in)\b.

//recursive patterns
// Recursive patterns 