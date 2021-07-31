var dog, dogImg, happyDodImg;
var database;
var foodS, foodStock;

var foodObj;
var addFood, feed;
var play, eat, bath, sleep;
var fedTime, lastFed;

var readState, gameState;

var gardenImg, bedroomImg, washroomImg;

var currentTime;

function preload() {
  dogImg = loadImage("images/dogImg.png");
  happyDodImg = loadImage("images/dogImg1.png");

  gardenImg = loadImage("images/Garden.png");
  bedroomImg = loadImage("images/BedRoom.png");
  washroomImg = loadImage("images/WashRoom.png");
}

function setup() {
  createCanvas(500, 800);

  dog = createSprite(250, 700);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  foodObj = new Food();

  addFood = createButton("Add Food");
  feed = createButton("Feed");
  play = createButton("Play");
  bath = createButton("Bath");
  sleep = createButton("Sleep");
  eat = createButton("Feed");

  addFood.position(430, 70);
  feed.position(520, 70);
  eat.position(520, 70);
  play.position(580, 70);
  bath.position(635, 70);
  sleep.position(690, 70);

  addFood.mousePressed(AddFood);
  feed.mousePressed(feedDog);
  play.mousePressed(Play);
  bath.mousePressed(Bath);
  sleep.mousePressed(Sleep);
  eat.mousePressed(Eat);

  readState = database.ref("gameState");
  readState.on("value", function (data) {
    gameState = data.val();
  });

  currentTime = hour();
}

function draw() {
  background("yellow");

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  if (gameState !== "hungry") {
    addFood.hide();
    feed.hide();
    eat.show();
  } else {
    addFood.show();
    feed.show();
    eat.hide();
    foodObj.display();
    drawSprites();
  }

  if (gameState === "playing") {
    foodObj.garden();
  } else if (gameState === "sleeping") {
    foodObj.bedroom();
  } else if (gameState === "bathing") {
    foodObj.washroom();
  } else {
    updateState("hungry");
  }

  fill("Black");
  textSize(30);
  textFont(BOLD);

  if (lastFed === undefined) {
    text("");
  } else if (lastFed > 12 && lastFed % 12 !== 0) {
    text("Last Feed Time: " + (lastFed % 12) + " PM", 100, 100);
  } else if (lastFed == 24) {
    text("Last Feed Time: 12 AM", 100, 100);
  } else if (lastFed === 12) {
    text("Last Feed Time: 12 PM", 120, 100);
  } else {
    text("Last Feed Time: " + lastFed + " AM", 120, 100);
  }
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFood(foodS);
}

function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref("/").update({
    Food: x,
  });
}

function AddFood() {
  if (foodS < 72) {
    dog.addImage(dogImg);
    foodS++;
    database.ref("/").update({
      Food: foodS,
    });
  }
}

function feedDog() {
  if (foodS > 0) {
    dog.addImage(happyDodImg);

    foodS--;

    database.ref("/").update({
      Food: foodS,
      FeedTime: hour(),
    });
  }
}

function updateState(state) {
  database.ref("/").update({
    gameState: state,
  });
}

function Play() {
  updateState("playing");
}

function Bath() {
  updateState("bathing");
}

function Sleep() {
  updateState("sleeping");
}

function Eat() {
  updateState("hungry");
}
