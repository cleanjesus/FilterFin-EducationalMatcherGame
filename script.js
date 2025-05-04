// Shark data for the game
const sharks = [
  {
    id: 1,
    name: "Whale Shark",
    image: "whalesharkjpeg.jpeg",
    type: "filterFeeder",
  },
  {
    id: 2,
    name: "Basking Shark",
    image: "basking.JPG",
    type: "filterFeeder",
  },
  {
    id: 3,
    name: "Megamouth Shark",
    image: "megamouth.jpg",
    type: "filterFeeder",
  },
  {
    id: 4,
    name: "Great White Shark",
    image: "greatwhite.png",
    type: "nonFilterFeeder",
  },
  {
    id: 5,
    name: "Hammerhead Shark",
    image: "hammerhead.jpg",
    type: "nonFilterFeeder",
  },
  {
    id: 6,
    name: "Thresher Shark",
    image: "thresher.jpg",
    type: "nonFilterFeeder",
  },
];

// Food data for level 2
const foods = [
  {
    id: 1,
    name: "Plankton",
    image: "plankton-1024.jpg",
    type: "planktonFood",
  },
  {
    id: 2,
    name: "Krill",
    image: "1200px-Meganyctiphanes_norvegica2.jpg",
    type: "planktonFood",
  },
  {
    id: 3,
    name: "Algae",
    image: "Colonies-thousands-cells-Volvox-globator-flagella-cell.jpg",
    type: "planktonFood",
  },
  {
    id: 4,
    name: "Fish",
    image: "tuna.jpg",
    type: "sharkFood",
  },
  {
    id: 5,
    name: "Seal",
    image: "AdobeStock_144122226.jpeg",
    type: "sharkFood",
  },
  {
    id: 6,
    name: "Squid",
    image: "GettyImages-508486981-1200x628.jpg",
    type: "sharkFood",
  },
];

let level1Complete = false;
let level2Complete = false;
let isMobileDevice = false;
let selectedCard = null; // Store the currently selected card

function checkMobile() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

document.addEventListener("DOMContentLoaded", function () {
  isMobileDevice = checkMobile();

  if (isMobileDevice) {
    const gameSection = document.getElementById("game");
    const mobileTip = document.createElement("div");
    mobileTip.className = "mobile-tip";
    mobileTip.innerHTML =
      "<p>Tip: Tap a card to select it, then tap a category to place it there.</p>";
    gameSection.insertBefore(mobileTip, gameSection.firstChild);
  }

  initLevel1();

  const dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("dragenter", dragEnter);
    zone.addEventListener("dragleave", dragLeave);
    zone.addEventListener("drop", drop);

    // Add click handler for mobile tap-to-place functionality
    if (isMobileDevice) {
      zone.addEventListener("click", function (e) {
        if (selectedCard) {
          placeCardInZone(selectedCard, this);
        }
      });
    }
  });

  document.getElementById("resetGame").addEventListener("click", resetLevel1);
  document
    .getElementById("checkAnswers")
    .addEventListener("click", checkLevel1);

  document.getElementById("resetLevel2").addEventListener("click", resetLevel2);
  document.getElementById("checkLevel2").addEventListener("click", checkLevel2);

  document.getElementById("nextLevelBtn").addEventListener("click", showLevel2);

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const currentYear = new Date().getFullYear();
  const footerYear = document.querySelector("footer p");
  footerYear.textContent = footerYear.textContent.replace("2023", currentYear);
});

function handleImageError(img, fallbackText) {
  img.onerror = function () {
    const parent = img.parentElement;

    img.remove();

    const fallback = document.createElement("div");
    fallback.className = "image-fallback";
    fallback.textContent = fallbackText.charAt(0);
    fallback.title = fallbackText;

    if (parent.firstChild) {
      parent.insertBefore(fallback, parent.firstChild);
    } else {
      parent.appendChild(fallback);
    }
  };
}

function initLevel1() {
  const sharksContainer = document.getElementById("sharksContainer");
  sharksContainer.innerHTML = "";

  const shuffledSharks = [...sharks].sort(() => Math.random() - 0.5);

  shuffledSharks.forEach((shark) => {
    const sharkCard = createCard(shark, "shark-card");
    sharksContainer.appendChild(sharkCard);
  });

  document.getElementById("filterFeederZone").innerHTML = "";
  document.getElementById("nonFilterFeederZone").innerHTML = "";

  document.getElementById("gameResult").classList.add("hidden");
  document.getElementById("level1Complete").classList.add("hidden");

  document.getElementById("nextLevelBtn").classList.remove("active");

  // Reset selected card
  selectedCard = null;
}

function initLevel2() {
  const foodContainer = document.getElementById("foodContainer");
  foodContainer.innerHTML = "";

  const shuffledFoods = [...foods].sort(() => Math.random() - 0.5);

  shuffledFoods.forEach((food) => {
    const foodCard = createCard(food, "food-card");
    foodContainer.appendChild(foodCard);
  });

  document.getElementById("sharkFoodZone").innerHTML = "";
  document.getElementById("planktonFoodZone").innerHTML = "";

  document.getElementById("level2Result").classList.add("hidden");
  document.getElementById("gameComplete").classList.add("hidden");

  // Reset selected card
  selectedCard = null;
}

function createCard(item, className) {
  const card = document.createElement("div");
  card.className = className;
  card.dataset.id = item.id;
  card.dataset.type = item.type;

  if (className === "shark-card") {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.draggable = false;
    handleImageError(img, item.name);
    card.appendChild(img);

    const name = document.createElement("p");
    name.textContent = item.name;
    card.appendChild(name);
  } else if (className === "food-card") {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.draggable = false;
    img.className = "food-image";
    handleImageError(img, item.name);
    card.appendChild(img);

    const name = document.createElement("p");
    name.textContent = item.name;
    name.className = "food-name";
    card.appendChild(name);
  }

  // Only add drag events for desktop
  if (!isMobileDevice) {
    card.draggable = true;
    card.addEventListener("dragstart", dragStart);
  } else {
    // Add click handler for mobile
    card.addEventListener("click", handleMobileCardClick);
  }

  return card;
}

function handleMobileCardClick(e) {
  // If there's already a selected card
  if (selectedCard) {
    // If it's the same card, deselect it
    if (selectedCard === this) {
      this.classList.remove("selected-card");
      selectedCard = null;
      return;
    }

    // If it's a different card, deselect the old one
    selectedCard.classList.remove("selected-card");
  }

  // Select the new card
  this.classList.add("selected-card");
  selectedCard = this;
}

function placeCardInZone(card, zone) {
  // First remove selection
  card.classList.remove("selected-card");

  // Then place the card in the zone
  zone.appendChild(card);

  // Reset selected card
  selectedCard = null;
}

function dragStart(e) {
  e.dataTransfer.setData(
    "text/plain",
    e.target.dataset.id + "," + e.target.className
  );
  setTimeout(() => {
    e.target.classList.add("dragging");
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add("drag-over");
}

function dragLeave(e) {
  this.classList.remove("drag-over");
}

function drop(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  const data = e.dataTransfer.getData("text/plain").split(",");
  const itemId = data[0];
  const className = data[1];

  let draggedItem;
  if (className === "shark-card") {
    draggedItem = document.querySelector(`.shark-card[data-id="${itemId}"]`);
  } else if (className === "food-card") {
    draggedItem = document.querySelector(`.food-card[data-id="${itemId}"]`);
  }

  if (draggedItem) {
    draggedItem.classList.remove("dragging");
    this.appendChild(draggedItem);
  }
}

document.addEventListener("dragend", function (e) {
  const draggingItems = document.querySelectorAll(".dragging");
  draggingItems.forEach((item) => item.classList.remove("dragging"));

  if (e.target.classList.contains("shark-card")) {
    const dropResult = e.dataTransfer.dropEffect;
    if (dropResult === "none") {
      const sharksContainer = document.getElementById("sharksContainer");
      if (!sharksContainer.contains(e.target)) {
        sharksContainer.appendChild(e.target);
      }
    }
  } else if (e.target.classList.contains("food-card")) {
    const dropResult = e.dataTransfer.dropEffect;
    if (dropResult === "none") {
      const foodContainer = document.getElementById("foodContainer");
      if (!foodContainer.contains(e.target)) {
        foodContainer.appendChild(e.target);
      }
    }
  }
});

function resetLevel1() {
  initLevel1();
}

function resetLevel2() {
  initLevel2();
}

function checkLevel1() {
  let score = 0;
  let total = sharks.length;

  const filterFeederZone = document.getElementById("filterFeederZone");
  const filterFeederSharks = filterFeederZone.querySelectorAll(".shark-card");

  filterFeederSharks.forEach((shark) => {
    if (shark.dataset.type === "filterFeeder") {
      shark.classList.add("correct-match");
      shark.classList.remove("incorrect-match");
      score++;
    } else {
      shark.classList.add("incorrect-match");
      shark.classList.remove("correct-match");
    }
  });

  const nonFilterFeederZone = document.getElementById("nonFilterFeederZone");
  const nonFilterFeederSharks =
    nonFilterFeederZone.querySelectorAll(".shark-card");

  nonFilterFeederSharks.forEach((shark) => {
    if (shark.dataset.type === "nonFilterFeeder") {
      shark.classList.add("correct-match");
      shark.classList.remove("incorrect-match");
      score++;
    } else {
      shark.classList.add("incorrect-match");
      shark.classList.remove("correct-match");
    }
  });

  const gameResult = document.getElementById("gameResult");
  document.getElementById("score").textContent = score;
  document.getElementById("total").textContent = total;

  gameResult.classList.remove("hidden");
  if (score === total) {
    gameResult.classList.add("correct");
    gameResult.classList.remove("incorrect");

    level1Complete = true;
    document.getElementById("level1Complete").classList.remove("hidden");
    document.getElementById("nextLevelBtn").classList.add("active");
  } else {
    gameResult.classList.add("incorrect");
    gameResult.classList.remove("correct");

    if (score > 0) {
      let encourageMsg = document.querySelector(".encourage-msg");
      if (!encourageMsg) {
        encourageMsg = document.createElement("p");
        encourageMsg.className = "encourage-msg";
        gameResult.appendChild(encourageMsg);
      }
      encourageMsg.textContent = `You're on the right track! Try reviewing the shark types and trying again.`;
    }
  }
}

function checkLevel2() {
  let score = 0;
  let total = foods.length;

  const sharkFoodZone = document.getElementById("sharkFoodZone");
  const sharkFoodItems = sharkFoodZone.querySelectorAll(".food-card");

  sharkFoodItems.forEach((food) => {
    if (food.dataset.type === "sharkFood") {
      food.classList.add("correct-match");
      food.classList.remove("incorrect-match");
      score++;
    } else {
      food.classList.add("incorrect-match");
      food.classList.remove("correct-match");
    }
  });

  const planktonFoodZone = document.getElementById("planktonFoodZone");
  const planktonFoodItems = planktonFoodZone.querySelectorAll(".food-card");

  planktonFoodItems.forEach((food) => {
    if (food.dataset.type === "planktonFood") {
      food.classList.add("correct-match");
      food.classList.remove("incorrect-match");
      score++;
    } else {
      food.classList.add("incorrect-match");
      food.classList.remove("correct-match");
    }
  });

  const level2Result = document.getElementById("level2Result");
  document.getElementById("scoreLevel2").textContent = score;
  document.getElementById("totalLevel2").textContent = total;

  level2Result.classList.remove("hidden");
  if (score === total) {
    level2Result.classList.add("correct");
    level2Result.classList.remove("incorrect");

    level2Complete = true;
    document.getElementById("gameComplete").classList.remove("hidden");
  } else {
    level2Result.classList.add("incorrect");
    level2Result.classList.remove("correct");

    if (score > 0) {
      let encourageMsg = document.querySelector(".encourage-msg-level2");
      if (!encourageMsg) {
        encourageMsg = document.createElement("p");
        encourageMsg.className = "encourage-msg-level2";
        level2Result.appendChild(encourageMsg);
      }
      encourageMsg.textContent = `Good effort! Check the shark info section to review what each type eats.`;
    }
  }
}

function showLevel2() {
  if (level1Complete) {
    document.getElementById("level2").classList.add("active");
    initLevel2();

    const level2Element = document.getElementById("level2");
    if (level2Element) {
      level2Element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}
