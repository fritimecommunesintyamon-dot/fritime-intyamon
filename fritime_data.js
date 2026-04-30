/**
 * FRI-TIME INTYAMON — Données
 * Fichier central de données — version production
 */

const FriTimeData = {

  // ─────────────────────────────────────────────
  // MEMBRES DU COMITÉ
  // ─────────────────────────────────────────────
  membres: [
    {id:1, prenom:"Karine", nom:"Rebelo", role:"Présidente", statut:"actif", email:"karine_rebelo@hotmail.fr", tel:"", commune:"Albeuve"},
  ],

  // ─────────────────────────────────────────────
  // PRESTATAIRES
  // ─────────────────────────────────────────────
  prestataires: [],

  // ─────────────────────────────────────────────
  // ACTIVITÉS
  // ─────────────────────────────────────────────
  activites: [],

  // ─────────────────────────────────────────────
  // ENFANTS
  // ─────────────────────────────────────────────
  enfants: [],

  // ─────────────────────────────────────────────
  // INSCRIPTIONS
  // ─────────────────────────────────────────────
  inscriptions: [],

  // ─────────────────────────────────────────────
  // TÂCHES
  // ─────────────────────────────────────────────
  taches: [],

  // ─────────────────────────────────────────────
  // BUDGET
  // ─────────────────────────────────────────────
  entrees: [],
  depenses: [],

  // ─────────────────────────────────────────────
  // UTILITAIRES
  // ─────────────────────────────────────────────
  getMembre(id) {
    const m = this.membres.find(x => x.id === id);
    return m ? `${m.prenom} ${m.nom}` : "—";
  },
  getPrestataire(id) {
    return this.prestataires.find(x => x.id === id) || null;
  },
  getActivite(id) {
    return this.activites.find(x => x.id === id) || null;
  },
  getEnfant(id) {
    return this.enfants.find(x => x.id === id) || null;
  },
  getInscriptionsActivite(activiteId) {
    return this.inscriptions.filter(i => i.activiteId === activiteId);
  },
  getConfirmesActivite(activiteId) {
    return this.inscriptions.filter(i => i.activiteId === activiteId && ["confirme","present","absent"].includes(i.statut));
  },
  getSolde(annee) {
    const entrees = this.entrees.filter(e => e.annee === annee).reduce((s,e) => s + (e.recu||0), 0);
    const depenses = this.depenses.filter(d => d.annee === annee).reduce((s,d) => s + (d.realise||0), 0);
    return entrees - depenses;
  },
  fmtDate(d) {
    if(!d) return "—";
    const [y,m,j] = d.split("-");
    return `${j}.${m}.${y}`;
  },
  initiales(prenom, nom) {
    return ((prenom||"")[0] + (nom||"")[0]).toUpperCase();
  }
};

window.FT = FriTimeData;
