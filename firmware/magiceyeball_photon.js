/*


    03_Magic_Eyeball
    http://pattvira.com/magic_eyeball


*/

// Create servo object using the built-in Particle Servo Library
Servo left;
Servo right;
Servo brow; 

// Eye and Eyebrow Variables
int brow_pin = D0; 
int right_pin = D1;  
int left_pin = D2;  

// Initialize Eye and Eyebrow positions
int eye_pos = 150;
int brow_pos = 165;

int response;

// A function to receive data from Magic Eyeball Alexa Skill. The Skill sends one of the three responses: Yes, No, and Maybe. 
int controlled(String args){
    
    if(-1 == pos){
        return -1;
    }
    
    String strValue = args.substring(0);
    
    // YES 
    if(strValue.equalsIgnoreCase("YES")){
        response = 0;
    }
    // NO
    else if(strValue.equalsIgnoreCase("NO")){
        response = 1;
    }
    // MAYBE
    else if(strValue.equalsIgnoreCase("MAYBE")){
        response = 2;
    }
    
    else{
        return -3;
    }
 
    return 1;
}

void setup() {
    right.attach(right_pin);
    left.attach(left_pin);  
    brow.attach(brow_pin);  
    left.write(eye_pos);
    right.write(eye_pos);
    brow.write(brow_pos);
  
    // Particle Functions
    Spark.function("ctrlled", controlled);
}

void loop() {

    // Controlling Servos for YES Expression 
    if (response == 0) {
        int responseY = 0;
        right.write(120);                  
        left.write(120);
        for (brow_pos = 165; brow_pos >= 120; brow_pos -= 4) 
        {
            brow.write(brow_pos);                  
            delay(15);                      
        }
        for (brow_pos = 120; brow_pos <= 165; brow_pos += 4) 
        { 
            brow.write(brow_pos);                  
            delay(15);                         
        }
        for (brow_pos = 165; brow_pos >= 120; brow_pos -= 4) 
        {
            brow.write(brow_pos);                  
            delay(15);                      
        }
        for (brow_pos = 120; brow_pos <= 165; brow_pos += 4) 
        { 
            brow.write(brow_pos);                  
            delay(15);                         
        }
        for (brow_pos = 165; brow_pos >= 120; brow_pos -= 4) 
        {
            brow.write(brow_pos);                  
            delay(15);                      
        }
        for (brow_pos = 120; brow_pos <= 165; brow_pos += 4) 
        { 
            brow.write(brow_pos);                  
            delay(15);                         
        }
        delay(2000);
        response = 3;
    

    // Controlling Servos for NO Expression     
    } else if (response == 1) {
        int responseN = 0;
        if (responseN < 1) {
            brow.write(130);
            for (eye_pos = 150; eye_pos >= 85; eye_pos -= 1) 
            {
            right.write(eye_pos);                  
            left.write(eye_pos);              
            delay(15);                      
            }
            delay(500);
            for (eye_pos = 85; eye_pos <= 150; eye_pos += 1) 
            { 
            right.write(eye_pos);                
            left.write(eye_pos);              
            delay(15);                       
            }
            delay(500);
            right.write(120);
            left.write(120);
            responseN += 1;
        }
        delay(2000);
        response = 3;
    

    // Controlling Servos for MAYBE Expression     
    } else if (response == 2) {
        brow.write(165);
        right.write(120);
        left.write(120);
        delay(500);
        right.write(85);
        left.write(85);
        delay(700);
        right.write(120);
        left.write(120);
        delay(500);
        right.write(160);
        left.write(160);
        delay(700);
        for (brow_pos = 165; brow_pos >= 130; brow_pos -= 4) 
        {
            brow.write(brow_pos);                  
            delay(15);                      
        }
        delay(2500);
        response = 3;
    } else if (response == 3) {
        brow.write(64);
    }

}