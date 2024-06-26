const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const commentInput = document.querySelector("#gcomment");
const commentList = document.querySelector("#comment_list");
const sortAscButton = document.querySelector("#sort_asc");
const sortDescButton = document.querySelector("#sort_desc");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const date = new Date();
  if (!name || !comment) {
    return;
  }

  const newComment = document.createElement("li");
  newComment.innerHTML = `<strong>${name}</strong> - ${comment} - 
    <time datetime="${date}">${date.toLocaleString()}</time>`;

  const listItem = document.createElement("li");
  listItem.appendChild(newComment);
  commentList.appendChild(listItem);
  nameInput.value = "";
  commentInput.value = "";
  form.querySelector('button[type="submit"]').disabled = false;
});

function sortComments(ascending) {
  const comments = Array.from(commentList.children);
  comments.sort(function (a, b) {
    const aDate = new Date(a.querySelector("time").getAttribute("datetime"));
    const bDate = new Date(b.querySelector("time").getAttribute("datetime"));
    return ascending ? aDate - bDate : bDate - aDate;
  });

  commentList.innerHTML = "";
  comments.forEach(function (comment) {
    commentList.appendChild(comment);
  });
}

sortAscButton.addEventListener("click", function () {
  sortComments(true);
});

sortDescButton.addEventListener("click", function () {
  sortComments(false);
});

function searchCountry() {
  var countryName = document.getElementById("country_input").value.trim();
  if (!countryName) {
    document.getElementById("country_details").innerHTML =
      "<p>Please enter a country name.</p>";
    document.getElementById("same_countries").innerHTML = "";
    return;
  }

  fetch("https://restcountries.com/v3.1/name/" + countryName)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Country not found");
      }
      return response.json();
    })

    .then(function (countryData) {
      let country = countryData[0];
      let details = `<h2>Country Details - ${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of 
          ${country.name.common}" width="100">
      
        <p><strong>Area:</strong> 
          ${country.area?country.area.toLocaleString()+
            "square kilometers":"N/A"}
        </p>
      
        <p><strong>Languages:</strong> 
          ${country.languages ? Object.values(country.languages)
            .join(", ") : "N/A"}
        </p>
      
        <p><strong>Subregion:</strong> 
          ${country.subregion ? country.subregion : "N/A"}
        </p>
      
        <p><strong>Capital:</strong> 
          ${country.capital ? country.capital[0] : "N/A"}
        </p>
      
        <p><strong>Timezones:</strong> 
          ${country.timezones ? country.timezones.join(", ") : "N/A"}
        </p>`;

      document.getElementById("country_details").innerHTML = details;
      return fetch("https://restcountries.com/v3.1/region/" + country.region);
    })

    .then(function (response) {
      if (!response.ok) {
        throw new Error("Region not found");
      }
      return response.json();
    })

    .then(function (regionData) {
      var region = regionData[0].region;
      var sameRegionCountriesList = regionData
        .map(function (c) {
          return `
            <div class="country-card">
              <img src="${c.flags.svg}" alt="Flag of ${c.name.common}" 
                width="50">
              <p>${c.name.common}</p>
            </div>`;
        }) .join("");

      document.getElementById("same_countries").innerHTML = 
        `<h2>Countries in the Same Region (${region})</h2>
        <div class="country-list">${sameRegionCountriesList}</div>`;
    })

    .catch(function (error) {
      console.error("Error fetching data:", error);
      document.getElementById("country_details").innerHTML =
        "<p>An error occurred: " + error.message + "</p>";
      document.getElementById("same_countries").innerHTML = "";
    });
}

document.getElementById("countries_button")
.addEventListener("click", function () {
    window.location.href = "./countries.html";
  });