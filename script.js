const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let coinsData = []; // global dataset
let sortState = { marketCap: "desc", percentage: "desc" }; // toggle states

// -------- Fetch Method 1: Using .then ----------
fetch(URL)
    .then(response => response.json())
    .then(data => {
        coinsData = data;
        renderTable(coinsData);
    })
    .catch(error => console.error("Error fetching data with .then:", error));

// -------- Fetch Method 2: Using async/await ----------
async function fetchCoins() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        coinsData = data;
        // renderTable(coinsData); // uncomment if you want this to run instead of .then
    } catch (error) {
        console.error("Error fetching data with async/await:", error);
    }
}
// fetchCoins(); // optional: use this instead of .then

// -------- Render Table ----------
function renderTable(data) {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";

    data.forEach(element => {
        const percentage = element.price_change_percentage_24h;
        const color = percentage >= 0 ? "green" : "red";
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("class", "table-row");
        tableRow.innerHTML = `
      <td>
        <div class="coin-info">
          <img class="coin-image" src="${element.image}" alt="${element.name}" width="20">
          <span class="coin-name">${element.name}</span>
        </div>
      </td>
      <td>${element.symbol.toUpperCase()}</td>
      <td>$${element.current_price.toLocaleString()}</td>
      <td>${element.total_volume.toLocaleString()}</td>
      <td style="color:${color};">${element.price_change_percentage_24h.toFixed(2)}%</td>
      <td>$${element.market_cap.toLocaleString()}</td>
    `;
        tbody.appendChild(tableRow);
    });
}

// -------- Sort by Market Cap (toggle asc/desc) ----------
function MarketCap() {
    const sorted = [...coinsData].sort((a, b) =>
        sortState.marketCap === "desc" ? b.market_cap - a.market_cap : a.market_cap - b.market_cap
    );
    sortState.marketCap = sortState.marketCap === "desc" ? "asc" : "desc";
    renderTable(sorted);
}

// -------- Sort by Percentage Change (toggle asc/desc) ----------
function Percentage() {
    const sorted = [...coinsData].sort((a, b) =>
        sortState.percentage === "desc"
            ? b.price_change_percentage_24h - a.price_change_percentage_24h
            : a.price_change_percentage_24h - b.price_change_percentage_24h
    );
    sortState.percentage = sortState.percentage === "desc" ? "asc" : "desc";
    renderTable(sorted);
}

// function PercentageColor(){
    
// }

// -------- Search Filter ----------
const searchInput = document.querySelector("#Search_bar");

searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = coinsData.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
});
