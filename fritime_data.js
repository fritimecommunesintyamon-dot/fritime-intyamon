/**
 * FRI-TIME INTYAMON — Données partagées
 * Ce fichier centralise toutes les données de l'application.
 * Il est chargé par tous les modules via <script src="fritime_data.js">
 * 
 * Dans la version finale avec base de données (Supabase),
 * ce fichier sera remplacé par des appels API automatiques.
 */

const FriTimeData = {

  // ─────────────────────────────────────────────
  // MEMBRES DU COMITÉ
  // ─────────────────────────────────────────────
  membres: [
    {id:1, prenom:"Marie", nom:"Dupont", role:"Présidente", statut:"actif", email:"marie.dupont@gmail.com", tel:"+41 79 100 11 22", commune:"Bulle"},
    {id:2, prenom:"Jean", nom:"Martin", role:"Trésorier", statut:"actif", email:"jean.martin@gmail.com", tel:"+41 79 200 22 33", commune:"Gruyères"},
    {id:3, prenom:"Sophie", nom:"Remy", role:"Responsable inscriptions", statut:"actif", email:"sophie.remy@gmail.com", tel:"+41 79 300 33 44", commune:"Broc"},
    {id:4, prenom:"Lara", nom:"Blanc", role:"Responsable communication", statut:"actif", email:"lara.blanc@gmail.com", tel:"+41 79 400 44 55", commune:"Bulle"},
    {id:5, prenom:"Paul", nom:"Morel", role:"Contact prestataires", statut:"actif", email:"paul.morel@gmail.com", tel:"+41 79 500 55 66", commune:"Châtel-St-Denis"},
    {id:6, prenom:"Ana", nom:"Favre", role:"Membre", statut:"remplacant", email:"ana.favre@gmail.com", tel:"+41 79 600 66 77", commune:"Bulle"},
  ],

  // ─────────────────────────────────────────────
  // PRESTATAIRES
  // ─────────────────────────────────────────────
  prestataires: [
    {id:1, nom:"Atelier Terracotta", type:"Indépendant", statut:"actif", cat:"Arts", cp:"Julie", cn:"Favre", email:"julie@terracotta.ch", tel:"+41 79 444 55 66", url:"https://atelierterracotta.ch", adresse:"Rue du Moulin 4, 1630 Bulle", gratuit:false, acts:["Poterie","Modelage"], evals:[]},
    {id:2, nom:"Guide Pro Rando", type:"Entreprise", statut:"actif", cat:"Nature", cp:"Marc", cn:"Dupont", email:"marc@guiderando.ch", tel:"+41 79 111 22 33", url:"", adresse:"Route du Col 12, 1663 Gruyères", gratuit:false, acts:["Randonnée","Observation nature"], evals:[]},
    {id:3, nom:"Cirque en Gruyère", type:"Association", statut:"acontacter", cat:"Arts", cp:"Sophie", cn:"Blanc", email:"contact@cirquegruyere.ch", tel:"+41 79 333 44 55", url:"", adresse:"", gratuit:false, acts:["Jonglage","Acrobatie"], evals:[]},
  ],

  // ─────────────────────────────────────────────
  // ACTIVITÉS
  // ─────────────────────────────────────────────
  activites: [
    {id:1, nom:"Atelier poterie", desc:"Initiation à la poterie avec un artisan local.", date:"2026-05-20", dateLimite:"2026-05-10", heureDebut:"09:00", heureFin:"12:00", lieu:"Atelier communal, Bulle", prestId:1, ageMin:6, ageMax:12, places:12, inscrits:8, cout:0, coutType:"global", coutFacture:"commune", materiel:"Tabliers fournis", tenue:"Vieux vêtements", statut:"planifiee", annee:"2025-2026", categorie:"Arts", tPublic:true, tMeteo:false, tService:true},
    {id:2, nom:"Sortie nature Lac Noir", desc:"Randonnée adaptée aux enfants autour du Lac Noir.", date:"2026-06-14", dateLimite:"2026-06-01", heureDebut:"08:30", heureFin:"17:00", lieu:"Lac Noir, Fribourg", prestId:2, ageMin:7, ageMax:14, places:20, inscrits:15, cout:25, coutType:"enfant", coutFacture:"familles", materiel:"Sac à dos, lunch, eau", tenue:"Chaussures de marche", statut:"validee", annee:"2025-2026", categorie:"Nature", tPublic:true, tMeteo:true, tService:true},
    {id:3, nom:"Cours de cirque", desc:"Découverte des arts du cirque.", date:"2026-07-08", dateLimite:"2026-06-25", heureDebut:"14:00", heureFin:"17:00", lieu:"Salle communale, Bulle", prestId:3, ageMin:5, ageMax:12, places:15, inscrits:0, cout:0, coutType:"global", coutFacture:"commune", materiel:"", tenue:"Vêtements confortables", statut:"idee", annee:"2025-2026", categorie:"Arts", tPublic:false, tMeteo:false, tService:false},
  ],

  // ─────────────────────────────────────────────
  // ENFANTS
  // ─────────────────────────────────────────────
  enfants: [
    {id:1, prenom:"Luca", nom:"Bernard", ddn:"2016-04-12", age:10, commune:"Bulle", pp:"Anne", pn:"Bernard", pe:"anne.bernard@gmail.com", pt:"+41 79 111 22 33", notes:"", parts:3, statut:"actif"},
    {id:2, prenom:"Emma", nom:"Favre", ddn:"2017-08-20", age:8, commune:"Gruyères", pp:"Paul", pn:"Favre", pe:"paul.favre@gmail.com", pt:"+41 79 222 33 44", notes:"Allergie aux arachides", parts:1, statut:"actif"},
    {id:3, prenom:"Noah", nom:"Morel", ddn:"2015-01-05", age:11, commune:"Broc", pp:"Claire", pn:"Morel", pe:"claire.morel@gmail.com", pt:"+41 79 333 44 55", notes:"", parts:5, statut:"actif"},
    {id:4, prenom:"Léa", nom:"Dupont", ddn:"2016-11-30", age:9, commune:"Bulle", pp:"Marc", pn:"Dupont", pe:"marc.dupont@gmail.com", pt:"+41 79 444 55 66", notes:"Asthme léger", parts:2, statut:"actif"},
    {id:5, prenom:"Tom", nom:"Remy", ddn:"2014-06-14", age:11, commune:"Châtel-St-Denis", pp:"Sophie", pn:"Remy", pe:"sophie.remy@gmail.com", pt:"+41 79 555 66 77", notes:"", parts:0, statut:"actif"},
  ],

  // ─────────────────────────────────────────────
  // INSCRIPTIONS
  // ─────────────────────────────────────────────
  inscriptions: [
    {id:1, enfantId:1, activiteId:1, statut:"confirme", pref:1, notes:"", presence:null},
    {id:2, enfantId:2, activiteId:1, statut:"confirme", pref:1, notes:"Allergie arachides à surveiller", presence:null},
    {id:3, enfantId:3, activiteId:1, statut:"selectionne", pref:2, notes:"", presence:null},
    {id:4, enfantId:4, activiteId:1, statut:"attente", pref:1, notes:"", presence:null},
    {id:5, enfantId:1, activiteId:2, statut:"confirme", pref:1, notes:"", presence:null},
    {id:6, enfantId:3, activiteId:2, statut:"confirme", pref:1, notes:"", presence:null},
    {id:7, enfantId:5, activiteId:2, statut:"selectionne", pref:2, notes:"", presence:null},
    {id:8, enfantId:2, activiteId:2, statut:"attente", pref:1, notes:"", presence:null},
  ],

  // ─────────────────────────────────────────────
  // TÂCHES
  // ─────────────────────────────────────────────
  taches: [
    {id:1, titre:"Contacter le prestataire poterie", desc:"Confirmer les détails de la session.", assignee:"Marie Dupont", priorite:"haute", activiteId:1, dateLimite:"2026-05-05", statut:"terminee"},
    {id:2, titre:"Réserver la salle communale", desc:"", assignee:"Jean Martin", priorite:"moyenne", activiteId:null, dateLimite:"2026-05-15", statut:"encours"},
    {id:3, titre:"Préparer la liste des participants", desc:"", assignee:"Sophie Remy", priorite:"haute", activiteId:2, dateLimite:"2026-06-01", statut:"assignee"},
    {id:4, titre:"Envoyer les confirmations aux familles", desc:"", assignee:"Lara Blanc", priorite:"moyenne", activiteId:2, dateLimite:"2026-06-05", statut:"ouverte"},
  ],

  // ─────────────────────────────────────────────
  // BUDGET
  // ─────────────────────────────────────────────
  entrees: [
    {id:1, source:"Subvention", desc:"Subvention cantonale", prevu:5000, recu:5000, statut:"recu", annee:"2025-2026"},
    {id:2, source:"Commune", desc:"Participation commune Intyamon", prevu:2000, recu:1500, statut:"partiel", annee:"2025-2026"},
    {id:3, source:"Don", desc:"Don association parents", prevu:500, recu:500, statut:"recu", annee:"2025-2026"},
    {id:4, source:"Recherche de fonds", desc:"Vente de gâteaux fête du village", prevu:300, recu:0, statut:"prevu", annee:"2025-2026"},
  ],

  depenses: [
    {id:1, desc:"Atelier poterie — Atelier Terracotta", activite:"Atelier poterie", prevu:180, reel:180, realise:180, type:"global", facture:"commune", annee:"2025-2026"},
    {id:2, desc:"Sortie Lac Noir — Guide Pro Rando", activite:"Sortie nature Lac Noir", prevu:625, reel:625, realise:0, type:"enfant", facture:"familles", annee:"2025-2026"},
    {id:3, desc:"Frais administratifs", activite:"", prevu:200, reel:150, realise:150, type:"global", facture:"commune", annee:"2025-2026"},
  ],

  // ─────────────────────────────────────────────
  // UTILITAIRES
  // ─────────────────────────────────────────────

  // Obtenir le nom complet d'un membre
  getMembre(id) {
    const m = this.membres.find(x => x.id === id);
    return m ? `${m.prenom} ${m.nom}` : "—";
  },

  // Obtenir un prestataire par ID
  getPrestataire(id) {
    return this.prestataires.find(x => x.id === id) || null;
  },

  // Obtenir une activité par ID
  getActivite(id) {
    return this.activites.find(x => x.id === id) || null;
  },

  // Obtenir un enfant par ID
  getEnfant(id) {
    return this.enfants.find(x => x.id === id) || null;
  },

  // Inscriptions pour une activité donnée
  getInscriptionsActivite(activiteId) {
    return this.inscriptions.filter(i => i.activiteId === activiteId);
  },

  // Inscriptions confirmées pour une activité
  getConfirmesActivite(activiteId) {
    return this.inscriptions.filter(i => i.activiteId === activiteId && ["confirme","present","absent"].includes(i.statut));
  },

  // Tâches d'un membre
  getTachesMembre(nomMembre) {
    return this.taches.filter(t => t.assignee === nomMembre && !["terminee","archivee"].includes(t.statut));
  },

  // Budget restant pour une année
  getSolde(annee) {
    const entrees = this.entrees.filter(e => e.annee === annee).reduce((s,e) => s + (e.recu||0), 0);
    const depenses = this.depenses.filter(d => d.annee === annee).reduce((s,d) => s + (d.realise||0), 0);
    return entrees - depenses;
  },

  // Formater une date JJ.MM.AAAA
  fmtDate(d) {
    if(!d) return "—";
    const [y,m,j] = d.split("-");
    return `${j}.${m}.${y}`;
  },

  // Initiales d'un nom
  initiales(prenom, nom) {
    return ((prenom||"")[0] + (nom||"")[0]).toUpperCase();
  }
};

// Rendre disponible globalement
window.FT = FriTimeData;
