function makeProductCard(id, category, name, img_url) {
  return (
    '<div class="col-lg-3 col-md-4 col-sm-12 text-center justify-content-center" id="nav-rehab-wheelchair-card-' +
    id +
    '"><div class="card bg-light mb-3 justify-content-center text-center" data-toggle="modal" data-target="#rehabModal" data-pid="' +
    id +
    '" data-category="' +
    category +
    '"><img src="' +
    img_url +
    '" alt="' +
    name +
    '" class="card-img-top"><div class="card-body"><h4 class="card-title">' +
    name +
    '</h4><h5 class="card-subtitle text-muted">Product code</h5></div></div></div>'
  );
}
let products;
fetch("../data/product_category.json")
  .then((response) => response.json())
  .then((json) => json.categories)
  .then((categories) => categories[1].link)
  .then((link) => {
    fetch(link)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        // For WheelChair
        products = json;
        let wheelchairContent = document.querySelector(
          "#nav-rehab-wheelchair .container .row"
        );
        console.log(wheelchairContent.innerHTML);
        let wheelchairs = json.categories.find(
          (category) => category.name === "WheelChair"
        );
        console.log(wheelchairs.items);
        let cards = [];
        wheelchairs.items.forEach((element) => {
          let wheelchairCard = makeProductCard(
            element["product-id"],
            "WheelChair",
            element["product-name"],
            element["product-image-url"]
          );
          cards += wheelchairCard;
        });
        wheelchairContent.innerHTML = cards;
        // for Walker
        let WalkerContent = document.querySelector(
          "#nav-rehab-walker .container .row"
        );
        console.log(WalkerContent.innerHTML);
        let walkers = json.categories.find(
          (category) => category.name === "Walker"
        );
        console.log(walkers.items);
        cards = [];
        walkers.items.forEach((element) => {
          let walkerCard = makeProductCard(
            element["product-id"],
            "Walker",
            element["product-name"],
            element["product-image-url"]
          );
          cards += walkerCard;
        });
        WalkerContent.innerHTML = cards;
        // for Walking Sticks
        let WalkingSticksContent = document.querySelector(
          "#nav-rehab-walking-stick .container .row"
        );
        console.log(WalkingSticksContent.innerHTML);
        let walkingSticks = json.categories.find(
          (category) => category.name === "Walking Stick"
        );
        console.log(walkingSticks.items);
        cards = [];
        walkingSticks.items.forEach((element) => {
          let WalkingSticksCard = makeProductCard(
            element["product-id"],
            "Walking Stick",
            element["product-name"],
            element["product-image-url"]
          );
          cards += WalkingSticksCard;
        });
        WalkingSticksContent.innerHTML = cards;
        // for Commode tools
        let CommodeContent = document.querySelector(
          "#nav-rehab-commode .container .row"
        );
        console.log(CommodeContent.innerHTML);
        let commode = json.categories.find(
          (category) => category.name === "Commode Tools"
        );
        console.log(commode.items);
        cards = [];
        commode.items.forEach((element) => {
          let CommodeCard = makeProductCard(
            element["product-id"],
            "Commode Tools",
            element["product-name"],
            element["product-image-url"]
          );
          cards += CommodeCard;
        });
        CommodeContent.innerHTML = cards;
        // for Beds
        let BedContent = document.querySelector(
          "#nav-rehab-bed .container .row"
        );
        console.log(BedContent.innerHTML);
        let Bed = json.categories.find(
          (category) => category.name === "Rehabilitation Bed"
        );
        console.log(Bed.items);
        cards = [];
        Bed.items.forEach((element) => {
          let BedCard = makeProductCard(
            element["product-id"],
            "Rehabilitation Bed",
            element["product-name"],
            element["product-image-url"]
          );
          cards += BedCard;
        });
        BedContent.innerHTML = cards;
        // for healthcare
        let healthcareContent = document.querySelector(
          "#nav-rehab-healthcare .container .row"
        );
        console.log(healthcareContent.innerHTML);
        let healthcare = json.categories.find(
          (category) => category.name === "Healthcare Devices"
        );
        console.log(healthcare.items);
        cards = [];
        healthcare.items.forEach((element) => {
          let healthcareCard = makeProductCard(
            element["product-id"],
            "Healthcare Devices",
            element["product-name"],
            element["product-image-url"]
          );
          cards += healthcareCard;
        });
        healthcareContent.innerHTML = cards;
      });
  });
$("#rehabModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  // var  = button.data("pid"); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  let category = button.data("category");
  let pid = button.data("pid");
  let product = products.categories.find((element) => element.name === category)
    .items;
  product = product.find((element) => Number(element["product-id"]) === pid);
  console.log(product);
  var modal = $(this);
  modal.find(".modal-title").text(category);
  modal.find(".modal-body img").attr("src", product["product-image-url"]);
  modal
    .find(".modal-body #modal-content-pointer h2")
    .text(product["product-name"]);
  modal.find(".modal-body #modal-content-pointer h3").text("Product Code");
  modal
    .find(".modal-body #modal-content-pointer p")
    .text(product["product-description"]);

  modal
    .find(".modal-body #modal-content-pointer h5")
    .text(product["company"][0].name);
});
// Wheelchair card
// <div class="col-md-4 col-sm-12 text-center justify-content-center"
//     id="nav-rehab-wheelchair-cards">
//     <div class="card bg-light mb-3 justify-content-center text-center"
//        data-toggle="modal" data-target="#rehabModal">
//        <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
//            class="card-img-top">
//        <div class="card-body">
//          <h4 class="card-title">wheelchair</h4>
//          <h5 class="card-subtitle text-muted">Product code</h5>
//        </div>
//     </div>
//  </div>
