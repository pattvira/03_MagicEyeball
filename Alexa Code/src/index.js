/*


    03_Magic_Eyeball
    http://pattvira.com/magic_eyeball
    Built on a template provided by Amazon 


    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";


var https = require('https');
/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * MagicEyeball is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MagicEyeball = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MagicEyeball.prototype = Object.create(AlexaSkill.prototype);
MagicEyeball.prototype.constructor = MagicEyeball;

MagicEyeball.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MagicEyeball onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

// Welcome Message 
MagicEyeball.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

    console.log("MagicEyeball onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Oh hello there. Welcome to the Magic Eyeball. I see the frustions in your eyes. Ask the question you have been dying to know.";
    var repromptText = "I mean it. You know, I'm a pretty magical eyeball.";
    response.ask(speechOutput, repromptText);
    
};

MagicEyeball.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MagicEyeball onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

// List of phrases for three responses 
var yesList = ["Yeah, sure, why not?", "YAAASS", "Yes, but it could end badly.", "My mind is telling me no, but my body, my body's telling me yes.",
                "Oh, hells yeah", "Abso-fuckin-lutely", "Yes. YES! YES! OH GOD YES!", "To quote the great Albert Einstein, Shit yeah, homie.",
                "Most definitely", "Do you believe in miracles? YES", "Obviously", "What do you think?"];

var noList = ["And I was like, Baby, baby, baby, NO.", "It doesn’t look good.", "YOU CAN’T HANDLE THE TRUTH!", "No. No! NO! NO! No.",
               "If you build it, they will come. Wait. What? Oh... ummm... no.", "The answer is no. Please go away and never ask that again.",
               "That is literally the dumbest question. No. Just... no.", "Ha. Hahaha. Hahahahahaha. No chance, my friend.", "You don't even want to know.",
               "Forget about it", "Get a clue", "In your dreams", "Not a chance", "That’s ridiculous", "Yeah right", "You wish", "You’ve got to be kidding", "YOU GET OUT OF HERE WITH THOSE KIND OF QUESTIONS!"];

var maybeList = ["If you believe it, it shall come true. Or not. But maybe.", "Well maybe", "Ask again, but this time in a British accent",
                 "Sorry, I wasn’t paying attention. Try again.", "How DARE you ask me that. You should be ashamed.",
                 "That was a dumb question. Think of a better one and try again.", "Whatever, who cares?"];


MagicEyeball.prototype.intentHandlers = {
    ParticleIntent: function (intent, session, response) {
        var answerSlot = intent.slots.answer;

        var answer = answerSlot ? intent.slots.answer.value : "";

        console.log("Answer = "+answer);

        var speech_response = "";
        var speech = "";
        
        // Insert device id and access token found on the Particle IDE 
        var deviceid = ""; 
        var accessToken = "";
        
        var sparkHst = "api.particle.io";
        
        console.log("Host = " + sparkHst);

        var yesIndex = getRandomInt(0, yesList.length-1);
        var noIndex = getRandomInt(0, noList.length-1);
        var maybeIndex = getRandomInt(0, maybeList.length-1);

        getJsonEventsFrom8BallAPI(function(events){
            var speechText = "";
            if (events.length == 0) {
                speechText = "There is some problem with the API. Please try again later.";
            } else {
                speechText = events.magic.type; 
            }
            
            if (speechText == "Affirmative") { 
                speech_response = "YES";
                speech = yesList[yesIndex];

            } 
            else if (speechText == "Contrary") {
                speech_response = "NO";
                speech = noList[noIndex];
            }
            else if (speechText == "Neutral") {
                speech_response = "MAYBE";
                speech = maybeList[maybeIndex];
            }
            console.log("events.magic.type: "+events.magic.type);
        

            var sparkPath = "/v1/devices/" + deviceid + "/ctrlled";
            
            console.log("Path = " + sparkPath);

            //var args = message + "," + speech_response;
            var args = speech_response;
            
            makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
                var json = JSON.parse(resp);
                
                response.tellWithCard(speech);
            });
            
          
        }); 
    }
};


// Getting response from an API 
function getJsonEventsFrom8BallAPI(eventCallback) {
    var url = 'https://8ball.delegator.com/magic/JSON/hello';

    https.get(url, function(res){
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function() {
            responseObject = JSON.parse(responseString);
            console.log(responseObject);
            eventCallback(responseObject);
        });

    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
    return eventCallback;
} 

// Sending data to Particle Photon 
function makeParticleRequest(hname, urlPath, args, accessToken, callback){
    // Particle API parameters
    var options = {
        hostname: hname,
        port: 443,
        path: urlPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*.*'
        }
    }
    
    var postData = "access_token=" + accessToken + "&" + "args=" + args;
    
    console.log("Post Data: " + postData);
    
    // Call Particle API
    var req = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        
        var body = "";
        
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            
            body += chunk;
        });
        
        res.on('end', function () {
            callback(body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MagicEyeball skill.
    var magicEyeball = new MagicEyeball();
    magicEyeball.execute(event, context);
};
