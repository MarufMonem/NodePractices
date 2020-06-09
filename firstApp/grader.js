var scores = [90,98,89,100,100,86,94];
var scores2 = [40,65,77,82,80,54,73,63,95,49];

function average(val){
    let sum=0;
    for (let index = 0; index < val.length; index++) {
        sum = sum + val[index];
    }
    console.log("avergae is " + Math.round(sum/val.length));
}

average(scores);
average(scores2);