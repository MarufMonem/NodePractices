var faker = require("faker");

var array =[];
console.log(faker.commerce.product());

for (let index = 0; index < 10; index++) {
    let item = {
        name:faker.commerce.product(),
        price:faker.commerce.price()
    }
    array.push(item);
    
}
console.log("Welcome to the inventory");

for (let index = 0; index < array.length; index++) {
    console.log("Product: "  + array[index].name + ", Price: " + array[index].price);
    
}