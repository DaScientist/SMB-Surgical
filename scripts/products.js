fetch("../data/product_category.json")
  .then((response) => response.json())
  .then((json) => json.categories)
  .then((categories) => categories[1].link)
  .then((link) => {
    fetch(link)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        let wheelchairContent = document.querySelector("#nav-rehab-wheelchair");
        console.log(wheelchairContent.innerHTML);
        let wheelchairs = json.categories.find(
          (category) => category.name === "WheelChair"
        );
        console.log(wheelchairs.items);
        let cards;
        wheelchairs.items.forEach((element) => {
          let wheelchairCard = "";
        });
      });
  });
