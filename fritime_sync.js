/**
 * FRI-TIME INTYAMON — Synchronisation entre modules
 * Ce fichier gère la persistance et la communication entre pages.
 * Les données sont sauvegardées dans le localStorage du navigateur.
 * Dans la version finale (Supabase), ce fichier sera remplacé par des appels API.
 */

const FriSync = {

  // ─────────────────────────────────────────────
  // INITIALISATION
  // ─────────────────────────────────────────────
  init() {
    // Version check - force reset if demo data still present
    const version = localStorage.getItem("ft_version");
    if (version !== "prod_v1") {
      localStorage.removeItem("ft_data");
      localStorage.setItem("ft_version", "prod_v1");
    }
    // Charger les données sauvegardées ou utiliser les données par défaut
    const saved = localStorage.getItem("ft_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Fusionner avec FT (les données sauvegardées priment)
        Object.keys(parsed).forEach(key => {
          if (Array.isArray(parsed[key])) {
            window.FT[key] = parsed[key];
          }
        });
      } catch(e) {
        console.warn("Erreur chargement données sauvegardées:", e);
      }
    } else {
      // Premier lancement — sauvegarder les données par défaut
      this.save();
    }
    console.log("Fri-Time Intyamon — données chargées ✓");
  },

  // ─────────────────────────────────────────────
  // SAUVEGARDE
  // ─────────────────────────────────────────────
  save() {
    const toSave = {
      activites: window.FT.activites,
      enfants: window.FT.enfants,
      inscriptions: window.FT.inscriptions,
      membres: window.FT.membres,
      prestataires: window.FT.prestataires,
      taches: window.FT.taches,
      entrees: window.FT.entrees,
      depenses: window.FT.depenses,
    };
    localStorage.setItem("ft_data", JSON.stringify(toSave));
  },

  // ─────────────────────────────────────────────
  // ACTIVITÉS
  // ─────────────────────────────────────────────
  saveActivite(activite) {
    const idx = window.FT.activites.findIndex(a => a.id === activite.id);
    if (idx >= 0) {
      window.FT.activites[idx] = activite;
    } else {
      // Nouvel ID
      const maxId = Math.max(0, ...window.FT.activites.map(a => a.id));
      activite.id = maxId + 1;
      window.FT.activites.push(activite);
    }
    // Mettre à jour le compteur d'inscrits
    this.updateInscrits(activite.id);
    this.save();
    this.notifyUpdate("activites", activite.id);
    return activite;
  },

  deleteActivite(id) {
    window.FT.activites = window.FT.activites.filter(a => a.id !== id);
    window.FT.inscriptions = window.FT.inscriptions.filter(i => i.activiteId !== id);
    this.save();
    this.notifyUpdate("activites", id);
  },

  // ─────────────────────────────────────────────
  // INSCRIPTIONS
  // ─────────────────────────────────────────────
  saveInscription(inscription) {
    const idx = window.FT.inscriptions.findIndex(i => i.id === inscription.id);
    if (idx >= 0) {
      window.FT.inscriptions[idx] = inscription;
    } else {
      const maxId = Math.max(0, ...window.FT.inscriptions.map(i => i.id));
      inscription.id = maxId + 1;
      window.FT.inscriptions.push(inscription);
    }
    this.updateInscrits(inscription.activiteId);
    this.save();
    this.notifyUpdate("inscriptions", inscription.id);
    return inscription;
  },

  deleteInscription(id) {
    const insc = window.FT.inscriptions.find(i => i.id === id);
    window.FT.inscriptions = window.FT.inscriptions.filter(i => i.id !== id);
    if (insc) this.updateInscrits(insc.activiteId);
    this.save();
    this.notifyUpdate("inscriptions", id);
  },

  // Met à jour le compteur d'inscrits d'une activité
  updateInscrits(activiteId) {
    const confirms = window.FT.inscriptions.filter(i =>
      i.activiteId === activiteId &&
      ["confirme","present","absent"].includes(i.statut)
    ).length;
    window.FT.activites = window.FT.activites.map(a =>
      a.id === activiteId ? {...a, inscrits: confirms} : a
    );
  },

  // ─────────────────────────────────────────────
  // ENFANTS
  // ─────────────────────────────────────────────
  saveEnfant(enfant) {
    const idx = window.FT.enfants.findIndex(e => e.id === enfant.id);
    if (idx >= 0) {
      window.FT.enfants[idx] = enfant;
    } else {
      const maxId = Math.max(0, ...window.FT.enfants.map(e => e.id));
      enfant.id = maxId + 1;
      window.FT.enfants.push(enfant);
    }
    this.save();
    this.notifyUpdate("enfants", enfant.id);
    return enfant;
  },

  deleteEnfant(id) {
    window.FT.enfants = window.FT.enfants.filter(e => e.id !== id);
    window.FT.inscriptions = window.FT.inscriptions.filter(i => i.enfantId !== id);
    this.save();
    this.notifyUpdate("enfants", id);
  },

  // ─────────────────────────────────────────────
  // TÂCHES
  // ─────────────────────────────────────────────
  saveTache(tache) {
    const idx = window.FT.taches.findIndex(t => t.id === tache.id);
    if (idx >= 0) {
      window.FT.taches[idx] = tache;
    } else {
      const maxId = Math.max(0, ...window.FT.taches.map(t => t.id));
      tache.id = maxId + 1;
      window.FT.taches.push(tache);
    }
    this.save();
    this.notifyUpdate("taches", tache.id);
    return tache;
  },

  // ─────────────────────────────────────────────
  // MEMBRES
  // ─────────────────────────────────────────────
  saveMembre(membre) {
    const idx = window.FT.membres.findIndex(m => m.id === membre.id);
    if (idx >= 0) {
      window.FT.membres[idx] = membre;
    } else {
      const maxId = Math.max(0, ...window.FT.membres.map(m => m.id));
      membre.id = maxId + 1;
      window.FT.membres.push(membre);
    }
    this.save();
    this.notifyUpdate("membres", membre.id);
    return membre;
  },

  // ─────────────────────────────────────────────
  // PRESTATAIRES
  // ─────────────────────────────────────────────
  savePrestataire(prest) {
    const idx = window.FT.prestataires.findIndex(p => p.id === prest.id);
    if (idx >= 0) {
      window.FT.prestataires[idx] = prest;
    } else {
      const maxId = Math.max(0, ...window.FT.prestataires.map(p => p.id));
      prest.id = maxId + 1;
      window.FT.prestataires.push(prest);
    }
    this.save();
    this.notifyUpdate("prestataires", prest.id);
    return prest;
  },

  // ─────────────────────────────────────────────
  // BUDGET
  // ─────────────────────────────────────────────
  saveEntree(entree) {
    const idx = window.FT.entrees.findIndex(e => e.id === entree.id);
    if (idx >= 0) {
      window.FT.entrees[idx] = entree;
    } else {
      const maxId = Math.max(0, ...window.FT.entrees.map(e => e.id));
      entree.id = maxId + 1;
      window.FT.entrees.push(entree);
    }
    this.save();
    return entree;
  },

  saveDepense(depense) {
    const idx = window.FT.depenses.findIndex(d => d.id === depense.id);
    if (idx >= 0) {
      window.FT.depenses[idx] = depense;
    } else {
      const maxId = Math.max(0, ...window.FT.depenses.map(d => d.id));
      depense.id = maxId + 1;
      window.FT.depenses.push(depense);
    }
    this.save();
    return depense;
  },

  // ─────────────────────────────────────────────
  // NOTIFICATIONS ENTRE MODULES
  // Utilise localStorage events pour notifier les autres onglets
  // ─────────────────────────────────────────────
  notifyUpdate(type, id) {
    localStorage.setItem("ft_update", JSON.stringify({
      type, id, ts: Date.now()
    }));
  },

  // ─────────────────────────────────────────────
  // RESET (réinitialiser aux données par défaut)
  // ─────────────────────────────────────────────
  reset() {
    if (confirm("Réinitialiser toutes les données aux valeurs par défaut ? Cette action est irréversible.")) {
      localStorage.removeItem("ft_data");
      localStorage.removeItem("ft_update");
      window.location.reload();
    }
  },

  // ─────────────────────────────────────────────
  // EXPORT JSON (sauvegarde manuelle)
  // ─────────────────────────────────────────────
  exportJSON() {
    const data = localStorage.getItem("ft_data");
    if (!data) { alert("Aucune donnée à exporter"); return; }
    const blob = new Blob([data], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fritime_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
  },

  // ─────────────────────────────────────────────
  // IMPORT JSON (restauration)
  // ─────────────────────────────────────────────
  importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem("ft_data", JSON.stringify(data));
        alert("Données importées avec succès. Rechargement...");
        window.location.reload();
      } catch(err) {
        alert("Fichier invalide : " + err.message);
      }
    };
    reader.readAsText(file);
  }
};

// Initialiser automatiquement
window.FTSync = FriSync;
document.addEventListener("DOMContentLoaded", () => FriSync.init());

// Écouter les mises à jour des autres onglets
window.addEventListener("storage", (e) => {
  if (e.key === "ft_data" && e.newValue) {
    try {
      const parsed = JSON.parse(e.newValue);
      Object.keys(parsed).forEach(key => {
        if (Array.isArray(parsed[key])) window.FT[key] = parsed[key];
      });
      // Rafraîchir si la page a une fonction render()
      if (typeof render === "function") render();
      if (typeof renderAll === "function") renderAll();
    } catch(e) {}
  }
});
