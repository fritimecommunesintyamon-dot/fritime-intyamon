/**
 * FRI-TIME INTYAMON — Gestion partagée des catégories et sous-catégories
 * Inclure ce fichier dans tous les modules qui utilisent catégories/sous-catégories
 */

var FriCats = {
  categories: [],
  sousCategories: [],

  // Charger depuis Supabase
  async load() {
    if (typeof FriDB === 'undefined') return;
    try {
      var dbCats = await FriDB.getCategories();
      if (dbCats && dbCats.length) this.categories = dbCats.map(function(c){ return c.nom; });
    } catch(e) { console.warn('[FriCats] Erreur chargement catégories:', e); }
    try {
      var dbSC = await FriDB.getSousCategories();
      if (dbSC && dbSC.length) this.sousCategories = dbSC.map(function(sc){ return {nom: sc.nom, cat: sc.categorie}; });
    } catch(e) { console.warn('[FriCats] Erreur chargement sous-catégories:', e); }
    this.refreshAll();
  },

  // Remplir un select catégories
  fillCatSelect(selectId, currentVal) {
    var s = document.getElementById(selectId);
    if (!s) return;
    s.innerHTML = '<option value="">— Choisir —</option>' +
      this.categories.map(function(c){ return '<option value="'+c+'"'+(c===currentVal?' selected':'')+'>'+ c +'</option>'; }).join('');
    if (currentVal) s.value = currentVal;
  },

  // Remplir un select sous-catégories filtré par catégorie
  fillSousCatSelect(selectId, cat, currentVal) {
    var s = document.getElementById(selectId);
    if (!s) return;
    var filtered = cat ? this.sousCategories.filter(function(sc){ return sc.cat === cat; }) : this.sousCategories;
    s.innerHTML = '<option value="">— Aucune —</option>' +
      filtered.map(function(sc){ return '<option value="'+sc.nom+'"'+(sc.nom===currentVal?' selected':'')+'>'+ sc.nom +'</option>'; }).join('');
    if (currentVal) s.value = currentVal;
  },

  // Quand on change de catégorie — recharge les sous-catégories depuis Supabase si besoin
  async onCatChange(catSelectId, sousCatSelectId) {
    var cat = document.getElementById(catSelectId) ? document.getElementById(catSelectId).value : '';
    if (cat && typeof FriDB !== 'undefined') {
      try {
        var fresh = await FriDB.getSousCategories(cat);
        if (fresh && fresh.length) {
          var self = this;
          fresh.forEach(function(sc){
            if (!self.sousCategories.find(function(x){ return x.nom === sc.nom && x.cat === sc.categorie; }))
              self.sousCategories.push({nom: sc.nom, cat: sc.categorie});
          });
        }
      } catch(e) {}
    }
    this.fillSousCatSelect(sousCatSelectId, cat);
  },

  // Ajouter une nouvelle catégorie
  async addCategorie(inputId, catSelectId, sousCatSelectId, newCatDivId) {
    var input = document.getElementById(inputId);
    var v = input ? input.value.trim() : '';
    if (!v) return;
    if (!this.categories.includes(v)) {
      this.categories.push(v);
      if (typeof FriDB !== 'undefined') try { await FriDB.saveCategorie(v); } catch(e) { console.warn(e); }
    }
    this.fillCatSelect(catSelectId, v);
    this.fillSousCatSelect(sousCatSelectId, v);
    if (input) input.value = '';
    var div = document.getElementById(newCatDivId);
    if (div) div.classList.remove('visible');
  },

  // Ajouter une nouvelle sous-catégorie
  async addSousCategorie(inputId, catSelectId, sousCatSelectId, newSousCatDivId) {
    var input = document.getElementById(inputId);
    var v = input ? input.value.trim() : '';
    var cat = document.getElementById(catSelectId) ? document.getElementById(catSelectId).value : '';
    if (!v) return;
    var self = this;
    if (!this.sousCategories.find(function(sc){ return sc.nom === v && sc.cat === cat; })) {
      this.sousCategories.push({nom: v, cat: cat});
      if (typeof FriDB !== 'undefined') try { await FriDB.saveSousCategorie(v, cat); } catch(e) { console.warn(e); }
    }
    this.fillSousCatSelect(sousCatSelectId, cat, v);
    if (input) input.value = '';
    var div = document.getElementById(newSousCatDivId);
    if (div) div.classList.remove('visible');
  },

  // Rafraîchir tous les selects catégories/sous-catégories présents sur la page
  refreshAll() {
    var catSels = document.querySelectorAll('[data-fricat="cat"]');
    var self = this;
    catSels.forEach(function(s){ self.fillCatSelect(s.id, s.value); });
    var sousCatSels = document.querySelectorAll('[data-fricat="souscat"]');
    sousCatSels.forEach(function(s){
      var catSel = document.querySelector('[data-fricat="cat"]');
      self.fillSousCatSelect(s.id, catSel ? catSel.value : '', s.value);
    });
  }
};

window.FriCats = FriCats;
console.log('Fri-Time Intyamon — FriCats chargé ✓');
