/* ---------------- state ---------------- */
let currentUser = null; // {name, phone, id}
let currentView = 'home';
let currentListingId = null;
let listings = [
  {id:'GB-1001', type:'house', title:'3-Storey Modern House in Budhanilkantha', location:'Budhanilkantha, Kathmandu', price:28500000, priceLabel:'2.85 Crore', area:'0-6-2-0 (Ropani)', beds:4, baths:3, road:'13 ft blacktop', facing:'East', color:'#A6432E'},
  {id:'GB-1002', type:'land', title:'Residential Plot near Ring Road', location:'Sanepa, Lalitpur', price:18000000, priceLabel:'1.80 Crore', area:'0-4-0-0 (Ropani)', road:'20 ft blacktop', facing:'North-East', color:'#3F5D48'},
  {id:'GB-1003', type:'house', title:'Newari-Style Brick Home', location:'Suryabinayak, Bhaktapur', price:15500000, priceLabel:'1.55 Crore', area:'0-3-2-0 (Ropani)', beds:3, baths:2, road:'10 ft graveled', facing:'South', color:'#E7A93E'},
  {id:'GB-1004', type:'land', title:'Lakeview Land Parcel', location:'Lakeside, Pokhara', price:32000000, priceLabel:'3.20 Crore', area:'0-8-0-0 (Ropani)', road:'16 ft blacktop', facing:'West', color:'#26313B'},
  {id:'GB-1005', type:'house', title:'Family Home with Garden', location:'Baneshwor, Kathmandu', price:42000000, priceLabel:'4.20 Crore', area:'0-5-0-0 (Ropani)', beds:5, baths:4, road:'18 ft blacktop', facing:'East', color:'#A6432E'},
  {id:'GB-1006', type:'land', title:'Terai Farmland Plot', location:'Bharatpur, Chitwan', price:9500000, priceLabel:'95 Lakh', area:'2-5-0 (Bigha-Kattha-Dhur)', road:'Feeder road', facing:'South', color:'#3F5D48'},
  {id:'GB-1007', type:'house', title:'Compact Duplex near School', location:'Chabahil, Kathmandu', price:19500000, priceLabel:'1.95 Crore', area:'0-2-3-0 (Ropani)', beds:3, baths:2, road:'12 ft blacktop', facing:'North', color:'#E7A93E'},
  {id:'GB-1008', type:'land', title:'Commercial Corner Plot', location:'New Road, Pokhara', price:55000000, priceLabel:'5.50 Crore', area:'0-6-0-0 (Ropani)', road:'24 ft blacktop', facing:'Corner', color:'#26313B'},
];

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'flex';
  setTimeout(()=>{ t.style.display='none'; }, 2600);
}

function svgHillPattern(color, id){
  return `<div style="position:absolute; inset:0; background:${color};">
    <svg viewBox="0 0 300 150" style="position:absolute; bottom:-2px; left:0; width:100%; height:70%;" preserveAspectRatio="none">
      <polygon points="0,150 0,90 60,60 130,100 190,50 260,90 300,70 300,150" fill="rgba(255,255,255,0.14)"/>
      <polygon points="0,150 0,110 80,80 160,120 240,75 300,105 300,150" fill="rgba(255,255,255,0.09)"/>
    </svg>
  </div>`;
}

/* ---------------- nav rendering ---------------- */
function renderNavActions(){
  const el = document.getElementById('navActions');
  if(currentUser){
    el.innerHTML = `
      <span class="badge mono">${currentUser.id}</span>
      <a class="btn btn-sm" href="#sell">+ List Property</a>
      <button class="btn btn-ghost btn-sm" onclick="logout()">Log out</button>`;
  } else {
    el.innerHTML = `
      <a class="btn btn-ghost btn-sm" href="#login">Log In</a>
      <a class="btn btn-primary btn-sm" href="#signup">Sign Up</a>`;
  }
}

function logout(){
  currentUser = null;
  renderNavActions();
  showToast('Logged out');
  navigate('home');
}

function setActiveNav(view){
  document.querySelectorAll('nav.links a').forEach(a=>{
    a.classList.toggle('active', a.dataset.view === view);
  });
}

/* ---------------- views ---------------- */
function viewHome(){
  const featured = listings.slice(0,6);
  return `
  <div class="hero">
    <div class="hero-inner">
      <span class="hero-eyebrow">Buy &amp; Sell Property Across Nepal</span>
      <h1>Find your <em>ghar</em>, own your <em>bhumi</em>.</h1>
      <p class="lead">A straightforward marketplace for houses and land — from Kathmandu Valley wards to Terai bighas. Browse verified-style listings, or list your own property in minutes.</p>
      <div class="search-panel">
        <div class="field">
          <label>Looking for</label>
          <select id="searchType"><option value="house">House</option><option value="land">Land</option></select>
        </div>
        <div class="field">
          <label>Location</label>
          <select id="searchLoc">
            <option value="">Any location</option>
            <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
            <option>Pokhara</option><option>Chitwan</option>
          </select>
        </div>
        <div class="field">
          <label>Max budget (NPR)</label>
          <input id="searchBudget" type="text" placeholder="e.g. 10,00,00,000">
        </div>
        <div class="field" style="justify-content:flex-end;">
          <button class="btn btn-primary" style="height:44px;" onclick="runHeroSearch()">Search</button>
        </div>
      </div>
    </div>
  </div>

  <section>
    <div class="section-head">
      <div>
        <span class="eyebrow">Categories</span>
        <h2>What are you here for?</h2>
      </div>
    </div>
    <div class="cat-grid">
      <div class="cat-card" onclick="navigate('buy')">
        <span class="cat-num mono">01</span>
        <h3>Buy a House</h3>
        <p>Browse homes in Kathmandu Valley, Pokhara, Chitwan and beyond.</p>
      </div>
      <div class="cat-card" onclick="navigate('buy-land')">
        <span class="cat-num mono">02</span>
        <h3>Buy Land</h3>
        <p>Residential, commercial and agricultural plots, hill and Terai.</p>
      </div>
      <div class="cat-card" onclick="navigate('sell')">
        <span class="cat-num mono">03</span>
        <h3>Sell / List Property</h3>
        <p>Post your house or land with details buyers actually look for.</p>
      </div>
      <div class="cat-card" onclick="navigate('converter')">
        <span class="cat-num mono">04</span>
        <h3>Land Unit Converter</h3>
        <p>Convert Ropani-Aana-Paisa-Daam and Bigha-Kattha-Dhur to sq. ft. / sq. m.</p>
      </div>
    </div>
  </section>

  <section style="padding-top:0;">
    <div class="section-head">
      <div>
        <span class="eyebrow">Featured</span>
        <h2>Recently listed</h2>
      </div>
      <a class="btn btn-ghost btn-sm" href="#buy">View all listings →</a>
    </div>
    <div class="listing-grid">
      ${featured.map(cardHtml).join('')}
    </div>
  </section>
  `;
}

function cardHtml(l){
  const specs = l.type === 'house'
    ? `<div><b>${l.beds}</b>Bed</div><div><b>${l.baths}</b>Bath</div><div><b>${l.area.split(' ')[0]}</b>${l.area.includes('Ropani')?'Ropani':'Bigha'}</div>`
    : `<div><b>${l.area.split(' ')[0]}</b>${l.area.includes('Ropani')?'Ropani':'Bigha'}</div><div><b>${l.facing}</b>Facing</div><div><b>${l.road.split(' ')[0]}</b>ft road</div>`;
  return `
  <div class="card" onclick="viewListing('${l.id}')" style="cursor:pointer;">
    <div class="card-media">${svgHillPattern(l.color)}
      <span class="card-tag" style="position:relative; z-index:2;">${l.type === 'house' ? 'House' : 'Land'}</span>
    </div>
    <div class="card-body">
      <div class="card-price mono">Rs ${l.priceLabel}</div>
      <div class="card-title">${l.title}</div>
      <div class="card-loc">📍 ${l.location}</div>
      <div class="card-specs">${specs}</div>
    </div>
  </div>`;
}

function viewListings(type){
  const filtered = listings.filter(l=>l.type===type);
  return `
  <section>
    <div class="section-head">
      <div>
        <span class="eyebrow">${type==='house'?'Houses':'Land'} for Sale</span>
        <h2>${type==='house' ? 'Houses across Nepal' : 'Land parcels across Nepal'}</h2>
        <p>${filtered.length} listings found</p>
      </div>
    </div>
    <div class="tabs">
      <a href="#buy" class="tab ${type==='house'?'active':''}">Houses</a>
      <a href="#buy-land" class="tab ${type==='land'?'active':''}">Land</a>
    </div>
    <div class="listings-layout">
      <aside class="filters">
        <div class="filter-group">
          <h4>Location</h4>
          <div class="chip-row">
            <span class="chip active">All</span>
            <span class="chip">Kathmandu</span>
            <span class="chip">Lalitpur</span>
            <span class="chip">Bhaktapur</span>
            <span class="chip">Pokhara</span>
            <span class="chip">Chitwan</span>
          </div>
        </div>
        <div class="filter-group">
          <h4>Budget (NPR)</h4>
          <div class="chip-row">
            <span class="chip">Under 50 Lakh</span>
            <span class="chip">50L – 2 Crore</span>
            <span class="chip">2 – 5 Crore</span>
            <span class="chip">5 Crore+</span>
          </div>
        </div>
        <div class="filter-group">
          <h4>Road Access</h4>
          <div class="chip-row">
            <span class="chip">Blacktop</span>
            <span class="chip">Graveled</span>
            <span class="chip">Feeder road</span>
          </div>
        </div>
      </aside>
      <div class="listing-grid">
        ${filtered.map(cardHtml).join('')}
      </div>
    </div>
  </section>`;
}

function viewDetail(id){
  const l = listings.find(x=>x.id===id);
  if(!l) return `<div class="empty-state"><h3>Listing not found</h3><a class="btn" href="#buy">Back to listings</a></div>`;
  const isHouse = l.type === 'house';
  return `
  <section>
    <a href="${isHouse?'#buy':'#buy-land'}" style="font-size:13px; color:var(--ink-soft); display:inline-block; margin-bottom:18px;">← Back to ${isHouse?'houses':'land'}</a>
    <div class="detail-grid">
      <div>
        <div class="detail-media">${svgHillPattern(l.color)}
          <span class="card-tag" style="position:absolute; top:14px; left:14px; z-index:2;">${isHouse?'House':'Land'} · ${l.id}</span>
        </div>
        <h1 style="font-size:26px; margin-top:24px;">${l.title}</h1>
        <div class="card-loc" style="margin-top:8px; font-size:14px;">📍 ${l.location}</div>
        <div class="spec-grid">
          <div class="spec-item"><div class="l">Area</div><div class="v">${l.area}</div></div>
          <div class="spec-item"><div class="l">Facing</div><div class="v">${l.facing}</div></div>
          <div class="spec-item"><div class="l">Road Access</div><div class="v">${l.road}</div></div>
          ${isHouse ? `<div class="spec-item"><div class="l">Bed / Bath</div><div class="v">${l.beds} / ${l.baths}</div></div>` : `<div class="spec-item"><div class="l">Type</div><div class="v">Residential</div></div>`}
        </div>
        <hr class="parcel-divider" style="margin:28px 0;">
        <h3 style="font-size:17px; margin-bottom:10px;">Description</h3>
        <p style="color:var(--ink-soft); line-height:1.7; font-size:14.5px;">
          ${isHouse
            ? `A well-maintained property in ${l.location.split(',')[0]}, built with quality materials and finished for immediate move-in. Close to schools, local markets and public transport. Land ownership certificate (lalpurja) and blueprint available on request.`
            : `A well-located plot in ${l.location.split(',')[0]}, suitable for residential construction. Flat terrain, clear boundary pillars, and municipal water line nearby. Lalpurja and survey (naksa) available on request.`}
        </p>
      </div>
      <div class="seller-card">
        <div class="card-price mono" style="font-size:26px;">Rs ${l.priceLabel}</div>
        <div style="font-size:12.5px; color:var(--ink-soft); margin-top:2px;">Rs ${l.price.toLocaleString('en-IN')} negotiable</div>
        <hr class="parcel-divider" style="margin:18px 0;">
        <div style="font-size:13px; color:var(--ink-soft); margin-bottom:14px;">Listed by</div>
        <div style="font-weight:600; font-size:15px;">Verified Seller</div>
        <div style="font-size:13px; color:var(--ink-soft); margin-top:2px;">Member since 2024</div>
        <button class="btn btn-primary btn-full" style="margin-top:20px;" onclick="contactSeller()">Reveal Contact Number</button>
        <button class="btn btn-full" style="margin-top:10px;" onclick="showToast('Saved to your shortlist')">Save Listing</button>
      </div>
    </div>
  </section>`;
}

function contactSeller(){
  if(!currentUser){ showToast('Please log in to view contact details'); navigate('login'); return; }
  showToast('Seller phone: +977-98XXXXXXXX (demo)');
}

/* ---------------- auth ---------------- */
let authMode = 'login';
function viewAuth(mode){
  authMode = mode;
  return `
  <div class="auth-wrap">
    <div class="auth-tabs">
      <div class="auth-tab ${mode==='login'?'active':''}" onclick="navigate('login')">Log In</div>
      <div class="auth-tab ${mode==='signup'?'active':''}" onclick="navigate('signup')">Sign Up</div>
    </div>
    <div id="authBody">${mode==='login' ? loginForm() : signupForm()}</div>
  </div>`;
}

function loginForm(){
  return `
    <h2 style="font-size:20px; margin-bottom:4px;">Welcome back</h2>
    <p style="font-size:13px; color:var(--ink-soft); margin-bottom:22px;">Log in with your registered phone number.</p>
    <div class="form-field">
      <label>Phone Number</label>
      <div class="phone-input">
        <input class="cc" value="+977" disabled>
        <input type="tel" id="loginPhone" placeholder="98XXXXXXXX" maxlength="10">
      </div>
    </div>
    <div class="form-field">
      <label>Password</label>
      <input type="password" id="loginPass" placeholder="Enter your password">
    </div>
    <div class="error-text" id="loginError"></div>
    <button class="btn btn-primary btn-full" onclick="doLogin()">Log In</button>
    <p style="font-size:12.5px; color:var(--ink-soft); text-align:center; margin-top:16px;">No account? <a href="#signup" style="color:var(--brick); font-weight:600;">Sign up</a></p>
  `;
}

function signupForm(){
  return `
    <h2 style="font-size:20px; margin-bottom:4px;">Create your account</h2>
    <p style="font-size:13px; color:var(--ink-soft); margin-bottom:22px;">Your phone number becomes your unique GharBhumi ID.</p>
    <div id="signupStep1">
      <div class="form-field">
        <label>Full Name</label>
        <input type="text" id="suName" placeholder="e.g. Sita Rai">
      </div>
      <div class="form-field">
        <label>Phone Number</label>
        <div class="phone-input">
          <input class="cc" value="+977" disabled>
          <input type="tel" id="suPhone" placeholder="98XXXXXXXX" maxlength="10">
        </div>
      </div>
      <div class="form-field">
        <label>Password</label>
        <input type="password" id="suPass" placeholder="Create a password (min. 6 characters)">
      </div>
      <div class="error-text" id="signupError"></div>
      <button class="btn btn-primary btn-full" onclick="requestOtp()">Send Verification Code</button>
    </div>
  `;
}

function requestOtp(){
  const name = document.getElementById('suName').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const pass = document.getElementById('suPass').value;
  const err = document.getElementById('signupError');
  err.style.display='none';
  if(!name || !/^9\d{9}$/.test(phone) || pass.length < 6){
    err.textContent = 'Enter your name, a valid 10-digit Nepal number starting with 9, and a password of at least 6 characters.';
    err.style.display='block';
    return;
  }
  if(listings.some(()=>false)){} // no-op
  window._pendingSignup = {name, phone, pass};
  document.getElementById('authBody').innerHTML = `
    <h2 style="font-size:20px; margin-bottom:4px;">Verify your number</h2>
    <p style="font-size:13px; color:var(--ink-soft); margin-bottom:22px;">We sent a 6-digit code to +977-${phone} (demo mode — enter any 6 digits).</p>
    <div class="form-field">
      <label>Verification Code</label>
      <input type="text" id="otpCode" maxlength="6" placeholder="000000">
    </div>
    <div class="error-text" id="otpError"></div>
    <button class="btn btn-primary btn-full" onclick="verifyOtp()">Verify &amp; Create Account</button>
  `;
}

function verifyOtp(){
  const code = document.getElementById('otpCode').value.trim();
  const err = document.getElementById('otpError');
  if(!/^\d{6}$/.test(code)){
    err.textContent = 'Enter the 6-digit code.';
    err.style.display='block';
    return;
  }
  const {name, phone} = window._pendingSignup;
  const uid = 'GB-' + phone.slice(-4) + '-' + Math.floor(100 + Math.random()*900);
  currentUser = {name, phone, id: uid};
  document.getElementById('authBody').innerHTML = `
    <h2 style="font-size:20px; margin-bottom:4px;">You're in, ${name.split(' ')[0]}.</h2>
    <p style="font-size:13px; color:var(--ink-soft);">Your unique account ID has been generated from your phone number.</p>
    <div class="id-badge">
      <div class="label">Your GharBhumi ID</div>
      <div class="value mono">${uid}</div>
    </div>
    <button class="btn btn-primary btn-full" style="margin-top:20px;" onclick="navigate('home')">Continue to GharBhumi</button>
  `;
  renderNavActions();
}

function doLogin(){
  const phone = document.getElementById('loginPhone').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if(!/^9\d{9}$/.test(phone) || pass.length < 6){
    err.textContent = 'Enter a valid registered phone number and password.';
    err.style.display='block';
    return;
  }
  const uid = 'GB-' + phone.slice(-4) + '-DEMO';
  currentUser = {name:'Demo User', phone, id: uid};
  renderNavActions();
  showToast('Logged in successfully');
  navigate('home');
}

/* ---------------- sell / post property ---------------- */
function viewSell(){
  if(!currentUser){
    return `
    <section>
      <div class="empty-state">
        <h3 style="font-family:'Fraunces',serif; font-size:22px; margin-bottom:8px;">Log in to list a property</h3>
        <p style="max-width:400px; margin:0 auto 20px;">Creating an account with your phone number takes less than a minute and lets buyers reach you directly.</p>
        <a class="btn btn-primary" href="#signup">Create Account</a>
      </div>
    </section>`;
  }
  return `
  <section>
    <div class="section-head"><div>
      <span class="eyebrow">List a Property</span>
      <h2>Tell buyers what you're selling</h2>
    </div></div>
    <div class="form-card">
      <div class="form-field">
        <label>I want to sell</label>
        <select id="pType" onchange="toggleHouseFields()">
          <option value="house">A House</option>
          <option value="land">Land Only</option>
        </select>
      </div>
      <div class="form-field"><label>Listing Title</label><input id="pTitle" placeholder="e.g. 3-Storey House with Garden"></div>
      <div class="form-grid">
        <div class="form-field"><label>District / City</label>
          <select id="pCity"><option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option><option>Pokhara</option><option>Chitwan</option></select>
        </div>
        <div class="form-field"><label>Area / Tole</label><input id="pArea" placeholder="e.g. Budhanilkantha"></div>
      </div>
      <div class="form-grid">
        <div class="form-field"><label>Asking Price (NPR)</label><input id="pPrice" placeholder="e.g. 2,85,00,000"></div>
        <div class="form-field"><label>Land Area</label><input id="pLandArea" placeholder="e.g. 0-6-2-0 Ropani-Aana-Paisa-Daam"></div>
      </div>
      <div class="form-grid" id="houseFields">
        <div class="form-field"><label>Bedrooms</label><input id="pBeds" type="number" min="0" placeholder="e.g. 4"></div>
        <div class="form-field"><label>Bathrooms</label><input id="pBaths" type="number" min="0" placeholder="e.g. 3"></div>
      </div>
      <div class="form-grid">
        <div class="form-field"><label>Road Access</label><input id="pRoad" placeholder="e.g. 13 ft blacktop"></div>
        <div class="form-field"><label>Facing</label>
          <select id="pFacing"><option>East</option><option>West</option><option>North</option><option>South</option><option>North-East</option><option>South-East</option></select>
        </div>
      </div>
      <div class="form-field"><label>Description</label><textarea id="pDesc" rows="4" placeholder="Ownership certificate status, nearby landmarks, why it's a good buy..."></textarea></div>
      <div class="form-field"><label>Contact Phone</label>
        <div class="phone-input"><input class="cc" value="+977" disabled><input id="pPhone" placeholder="98XXXXXXXX" maxlength="10"></div>
      </div>
      <div class="error-text" id="postError"></div>
      <button class="btn btn-primary btn-full" onclick="submitListing()">Publish Listing</button>
    </div>
  </section>`;
}

function toggleHouseFields(){
  const isHouse = document.getElementById('pType').value === 'house';
  document.getElementById('houseFields').style.display = isHouse ? 'grid' : 'none';
}

function submitListing(){
  const title = document.getElementById('pTitle').value.trim();
  const price = document.getElementById('pPrice').value.trim();
  const phone = document.getElementById('pPhone').value.trim();
  const err = document.getElementById('postError');
  if(!title || !price || !/^9\d{9}$/.test(phone)){
    err.textContent = 'Please fill in the title, price, and a valid 10-digit phone number.';
    err.style.display = 'block';
    return;
  }
  const type = document.getElementById('pType').value;
  const newListing = {
    id: 'GB-' + (2000 + listings.length),
    type,
    title,
    location: document.getElementById('pArea').value + ', ' + document.getElementById('pCity').value,
    price: 0,
    priceLabel: price,
    area: document.getElementById('pLandArea').value || '—',
    beds: document.getElementById('pBeds').value || '—',
    baths: document.getElementById('pBaths').value || '—',
    road: document.getElementById('pRoad').value || '—',
    facing: document.getElementById('pFacing').value,
    color: ['#A6432E','#3F5D48','#E7A93E','#26313B'][listings.length % 4]
  };
  listings.unshift(newListing);
  showToast('Listing published successfully');
  navigate(type === 'house' ? 'buy' : 'buy-land');
}

/* ---------------- converter ---------------- */
function viewConverter(){
  return `
  <section>
    <div class="converter">
      <span class="eyebrow" style="color:var(--marigold);">Tool</span>
      <h2>Land Unit Converter</h2>
      <p>Land in Nepal's hill regions is measured in Ropani-Aana-Paisa-Daam; in the Terai, it's Bigha-Kattha-Dhur. Convert between both and standard sq. ft. / sq. m.</p>
      <div class="conv-grid">
        <div class="conv-box">
          <h4>Ropani — Hill Region</h4>
          <div class="conv-row">
            <div><label>Ropani</label><input type="number" id="ropani" value="0" oninput="calcRopani()"></div>
            <div><label>Aana</label><input type="number" id="aana" value="0" oninput="calcRopani()"></div>
            <div><label>Paisa</label><input type="number" id="paisa" value="0" oninput="calcRopani()"></div>
            <div><label>Daam</label><input type="number" id="daam" value="0" oninput="calcRopani()"></div>
          </div>
          <div class="conv-out">= <b id="ropaniOut">0</b> sq. ft &nbsp;·&nbsp; <b id="ropaniOutM">0</b> sq. m</div>
        </div>
        <div class="conv-box">
          <h4>Bigha — Terai Region</h4>
          <div class="conv-row" style="grid-template-columns:1fr 1fr 1fr;">
            <div><label>Bigha</label><input type="number" id="bigha" value="0" oninput="calcBigha()"></div>
            <div><label>Kattha</label><input type="number" id="kattha" value="0" oninput="calcBigha()"></div>
            <div><label>Dhur</label><input type="number" id="dhur" value="0" oninput="calcBigha()"></div>
          </div>
          <div class="conv-out">= <b id="bighaOut">0</b> sq. ft &nbsp;·&nbsp; <b id="bighaOutM">0</b> sq. m</div>
        </div>
      </div>
    </div>
  </section>`;
}

function calcRopani(){
  const r = +document.getElementById('ropani').value || 0;
  const a = +document.getElementById('aana').value || 0;
  const p = +document.getElementById('paisa').value || 0;
  const d = +document.getElementById('daam').value || 0;
  const sqft = r*5476 + a*342.25 + p*85.5625 + d*21.39;
  document.getElementById('ropaniOut').textContent = sqft.toLocaleString('en-IN', {maximumFractionDigits:1});
  document.getElementById('ropaniOutM').textContent = (sqft*0.092903).toLocaleString('en-IN', {maximumFractionDigits:1});
}
function calcBigha(){
  const b = +document.getElementById('bigha').value || 0;
  const k = +document.getElementById('kattha').value || 0;
  const dh = +document.getElementById('dhur').value || 0;
  const sqft = b*72900 + k*3645 + dh*182.25;
  document.getElementById('bighaOut').textContent = sqft.toLocaleString('en-IN', {maximumFractionDigits:1});
  document.getElementById('bighaOutM').textContent = (sqft*0.092903).toLocaleString('en-IN', {maximumFractionDigits:1});
}

/* ---------------- router ---------------- */
function navigate(view, param){
  currentView = view;
  if(view === 'detail') currentListingId = param;
  location.hash = param ? `${view}/${param}` : view;
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}

function viewListing(id){ navigate('detail', id); }

function runHeroSearch(){
  const type = document.getElementById('searchType').value;
  navigate(type === 'house' ? 'buy' : 'buy-land');
}

function render(){
  const app = document.getElementById('app');
  let html = '';
  switch(currentView){
    case 'home': html = viewHome(); break;
    case 'buy': html = viewListings('house'); break;
    case 'buy-land': html = viewListings('land'); break;
    case 'detail': html = viewDetail(currentListingId); break;
    case 'login': html = viewAuth('login'); break;
    case 'signup': html = viewAuth('signup'); break;
    case 'sell': html = viewSell(); break;
    case 'converter': html = viewConverter(); break;
    default: html = viewHome();
  }
  app.innerHTML = html;
  setActiveNav(currentView);
  if(currentView === 'sell' && currentUser) toggleHouseFields();
}

function parseHash(){
  const raw = location.hash.replace('#','');
  if(!raw) return {view:'home'};
  const [view, param] = raw.split('/');
  return {view, param};
}

window.addEventListener('hashchange', ()=>{
  const {view, param} = parseHash();
  currentView = view;
  currentListingId = param;
  render();
});

/* ---------------- init ---------------- */
renderNavActions();
render();