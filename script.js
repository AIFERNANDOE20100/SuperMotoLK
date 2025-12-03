// 🔗 Replace with your published CSV download link
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSSz-oWF0jOFFWhMFm5TFmxGdXarww3evJeYjz6oz2ojDRxLCLggivu-bU4xYa5q4YBNEbef1S_png0/pub?output=csv";

let products = [];

// Load CSV Dynamically
async function loadCSV() {
  try {
    const res = await fetch(SHEET_CSV_URL + "&t=" + Date.now());
    const data = await res.text();
    products = parseCSV(data);
    populateCategoryFilter();
    loadProducts(products);
  } catch (err) {
    console.log("CSV load error:", err);
  }
}

// Convert CSV rows → objects
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(row => {
    const cols = row.split(",");
    const obj = {};

    headers.forEach((h, i) => {
      obj[h.trim()] = cols[i]?.trim();
    });

    return obj;
  });
}

// Load product cards
function loadProducts(list) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  list.forEach(p => {
    const inStock = p.in_stock.toLowerCase() === "yes";

    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        
        <h3>${p.title}</h3>
        <p>${p.price}</p>

        <span class="stock-badge ${inStock ? "in" : "out"}">
          ${inStock ? "In Stock" : "Out of Stock"}
        </span>

        <button class="btn-cart" ${!inStock ? "disabled" : ""} onclick="addToCart('${p.title}')">
          ${inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    `;
  });
}


// Build category dropdown dynamically
function populateCategoryFilter() {
  const select = document.getElementById("categorySelect");
  const categories = [...new Set(products.map(p => p.category))];

  select.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// Filtering system
function filterProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("categorySelect").value;

  const filtered = products.filter(p =>
    (cat === "all" || p.category === cat) &&
    p.title.toLowerCase().includes(search)
  );

  loadProducts(filtered);
}

function addToCart(title) {
  alert(title + " added to cart");
}

// Initial load
loadCSV();

// Auto-refresh every 30 sec
setInterval(loadCSV, 30000);
