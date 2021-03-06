//trigger debug mode
let isDebugMode = false;

var socket;
var slider;
var sizecounter;

let map; // Declare variable 'img'.

let FIXED_WINDOW_WIDTH = 2500;
let FIXED_WINDOW_HEIGHT = 1500;

let COLLISION_BOX_X = 45;
let COLLISION_BOX_Y = 50;

//State Switcher

const selectedState = {
    'NONE_SELECTED': 'none_selected',
    'SELECTED': 'selected'
}

const placedState = {
    "NONE_PLACED":"none_placed",
    "TEMP_PLACED":"temp_placed"
}

const treeType = {
    'NONE':'none',
    'TREE1': 'tree1',
    'TREE2': 'tree2',
    'TREE3': 'tree3'
}

//prices for the tree
const treePrices = {
    "tree1": 3,
    "tree2": 5,
    "tree3": 1
}

let currentSelectState;
let currentPlacedState;
let currentTree;

let hovered_tree;
let isOnHover = false;

let tempTreeSprite;
let permanentTreeSprite;
let received_treeJSON;

let tree1Button;
let tree2Button;
let tree3Button;

let nameInput;
let urlInput;
let commentInput;

let totalAmount;


//Loading Images
let imageTree1;
let imageTree1Width = 50;
let imageTree1Height = 50;

let imageTree2;
let imageTree2Width = 50;
let imageTree2Height = 50;

let imageTree3;
let imageTree3Width = 50;
let imageTree3Height = 50;

function preload(){

    imageTree1 = loadImage('assets/tree1.png');
    imageTree1_hover = loadImage('assets/tree1_hover.png');
    imageTree1_temp = loadImage('assets/tree1_temp.png');
    imageTree1_delete = loadImage('assets/tree1_temp_del.png');

    imageTree2 = loadImage('assets/tree2.png');
    imageTree2_hover = loadImage('assets/tree2_hover.png');
    imageTree2_temp = loadImage('assets/tree2_temp.png');
    imageTree2_delete = loadImage('assets/tree2_temp_del.png');

    imageTree3 = loadImage('assets/tree3.png');
    imageTree3_ani1 = loadImage('assets/tree3_001.png');
    imageTree3_ani2 = loadImage('assets/tree3_002.png');
    imageTree3_ani3 = loadImage('assets/tree3_003.png');
    imageTree3_ani4 = loadImage('assets/tree3_004.png');

    imageTree3_hover = loadImage('assets/tree3_hover.png');
    imageTree3_temp = loadImage('assets/tree3_temp.png');
    imageTree3_delete = loadImage('assets/tree3_temp_del.png');

    imageCursor = loadImage('assets/shovel.png');

}


function setup() {
    currentSelectState = selectedState.NONE_SELECTED;
    currentPlacedState = placedState.NONE_PLACED;
    currentTree = treeType.NONE;
    tempTreeSprite = new Group();
    permanentTreeSprite = new Group();
    mouseSprite = createSprite(-50,-50);
    noCursor();


    // PROBLEM: Two people trying to create a tree on the same spot.

    /////// GET INITIAL DATA //////
    fetchServerData()

    /////// DONATE BUTTON //////
    // let donate = createButton("donate");
    // donate.class("donate")
    // donate.parent("donateContainer")
    // donate.attribute("value","donate")
    // donate.mouseClicked(function(){

    //     let jsonData = sendTrees();
    //     currentPlacedState = placedState.NONE_PLACED;

    //     fetch("/addTrees", {
    //         method: 'POST', // or 'PUT'
    //         body: JSON.stringify(jsonData), // data can be `string` or {object}!
    //         headers:{
    //           'Content-Type': 'application/json'
    //         }
    //     })
    //     // .then(res => res.json())
    //     .then((response) => {
    //         console.log('Success:', JSON.stringify(response))
    //         fetchServerData()
    //     })
    //     .catch(error => console.error('Error:', error));
    // })

    /////// TREE BUTTONS //////
    //——Button : Tree1
    tree1Button = createButton("$"+ treePrices["tree1"]);
    tree1Button.class("myTree1")
    tree1Button.parent("tree1")
    tree1Button.attribute("value","tree1")
    tree1Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE1;
            tree1Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE1){
            //If already selected tree1
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree1Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE1){
            //If already selected tree that is NOT tree1
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE1;
            tree1Button.addClass('Selected');
            tree2Button.removeClass('Selected');
            tree3Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree1');
    })

    //——Button : Tree2
    tree2Button = createButton("$"+ treePrices["tree2"]);
    tree2Button.class("myTree2")
    tree2Button.parent("tree2")
    tree2Button.attribute("value","tree2")
    tree2Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE2;
            tree2Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE2){
            //If already selected tree2
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree2Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE2){
            //If already selected tree that is NOT tree2
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE2;
            tree2Button.addClass('Selected');
            tree1Button.removeClass('Selected');
            tree3Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree2');
    })

   //——Button : Tree3
    tree3Button = createButton("$"+ treePrices["tree3"]);
    tree3Button.class("myTree3")
    tree3Button.parent("tree3")
    tree3Button.attribute("value","tree3")
    tree3Button.mouseClicked(function(){

        if(currentTree === treeType.NONE ){
            //If not previously selected
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE3;
            tree3Button.addClass('Selected');
        }
        else if(currentTree === treeType.TREE3){
            //If already selected tree3
            currentSelectState = selectedState.NONE_SELECTED;
            currentTree = treeType.NONE;
            tree3Button.removeClass('Selected');
        }
        else if(currentTree !== treeType.TREE3){
            //If already selected tree that is NOT tree3
            currentSelectState = selectedState.SELECTED;
            currentTree = treeType.TREE3;
            tree3Button.addClass('Selected');
            tree1Button.removeClass('Selected');
            tree2Button.removeClass('Selected');
        }
        //remove existing sprite before creating new sprite
        mouseSprite.remove();
        createMouseSprite();
        mouseSprite.changeImage('tree3');
    })

    //////////// USER INPUT ////////
    nameInput = createInput("").attribute('placeholder', 'Name');
    nameInput.attribute('maxlength',20);
    nameInput.class("name")
    nameInput.parent("nameInput")

    /*
    //Delete form on focus
    nameInput.id("name_input_field")
    document.getElementById("name_input_field").onfocus = function() { nameInput.attribute("value","")};
    */

    urlInput = createInput("").attribute('placeholder', 'Web URL');
    urlInput.class("name")
    urlInput.parent("urlInput")
  
    commentInput = createInput("").attribute('placeholder', 'Comment');
    commentInput.attribute('maxlength',100);
    commentInput.class("name")
    commentInput.parent("commentInput")
  


    var canvas = createCanvas(FIXED_WINDOW_WIDTH,FIXED_WINDOW_HEIGHT);
    canvas.class('canvas');
    canvas.parent('canvas-holder');
    //Activates the tree planting function
    canvas.mouseClicked(mouseHandle)
    background('#edf7ec');
    map = loadImage('assets/map.png'); // Load the image

    ////////////

    //   socket = io.connect('http://localhost:3000');
}

function clearText() {
    nameInput.style.backgroundColor = "red";
  }

let mouseSprite;

// Helper function for setup
function createMouseSprite(){
    mouseSprite = createSprite(mouseX,mouseY)
    mouseSprite.addImage('tree1',imageTree1_temp);
    mouseSprite.addImage('tree2',imageTree2_temp);
    mouseSprite.addImage('tree3',imageTree3_temp);
    mouseSprite.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
    // cursor.addImage('cursor',imageCursor);
    //('assets/shovel.png')
    // cursor('imageCursor');
    // mouseSprite.setCollider('circle',0,0,10);
    mouseSprite.debug = isDebugMode;
}


// // Helper function for setup
// function sendTrees(){
//     //Convert current tree position into JSON files to send to the server

//     let sendTreeList = [];
//     for (var i = 0 ; i < tempTreeSprite.length ; i++){
//         sendTreeList.push({
//             "x":tempTreeSprite[i].position.x,
//             "y":tempTreeSprite[i].position.y,
//             "treetype":tempTreeSprite[i].getAnimationLabel().split("_")[0],
//             "meta": {
//                 "name":nameInput.value(),
//                 "date": new Date(),
//                 "url":urlInput.value(),
//                 "comment":commentInput.value(),
//                 "payment_data":10
//             }
//         })
//     }

//     return sendTreeList;
// }



function renderInitialTrees(data){
    //Deletes current permanent tree sprite to refresh the screen
    let length_perm = permanentTreeSprite.length;
    for (var i = 0 ; i < length_perm ; i++){
        permanentTreeSprite[0].remove();
    }
    for (let i in data){
        //———————————T R E E 1 (PERMANENT) ————————————!
        if (data[i]["treetype"] == treeType.TREE1){
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree1Width,imageTree1Height)
            // TODO: New Animation for permanent tree here
            tree.addAnimation('tree1_permanent', imageTree1);
            tree.addAnimation('tree1_hover', imageTree1_hover);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                // Change to hover state animation
                tree.changeAnimation('tree1_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
              }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_permanent');
                isOnHover = false;
                cursor('default');

            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }

            tree.changeAnimation('tree1_permanent');
            permanentTreeSprite.add(tree);

        }  //———————————T R E E 2 (PERMANENT) ————————————!
        else if (data[i]["treetype"] == treeType.TREE2) {
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree2Width,imageTree2Height)

            tree.addAnimation('tree2_permanent', imageTree2);
            tree.addAnimation('tree2_hover', imageTree2_hover);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_permanent');
                isOnHover = false;
                cursor('default');
            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }
            tree.changeAnimation('tree2_permanent');
            permanentTreeSprite.add(tree);

        } //———————————T R E E 3 (PERMANENT) ————————————!
        else if (data[i]["treetype"] == treeType.TREE3) {
            let tree = createSprite(data[i]["x"],data[i]["y"],imageTree3Width,imageTree3Height)
            //tree.addAnimation('tree3_permanent', imageTree3_ani1,imageTree3_ani2,imageTree3_ani3);
            tree.addAnimation('tree3_permanent', imageTree3);
            tree.addAnimation('tree3_hover', imageTree3_hover);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree3_hover');
                isOnHover = true;
                hovered_tree = data[i];
                cursor('pointer');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree3_permanent');
                isOnHover = false;
                cursor('default');
            }

            tree.onMousePressed = function(){
                window.open(data[i].meta.url);
            }
            tree.changeAnimation('tree3_permanent');
            permanentTreeSprite.add(tree);
        }
    }
    console.log("permanent Tree Sprite is ↓")
    console.log(permanentTreeSprite)
}

function fetchServerData(){
    fetch('/getTrees')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log("Tree data received from server↓")
        received_treeJSON = data;
        console.log(received_treeJSON);

        //Draw permanent trees
        renderInitialTrees(data);
        //Delete the temporary tree sprites
        let length = tempTreeSprite.length;
        for (var i = 0 ; i < length ; i++){
            tempTreeSprite[0].remove();
        }
        updateBuyButton()
    })
}


// Note: For demo, changed to fixed canvas

// function windowResized(){
//     resizeCanvas(windowWidth,(windowHeight)-controlsHEIGHT);
// }

function updateBuyButton(){
    var donateButton = document.getElementsByClassName("donate")[0]
    totalAmount = 0;
    let total = document.getElementById("total");
    let cardTotal = document.getElementById("card-total");
    let payAmount = document.getElementById("pay-amount");

    for (let i = 0; i < tempTreeSprite.length;i++){
        let treeType = tempTreeSprite[i].getAnimationLabel().split("_")[0]
        totalAmount += treePrices[treeType];
    }

    if (totalAmount == 0){
        donateButton.classList.add("donateButtonInactive");
    } else {
        donateButton.classList.remove("donateButtonInactive");
    }

    payAmount.innerHTML = "Pay $" + totalAmount + ".00";
    cardTotal.innerHTML = "$" + totalAmount + ".00";
    total.innerHTML = totalAmount;
}

function mouseHandle(){
    if (currentSelectState == selectedState.SELECTED){
        console.log([currentSelectState,currentTree])

        //———————————T R E E 1 (TEMPORARY) ————————————!
        if (currentTree == treeType.TREE1){
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree1Width,imageTree1Height)
            tree.addAnimation('tree1_temp', imageTree1_temp);
            tree.addAnimation('tree1_temp_delete', imageTree1_delete);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree1_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree1_temp');
            }
            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }

            tree.changeAnimation('tree1_temp');
            tempTreeSprite.add(tree);

        } //———————————T R E E 2 (TEMPORARY) ————————————!
        else if (currentTree == treeType.TREE2) {
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree2Width,imageTree2Height)
            tree.addAnimation('tree2_temp', imageTree2_temp);
            tree.addAnimation('tree2_temp_delete', imageTree2_delete);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree2_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree2_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }
            tree.changeAnimation('tree2_temp');
            tempTreeSprite.add(tree);

        } //———————————T R E E 3 (TEMPORARY) ————————————!
        else if (currentTree == treeType.TREE3) {
            let tree = createSprite(mouseSprite.position.x,mouseSprite.position.y,imageTree3Width,imageTree3Height)
            tree.addAnimation('tree3_temp', imageTree3_temp);
            tree.addAnimation('tree3_temp_delete', imageTree3_delete);

            tree.setCollider('rectangle',0,0,COLLISION_BOX_X,COLLISION_BOX_Y);
            // tree.setCollider('circle',0,0,10);
            tree.debug = isDebugMode;

            tree.onMouseOver = function(){
                tree.changeAnimation('tree3_temp_delete');
            }

            tree.onMouseOut = function(){
                tree.changeAnimation('tree3_temp');
            }

            tree.onMousePressed = function(){
                if (currentSelectState == selectedState.NONE_SELECTED){
                    tree.remove()
                    updateBuyButton()
                    if(tempTreeSprite.length==0){
                        currentPlacedState = placedState.NONE_PLACED;
                    }
                }
            }
            tree.changeAnimation('tree3_temp');
            tempTreeSprite.add(tree);
        }

        //--------UPDATE BUY BUTTON---------//

        updateBuyButton();

        //———————————AFTER EACH CLICK EVENT ON CANVAS ————————————!
        cursor('default');

        tree1Button.removeClass('Selected');
        tree2Button.removeClass('Selected');
        tree3Button.removeClass('Selected');

        currentSelectState = selectedState.NONE_SELECTED;
        currentTree = treeType.NONE;
        currentPlacedState = placedState.TEMP_PLACED;
    }
}


function draw(){
    background('#edf7ec');
    image(map, 0, 0, FIXED_WINDOW_WIDTH,FIXED_WINDOW_HEIGHT);
    // cursor('assets/shovel.png'); 
    cursor("default")

    if (currentSelectState == selectedState.SELECTED){
        mouseSprite.velocity.x = (mouseX-mouseSprite.position.x)/10;
        mouseSprite.velocity.y = (mouseY-mouseSprite.position.y)/10;
        mouseSprite.collide(tempTreeSprite)
        mouseSprite.collide(permanentTreeSprite)
    } else {
        mouseSprite.remove();
    }
    drawSprites();


    fill(255, 255, 255);
    textSize(13);

    if(isDebugMode){
        text("Select State: " + currentSelectState, 20 , 20, 200, 100);
        text("Placed State: " +currentPlacedState, 20 , 40, 200, 100);
        text("Tree State: " +currentTree, 20 , 60, 200, 100);
        text("Toggle Debug with CONTROL key ", 20 , 80, 200, 100);
    }

    if(isOnHover){


        fill(101, 204, 101, 120);
        strokeWeight(3);
        stroke(51);
        rect(hovered_tree.x + imageTree1Width - 20 , hovered_tree.y - 30, 260, 80, 15, 15, 15, 15);
        line(hovered_tree.x, hovered_tree.y, hovered_tree.x + imageTree1Width - 20, hovered_tree.y);

        fill(0, 5, 55);
        cursor('pointer'); 

        noStroke();
        //NAME
        textSize(13);
        text("Donated $" + hovered_tree.meta.payment_data, hovered_tree.x + imageTree1Width, hovered_tree.y - 20, 150, 100);

        //NAME
        textSize(18);
        text(hovered_tree.meta.name, hovered_tree.x + imageTree1Width, hovered_tree.y, 250, 100);
        //Comment
        textSize(13);
        text(hovered_tree.meta.comment, hovered_tree.x + imageTree1Width, hovered_tree.y + 30, 250, 100);

    }

}

function keyPressed() {
    if (keyCode === CONTROL) {
    isDebugMode = !isDebugMode;
    }
  }



//-------- DVD Screenscaver ---------//

// let imageX = 40;
// let imageY = 0;

// let incrementorX = 2.5;
// let incrementorY = 2.5;

// function checkBoundsX(currPos){
//     if (currPos > WIDTH - 40 || currPos < -40){
//         return true;
//     }
//     return false;
// }

// function checkBoundsY(currPos){
//     if (currPos > HEIGHT - 40 || currPos < -40){
//         return true;
//     }
//     return false;
// }

// function draw() {
//     background(51);
//     if (checkBoundsX(imageX)){
//         incrementorX *= -1;
//     }
//     if (checkBoundsY(imageY)){
//         incrementorY *= -1;
//     }
//     imageX += incrementorX;
//     imageY += incrementorY;
//     image(img, imageX, imageY);
// }
