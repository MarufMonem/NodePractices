var request = require("request");
request('https://jsonplaceholder.typicode.com/users/1',function(error,response,body){
    //error handles the error 
    if(error){
        console.log("Something went wring: " + error);
    }
    else if(response.statusCode == 200){
        //recieved successfully
        var parsedData = JSON.parse(body);
        console.log("Company Name is: " );
        console.log(parsedData["company"]["name"]);
        console.log(parsedData.name + " Lives In " + parsedData.address.city);

    }
});

// //Also we have another way of doing it (ES6 version)
// //request as of now is depreicated instead we have request promise
// //to install it we need to do the following

// //npm i -S request-promise
// const rp = require("request-promise");
// rp('https://jsonplaceholder.typicode.com/users/1')
// .then((body)=> { //these are called promises this part is basically the response
//     const parsedData = JSON.parse(body); 
//     console.log(parsedData.name + " Lives In " + parsedData.address.city);
// })
// .catch((err)=> {
//     console.log("Error ", err );
// });