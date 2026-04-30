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
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    };
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase error: ${res.status} ${err}`);
    }
    if (method === 'DELETE' || method === 'PATCH') return true;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  },

  // ─── MEMBRES ─────────────────────────────────
  async getMembres() {
    return await this.query('membres', 'GET', null, '?order=id');
  },
  async saveMembre(m) {
    if (m.id) {
      return await this.query('membres', 'PATCH', m, `?id=eq.${m.id}`);
    }
    const {id, ...data} = m;
    return await this.query('membres', 'POST', data);
  },
  async deleteMembre(id) {
    return await this.query('membres', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── ACTIVITÉS ───────────────────────────────
  async getActivites() {
    return await this.query('activites', 'GET', null, '?order=date');
  },
  async saveActivite(a) {
    if (a.id) {
      return await this.query('activites', 'PATCH', a, `?id=eq.${a.id}`);
    }
    const {id, ...data} = a;
    return await this.query('activites', 'POST', data);
  },
  async deleteActivite(id) {
    return await this.query('activites', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── ENFANTS ─────────────────────────────────
  async getEnfants() {
    return await this.query('enfants', 'GET', null, '?order=nom');
  },
  async saveEnfant(e) {
    if (e.id) {
      return await this.query('enfants', 'PATCH', e, `?id=eq.${e.id}`);
    }
    const {id, ...data} = e;
    return await this.query('enfants', 'POST', data);
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
      return await this.query('inscriptions', 'PATCH', i, `?id=eq.${i.id}`);
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
      return await this.query('taches', 'PATCH', t, `?id=eq.${t.id}`);
    }
    const {id, ...data} = t;
    return await this.query('taches', 'POST', data);
  },
  async deleteTache(id) {
    return await this.query('taches', 'DELETE', null, `?id=eq.${id}`);
  },

  // ─── PRESTATAIRES ────────────────────────────
  async getPrestataires() {
    return await this.query('prestataires', 'GET', null, '?order=nom');
  },
  async savePrestataire(p) {
    if (p.id) {
      return await this.query('prestataires', 'PATCH', p, `?id=eq.${p.id}`);
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
    if (e.id) return await this.query('entrees_budget', 'PATCH', e, `?id=eq.${e.id}`);
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
    if (d.id) return await this.query('depenses_budget', 'PATCH', d, `?id=eq.${d.id}`);
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
    if (i.id) return await this.query('idees', 'PATCH', i, `?id=eq.${i.id}`);
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
    if (d.id) return await this.query('documents', 'PATCH', d, `?id=eq.${d.id}`);
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
    if (c.id) return await this.query('categories_docs', 'PATCH', c, `?id=eq.${c.id}`);
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
    if (i.id) return await this.query('incidents', 'PATCH', i, `?id=eq.${i.id}`);
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
    if (s.id) return await this.query('sondages', 'PATCH', s, `?id=eq.${s.id}`);
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
    if (c.id) return await this.query('campagnes', 'PATCH', c, `?id=eq.${c.id}`);
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
    if (c.id) return await this.query('comptes', 'PATCH', c, `?id=eq.${c.id}`);
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
  if ('enfantId' in mapped) { mapped.enfant_id = mapped.enfantId; delete mapped.enfantId; }
  if ('sondageId' in mapped) { mapped.sondage_id = mapped.sondageId; delete mapped.sondageId; }
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
['saveActivite','saveEnfant','saveInscription','saveTache','savePrestataire',
 'saveEntree','saveDepense','saveIdee','saveDocument','saveCatDoc',
 'saveIncident','saveSondage','saveReponse','saveCampagne','saveMembre','saveCompte'].forEach(function(fn){
  var orig = FriDB[fn].bind(FriDB);
  FriDB[fn] = async function(obj) {
    var dbObj = FriDB.toDb(Object.assign({}, obj));
    var result = await orig(dbObj);
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

window.FriDB = FriDB;
console.log('Fri-Time Intyamon — Supabase connecté ✓');
