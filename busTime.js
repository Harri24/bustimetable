const readlineSync = require('readline-sync');
const _ = require("lodash");

console.log("Find out bus information! ");

let busPostCode= readlineSync.question("Please enter your postcode ");

//let busPostCode = "NW51TL"

let postCode = `http://api.postcodes.io/postcodes/${busPostCode}`;

var request = require('request');


request(postCode, function (error, response, body) {
    var postObj = JSON.parse(body);
    let longitude = postObj.result.longitude;
    let latitude = postObj.result.latitude;
   // console.log(latitude, longitude);

    let postLink = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&app_id=485e1933&app_key=650c4ade6b4c673f2f65c135f6a13636`

    //var request = require('request');

    request(postLink, function (error, response, body) {
        var objLink = JSON.parse(body);
        //console.log(objLink);
        let busStopCode = objLink.stopPoints[0].naptanId;
        //console.log(busStopCode);
        let busLink = `https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?app_id=aa50f639&app_key=24c582c2aeca70cb7dddb23d0af0489d`;

        var request = require('request');
    
        request(busLink, function (error, response, body) {
            var obj = JSON.parse(body);
    
            var orderArray = _.sortBy(obj, ["timeToStation"]);
    
            for (i=0; i < 5; i++){
    
                let busTime = orderArray[i].timeToStation;
                let busNum = orderArray[i].lineId; 
                let busRoute = orderArray[i].towards;
                let busTimeMins = Math.floor(busTime / 60);
    
    
                console.log(busNum + " will arrive at your station in " + busTimeMins + " minutes and it will be heading towards " + busRoute); 
            
            }
           
        });
    });

})