/**
 * FRI-TIME INTYAMON — Connexion Supabase
 * Ce fichier remplace fritime_sync.js pour les données en temps réel
 */

const SUPABASE_URL = 'https://pixktldfpjtnimngvgqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZV04eYw85SDFQi43SwZJTg_igofPU8X';

// Client Supabase léger (sans SDK complet)
const FriDB = {

  // ─── REQUÊTE GÉNÉRIQUE ───────────────────────
  async query(table, method='GET', body=null, filters='') {
    const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation'
    };
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase error details:', res.status, err);
      throw new Error(`Supabase error: ${res.status} - ${err}`);
    }
    if (method === 'DELETE') return true;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  },

  // ─── MEMBRES ─────────────────────────────────
  async getMembres() {
    return await this.query('membres', 'GET', null, '?order=id');
  },
  async saveMembre(m) {
    var allowed = ['prenom','nom','role','statut','email','tel','commune','date_entree','fin_engagement','notes'];
    var clean = {};
    allowed.forEach(function(k){ if(k in m && m[k] !== undefined && m[k] !== null) clean[k] = m[k]; });
    if (m.id) {
      delete clean.id;
      return await this.query('membres', 'PATCH', clean, '?id=eq.'+m.id);
    }
    return await this.query('membres', 'POST', clean);
  },
  async deleteMembre(id) {
    return await this.query('membres', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── ACTIVITÉS ───────────────────────────────
  async getActivites() {
    return await this.query('activites', 'GET', null, '?order=created_at');
  },
  async saveActivite(a) {
    var allowed = ['nom','description','date','date_limite','heure_debut','heure_fin','lieu',
      'prest_id','prest_contact','prest_email','prest_tel','prest_url','age_min','age_max','places','inscrits','surveillants','cout','cout_type',
      'cout_facture','materiel','tenue','statut','annee','categorie','sous_categorie',
      't_public','t_parent','t_meteo','t_service','notes','image'];
    var clean = {};
    allowed.forEach(function(k){ if(k in a && a[k] !== undefined && a[k] !== null) clean[k] = a[k]; });
    if (a.id) {
      delete clean.id;
      return await this.query('activites', 'PATCH', clean, '?id=eq.'+a.id);
    }
    return await this.query('activites', 'POST', clean);
  },
  async deleteActivite(id) {
    return await this.query('activites', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── ENFANTS ─────────────────────────────────
  async getEnfants() {
    return await this.query('enfants', 'GET', null, '?order=nom');
  },
  async saveEnfant(e) {
    var allowed = ['prenom','nom','ddn','age','commune','pp','pn','pe','pt','notes','parts','statut','ban_motif'];
    var clean = {};
    allowed.forEach(function(k){ if(k in e && e[k] !== undefined && e[k] !== null) clean[k] = e[k]; });
    if (e.id) {
      delete clean.id;
      return await this.query('enfants', 'PATCH', clean, '?id=eq.'+e.id);
    }
    return await this.query('enfants', 'POST', clean);
  },
  async deleteEnfant(id) {
    return await this.query('enfants', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── INSCRIPTIONS ────────────────────────────
  async getInscriptions(activiteId=null) {
    const filter = activiteId ? `?activite_id=eq.${activiteId}&order=id` : '?order=id';
    return await this.query('inscriptions', 'GET', null, filter);
  },
  async saveInscription(i) {
    if (i.id) {
      const {id:_ii, ...idata} = i; return await this.query('inscriptions', 'PATCH', idata, `?id=eq.${i.id}`);
    }
    const {id, ...data} = i;
    return await this.query('inscriptions', 'POST', data);
  },
  async deleteInscription(id) {
    return await this.query('inscriptions', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── TÂCHES ──────────────────────────────────
  async getTaches() {
    return await this.query('taches', 'GET', null, '?order=created_at.desc');
  },
  async saveTache(t) {
    if (t.id) {
      const {id:_ti, ...tdata} = t; return await this.query('taches', 'PATCH', tdata, `?id=eq.${t.id}`);
    }
    const {id, ...data} = t;
    return await this.query('taches', 'POST', data);
  },
  async deleteTache(id) {
    return await this.query('taches', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── PRESTATAIRES ────────────────────────────
  async getSousCategories(categorie) {
    const filter = categorie ? '?categorie=eq.'+encodeURIComponent(categorie)+'&order=nom' : '?order=nom';
    return await this.query('sous_categories', 'GET', null, filter);
  },
  async saveSousCategorie(nom, categorie) {
    return await this.query('sous_categories', 'POST', {nom: nom, categorie: categorie});
  },
  async getCategories() {
    return await this.query('categories', 'GET', null, '?order=nom');
  },
  async saveCategorie(nom) {
    return await this.query('categories', 'POST', {nom: nom});
  },
  async deleteCategorie(id) {
    return await this.query('categories', 'DELETE', null, '?id=eq.'+id);
  },
  async getPrestataires() {
    return await this.query('prestataires', 'GET', null, '?order=nom');
  },
  async savePrestataire(p) {
    if (p.id) {
      const {id, ...data} = p;
      return await this.query('prestataires', 'PATCH', data, `?id=eq.${p.id}`);
    }
    const {id, ...data} = p;
    return await this.query('prestataires', 'POST', data);
  },
  async deletePrestataire(id) {
    return await this.query('prestataires', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── BUDGET ──────────────────────────────────
  async getEntrees() {
    return await this.query('entrees_budget', 'GET', null, '?order=id');
  },
  async saveEntree(e) {
    if (e.id){ const {id:_ei,...ed}=e; return await this.query('entrees_budget', 'PATCH', ed, `?id=eq.${e.id}`); }
    const {id, ...data} = e;
    return await this.query('entrees_budget', 'POST', data);
  },
  async deleteEntree(id) {
    return await this.query('entrees_budget', 'DELETE', null, `?id=eq.${id}`);
  },
  async getDepenses() {
    return await this.query('depenses_budget', 'GET', null, '?order=id');
  },
  async saveDepense(d) {
    if (d.id){ const {id:_di,...dd}=d; return await this.query('depenses_budget', 'PATCH', dd, `?id=eq.${d.id}`); }
    const {id, ...data} = d;
    return await this.query('depenses_budget', 'POST', data);
  },
  async deleteDepense(id) {
    return await this.query('depenses_budget', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── IDÉES ───────────────────────────────────
  async getIdees() {
    return await this.query('idees', 'GET', null, '?order=created_at.desc');
  },
  async saveIdee(i) {
    if (i.id){ const {id:_idi,...id2}=i; return await this.query('idees', 'PATCH', id2, `?id=eq.${i.id}`); }
    const {id, ...data} = i;
    return await this.query('idees', 'POST', data);
  },
  async deleteIdee(id) {
    return await this.query('idees', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── DOCUMENTS ───────────────────────────────
  async getDocuments() {
    return await this.query('documents', 'GET', null, '?order=nom');
  },
  async saveDocument(d) {
    if (d.id){ const {id:_doci,...docd}=d; return await this.query('documents', 'PATCH', docd, `?id=eq.${d.id}`); }
    const {id, ...data} = d;
    return await this.query('documents', 'POST', data);
  },
  async deleteDocument(id) {
    return await this.query('documents', 'DELETE', null, `?id=eq.${id}`);
  },
  async getCategsDocs() {
    return await this.query('categories_docs', 'GET', null, '?order=nom');
  },
  async saveCatDoc(c) {
    if (c.id){ const {id:_cdi,...cdd}=c; return await this.query('categories_docs', 'PATCH', cdd, `?id=eq.${c.id}`); }
    const {id, ...data} = c;
    return await this.query('categories_docs', 'POST', data);
  },
  async deleteCatDoc(id) {
    return await this.query('categories_docs', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── INCIDENTS ───────────────────────────────
  async getIncidents() {
    return await this.query('incidents', 'GET', null, '?order=created_at.desc');
  },
  async saveIncident(i) {
    if (i.id){ const {id:_inci,...incd}=i; return await this.query('incidents', 'PATCH', incd, `?id=eq.${i.id}`); }
    const {id, ...data} = i;
    return await this.query('incidents', 'POST', data);
  },
  async deleteIncident(id) {
    return await this.query('incidents', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── SONDAGES ────────────────────────────────
  async getSondages() {
    return await this.query('sondages', 'GET', null, '?order=created_at.desc');
  },
  async saveSondage(s) {
    if (s.id){ const {id:_si,...sd}=s; return await this.query('sondages', 'PATCH', sd, `?id=eq.${s.id}`); }
    const {id, ...data} = s;
    return await this.query('sondages', 'POST', data);
  },
  async getReponses(sondageId) {
    return await this.query('reponses_sondage', 'GET', null, `?sondage_id=eq.${sondageId}&order=created_at`);
  },
  async saveReponse(r) {
    const {id, ...data} = r;
    return await this.query('reponses_sondage', 'POST', data);
  },

  // ─── CAMPAGNES ───────────────────────────────
  async getCampagnes() {
    return await this.query('campagnes', 'GET', null, '?order=created_at.desc');
  },
  async saveCampagne(c) {
    if (c.id){ const {id:_ci,...cd}=c; return await this.query('campagnes', 'PATCH', cd, `?id=eq.${c.id}`); }
    const {id, ...data} = c;
    return await this.query('campagnes', 'POST', data);
  },
  async deleteCampagne(id) {
    return await this.query('campagnes', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── COMPTES ─────────────────────────────────
  async getComptes() {
    return await this.query('comptes', 'GET', null, '?order=id');
  },
  async login(email, pwd) {
    // Simple check - dans prod utiliser Supabase Auth
    const comptes = await this.query('comptes', 'GET', null, `?email=eq.${encodeURIComponent(email)}&actif=eq.true`);
    if (!comptes || !comptes.length) return null;
    // Vérification simple du mot de passe (à améliorer avec hash en prod)
    const compte = comptes[0];
    return compte;
  },
  async saveCompte(c) {
    if (c.id){ const {id:_coi,...cod}=c; return await this.query('comptes', 'PATCH', cod, `?id=eq.${c.id}`); }
    const {id, ...data} = c;
    return await this.query('comptes', 'POST', data);
  },

  // ─── TEST CONNEXION ──────────────────────────
  async testConnection() {
    try {
      await this.query('membres', 'GET', null, '?limit=1');
      return true;
    } catch(e) {
      console.error('Supabase connexion échouée:', e);
      return false;
    }
  }
};

// Mapping JS <-> DB column names
// Known columns per table (to avoid PGRST204 errors)
FriDB.COLUMNS = {
  activites: ['id','nom','description','date','date_limite','heure_debut','heure_fin','lieu',
    'prest_id','prest_contact','prest_email','prest_tel','prest_url','age_min','age_max',
    'places','inscrits','surveillants','cout','cout_type','cout_facture','materiel','tenue',
    'statut','annee','categorie','t_public','t_parent','t_meteo','t_service','notes','image'],
  membres: ['id','prenom','nom','role','statut','email','tel','commune',
    'date_entree','fin_engagement','notes'],
  enfants: ['id','prenom','nom','ddn','age','commune','pp','pn','pe','pt',
    'notes','parts','statut','ban_motif'],
  inscriptions: ['id','enfant_id','activite_id','statut','pref','notes','presence'],
  taches: ['id','titre','description','assignee','priorite','activite_id','date_limite','statut','notes'],
  prestataires: ['id','nom','type','statut','cat','cp','cn','email','tel','url',
    'adresse','gratuit','acts','notes'],
  entrees_budget: ['id','source','description','prevu','recu','statut','annee','notes'],
  depenses_budget: ['id','description','activite','prevu','reel','realise','type','facture','annee','notes'],
  idees: ['id','titre','description','categorie','sous_categorie','saison','cout_estime','age_min','age_max',
    'prestataire_suggere','statut','votes','notes','utilise','image','source','date'],
  documents: ['id','nom','cat','type','description','url','taille','date'],
  incidents: ['id','date','heure','lieu','activite','type','gravite','description',
    'blesses','temoins','actions','redacteur','statut'],
  sondages: ['id','activite','date_activite','date_envoi','statut'],
  reponses_sondage: ['id','sondage_id','nom','email','note','refaire','comment'],
  campagnes: ['id','titre','type','periode','deadline','message','activites','statut','date_envoi'],
  comptes: ['id','prenom','nom','email','role','actif'],
};

FriDB.stripUnknown = function(table, obj) {
  var cols = FriDB.COLUMNS[table];
  if(!cols) return obj;
  var clean = {};
  cols.forEach(function(c){ if(c in obj && obj[c] !== undefined) clean[c] = obj[c]; });
  return clean;
};

FriDB.toDb = function(obj) {
  var mapped = Object.assign({}, obj);
  if ('desc' in mapped) { mapped.description = mapped.desc; delete mapped.desc; }
  if ('dateLimite' in mapped) { mapped.date_limite = mapped.dateLimite; delete mapped.dateLimite; }
  if ('heureDebut' in mapped) { mapped.heure_debut = mapped.heureDebut; delete mapped.heureDebut; }
  if ('heureFin' in mapped) { mapped.heure_fin = mapped.heureFin; delete mapped.heureFin; }
  if ('prestId' in mapped) { mapped.prest_id = mapped.prestId; delete mapped.prestId; }
  if ('prestContact' in mapped) { mapped.prest_contact = mapped.prestContact; delete mapped.prestContact; }
  if ('prestEmail' in mapped) { mapped.prest_email = mapped.prestEmail; delete mapped.prestEmail; }
  if ('prestTel' in mapped) { mapped.prest_tel = mapped.prestTel; delete mapped.prestTel; }
  if ('prestUrl' in mapped) { mapped.prest_url = mapped.prestUrl; delete mapped.prestUrl; }
  if ('ageMin' in mapped) { mapped.age_min = mapped.ageMin; delete mapped.ageMin; }
  if ('ageMax' in mapped) { mapped.age_max = mapped.ageMax; delete mapped.ageMax; }
  if ('coutType' in mapped) { mapped.cout_type = mapped.coutType; delete mapped.coutType; }
  if ('coutFacture' in mapped) { mapped.cout_facture = mapped.coutFacture; delete mapped.coutFacture; }
  if ('tPublic' in mapped) { mapped.t_public = mapped.tPublic; delete mapped.tPublic; }
  if ('tParent' in mapped) { mapped.t_parent = mapped.tParent; delete mapped.tParent; }
  if ('tMeteo' in mapped) { mapped.t_meteo = mapped.tMeteo; delete mapped.tMeteo; }
  if ('tService' in mapped) { mapped.t_service = mapped.tService; delete mapped.tService; }
  if ('banMotif' in mapped) { mapped.ban_motif = mapped.banMotif; delete mapped.banMotif; }
  if ('dateLimite' in mapped) { mapped.date_limite = mapped.dateLimite; delete mapped.dateLimite; }
  if ('dateEntree' in mapped) { mapped.date_entree = mapped.dateEntree; delete mapped.dateEntree; }
  if ('finEngagement' in mapped) { mapped.fin_engagement = mapped.finEngagement; delete mapped.finEngagement; }
  if ('activiteId' in mapped) { mapped.activite_id = mapped.activiteId; delete mapped.activiteId; }
  if ('activite' in mapped && !('activite_id' in mapped)) { mapped.activite_id = mapped.activite; delete mapped.activite; }
  if ('enfantId' in mapped) { mapped.enfant_id = mapped.enfantId; delete mapped.enfantId; }
  if ('sondageId' in mapped) { mapped.sondage_id = mapped.sondageId; delete mapped.sondageId; }
  // Handle 'activite' (number) -> 'activite_id'
  if ('activite' in mapped && typeof mapped.activite === 'number') { 
    mapped.activite_id = mapped.activite; delete mapped.activite; 
  }
  if ('souscat' in mapped) { mapped.sous_categorie = mapped.souscat; delete mapped.souscat; }
  if ('sousCategorie' in mapped) { mapped.sous_categorie = mapped.sousCategorie; delete mapped.sousCategorie; }
  if ('dateActivite' in mapped) { mapped.date_activite = mapped.dateActivite; delete mapped.dateActivite; }
  if ('dateEnvoi' in mapped) { mapped.date_envoi = mapped.dateEnvoi; delete mapped.dateEnvoi; }
  if ('coutEstime' in mapped) { mapped.cout_estime = mapped.coutEstime; delete mapped.coutEstime; }
  if ('prestataireSuggere' in mapped) { mapped.prestataire_suggere = mapped.prestataireSuggere; delete mapped.prestataireSuggere; }
  // Handle 'dateLimite' spelling variant
  if ('datelimite' in mapped) { mapped.date_limite = mapped.datelimite; delete mapped.datelimite; }
  // Remove undefined/null id for inserts
  if (mapped.id === undefined || mapped.id === null) delete mapped.id;
  return mapped;
};

FriDB.fromDb = function(obj) {
  var mapped = Object.assign({}, obj);
  if ('description' in mapped) { mapped.desc = mapped.description; delete mapped.description; }
  if ('date_limite' in mapped) { mapped.dateLimite = mapped.date_limite; delete mapped.date_limite; }
  if ('heure_debut' in mapped) { mapped.heureDebut = mapped.heure_debut; delete mapped.heure_debut; }
  if ('heure_fin' in mapped) { mapped.heureFin = mapped.heure_fin; delete mapped.heure_fin; }
  if ('prest_id' in mapped) { mapped.prestId = mapped.prest_id; delete mapped.prest_id; }
  if ('prest_contact' in mapped) { mapped.prestContact = mapped.prest_contact; delete mapped.prest_contact; }
  if ('prest_email' in mapped) { mapped.prestEmail = mapped.prest_email; delete mapped.prest_email; }
  if ('prest_tel' in mapped) { mapped.prestTel = mapped.prest_tel; delete mapped.prest_tel; }
  if ('prest_url' in mapped) { mapped.prestUrl = mapped.prest_url; delete mapped.prest_url; }
  if ('age_min' in mapped) { mapped.ageMin = mapped.age_min; delete mapped.age_min; }
  if ('age_max' in mapped) { mapped.ageMax = mapped.age_max; delete mapped.age_max; }
  if ('cout_type' in mapped) { mapped.coutType = mapped.cout_type; delete mapped.cout_type; }
  if ('cout_facture' in mapped) { mapped.coutFacture = mapped.cout_facture; delete mapped.cout_facture; }
  if ('t_public' in mapped) { mapped.tPublic = mapped.t_public; delete mapped.t_public; }
  if ('t_parent' in mapped) { mapped.tParent = mapped.t_parent; delete mapped.t_parent; }
  if ('t_meteo' in mapped) { mapped.tMeteo = mapped.t_meteo; delete mapped.t_meteo; }
  if ('t_service' in mapped) { mapped.tService = mapped.t_service; delete mapped.t_service; }
  if ('categorie' in mapped) { mapped.cat = mapped.categorie; }
  if ('sous_categorie' in mapped) { mapped.souscat = mapped.sous_categorie; }
  if ('ban_motif' in mapped) { mapped.banMotif = mapped.ban_motif; delete mapped.ban_motif; }
  if ('date_entree' in mapped) { mapped.dateEntree = mapped.date_entree; delete mapped.date_entree; }
  if ('fin_engagement' in mapped) { mapped.finEngagement = mapped.fin_engagement; delete mapped.fin_engagement; }
  if ('activite_id' in mapped) { mapped.activiteId = mapped.activite_id; delete mapped.activite_id; }
  if ('enfant_id' in mapped) { mapped.enfantId = mapped.enfant_id; delete mapped.enfant_id; }
  if ('sondage_id' in mapped) { mapped.sondageId = mapped.sondage_id; delete mapped.sondage_id; }
  return mapped;
};

// Override save methods to use mapping
var _origSave = {};
var SAVE_TABLE_MAP = {
  saveActivite:'activites', saveEnfant:'enfants', saveInscription:'inscriptions',
  saveTache:'taches', savePrestataire:'prestataires', saveEntree:'entrees_budget',
  saveDepense:'depenses_budget', saveIdee:'idees', saveDocument:'documents',
  saveCatDoc:'categories_docs', saveIncident:'incidents', saveSondage:'sondages',
  saveReponse:'reponses_sondage', saveCampagne:'campagnes', saveMembre:'membres',
  saveCompte:'comptes'
};

Object.keys(SAVE_TABLE_MAP).forEach(function(fn){
  var table = SAVE_TABLE_MAP[fn];
  var orig = FriDB[fn].bind(FriDB);
  FriDB[fn] = async function(obj) {
    var dbObj = FriDB.toDb(Object.assign({}, obj));
    var cleanObj = FriDB.stripUnknown(table, dbObj);
    var result = await orig(cleanObj);
    if (Array.isArray(result)) return result.map(FriDB.fromDb);
    return result;
  };
});

// Override get methods to use mapping
['getMembres','getActivites','getEnfants','getInscriptions','getTaches',
 'getPrestataires','getEntrees','getDepenses','getIdees','getDocuments',
 'getCategsDocs','getIncidents','getSondages','getReponses','getCampagnes','getComptes'].forEach(function(fn){
  var orig = FriDB[fn].bind(FriDB);
  FriDB[fn] = async function(arg) {
    var result = await orig(arg);
    if (Array.isArray(result)) return result.map(FriDB.fromDb);
    return result;
  };
});


// Universal quick save - strips unknown columns automatically
FriDB.quickSave = async function(table, obj) {
  // Step 1: Convert camelCase to snake_case FIRST
  var converted = FriDB.toDb(Object.assign({}, obj));
  console.log('[QuickSave] table:', table);
  console.log('[QuickSave] original:', JSON.stringify(obj).substring(0,150));
  console.log('[QuickSave] converted:', JSON.stringify(converted).substring(0,150));
  // Step 2: Strip to known columns only
  var cols = FriDB.COLUMNS[table];
  var clean = {};
  if(cols) {
    cols.forEach(function(c){
      if(c in converted && converted[c] !== undefined && converted[c] !== null) {
        clean[c] = converted[c];
      }
    });
  } else {
    clean = converted;
  }
  // Step 3: Remove id for inserts, keep for updates
  // Only PATCH if this is a Supabase-originated ID (has created_at)
  // Local JS ids (nid++) should always be POSTed as new records
  if(obj.id && obj.created_at) {
    // Final cleanup for PATCH: empty strings -> null, arrays -> JSON string
    Object.keys(clean).forEach(function(k){
      if(clean[k] === '' || clean[k] === undefined) {
        clean[k] = null;
      } else if(Array.isArray(clean[k])) {
        clean[k] = JSON.stringify(clean[k]);
      }
    });
    delete clean.id;
    return await FriDB.query(table, 'PATCH', clean, '?id=eq.'+obj.id);
  }
  delete clean.id;
  // Final cleanup: empty strings -> null, arrays -> JSON string
  Object.keys(clean).forEach(function(k){
    if(clean[k] === '' || clean[k] === undefined) {
      clean[k] = null;
    } else if(Array.isArray(clean[k])) {
      clean[k] = JSON.stringify(clean[k]);
    }
  });
  console.log('[QuickSave] POST to', table, JSON.stringify(clean).substring(0,200));
  return await FriDB.query(table, 'POST', clean);
};

window.FriDB = FriDB;
console.log('Fri-Time Intyamon — Supabase connecté ✓');
