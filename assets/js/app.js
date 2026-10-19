// 1. Global State Management & Path Logic
const isSubfolder = window.location.pathname.includes('/pages/');
const isCheckoutFolder = window.location.pathname.includes('/checkout/');
const rootPrefix = isCheckoutFolder ? '../../' : (isSubfolder ? '../' : '');

function fixPath(path) {
  if (!path || path.startsWith('http') || path.startsWith('data:') || path.startsWith('#')) return path;
  
  // If path is index.html, it's always at the root
  if (path === 'index.html') return rootPrefix + 'index.html';
  
  // If it's a page in checkout
  const checkoutPages = ['checkout.html', 'checkout-guest.html', 'payment.html', 'confirmation.html', 'delivery.html', 'receipt.html'];
  if (checkoutPages.includes(path.split('?')[0])) {
      return rootPrefix + 'pages/checkout/' + path;
  }
  
  // Other pages are in pages/
  if (path.endsWith('.html') || path.includes('.html?')) {
      return rootPrefix + 'pages/' + path;
  }

  // Assets (images)
  if (path.startsWith('assets/images/')) return rootPrefix + path;
  
  return rootPrefix + path;
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

function updateCartBadge() {
  const badges = document.querySelectorAll('.badge.bg-warning, #cart-badge');
  badges.forEach(badge => {
    badge.textContent = cartCount;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Ensure badges are updated on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

window.addToCart = function (productName, price, quantity = 1, event = null) {
  if (event) event.stopPropagation();

  const parsedQty = parseInt(quantity, 10) || 1;
  const parsedPrice = parseFloat(price) || 0;

  const existing = cart.find(i => i.name === productName);
  if (existing) {
    existing.quantity += parsedQty;
  } else {
    cart.push({ name: productName, price: parsedPrice, quantity: parsedQty });
  }

  cartCount += parsedQty;
  updateCartBadge();

  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }


  if (event && event.target) {
    let btn = event.target.closest('button');
    if (btn) {
      let originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-pandayan');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-pandayan');
      }, 1500);
    }
  }
};

// Handle "Reorder" from history
window.reorderItems = function (items, event) {
  if (event) event.stopPropagation();
  let totalQtyAdded = 0;

  items.forEach(item => {
    const parsedQty = parseInt(item.quantity, 10) || 1;
    const parsedPrice = parseFloat(item.price) || 0;
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += parsedQty;
    } else {
      cart.push({ name: item.name, price: parsedPrice, quantity: parsedQty });
    }
    totalQtyAdded += parsedQty;
  });

  cartCount += totalQtyAdded;
  updateCartBadge();

  if (event && event.target) {
    let btn = event.target.closest('button');
    if (btn) {
      let originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Reordered';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-pandayan-outline');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-pandayan-outline');
      }, 1500);
    }
  }
};

// Specifically for bulk orders HTML
window.addBulkToCart = function (name, btn) {
  let inputId = '';
  if (name.includes('Intermediate Pad')) inputId = 'qty-pad';
  else if (name.includes('Ballpen Box')) inputId = 'qty-ballpen';
  else if (name.includes('Faber-Castell')) inputId = 'qty-faber';
  else if (name.includes('Sakura Watercolor')) inputId = 'qty-sakura';

  let qty = 10;
  if (inputId) {
    let el = document.getElementById(inputId);
    if (el) qty = parseInt(el.value) || 10;
  }

  addToCart(name, 0, qty);

  btn.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
  btn.classList.add('btn-success'); btn.classList.remove('btn-pandayan');
  setTimeout(() => { btn.innerHTML = 'Add'; btn.classList.remove('btn-success'); btn.classList.add('btn-pandayan'); }, 1500);
};

// 2. Product Catalog Expansion
const products = [
  // School Supplies
  {
    id: 1, category: 'school', audience: 'students', name: 'Intermediate Pad', price: 45.00, img: 'assets/images/intermediate_pad.png',
    desc: 'Standard intermediate writing pad with 80 leaves of quality ruled paper. Ideal for classroom notes, assignments, and everyday writing tasks.',
    features: ['80 leaves of smooth, ruled paper', 'Standard size for school use', 'Durable cover to protect pages', 'Perforated sheets for easy tear-out', 'Ideal for students of all levels']
  },
  {
    id: 2, category: 'school', audience: 'students', name: 'Composition Notebook', price: 65.00, img: 'assets/images/composition_notebook.png',
    desc: 'Classic composition notebook with sewn binding and durable marble-pattern cover. Great for classroom notes, journals, and assignments.',
    features: ['100 sheets of wide-ruled paper', 'Sewn binding for long-lasting use', 'Classic marble-pattern cover', 'Sturdy construction resists wear', 'Great for everyday school use']
  },
  {
    id: 3, category: 'school', audience: 'students', name: 'Yellow Pad', price: 50.00, img: 'assets/images/yellow_pad.png',
    desc: 'Standard yellow writing pad with 80 leaves of ruled paper. A must-have for students and professionals needing affordable, reliable writing pads.',
    features: ['80 leaves of quality yellow paper', 'Standard ruled lines for neat writing', 'Glue-top binding for easy removal', 'Lightweight and portable', 'Perfect for note-taking and drafts']
  },
  {
    id: 4, category: 'school', audience: 'students', name: 'Plastic Envelopes', price: 20.00, img: 'assets/images/plastic_envelope.png',
    desc: 'Durable clear plastic envelope with snap button closure. Keeps documents, papers, and projects organized and protected.',
    features: ['Clear plastic for easy identification', 'Snap button closure keeps contents secure', 'Legal or A4 size compatible', 'Water-resistant material', 'Ideal for school and office filing']
  },
  {
    id: 5, category: 'school', audience: 'students', name: 'Clear Book', price: 85.00, img: 'assets/images/plastic_envelope.png',
    desc: 'Clear book with 20 transparent pocket pages. Perfect for organizing and presenting certificates, reports, and project documents.',
    features: ['20 transparent pocket pages', 'Fits A4 and letter-size documents', 'Durable polypropylene cover', 'Easy to insert and remove pages', 'Professional look for presentations']
  },

  // Writing Instruments
  {
    id: 6, category: 'writing', audience: 'students', name: 'Ballpen Set (Black)', price: 120.00, img: 'assets/images/ballpen_set.png',
    desc: 'Set of 12 smooth-writing black ballpoint pens. Reliable, comfortable grip with skip-free ink flow for everyday writing.',
    features: ['12 ballpoint pens per set', 'Smooth, skip-free black ink', 'Comfortable rubber grip', '0.7mm tip for fine lines', 'Great for school and office use']
  },
  {
    id: 7, category: 'writing', audience: 'students', name: 'Gel Pen (Blue)', price: 35.00, img: 'assets/images/gel_pen.png',
    desc: 'Premium blue gel pen with ultra-smooth ink flow and comfortable grip. Ideal for writing assignments, notes, and exams.',
    features: ['Smooth blue gel ink', 'Fine 0.5mm tip', 'Comfortable non-slip grip', 'Quick-drying ink prevents smudging', 'Suitable for left and right-handed users']
  },
  {
    id: 8, category: 'writing', audience: 'teachers', name: 'Whiteboard Markers', price: 150.00, img: 'assets/images/whiteboard_markers.png',
    desc: 'Set of 4 vivid whiteboard markers in assorted colors. Quick-drying, low-odor formula that erases cleanly from any whiteboard surface.',
    features: ['4 assorted colors: black, blue, red, green', 'Bullet tip for bold, clear writing', 'Low-odor, non-toxic formula', 'Easy dry-erase from any whiteboard', 'Long-lasting ink supply']
  },
  {
    id: 9, category: 'writing', audience: 'offices', name: 'Highlighters (Assorted)', price: 90.00, img: 'assets/images/highlighters.png',
    desc: 'Pack of 6 bright highlighters in assorted fluorescent colors. Chisel tip for both broad and fine highlighting.',
    features: ['6 assorted fluorescent colors', 'Chisel tip for versatile marking', 'Non-toxic, water-based ink', 'Smear-resistant formula', 'Ideal for students and office professionals']
  },
  {
    id: 10, category: 'writing', audience: 'offices', name: 'Mechanical Pencil', price: 75.00, img: 'assets/images/mongol_pencil.png',
    desc: 'Precision mechanical pencil with 0.5mm lead and built-in eraser. Lightweight barrel with cushioned grip for extended writing comfort.',
    features: ['0.5mm lead for precise lines', 'Built-in click eraser', 'Cushioned rubber grip', 'Retractable tip for pocket safety', 'Includes 2 replacement lead tubes']
  },

  // Art Supplies
  {
    id: 11, category: 'art', audience: 'students', name: 'Sakura Watercolor Set', price: 350.00, img: 'assets/images/sakura_watercolor.png',
    desc: 'High-quality watercolor set perfect for beginners and professionals. Includes 12 vibrant colors, a brush, and a mixing palette.',
    features: ['12 assorted vivid colors in a compact tray', 'Non-toxic, safe for children and adults', 'Snap-lock lid with built-in mixing palette', 'Refillable pans for extended use', 'Ideal for school projects and professional artwork']
  },
  {
    id: 12, category: 'art', audience: 'students', name: 'Pentel Watercolor', price: 280.00, img: 'assets/images/pentel_watercolor.png',
    desc: 'Pentel watercolor set with 12 rich, blendable colors in tube format. Perfect for art classes, school projects, and creative hobbies.',
    features: ['12 vibrant watercolor tubes', 'Smooth, highly pigmented formula', 'Easy to blend and layer', 'Non-toxic and washable', 'Great for beginners and hobbyists']
  },
  {
    id: 13, category: 'art', audience: 'students', name: 'Faber-Castell Set', price: 450.00, img: 'assets/images/faber_castell.png',
    desc: 'Premium Faber-Castell 24-color pencil set with vibrant, break-resistant leads. Perfect for detailed drawing, coloring, and art class.',
    features: ['24 rich, vibrant colors', 'Break-resistant SV bonding lead', 'Eco-friendly certified wood', 'Smooth, even color laydown', 'Includes storage tin for portability']
  },
  {
    id: 14, category: 'art', audience: 'offices', name: 'Acrylic Paint Set', price: 500.00, img: 'assets/images/acrylic_paint.png',
    desc: 'Professional-grade acrylic paint set with 12 richly pigmented colors. Fast-drying, water-resistant finish for canvas, wood, and mixed media.',
    features: ['12 highly pigmented acrylic colors', 'Fast-drying and water-resistant', 'Suitable for canvas, wood, and paper', 'Non-toxic AP-certified formula', 'Ideal for professionals and students']
  },
  {
    id: 15, category: 'art', audience: 'students', name: 'Sketchpad A4', price: 150.00, img: 'assets/images/canvas_board.png',
    desc: 'A4-size sketchpad with 50 sheets of heavyweight acid-free paper. Suitable for pencil, charcoal, pastel, and light ink work.',
    features: ['50 sheets of heavyweight paper', 'Acid-free for archival quality', 'Suitable for pencil, charcoal, and pastel', 'Spiral binding lies flat', 'A4 size perfect for studio or travel']
  },

  // Office Supplies
  {
    id: 16, category: 'office', audience: 'offices', name: 'Bond Paper Ream A4', price: 250.00, img: 'assets/images/bond_paper.png',
    desc: 'Ream of 500 sheets of premium A4 bond paper, 80gsm. Bright white, smooth finish suitable for printing, copying, and everyday office tasks.',
    features: ['500 sheets per ream', '80gsm weight for durability', 'Bright white for sharp printing', 'Compatible with inkjet and laser printers', 'Ideal for reports, letters, and forms']
  },
  {
    id: 17, category: 'office', audience: 'offices', name: 'Stapler w/ Staple Wire', price: 180.00, img: 'assets/images/expanding_envelope.png',
    desc: 'Heavy-duty desktop stapler bundled with a box of standard No. 35 staple wires. Staples up to 25 sheets at a time.',
    features: ['Staples up to 25 sheets', 'Includes 1 box of No. 35 staple wires', 'Durable metal construction', 'Non-slip rubber base', 'Ergonomic design for comfortable use']
  },
  {
    id: 18, category: 'office', audience: 'offices', name: 'Sticky Notes 3x3', price: 45.00, img: 'assets/images/sticky_notes.png',
    desc: 'Pack of 100 self-adhesive sticky notes in classic yellow, 3×3 inch size. Repositionable and leaves no residue on surfaces.',
    features: ['100 sheets per pad', '3×3 inch standard size', 'Strong adhesive that repositions cleanly', 'Bright yellow for visibility', 'Ideal for reminders and bookmarks']
  },
  {
    id: 19, category: 'office', audience: 'offices', name: 'Binder Clips Box', price: 60.00, img: 'assets/images/expanding_envelope.png',
    desc: 'Box of 12 medium binder clips (32mm). Strong spring action securely holds stacks of paper, reports, and documents together.',
    features: ['12 binder clips per box', '32mm (medium) size', 'Strong spring-loaded grip', 'Foldable handles for flat storage', 'Great for organizing thick documents']
  },
  {
    id: 20, category: 'office', audience: 'offices', name: 'File Folder (Pack of 10)', price: 90.00, img: 'assets/images/expanding_envelope.png',
    desc: 'Pack of 10 manila file folders, letter size. Tab-cut design for easy labeling and organization of documents.',
    features: ['10 manila folders per pack', 'Letter size fits standard documents', '1/3 tab-cut for easy labeling', 'Durable 11pt manila stock', 'Perfect for home and office filing']
  },

  // Books & Reading
  {
    id: 21, category: 'books', audience: 'students', name: 'English Dictionary', price: 450.00, img: 'assets/images/composition_notebook.png',
    desc: 'Comprehensive English dictionary with over 50,000 entries, including definitions, pronunciation guides, and usage examples.',
    features: ['Over 50,000 word entries', 'Clear pronunciation guides', 'Example sentences for context', 'Compact paperback format', 'Essential reference for students']
  },
  {
    id: 22, category: 'books', audience: 'students', name: 'Noli Me Tangere', price: 250.00, img: 'assets/images/composition_notebook.png',
    desc: 'Complete unabridged edition of José Rizal\'s "Noli Me Tangere." A required reading for Filipino students, exploring social injustice in the Philippines.',
    features: ['Complete unabridged text', 'Filipino and English annotations', 'Required reading for Philippine literature', 'Historical context introduction', 'Compact and school-friendly format']
  },
  {
    id: 23, category: 'books', audience: 'teachers', name: 'Lesson Plan Book', price: 120.00, img: 'assets/images/composition_notebook.png',
    desc: 'Structured lesson plan book with weekly and daily planning grids. Helps teachers organize curricula, track progress, and manage classroom activities.',
    features: ['40-week planner layout', 'Weekly and daily planning pages', 'Space for objectives and assessments', 'Durable cover with spiral binding', 'Designed for K-12 educators']
  },
  {
    id: 24, category: 'books', audience: 'students', name: 'El Filibusterismo', price: 250.00, img: 'assets/images/composition_notebook.png',
    desc: 'Complete edition of José Rizal\'s "El Filibusterismo," the sequel to Noli Me Tangere. Essential reading for Philippine history and literature courses.',
    features: ['Complete unabridged text', 'Filipino and English annotations', 'Sequel to Noli Me Tangere', 'Includes historical context', 'Standard school edition']
  },
  {
    id: 25, category: 'books', audience: 'kids', name: 'Coloring Book', price: 75.00, img: 'assets/images/canvas_board.png',
    desc: 'Fun coloring book with 48 pages of illustrations featuring animals, shapes, and nature scenes. Printed on thick paper that resists marker bleed-through.',
    features: ['48 pages of fun illustrations', 'Thick paper prevents bleed-through', 'Animal, nature, and shape themes', 'Suitable for ages 3-8', 'Great for developing motor skills']
  },

  // Kids Toys
  {
    id: 26, category: 'kids', audience: 'kids', name: 'Modeling Clay Set', price: 150.00, img: 'assets/images/eraser_set.png',
    desc: '12-color modeling clay set that is soft, non-toxic, and easy to mold. Perfect for creative play, art class, and developing fine motor skills.',
    features: ['12 bright, assorted colors', 'Soft, easy-to-mold formula', 'Non-toxic and non-staining', 'Reusable – won\'t dry out in sealed container', 'Great for ages 3 and up']
  },
  {
    id: 27, category: 'kids', audience: 'kids', name: 'Building Blocks', price: 300.00, img: 'assets/images/eraser_set.png',
    desc: 'Set of 100 colorful building blocks in various shapes and sizes. Encourages creativity, spatial reasoning, and imaginative play for young learners.',
    features: ['100 pieces in assorted colors and shapes', 'Made from durable, non-toxic plastic', 'Compatible with standard building block brands', 'Includes storage bag', 'Recommended for ages 4-10']
  },
  {
    id: 28, category: 'kids', audience: 'kids', name: 'Educational Flashcards', price: 120.00, img: 'assets/images/composition_notebook.png',
    desc: 'Set of 52 educational flashcards covering alphabet, numbers, shapes, and colors. Double-sided with vibrant illustrations for interactive learning.',
    features: ['52 double-sided flashcards', 'Covers ABCs, 123s, shapes, and colors', 'Thick, laminated cards for durability', 'Bright illustrations for engagement', 'Ideal for ages 2-6']
  },
  {
    id: 29, category: 'kids', audience: 'kids', name: 'Origami Paper Pack', price: 60.00, img: 'assets/images/canvas_board.png',
    desc: 'Pack of 100 sheets of square origami paper in 20 vibrant colors. Standard 15×15 cm size, perfect for folding projects and crafts.',
    features: ['100 sheets in 20 colors', '15×15 cm standard origami size', 'Easy-to-fold lightweight paper', 'Includes basic origami instructions', 'Great for school crafts and hobbies']
  },
  {
    id: 30, category: 'kids', audience: 'kids', name: 'Puzzles for Kids', price: 200.00, img: 'assets/images/eraser_set.png',
    desc: '48-piece jigsaw puzzle with colorful animal illustration. Develops problem-solving skills and hand-eye coordination for young learners.',
    features: ['48 large, easy-grip pieces', 'Colorful animal-themed illustration', 'Made from thick recycled cardboard', 'Completed size: 30×40 cm', 'Suitable for ages 4-8']
  }
];

// 3. Render Products
function renderProducts(items) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5"><h3 class="text-muted">No products found.</h3></div>';
    return;
  }

  items.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3 product-item';
    col.dataset.category = product.category;
    col.dataset.audience = product.audience;

    col.innerHTML = `
      <a href="${fixPath('product.html?id=' + product.id)}" class="text-decoration-none">
        <div class="card product-card h-100 p-3">
          <img src="${fixPath(product.img)}" class="card-img-top mb-3 rounded" alt="${product.name}" style="height:140px; object-fit:contain;">
          <div class="card-body p-0 d-flex flex-column">
            <h3 class="h6 card-title text-dark">${product.name}</h3>
            <p class="stock-badge mb-1"><i class="bi bi-check-circle-fill me-1"></i>In Stock</p>
            <p class="product-price mt-auto mb-3">₱ ${product.price.toFixed(2)}</p>
            <button class="btn btn-pandayan w-100" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, 1, event)">
              <i class="bi bi-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </a>
    `;
    grid.appendChild(col);
  });
}

// 4. Category Filtering Logic
window.filterByCategory = function (category, event) {
  if (event) event.preventDefault();

  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
};

// 5. Search Algorithm Dynamic Trigger
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('products-grid');

  // Render initially on index
  if (grid) {
    renderProducts(products);
  }

  // Hook up all search inputs
  const searchInputs = document.querySelectorAll('input[type="search"]');
  searchInputs.forEach(input => {
    const form = input.closest('form');
    if (form) {
      // Ensure the parent form is relative for absolutely positioned suggestions
      if (getComputedStyle(form).position === 'static') {
        form.style.position = 'relative';
      }

      // Create suggestions container
      let suggestionsBox = form.querySelector('.search-suggestions');
      if (!suggestionsBox) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.className = 'search-suggestions';
        form.appendChild(suggestionsBox);
      }

      // Input listener for suggestions and grid filtering
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();

        // Filter products
        let filtered = [];
        if (query.length > 0) {
          filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
          );
        }

        // If we are on a page with products-grid, filter the grid
        if (grid) {
          if (query.length > 0) {
            renderProducts(filtered);
          } else {
            renderProducts(products); // Show all if empty
          }
        }

        // Show suggestions autocomplete on ALL pages
        if (query.length > 0 && filtered.length > 0) {
          suggestionsBox.innerHTML = '';
          // Limit to 5 suggestions
          filtered.slice(0, 5).forEach(p => {
            const item = document.createElement('a');
            item.href = fixPath(`product.html?id=${p.id}`); // Redirect to product details
            item.className = 'suggestion-item';
            item.innerHTML = `
              <img src="${fixPath(p.img)}" alt="${p.name}" class="suggestion-img">
              <div class="suggestion-details">
                <span class="suggestion-name">${p.name}</span>
                <span class="suggestion-category text-capitalize">${p.category}</span>
              </div>
            `;
            suggestionsBox.appendChild(item);
          });
          suggestionsBox.classList.add('active');
        } else {
          suggestionsBox.classList.remove('active');
        }
      });

      // Close suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (!form.contains(e.target)) {
          suggestionsBox.classList.remove('active');
        }
      });

      // Prevent default form submission but allow Enter to navigate to search.html with query
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = input.value.trim();
          if (query.length > 0) {
            window.location.href = fixPath(`search.html?q=${encodeURIComponent(query)}`);
          }
        });
    }
  });

  // Render cart if on cart page
  renderCart();

  // Render confirmation if on confirmation page
  renderConfirmation();

  // Render tracking summary if on order-tracking page
  renderTrackingSummary();

  // Render dynamic product page if on product.html
  renderProductPage();
});

// 6. Product Page Rendering Logic
window.renderProductPage = function () {
  if (!window.location.pathname.includes('product.html')) return;

  const urlParams = new URLSearchParams(window.location.search);
  let productId = parseInt(urlParams.get('id'));

  // Default to Sakura Watercolor (id 11) if no ID is found or invalid
  if (!productId || isNaN(productId)) {
    productId = 11;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Update DOM elements
  const titleEl = document.getElementById('product-title');
  const priceEl = document.getElementById('product-price');
  const imgEl = document.getElementById('product-main-img');
  const pageTitleEl = document.getElementById('page-title');
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const addToCartBtn = document.getElementById('addToCartBtn');

  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = '₱ ' + product.price.toFixed(2);
  if (imgEl) {
    imgEl.src = fixPath(product.img);
    imgEl.alt = product.name;
  }
  if (pageTitleEl) pageTitleEl.textContent = product.name + ' - Pandaday Bookshop';

  if (breadcrumbCat) {
    const catMap = {
      'school': 'School Supplies',
      'writing': 'Writing Instruments',
      'art': 'Art Supplies',
      'office': 'Office Supplies',
      'books': 'Books & Reading',
      'kids': 'Kids Toys'
    };
    breadcrumbCat.textContent = catMap[product.category] || 'Category';
    breadcrumbCat.href = fixPath(`categories.html?cat=${product.category}`);
  }

  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

  if (addToCartBtn) {
    addToCartBtn.setAttribute('onclick', `addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, document.getElementById('qty-input').value, event)`);
  }

  // Update product description
  const descSection = document.querySelector('.col-lg-7 .bg-white');
  if (descSection && product.desc) {
    let descHTML = '<h2 class="section-title">Product Description</h2>';
    descHTML += '<p>' + product.desc + '</p>';
    if (product.features && product.features.length > 0) {
      descHTML += '<ul class="mt-3">';
      product.features.forEach(f => {
        descHTML += '<li class="mb-2">' + f + '</li>';
      });
      descHTML += '</ul>';
    }
    descSection.innerHTML = descHTML;
  }

  // Update thumbnails to show related product images from same category
  const thumbContainer = document.querySelector('.d-flex.gap-2.mt-3');
  if (thumbContainer) {
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 2);
    let thumbHTML = `<img src="${product.img}" class="rounded border border-pandayan" style="width:60px;height:60px;object-fit:cover;cursor:pointer;" alt="${product.name} view 1">`;
    related.forEach(r => {
      thumbHTML += `<img src="${r.img}" class="rounded border" style="width:60px;height:60px;object-fit:cover;cursor:pointer;opacity:.6;" alt="${r.name}">`;
    });
    thumbContainer.innerHTML = thumbHTML;
  }
};

// 7. Cart Rendering Logic
window.renderConfirmation = function () {
  const summaryContainer = document.getElementById('confirmation-summary-items');
  const totalEl = document.getElementById('confirmation-total');
  if (!summaryContainer) return;

  const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];

  summaryContainer.innerHTML = '';

  if (lastOrder.length === 0) {
    summaryContainer.innerHTML = '<div class="py-3 text-center text-muted">No recent order found.</div>';
    if (totalEl) totalEl.textContent = '₱0.00';
    return;
  }

  let subtotal = 0;

  lastOrder.forEach(item => {
    subtotal += item.price * item.quantity;
    summaryContainer.innerHTML += `
      <div class="d-flex justify-content-between py-2 border-bottom">
        <span>${item.name} &times;${item.quantity}</span>
        <span class="fw-semibold">₱ ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  const fee = 0; // Defaulting to FREE for confirmation as per mockup (could read from checkout form later)

  summaryContainer.innerHTML += `
    <div class="d-flex justify-content-between py-2 border-bottom">
      <span>Delivery Fee</span>
      <span class="text-success fw-semibold">FREE</span>
    </div>
  `;

  if (totalEl) {
    totalEl.textContent = '₱ ' + (subtotal + fee).toFixed(2);
  }
};

window.renderTrackingSummary = function () {
  const summaryContainer = document.getElementById('tracking-summary-items');
  const totalEl = document.getElementById('tracking-total');
  if (!summaryContainer) return;

  const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];

  summaryContainer.innerHTML = '';

  if (lastOrder.length === 0) {
    summaryContainer.innerHTML = '<div class="py-2 text-muted">No items found.</div>';
    if (totalEl) totalEl.textContent = '₱0.00';
    return;
  }

  let subtotal = 0;

  lastOrder.forEach(item => {
    subtotal += item.price * item.quantity;
    summaryContainer.innerHTML += `
      <div class="summary-row">
        <span>${item.name} (${item.quantity}x)</span>
        <span>₱ ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  const fee = 0; // Defaulting to FREE as per mockup

  if (totalEl) {
    totalEl.textContent = '₱ ' + (subtotal + fee).toFixed(2);
  }
};

window.renderCart = function () {
  const container = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('order-summary-items');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    if (container) {
      container.innerHTML = `<div class="text-center py-5"><h3 class="text-muted">Your cart is empty</h3><p class="text-muted mb-3">Add some items to get started!</p><a href="${fixPath('index.html')}" class="btn btn-pandayan mt-3"><i class="bi bi-shop me-2"></i>Start Shopping</a></div>`;
    }
    if (totalEl) totalEl.textContent = '₱ 0.00';
    if (summaryContainer) summaryContainer.innerHTML = '';
    // hide delivery options and checkout when empty
    const deliveryOpts = document.getElementById('delivery-options');
    if (deliveryOpts) deliveryOpts.style.display = 'none';
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  // ensure delivery options and checkout visible
  const deliveryOpts = document.getElementById('delivery-options');
  if (deliveryOpts) deliveryOpts.style.display = 'block';
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.style.display = '';

  let subtotal = 0;

  if (container) {
    container.innerHTML = '';
    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      const div = document.createElement('div');
      div.className = 'cart-item';

      // find image from products array if possible
      const productDef = products.find(p => p.name === item.name);
      const imgUrl = productDef ? productDef.img : 'assets/images/intermediate_pad.png';

      div.innerHTML = `
        <img src="${fixPath(imgUrl)}" alt="${item.name}" style="object-fit:contain; background:#f8f9fa;">
        <div class="cart-item-details">
          <h3 class="h6 fw-bold mb-1">${item.name}</h3>
          <p class="stock-badge small mb-2"><i class="bi bi-check-circle-fill me-1"></i>In Stock</p>
          <p class="product-price mb-0">₱ ${item.price.toFixed(2)}</p>
        </div>
        <div class="qty-selector">
          <button type="button" aria-label="Decrease quantity" onclick="updateCartItemQty(${index}, -1)">−</button>
          <input type="number" value="${item.quantity}" min="1" aria-label="Quantity" readonly class="cart-qty">
          <button type="button" aria-label="Increase quantity" onclick="updateCartItemQty(${index}, 1)">+</button>
        </div>
        <button class="btn btn-link text-danger ms-3" aria-label="Remove item" onclick="removeCartItem(${index})"><i class="bi bi-trash fs-5"></i></button>
      `;
      container.appendChild(div);
    });
  } else {
    // Just calculate subtotal if no container exists (like on checkout.html)
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
  }

  // Update order summary
  if (summaryContainer) {
    summaryContainer.innerHTML = '';
    cart.forEach(item => {
      summaryContainer.innerHTML += `<div class="summary-row"><span>${item.name} &times;${item.quantity}</span><span>₱ ${(item.price * item.quantity).toFixed(2)}</span></div>`;
    });
  }

  // Delivery fee logic
  const pickupEl = document.querySelector('input[value="pickup"]');
  const isPickup = pickupEl ? pickupEl.checked : true; // Default to free pickup if no radio present
  const fee = isPickup ? 0 : 50;

  const feeEl = document.getElementById('delivery-fee');
  if (feeEl) {
    feeEl.textContent = isPickup ? 'FREE' : '₱ 50.00';
    feeEl.className = isPickup ? 'text-success fw-semibold' : 'text-danger fw-semibold';
  }

  if (totalEl) {
    totalEl.textContent = '₱ ' + (subtotal + fee).toFixed(2);
  }
};

window.updateCartItemQty = function (index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  // recalculate total count
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  updateCartBadge();
  renderCart();
};

window.removeCartItem = function (index) {
  if (cart[index]) {
    cartCount -= cart[index].quantity;
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCart();
};
