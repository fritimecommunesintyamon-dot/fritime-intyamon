/**
 * FRI-TIME INTYAMON — Gestion partagée catégories/sous-catégories
 * Utilise les tableaux locaux de chaque page (window.categories, window.sousCategories)
 */

var FriCats = {

  // Remplir un select catégories depuis window.categories
  fillCatSelect(selectId, currentVal) {
    var s = document.getElementById(selectId);
    if (!s) return;
    var cats = window.categories || [];
    s.innerHTML = '<option value="">— Choisir —</option>' +
      cats.map(function(c){ 
        return '<option value="'+c+'"'+(c===currentVal?' selected':'')+'>'+c+'</option>'; 
      }).join('');
    if (currentVal) s.value = currentVal;
  },

  // Remplir un select sous-catégories depuis window.sousCategories
  fillSousCatSelect(selectId, cat, currentVal) {
    var s = document.getElementById(selectId);
    if (!s) return;
    var all = window.sousCategories || [];
    var filtered = cat ? all.filter(function(sc){ return sc.cat === cat; }) : all;
    s.innerHTML = '<option value="">— Aucune —</option>' +
      filtered.map(function(sc){ 
        return '<option value="'+sc.nom+'"'+(sc.nom===currentVal?' selected':'')+'>'+sc.nom+'</option>'; 
      }).join('');
    if (currentVal) s.value = currentVal;
  },

  // Ajouter une nouvelle catégorie
  async addCategorie(inputId, catSelectId, sousCatSelectId, newCatDivId) {
    var input = document.getElementById(inputId);
    var v = input ? input.value.trim() : '';
    if (!v) return;
    var cats = window.categories = window.categories || [];
    if (!cats.includes(v)) {
      cats.push(v);
      if (typeof FriDB !== 'undefined') {
        try { await FriDB.saveCategorie(v); } catch(e) { console.warn(e); }
      }
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
    var catSel = document.getElementById(catSelectId);
    var cat = catSel ? catSel.value : '';
    if (!v) return;
    var all = window.sousCategories = window.sousCategories || [];
    if (!all.find(function(sc){ return sc.nom === v && sc.cat === cat; })) {
      all.push({nom: v, cat: cat});
      if (typeof FriDB !== 'undefined') {
        try { await FriDB.saveSousCategorie(v, cat); } catch(e) { console.warn(e); }
      }
    }
    this.fillSousCatSelect(sousCatSelectId, cat, v);
    if (input) input.value = '';
    var div = document.getElementById(newSousCatDivId);
    if (div) div.classList.remove('visible');
  },

  // Charger et remplir au démarrage d'un module
  async loadAndFill(catSelectId, sousCatSelectId, currentCat, currentSousCat) {
    if (typeof FriDB === 'undefined') return;
    try {
      var dbCats = await FriDB.getCategories();
      if (dbCats && dbCats.length) window.categories = dbCats.map(function(c){ return c.nom; });
    } catch(e) {}
    try {
      var dbSC = await FriDB.getSousCategories();
      if (dbSC && dbSC.length) window.sousCategories = dbSC.map(function(sc){ return {nom: sc.nom, cat: sc.categorie}; });
    } catch(e) {}
    this.fillCatSelect(catSelectId, currentCat||'');
    this.fillSousCatSelect(sousCatSelectId, currentCat||'', currentSousCat||'');
  },

  // Recharger sous-catégories depuis Supabase pour une catégorie
  async refreshSousCats(cat, sousCatSelectId) {
    if (cat && typeof FriDB !== 'undefined') {
      try {
        var fresh = await FriDB.getSousCategories(cat);
        if (fresh && fresh.length) {
          var all = window.sousCategories = window.sousCategories || [];
          fresh.forEach(function(sc){
            if (!all.find(function(x){ return x.nom===sc.nom && x.cat===sc.categorie; }))
              all.push({nom: sc.nom, cat: sc.categorie});
          });
        }
      } catch(e) {}
    }
    this.fillSousCatSelect(sousCatSelectId, cat);
  }
};

window.FriCats = FriCats;
console.log('FriCats chargé ✓');
