class ProductDto {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.brand = data.brand;
    this.color = data.color;
    this.baseUrl = data.baseUrl;
    this.files = data.files; // important for images
  }
}

module.exports = { ProductDto };