let taxSwitch = document.getElementById("switchCheckDefault");

  taxSwitch.addEventListener("click", () => {
    // Grab all instances across every card component
    let basePrices = document.getElementsByClassName("base-price");
    let totalPrices = document.getElementsByClassName("total-price");
    let taxInfoTags = document.getElementsByClassName("tax-info");

    for (let i = 0; i < basePrices.length; i++) {
      // If the total price is hidden, the switch is being turned ON
      if (totalPrices[i].classList.contains("d-none")) {
        // Apply line-through and dim the original price
        basePrices[i].style.textDecoration = "line-through";
        basePrices[i].style.color = "#717171"; 
        
        // Reveal the updated price and its accompanying tag
        totalPrices[i].classList.remove("d-none");
        taxInfoTags[i].classList.remove("d-none");
      } else {
        // Clear line-through and restore crisp text formatting when turned OFF
        basePrices[i].style.textDecoration = "none";
        basePrices[i].style.color = "inherit";
        
        // Hide total prices and tags again
        totalPrices[i].classList.add("d-none");
        taxInfoTags[i].classList.add("d-none");
      }
    }
  });