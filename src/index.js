let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyUrl = "http://localhost:3000/toys";
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");
  let allToys = [];

  // Toggle the toy form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display all toys
  fetch(toyUrl)
    .then(response => response.json())
    .then(toys => {
      allToys = toys;
      displayToys(allToys);
    })
    .catch(error => console.error('Error fetching the toys:', error));

  // Function to display all toys on the DOM
  function displayToys(toys) {
    // Clear the toyCollection by removing each child
    while (toyCollection.firstChild) {
      toyCollection.removeChild(toyCollection.firstChild);
    }

    // Add each toy to the collection
    toys.forEach(toy => {
      createToyCard(toy);
    });
  }

  // Function to create toy cards for each toy
  function createToyCard(toy) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const toyName = document.createElement("h2");
    toyName.textContent = toy.name;

    const toyImg = document.createElement("img");
    toyImg.src = toy.image;
    toyImg.className = "toy-avatar";

    const toyLikes = document.createElement("p");
    toyLikes.textContent = `${toy.likes} likes`;

    const likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = `like-btn-${toy.id}`;
    likeButton.textContent = "Like ❤️";
    likeButton.addEventListener("click", () => {
      increaseLikes(toy);
    });

    cardDiv.appendChild(toyName);
    cardDiv.appendChild(toyImg);
    cardDiv.appendChild(toyLikes);
    cardDiv.appendChild(likeButton);

    toyCollection.appendChild(cardDiv);
  }

  // Function to handle like button click
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`${toyUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        displayToys(allToys);
      })
      .catch(error => console.error('Error updating likes:', error));
  }

  // Handle form submission
  addToyForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(addToyForm);
    const newToy = {
      name: formData.get("name"),
      image: formData.get("image"),
      likes: 0
    };

    console.log("Submitting new toy:", newToy); // Debugging log

    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        console.log("Toy added:", toy); // Debugging log
        allToys.push(toy);
        createToyCard(toy);
        addToyForm.reset();
      })
      .catch(error => console.error('Error adding the toy:', error));
  });
});
