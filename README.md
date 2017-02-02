## 03_MagicEyeball
[pattvira.com/magic-eyeball](http://pattvira.com/magic-eyeball)

[Video Documentation](https://youtu.be/f2CfsaF9Uho)

### Overview

This project is divided into three parts: 

**Part 1: Building the frame to allow for the movement of the eyes and eyebrow**

First, I cut out the back of the two ping pong balls to make the eyes, and measured the positions of the three servo motors that will allow me to move the eyes left and right and the eyebrows up and down.  Then, I cut foamcore to make the eyebrows and the base structure, and mounted the whole thing on a sheet of plywood. The structure and the number of servo motors used can vary as long as you can move the eyes and the eyebrows. 

**Part 2: Using a photon to control the motors to create different expressions**

I connected two potentiometers to the 3 servos: 2 for the eyes, and 1 for the eyebrows. I played around with the movement of the eyes and eyebrows to create three unique face expressions for the three responses: yes no and maybe. 

**Part 3: Creating an Alexa skill that communicates to the photon**

I created an Alexa skill called Magic Eyeball (*This is not a published skill). 

Here’s how the skill works: 

User: Alexa, ask Magic Eyeball (Yes/No Question) 
The command sends a request to the web API that returns one of the three responses: yes, no, or maybe. 
Once we get the response, Alexa does two things: 
1. Alexa says a random phrase within the list of yes, no or maybe responses that I created
2. Alexa tells photon what the response is, and photon makes a corresponding face expression

Here's how I created the Magic Eyeball Alexa Skill. 

There are three main pages required for installation: 

1. AWS Lambda
2. Amazon Developer Control
3. Particle Web IDE

## 1) AWS Lambda	[(https://aws.amazon.com/console/)](https://aws.amazon.com/console/)

Steps:

1. Sign in to the console
1. Click Services (top left corner) > Compute > Lambda
1. Make sure on the right top corner, the region is set to US East (N. Virginia)
1. Click Create Lambda Function
1. You should now be on Select blueprint on the left tab. Go ahead and click Configure triggers.
1. **Configure triggers:** Click inside the blank square on the left of the Lambda icon. Choose a drop down option Alexa Skills Kit for Lambda. Then, click Next. 
1. **Configure function:** Choose a function name (I usually choose the same as the Invocation name for easy remembering).
1. **Runtime:** Choose Node.js 4.3 
1. **Handler:** Choose index.handler 
1. **Role:** If this is your first time, choose create a custom role. This will redirect you to a new page. IAM Role: choose lambda_basic_execution. Then, click allow at the bottom right corner. 
1. Once made, **Role:** choose Choose an existing role. **Existing role:** choose lambda_basic_execution.
1. Leave the Advanced settings as is. Then, click Next.
1. **Review:** Review, then click Create function. 
1. Once the function is created, click on the Code tab. 
1. Modified the index.js file found in ASK>src folder. 
1. Insert the correct deviceid and accessToken of the Particle Photon unit. (You can find them from the Particle Web IDE). 
1. For Code entry type, choose a drop down option: Upload a .ZIP file. Then, upload the compressed zip file inside src. Compress the AlexaSkill.js and index.js file together. Make sure to be inside the src folder before compressing the files. 
1. Click Save and Test. 
1. Save the ARN key on the top right corner. You will need it for the next step. (Necessary for the Configuration Tab in Amazon Developer).


## 2) Amazon Developer Control	[(https://developer.amazon.com/)](https://developer.amazon.com/)

Steps: 

1. Sign in at the right top corner
1. Click Alexa > Get Started (under Alexa Skills Kit) > Add a New Skill
1. **Skill Information:** Put in the Name and the Invocation Name. This is the keyword that you use to activate the skill. In this case, it's magic eyeball. Then click Next.  
1. **Interaction Model:** Add Custom Slot (Make sure you do this before adding Intent Schema and Sample Utterances). Then, Add Intent Schema and Sample Utterances (Look at the ASK>speechAssets folder for references)
1. **Configuration:** Click AWS Lambda ARN (Amazon Resource Name) and North America. In the link, post the ARN key you get from the AWS Lambda page.  Click Next, then Yes, Apply.  
1. **Test:** You can test the commands without an Amazon Echo by entering commands in the Enter Utterance for testing tab. (Most of the errors happened in the index.js file. If the error stated that it cannot find the endpoint, make sure the Particle's device ID in the index.js file is entered correctly).
1. **Publishing Information + Privacy & Compliance:** I haven't done it yet, but just fill everything out then click Submit for Certification. You need to wait for Amazon to approve the skill, and then it will be ready for the public to use.

**Custom Slot Type**

You might wonder, what are all these random phrases. What I am trying to do here is to create a generic slot by listing out several random phrases with varying lengths. My intent is to trick Alexa to pass whatever question or whatever I say into a QUESTION slot. I am not sure if this is the best way to approach this. If anyone knows of a better idea, I'd love to hear. 

	Type
	QUESTION

	Values       
	yes
	no 
	maybe
	Do I like cheese
	Can he eat spicy food
	Is this a pen
	Are you pink
	Is he really doing that
	Are you serious
	Can I get a cup of tea
	Is the sky blue
	Are you kidding me Alexa
	Is my real name Scala J Jisi 
	The calculator is not working
	What the heck is this
	Can you answer my question please
	The sun is shining in my eyes
	I am quite confused
	Am I going to win this contest
	What is going on with the salmon
	Is the room too cold
	Is it really December

**Intent Schema**

	{ 
	 "intents": [ 
 	  { 
 	    "intent": "ParticleIntent", 
 	    "slots": [ 
     	  { 
      	   "name": "question", 
      	   "type": "QUESTION" 
     	  } 
    	 ] 
  	 } 
 	] 
	} 
    
**Sample Utterances**

	ParticleIntent {question}
    
## 3) Particle Web IDE	[(https://build.particle.io)](https://build.particle.io)
![circuit_diagram.png]({{site.baseurl}}/circuit_diagram.png)


Steps: 

1. Use the Particle iOS app to set up a new device. Follow basic instructions.(https://docs.particle.io/guide/getting-started/intro/photon/). 
1. Note the device ID and access token found on the website to put in the index.js file. 
1. Flash an appropriate sketch.

Creating an Alexa Skill can be a bit challenging at first (at least for me) so I will try to explain with the best of my ability. For extra references, here are very useful links I followed:

[https://github.com/krvarma/Particle_Alexa](https://github.com/krvarma/Particle_Alexa) 

[https://github.com/rlisle/alexaParticleBridge](https://github.com/rlisle/alexaParticleBridge)

**Words of Warning:**

This is my first take on creating an Alexa Skill. I did not publish the skill yet because there is still a little bit of a bug as Alexa sometimes does not recognize the skill or does not hear me say magic eyeball correctly. However, it works most of the time. 
Take a stab at it, and let me know what I can improve!
