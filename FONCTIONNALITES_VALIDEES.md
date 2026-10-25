# Fonctionnalités validées — Fri-Time Intyamon

Ce fichier liste les fonctionnalités confirmées par Karine comme opérationnelles.
**Avant chaque commit, vérifier que chaque signature est encore présente dans le fichier concerné.**

---

## fritime_activites_planning.html

### Activités
- [ ] Grille des activités avec filtre par catégorie — `function renderGrid`
- [ ] Filtre période date-à-date (activités) — `id="periode-deb"` + `function applyPeriode`
- [ ] Filtre période date-à-date (planning) — `id="plan-periode-deb"`
- [ ] Création/modification activité — `async function saveActivite`
- [ ] Validation complète formulaire activité (tous champs obligatoires) — `id="act-form-error"`
- [ ] Upload photo activité — `function uploadPhotoFile`
- [ ] Statuts activité (brouillon/publié/complet/réalisé/annulé/météo) — `function selectStatut`

### Calendrier (onglet Campagnes)
- [ ] Onglet Calendrier intégré dans Activités & Planning — `switchModuleTab('campagnes')`
- [ ] Création de campagne — `function campSaveCampaign`
- [ ] Validation formulaire campagne (tous champs obligatoires) — `id="camp-form-error"`
- [ ] Lien d'inscription Klapp — `fritime-intyamon-1t2w.vercel.app/fritime_inscription_publique.html?id=`
- [ ] Modals campagne centrées (overlay + classList) — `id="mCampCreate"` + `classList.add('open')`
- [ ] Bannière info "via l'app Klapp" — `via l'app Klapp à tous les élèves`

### Planning
- [ ] Vue planning (liste chronologique) — `function renderPlanList`
- [ ] Filtre période sur planning — `function filterByPeriode`

---

## fritime_inscription_publique.html

- [ ] Blocage doublon AVANT confirmation — vérification Supabase à l'étape 5 avant `showStep(6)`
- [ ] Message d'erreur doublon visible — `id="err-doublon-insc"`
- [ ] Encadré jaune avertissement non-confirmation — `background:#fff3cd` dans section email-confirmation
- [ ] Création enfant + inscriptions dans Supabase — `rest/v1/enfants` + `rest/v1/inscriptions`
- [ ] Email de confirmation envoyé — `function sendConfirmationEmail` ou équivalent

---

## fritime_enfants.html

- [ ] Liste des inscriptions en cours dans le détail enfant — `activitesList.find` dans `renderDet`
- [ ] Blocage doublon depuis le module admin — `function saveAddPart` + vérification `doublon`
- [ ] Bannissement enfant — `function confirmBan`

---

## fritime_campagnes.html

- [ ] Redirection vers activités#campagnes — `window.location.replace('fritime_activites_planning.html#campagnes')`

---

## Navigation (toutes les pages)

- [ ] Campagnes absent du menu de navigation — vérifier absence de `fritime_campagnes.html` dans les `<a>` de nav

---

*Dernière mise à jour : 25.10.2026*
