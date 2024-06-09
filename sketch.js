var gmChrX, gmChrY, flrPosY;
var lives = 5; // Global variable for lives
var islft, isrght, isfllng, isplmtng, isjmpg;
var collectable; // Collectable item object
var canyon; // Canyon object
var trees_x; // Array of tree positions
var clouds; // Array of cloud objects
var mountains; // Array of mountain objects
var cameraPosX; // Camera position X
var isFound = false; //variable to determinate if the collectable item is found
let cloudOffset = 1;
const START_CAM = 0; //costant for camera
var game_score = 0; // Global variable for score
var flagpole = {
    x: 7600, // X position of the flagpole
    isReached: false,
};
var enemies = [];

var isCollision = false;
let birds = [];
let wingFlap = 0;

// Percentages of world population, the higher the more resources needed, the slower the game
// Percentage based on game_distance variable  (percentage of game_distance)
var low_percentage = 0.0015;
var med_percentage = 0.0020;
var high_percentage = 0.0025;

function preload() {
	soundFormats('mp3', 'wav');
	//Loading sounds:
	jumpSound = loadSound('assets/robojump.wav')
	powerUp = loadSound('assets/powerup.wav')
	fallSound = loadSound('assets/falling-sound.wav')
	atRespawn = loadSound('assets/start.wav')
	checkpoint = loadSound('assets/finished.wav')

	//Setting sounds' volumes;
	// Here i have tried a for loop on an array of all sounds to set the volume for each sound but it would not work, not sure why
	jumpSound.setVolume(0.1)
	powerUp.setVolume(0.1)
	fallSound.setVolume(0.1)
	atRespawn.setVolume(0.1)
	checkpoint.setVolume(0.1)
}

function setup() {    
    createCanvas(1600, 900);
    //initialize the floor settings
    flrPosY = height * 3 / 4;
    //setting up the character x
    gmChrX = width / 2;
     //setting up the character y
    gmChrY = flrPosY;
    //camera position
    cameraPosX = 0;
    // refering to jump = false
    isjmpg = false;
    // assigning the camera value to 0 cause the constant is 0
    cameraPosX = START_CAM;
    var obstacles = [];
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].draw();
    }
    initializeBirds();
    // Initialise arrays tree
    trees_x = [3,50,100, 150, 300, 600, 680, 750, 900,1150, 1500, 1550, 1600,1650,1700,1750,1800,2110,2270,2420,2900,3500,3550,3600,3650,3700,3750,3800,3850,3900,5450,5500,5500,5550,5600,6000,6050,6100,6150,6200,6250]; 
    
    //initiliaze the array of clouds
    clouds = [
        {x: 100, y: 100, size: 50}, 
        {x: 400, y: 150, size: 60}, 
        {x: 800, y: 120, size: 55},
        {x: 1000, y: 170, size: 55},
        {x: 1400, y: 90, size: 55},
    ];
    
    //initiliaze the array of mountains
    mountains = [
        {x: 225, y: flrPosY - 99, height: 100}, 
        {x: 559, y: flrPosY - 117, height: 120},
        {x: 830, y: flrPosY - 109, height: 110},
        {x: 1100, y: flrPosY - 109, height: 110},
        {x: 1240, y: flrPosY - 110, height: 110},
        {x: 2200, y: flrPosY - 110, height: 110},
        {x: 2500, y: flrPosY - 110, height: 110},
        {x: 2610, y: flrPosY - 110, height: 110},
        {x: 2710, y: flrPosY - 110, height: 110},
        {x: 2810, y: flrPosY - 110, height: 110},
        {x: 4550, y: flrPosY - 110, height: 110},
        {x: 4680, y: flrPosY - 110, height: 110},
        {x: 4800, y: flrPosY - 110, height: 110},
        {x: 4920, y: flrPosY - 110, height: 110},
        {x: 5030, y: flrPosY - 110, height: 110},
        {x: 5150, y: flrPosY - 110, height: 110},
        {x: 5780, y: flrPosY - 110, height: 110},
        {x: 5900, y: flrPosY - 110, height: 110}, 
    ];

    //initiliaze the array of collectables
    collectables = [
        {x: 700, y: flrPosY - 15, isFound: false}, 
        {x: 100, y: flrPosY - 15, isFound: false},
        {x: 1260, y: flrPosY - 15, isFound: false},
        {x: 1460, y: flrPosY - 15, isFound: false},
        {x: 2200, y: flrPosY - 15, isFound: false},
        {x:2500, y: flrPosY - 15, isFound: false},
        {x:2600, y: flrPosY - 15, isFound: false},
        {x:2700, y: flrPosY - 15, isFound: false},
        {x:3350, y: flrPosY - 50, isFound: false},
        {x:4450, y: flrPosY - 50, isFound: false},
        {x:5250, y: flrPosY - 50, isFound: false},
        {x:6050, y: flrPosY - 50, isFound: false},
        {x:6150, y: flrPosY - 50, isFound: false},
        {x:6650, y: flrPosY - 50, isFound: false},
        {x:6700, y: flrPosY - 50, isFound: false},
        {x:6750, y: flrPosY - 50, isFound: false},
        {x:6800, y: flrPosY - 50, isFound: false},
        {x:6850, y: flrPosY - 50, isFound: false},
        {x:6900, y: flrPosY - 50, isFound: false},
        {x:6950, y: flrPosY - 50, isFound: false},
    ];

    // Initialize canyons
    canyons = [
        {x: -200, width: 100, depth: 300},
        {x: -100, width: 100, depth: 300},
        {x: 380, width: 100, depth: 300},
        {x: 930, width: 100, depth: 300},
        {x: 1300, width: 100, depth: 300},
        {x: 2300, width: 100, depth: 300},
        {x: 2000, width: 100, depth: 300},
        {x: 3000, width: 100, depth: 300},
        {x: 3300, width: 100, depth: 300},
        {x: 4000, width: 100, depth: 300},
        {x: 4300, width: 100, depth: 300},
        {x: 5300, width: 100, depth: 300},
        {x: 6300, width: 100, depth: 300},
        {x: 7300, width: 100, depth: 300},
    ];
    
     // Initialize canyons and enemies within them
    for (let i = 0; i < canyons.length; i++) {
        let canyonCenterX = canyons[i].x + canyons[i].width / 2;
        let enemyY = flrPosY - canyons[i].depth / 2;
        enemies.push(new VerticalEnemy(canyonCenterX, enemyY, canyons[i].depth / 2));
    }
}

function draw() {
    //defining the background
    background(100, 155, 255);
    fill(0, 155, 0);
   
    // Enhanced grass rendering
    for (let y = flrPosY; y < height; y++) {
        let grassColor = color(0, 155 + noise(y) * 50, 0); // Vary the green color
        fill(grassColor);
        rect(0, y, width, 1); // Draw a line for each y position
    }

    push();
    translate(-cameraPosX, 0);
    
    // Draw the sun
    drawSun();
      
    //defininf the position for the canyon in order to check later the falling 
    let canyonStart = 590;
    let canyonEnd = 489;
    

    // Draw trees
    for (var indice = 0; indice < trees_x.length; indice++) {
        // Draw the trunk
        fill(124, 66, 0); // Brown color for tree trunk
        rect(trees_x[indice], flrPosY - 100, 20, 100); // Tree trunk
        // Draw branches
        stroke(124, 66, 0); // Brown color for branches
        strokeWeight(4);
        line(trees_x[indice] + 10, flrPosY - 80, trees_x[indice] - 20, flrPosY - 120);
        line(trees_x[indice] + 10, flrPosY - 60, trees_x[indice] + 40, flrPosY - 100);
        // Draw the leaves with different shades of green
        noStroke();
        fill(0, 128, 0); // Darker green
        ellipse(trees_x[indice] + 10, flrPosY - 130, 80, 80);
        fill(0, 255, 0); // Bright green
        ellipse(trees_x[indice] + 10, flrPosY - 160, 60, 60);
        fill(50, 205, 50); // Different shade of green
        ellipse(trees_x[indice] + 10, flrPosY - 140, 70, 70);
    }

    // Update and draw clouds with movement and drawing them iterating trough the array of clouds
     // Update and draw clouds with movement
    for (let i = 0; i < clouds.length; i++) {
        drawCloud(clouds[i].x, clouds[i].y, clouds[i].size);
        clouds[i].x += 1; // Move the cloud to the right

        // Reposition cloud to the left if it moves off the right side of the screen
        if (clouds[i].x - clouds[i].size > width) {
            clouds[i].x = -clouds[i].size;
        }
    }
    
    for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
        if (enemies[i].checkContact(gmChrX, gmChrY)) {
            console.log("Collision with enemy " + i);
            // handle collision
        }
    }

    cloudOffset += 0.02;  //offset of the clouds

    for (var indice = 0; indice < mountains.length; indice++) {
        let mountain = mountains[indice];

        // Main mountain color
        let mountainColor = color(108, 122, 137); // Dark grey

        // Gradient for mountain (darker at the bottom)
        let gradientStart = color(108, 122, 137); // Dark grey
        let gradientEnd = color(169, 169, 169); // Light grey

        // Drawing the mountain with gradient
        for (let y = mountain.y; y < mountain.y + mountain.height; y++) {
            let inter = map(y, mountain.y, mountain.y + mountain.height, 0, 1);
            let c = lerpColor(gradientStart, gradientEnd, inter);
            fill(c);
            noStroke();
            triangle(
                mountain.x, mountain.y,
                mountain.x - (mountain.height / 2) * inter, y,
                mountain.x + (mountain.height / 2) * inter, y
            );
        }

        // Snow cap
        fill(255); // White for snow
        triangle(
            mountain.x, mountain.y,
            mountain.x - 15, mountain.y + 30,
            mountain.x + 15, mountain.y + 30
        );

        // Additional shadow for depth (optional)
        fill(54, 69, 79, 100); // Semi-transparent dark color
        triangle(
            mountain.x, mountain.y,
            mountain.x - (mountain.height / 2), mountain.y + mountain.height,
            mountain.x, mountain.y + mountain.height
        );
    }
    
    drawScore();
    drawLives();

    drawFlagpole();
    for (let bird of birds) {
        bird.draw();
    }
    
   // Iterate over collectables to update game_score
    for (let i = 0; i < collectables.length; i++) {
        let collectable = collectables[i];
        if (!collectable.isFound && gmChrX > collectable.x - 50 && gmChrX < collectable.x + 50) {
            collectable.isFound = true;
            powerUp.play();
            game_score += 1; // Increment game_score
        }
    }
    
    checkPlayerDie();
    
    // Iterate over the collectables array
    for (let indice = 0; indice < collectables.length; indice++) {
        let collectable = collectables[indice];
        // Check if the collectable is not yet found
        if (!collectable.isFound) {
            // Check if the game character is close enough to the collectable in order to make it disappear
            if (gmChrX > collectable.x - 50 && gmChrX < collectable.x + 50) {
                // Collectable is within 50 pixels range of the game character
                collectable.isFound = true;
            } else {
                drawCollectable(collectable.x, collectable.y);
            }
        }
    }

    // Draw canyons
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
    }

    // game character move or the background scroll
    if(islft) {
        gmChrX -= 5;
        cameraPosX -= 5; // Move the camera to follow the character
    }
    if(isrght) {
        gmChrX += 5;
        cameraPosX += 5; // Move the camera to follow the character
    }

    // statements in order to make the character jump
    if(isjmpg) {
        gmChrY -= 10; // character moving in Y
        if(gmChrY <= flrPosY - 100) { // Check if the character has reached the peak of the jump
            isjmpg = false; // starting the falling
        }
    }

    // statements to apply the gravity over the game
    if(gmChrY < flrPosY && !isjmpg) {
        gmChrY += 5;
        isfllng = true;
    } else {
        isfllng = false;
    }

    // Check if the character is near any of the canyons
    for (var i = 0; i < canyons.length; i++) {
        if (gmChrX > canyons[i].x && gmChrX < canyons[i].x + canyons[i].width) {
            if (gmChrY >= flrPosY) {
                isplmtng = true;
                atRespawn.play();
                break; // Exit the loop if the character is plummeting in any canyon
                
            }
        }
    }

    // in this part I obtain information if the character is plummenting
    if (isplmtng) {
        gmChrY += 10;
    }

    // Draw the game character positions
    if(islft && isfllng) {
        // Jumping-left code
        fill(255,192,203); // Skin color
        ellipse(gmChrX, gmChrY - 60, 30, 30); // Head
        fill(255,255,255); // Eye color
        ellipse(gmChrX - 5, gmChrY - 65, 5, 5); // Eye
        fill(0,0,255); // Clothing color
        rect(gmChrX - 15, gmChrY - 50, 30, 25); // Body
        stroke(0); // Color for the outline of the limbs
        strokeWeight(2); // Thickness of the limbs
        line(gmChrX - 5, gmChrY - 50, gmChrX - 20, gmChrY - 60); // Left arm
        line(gmChrX + 5, gmChrY - 50, gmChrX + 10, gmChrY - 60); // Right arm
        line(gmChrX - 5, gmChrY - 25, gmChrX - 5, gmChrY - 5); // Left leg
        line(gmChrX + 5, gmChrY - 25, gmChrX + 5, gmChrY - 5); // Right leg
        noStroke(); // Remove the stroke for further shapes
    } else if(isrght && isfllng) {
        // Jumping-right code
        fill(255,192,203);
        ellipse(gmChrX, gmChrY - 47, 25, 25);
        fill(255,255,255);
        ellipse(gmChrX + 5, gmChrY - 50, 5, 5);
        ellipse(gmChrX + 12, gmChrY - 47, 5, 5);
        fill(255,0,0);
        rect(gmChrX - 5, gmChrY - 35,9, 12);
        fill(0,0,0);
        rect(gmChrX - 5, gmChrY - 30, 3, 12);
        rect(gmChrX + 1, gmChrY - 30, 3, 12);
    } else if(islft) {
        // Walking left code
        fill(255,192,203);
        ellipse(gmChrX, gmChrY - 47, 25, 25);
        fill(255,255,255);
        ellipse(gmChrX - 8, gmChrY - 47, 5, 5);
        ellipse(gmChrX - 12, gmChrY - 47, 5, 5); 
        fill(255,0,0);
        rect(gmChrX - 5, gmChrY - 35,9, 12);
        fill(0,0,0);
        rect(gmChrX - 5, gmChrY - 24, 3, 12);
        rect(gmChrX + 1, gmChrY - 24, 3, 12);
    } else if(isrght) {
        // Walking right code
        fill(255,192,203);
        ellipse(gmChrX, gmChrY - 47, 25, 25);
        fill(255,255,255);
        ellipse(gmChrX + 8, gmChrY - 47, 5, 5);
        ellipse(gmChrX + 12, gmChrY - 47, 5, 5);
        fill(255,0,0);
        rect(gmChrX - 5, gmChrY - 35,9, 12);
        fill(0,0,0);
        rect(gmChrX - 5, gmChrY - 24, 3, 12);
        rect(gmChrX + 1, gmChrY - 24, 3, 12);
    } else if(isfllng || isplmtng) {
        // Jumping facing forwards code
        fill(255,192,203);
        ellipse(gmChrX, gmChrY - 41, 25, 25);
        fill(255,255,255);
        ellipse(gmChrX - 4, gmChrY - 47, 5, 5);
        ellipse(gmChrX + 4, gmChrY - 47, 5, 5);
        fill(255,0,0);
        rect(gmChrX - 5, gmChrY - 29,9, 12);
        fill(0,0,0);
        rect(gmChrX - 5, gmChrY - 24, 3, 12);
        rect(gmChrX + 1, gmChrY - 24, 3, 12);
    } else {
        // Standing front facing code
        fill(255,192,203);
        ellipse(gmChrX, gmChrY - 47, 25, 25);
        fill(255,255,255);
        ellipse(gmChrX - 4, gmChrY - 47, 5, 5);
        ellipse(gmChrX + 4, gmChrY - 47, 5, 5);
        fill(255,0,0);
        rect(gmChrX - 5, gmChrY - 35,9, 23);
        fill(0,0,0);
        rect(gmChrX - 5, gmChrY - 12, 3, 12);
        rect(gmChrX + 1, gmChrY - 12, 3, 12);
    }

    // reset the game character position if it falls off the screen
    if(gmChrY > height) {
        cameraPosX = START_CAM;
        gmChrX = width / 2;
        gmChrY = flrPosY;
        isplmtng = false;
    }
    
     //checkPlayerStatus(); // Add this line
    
    checkFlagpole();

    if (flagpole.isReached) {
        checkpoint.play();
        fill(0, 0, 0); // Set text color to red
        textSize(50); // Set text size
        textAlign(CENTER, CENTER);
        // Draw text relative to the camera position
        background(255,255,255);
        text("Level Complete, Press Space to restart", width / 2 + cameraPosX, height / 2);
        // noLoop(); // Uncomment this if you want to stop the loop after displaying the message
    }
}

//codce that check which tkey has been pressed
function keyPressed() {
    if(keyCode == 37) {
        islft = true;
    }
    if(keyCode == 39) {
        isrght = true;
    }
    if(keyCode == 32 && gmChrY == flrPosY) {
        isjmpg = true;
        
    }
}

//codce that check which tkey has been released
function keyReleased() {
    if(keyCode == 37) {
        islft = false;
    }
    if(keyCode == 39) {
        isrght = false;
    }
}

// Function to draw a branch of tree with recursive implementation
function branch(startX, startY, length, angle, branchWidth) {
    const endX = startX + length * cos(angle);
    const endY = startY - length * sin(angle);
    stroke(80, 42, 42); // Brown color
    strokeWeight(branchWidth);
    line(startX, startY, endX, endY);
    if (length > 10) {
        branch(endX, endY, length * 0.7, angle - QUARTER_PI, branchWidth * 0.7);
        branch(endX, endY, length * 0.7, angle + QUARTER_PI, branchWidth * 0.7);
    }
}

function drawCloud(x, y, size) {
    noStroke();
    fill(255);
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.1) {
        let r = size + noise(x * 0.005 + angle, y * 0.005) * size / 2;
        let cloudX = x + r * cos(angle);
        let cloudY = y + r * sin(angle);
        vertex(cloudX, cloudY);
    }
    endShape(CLOSE);
}

var hasJustStartedFalling = false; // Flag to indicate the start of falling

function checkPlayerDie() {
    var isOverAnyCanyon = false;

    for (var i = 0; i < canyons.length; i++) {
        var characterBottomCenterX = gmChrX;
        var isOverCanyon = characterBottomCenterX > canyons[i].x && characterBottomCenterX < canyons[i].x + canyons[i].width;

        if (isOverCanyon && gmChrY >= flrPosY) {
            isOverAnyCanyon = true;
            if (!hasJustStartedFalling) {
                // The character starts falling
                hasJustStartedFalling = true;
                isplmtng = true;
                isjmpg = false;
                islft = false;
                isrght = false;
                isfllng = true;

                // Decrement lives only if they are above zero
                if (lives > 0) {
                    lives--;
                    if (lives == 0) {
                        isGameOver = true; // Set game-over state
                        checkGameOver();
                    }
                }
            }
        }
    }

    // If the character is not over any canyon, reset the falling states
    if (!isOverAnyCanyon) {
        if (isplmtng) {
            gmChrY = flrPosY; // Ensure character lands on the floor
        }
        isplmtng = false;
        hasJustStartedFalling = false;
    }
}

function checkGameOver() {
    if (lives <= 0) {
        // Game over logic
        fallSound.play();
        fill(255, 0, 0);
        textSize(50);
        textAlign(CENTER, CENTER);
        background(0,0,0);
        text("Game Over. Press space to continue.", width / 2+ cameraPosX, height / 2);
        noLoop();
        return; // Immediately exit the function to prevent resetting the character
    }
    // Reset the character's position and camera for the next attempt
    resetGame();
    
}


function resetGame() {
    // Reset character position and state
    gmChrX = width / 2;
    gmChrY = flrPosY;
    islft = false;
    isrght = false;
    isfllng = false;
    isplmtng = false;
    isjmpg = false;
    isFound = false; // Reset collectable found state

    // Reset camera position
    cameraPosX = START_CAM;
    initializeBirds();

    // Reset score and lives
    game_score = 0;
    lives = 5;

    // Reset flagpole
    flagpole.isReached = false;

    // Re-initialize clouds
    clouds = [
        {x: 100, y: 100, size: 50}, 
        {x: 400, y: 150, size: 60},
        {x: 800, y: 120, size: 55},
        {x: 1000, y: 170, size: 55},
        {x: 1400, y: 90, size: 55},
    ];

    // Re-initialize collectables
    collectables = [
        {x: 700, y: flrPosY - 15, isFound: false}, 
        {x: 100, y: flrPosY - 15, isFound: false},
        {x: 1260, y: flrPosY - 15, isFound: false},
        {x: 1460, y: flrPosY - 15, isFound: false},
        {x: 2200, y: flrPosY - 15, isFound: false},
        {x:2500, y: flrPosY - 15, isFound: false},
        {x:2600, y: flrPosY - 15, isFound: false},
        {x:2700, y: flrPosY - 15, isFound: false},
        {x:3350, y: flrPosY - 50, isFound: false},
        {x:4450, y: flrPosY - 50, isFound: false},
        {x:5250, y: flrPosY - 50, isFound: false},
        {x:6050, y: flrPosY - 50, isFound: false},
        {x:6150, y: flrPosY - 50, isFound: false},
        {x:6650, y: flrPosY - 50, isFound: false},
        {x:6700, y: flrPosY - 50, isFound: false},
        {x:6750, y: flrPosY - 50, isFound: false},
        {x:6800, y: flrPosY - 50, isFound: false},
        {x:6850, y: flrPosY - 50, isFound: false},
        {x:6900, y: flrPosY - 50, isFound: false},
        {x:6950, y: flrPosY - 50, isFound: false},
    ];
    // Re-initialize canyons
    canyons = [
        {x: -200, width: 100, depth: 300},
        {x: -100, width: 100, depth: 300},
        {x: 380, width: 100, depth: 300},
        {x: 930, width: 100, depth: 300},
        {x: 1300, width: 100, depth: 300},
        {x: 2300, width: 100, depth: 300},
        {x: 2000, width: 100, depth: 300},
        {x: 3000, width: 100, depth: 300},
        {x: 3300, width: 100, depth: 300},
        {x: 4000, width: 100, depth: 300},
        {x: 4300, width: 100, depth: 300},
        {x: 5300, width: 100, depth: 300},
        {x: 6300, width: 100, depth: 300},
        {x: 7300, width: 100, depth: 300},
        
    ];


    loop();
}

function keyPressed() {
    if (keyCode === 32 && lives <= 0) {
        // Space bar pressed and game is over
        resetGame();
        loop(); // Restart the game loop
    } else if (keyCode === 37) {
        islft = true;
    } else if (keyCode === 39) {
        isrght = true;
    } else if (keyCode === 32 && gmChrY == flrPosY) {
         jumpSound.play();
        isjmpg = true;
    }
}


//function to draw multiple canyons
function drawCanyon(canyon) {
    if (canyon) {
        // Set up gradient colors for a more natural look
        let topColor = color(224, 122, 95); // Lighter color for the top
        let bottomColor = color(173, 101, 76); // Darker color for the bottom

        // Draw the canyon using a gradient
        for (let y = flrPosY; y < height; y++) {
            let inter = map(y, flrPosY, height, 0, 1);
            let c = lerpColor(topColor, bottomColor, inter);
            stroke(c);
            line(canyon.x, y, canyon.x + canyon.width, y);
        }

        // Additional details for texture and depth
        noStroke();
        fill(139, 69, 19); // Darker fill for depth
        let numberOfStrata = 5; // Number of horizontal strata lines
        for (let i = 0; i < numberOfStrata; i++) {
            let strataY = flrPosY + (i * (height - flrPosY) / numberOfStrata);
            rect(canyon.x, strataY, canyon.width, 2); // Horizontal strata lines
        }
    }
}

function drawCollectable(x, y) {
    fill(192, 192, 192); // Silver color
    ellipse(x, y, 40, 40);
    //gold circle
    fill(255, 215, 0); // Gold color
    ellipse(x, y, 25, 25);
    // Text on the coin
    fill(0);
    textSize(8);
    textAlign(CENTER, CENTER);
    text('€', x, y);
}
function drawSun() {
    // Set the color and position for the sun
    let sunX = width - 100; // X position of the sun
    let sunY = 100; // Y position of the sun
    let sunRadius = 50; // Radius of the sun

    // Draw the sun
    fill(255, 255, 0); // Yellow color for the sun
    noStroke();
    ellipse(sunX+cameraPosX, sunY, sunRadius * 2, sunRadius * 2); // Draw the sun

    // Optional: Draw sun rays
    stroke(255, 255, 0); // Yellow color for the rays
    strokeWeight(2);
    for (let angle = 0; angle < TWO_PI; angle += QUARTER_PI / 3) {
        let rayX = sunX+cameraPosX + cos(angle) * sunRadius * 1.5;
        let rayY = sunY + sin(angle) * sunRadius * 1.5;
        line(sunX+cameraPosX, sunY, rayX, rayY);
    }
}


function drawScore() {
    fill(0,0,0);
    noStroke();
    textSize(20);
    textAlign(RIGHT, TOP);
    text("Score: " + game_score, width - 50 + cameraPosX, 20); // Add cameraPosX here
}

function checkFlagpole() {
    var d = abs(gmChrX - flagpole.x);
    if (d < 10 && !flagpole.isReached) {
        flagpole.isReached = true;
    }
}

function keyPressed() {
    if (keyCode === 32 && flagpole.isReached) {
        resetGame();
    }
    if (keyCode === 32 && lives <= 0) {
        // Space bar pressed and game is over
        resetGame();
        loop(); // Restart the game loop
    } else if (keyCode === 37) {
        islft = true;
    } else if (keyCode === 39) {
        isrght = true;
    } else if (keyCode === 32 && gmChrY == flrPosY) {
        isjmpg = true;
        jumpSound.play();
    }
}

function VerticalEnemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentY = y;
    this.inc = 2; // Speed of vertical movement
    this.collisionProcessed = false; // New property

    this.update = function() {
        this.currentY += this.inc;
        // Reverse direction when it reaches the top or bottom of the range
        if (this.currentY >= this.y + this.range || this.currentY <= this.y - this.range) {
            this.inc = -this.inc;
        }
    };

    this.draw = function() {
        // Update the position of the enemy
        this.update();

        // Set the drawing context to the enemy's position
        push();
        translate(this.x, this.currentY);

        // Draw the enemy's head
        fill(255, 0, 0); // Red color for the enemy
        ellipse(0, 0, 50, 50);

        // Draw the eyes
        fill(255); // White color for eyes
        ellipse(-10, -10, 15, 20); // Left eye
        ellipse(10, -10, 15, 20); // Right eye

        // Draw the pupils
        fill(0); // Black color for pupils
        ellipse(-10, -10, 5, 5); // Left pupil
        ellipse(10, -10, 5, 5); // Right pupil

        // Draw angry eyebrows
        stroke(0);
        strokeWeight(5);
        line(-15, -20, -5, -15); // Left eyebrow
        line(15, -20, 5, -15); // Right eyebrow

        // Draw the mouth
        noStroke();
        fill(128); // Dark color for mouth
        arc(0, 10, 30, 20, 0, PI); // Mouth shape

        pop();
    };
}

VerticalEnemy.prototype.checkContact = function(gc_x, gc_y) {
    var enemyHalfWidth = 25; // Half of the enemy width
    var characterHalfWidth = 15; // Half of the character width

    // Check horizontal and vertical overlap
    var horizontalOverlap = abs(gc_x - this.x) <= (enemyHalfWidth + characterHalfWidth);
    var verticalOverlap = abs(gc_y - this.currentY) <= (enemyHalfWidth + characterHalfWidth);

    // Collision occurs if both horizontal and vertical overlaps are true
    if (horizontalOverlap && verticalOverlap) {
        if (!this.collisionProcessed) {
            lives -= 1;
            this.collisionProcessed = true; // Mark collision as processed
            fallSound.play();
            console.log("Collision detected");
            if (lives <= 0) {
                checkGameOver();
            }
        }
        return true;
    } else {
        this.collisionProcessed = false; // Reset if not colliding
    }

    return false;
};

function drawLives() {
    fill(0,0,0);
    noStroke();
    textSize(20);
    textAlign(LEFT, TOP);
    text("Lives: " + lives, 50 + cameraPosX, 20); // Add cameraPosX here
}

function drawFlagpole() {
    strokeWeight(5);
    stroke(180);
    line(flagpole.x, flrPosY, flagpole.x, flrPosY - 200); // Pole

    if (flagpole.isReached) {
        fill(255, 0, 0);
        rect(flagpole.x, flrPosY - 200, 50, 30); // Flag
    }
}

function drawCharacter(x, y) {
    push();
    translate(x, y);

    // Draw head
    fill(255, 224, 189); // Skin color
    ellipse(0, -50, 30, 40); // Head

    // Eyes
    fill(255); // White
    ellipse(-5, -55, 10, 8); // Left eye
    ellipse(5, -55, 10, 8); // Right eye
    fill(0); // Black
    ellipse(-5, -55, 4, 4); // Left pupil
    ellipse(5, -55, 4, 4); // Right pupil

    // Body
    fill(0, 0, 255); // Clothing color
    rect(-15, -30, 30, 50); // Body

    // Arms
    stroke(255, 224, 189); // Skin color
    strokeWeight(8);
    line(-15, -20, -35, -40); // Left arm
    line(15, -20, 35, -40); // Right arm

    // Legs
    fill(0, 0, 0); // Pants color
    rect(-10, 20, 20, 40); // Left leg
    rect(0, 20, 20, 40); // Right leg

    pop();
}

function createBird(x, y, speed) {
    return {
        x: x,
        y: y,
        speed: speed,
        flap: 0,

        draw: function() {
            this.flap = sin(frameCount / 10) * 10; // Flapping effect
            drawBird(this.x, this.y + this.flap);
            this.x += this.speed;
        }
    };
}

// Create birds in a matrix pattern
function initializeBirds() {
    let spacingX = 50;
    let spacingY = 50;
    let startX = 100;
    let startY = 100;
    let speed = 3;

    for (let i = 0; i < 3; i++) { // 3 rows
        for (let j = 0; j < 3; j++) { // 3 birds in each row
            birds.push(createBird(startX + j * spacingX, startY + i , speed));
        }
        startX -= 125; // Offset for next row
        startY += 100;
    }
}

function drawBird(x, y) {
    // Body of the bird
    fill(255, 200, 200); // Light red color
    ellipse(x, y, 20, 15);

    // Wings - they will flap
    let wingWidth = 20;
    let wingHeight = 10;
    ellipse(x - 5, y, wingWidth, wingHeight + wingFlap); // Left wing
    ellipse(x + 5, y, wingWidth, wingHeight + wingFlap); // Right wing
}
