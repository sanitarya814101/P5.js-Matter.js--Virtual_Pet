class Food {
  constructor() {
    this.foodStock = 0;
    this.image = loadImage("images/Milk.png");
  }

  updateFood(foodStock) {
    this.foodStock = foodStock;

  }

  getFoodStock() {
    return this.foodStock;
  }

  garden() {
    background(gardenImg, 500, 800);
  }

  bedroom() {
    background(bedroomImg, 500, 800);
  }

  washroom() {
    background(washroomImg, 500, 400);
  }

  display() {
    var x = 80;
    var y = 120;

    imageMode(CENTER);
    image(this.image, 150, 700, 70, 70);

    if (this.foodStock !== 0) {
      for (var i = 0; i < this.foodStock; i++) {
        if (i % 12 == 0) {
          x = 80;
          y = y + 70;
        }
        image(this.image, x, y, 70, 70);
        x = x + 30;
      }
    }
  }
}
