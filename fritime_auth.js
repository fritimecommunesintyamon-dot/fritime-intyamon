/**
 * FRI-TIME INTYAMON — Authentification
 * Gère la session, la protection des pages et les droits d'accès.
 * 
 * NIVEAUX D'ACCÈS :
 * - "president"   : accès total + validation des demandes
 * - "comite"      : accès à tous les modules
 * - "lecture"     : consultation uniquement (pas de modification)
 */

const FriAuth = {

  // Pages accessibles sans connexion
  PUBLIC_PAGES: [
    "fritime_login.html",
    "fritime_inscription_publique.html",
    "fritime_sondage_parent.html"
  ],

  // Droits par rôle
  ROLES_DROITS: {
    "Présidente":               "president",
    "Vice-présidente":          "president",
    "Trésorière":               "comite",
    "Trésorier":                "comite",
    "Secrétaire":               "comite",
    "Responsable activités":    "comite",
    "Responsable communication":"comite",
    "Responsable inscriptions": "comite",
    "Contact prestataires":     "comite",
    "Membre":                   "comite",
  },

  // ─────────────────────────────────────────────
  // VÉRIFICATION AU CHARGEMENT DE CHAQUE PAGE
  // ─────────────────────────────────────────────
  check() {
    const currentPage = window.location.pathname.split("/").pop() || "fritime_dashboard.html";

    // Page publique → pas de vérification
    if (this.PUBLIC_PAGES.includes(currentPage)) return;

    const user = this.getUser();
    if (!user) {
      // Non connecté → redirection login
      window.location.href = "fritime_login.html";
      return;
    }

    // Session expirée (8 heures)
    const elapsed = Date.now() - (user.loginTime || 0);
    if (elapsed > 8 * 60 * 60 * 1000) {
      this.logout();
      return;
    }

    // Rafraîchir le temps de session
    user.loginTime = Date.now();
    this.saveUser(user);

    // Afficher les infos utilisateur dans la nav
    this.updateNavUI(user);
  },

  // ─────────────────────────────────────────────
  // CONNEXION
  // ─────────────────────────────────────────────
  login(email, pwd) {
    // Comptes enregistrés (dans la version finale → vérification côté serveur)
    const comptes = JSON.parse(localStorage.getItem("ft_comptes") || "[]");
    const defaults = [
      {email:"marie.dupont@example.ch", pwd:"Fritim2026!", nom:"Marie Dupont", role:"Présidente"},
      {email:"jean.martin@example.ch", pwd:"Fritim2026!", nom:"Jean Martin", role:"Trésorier"},
      {email:"sophie.remy@example.ch", pwd:"Fritim2026!", nom:"Sophie Remy", role:"Responsable inscriptions"},
      {email:"lara.blanc@example.ch", pwd:"Fritim2026!", nom:"Lara Blanc", role:"Responsable communication"},
      {email:"paul.morel@example.ch", pwd:"Fritim2026!", nom:"Paul Morel", role:"Contact prestataires"},
    ];
    const tous = [...defaults, ...comptes];
    const compte = tous.find(c => c.email === email && c.pwd === pwd);

    if (!compte) return null;

    const user = {
      nom: compte.nom,
      email: compte.email,
      role: compte.role,
      droits: this.ROLES_DROITS[compte.role] || "comite",
      loginTime: Date.now(),
    };
    this.saveUser(user);
    return user;
  },

  // ─────────────────────────────────────────────
  // INSCRIPTION D'UN NOUVEAU COMPTE
  // ─────────────────────────────────────────────
  register(prenom, nom, email, pwd, role) {
    const comptes = JSON.parse(localStorage.getItem("ft_comptes") || "[]");
    // Vérifier si email déjà utilisé
    if (comptes.find(c => c.email === email)) return false;
    comptes.push({prenom, nom, email, pwd, role, actif: false});
    localStorage.setItem("ft_comptes", JSON.stringify(comptes));
    return true;
  },

  // ─────────────────────────────────────────────
  // DÉCONNEXION
  // ─────────────────────────────────────────────
  logout() {
    sessionStorage.removeItem("ft_user");
    window.location.href = "fritime_login.html";
  },

  // ─────────────────────────────────────────────
  // GESTION SESSION
  // ─────────────────────────────────────────────
  getUser() {
    try {
      return JSON.parse(sessionStorage.getItem("ft_user"));
    } catch { return null; }
  },

  saveUser(user) {
    sessionStorage.setItem("ft_user", JSON.stringify(user));
  },

  // Vérifier si l'utilisateur est président
  isPresident() {
    const u = this.getUser();
    return u && u.droits === "president";
  },

  // Vérifier si l'utilisateur a accès à une action
  canEdit() {
    const u = this.getUser();
    return u && ["president","comite"].includes(u.droits);
  },

  // ─────────────────────────────────────────────
  // MISE À JOUR DE L'INTERFACE NAV
  // ─────────────────────────────────────────────
  updateNavUI(user) {
    // Initiales avatar
    const initials = (user.nom || "?").split(" ").map(p => p[0] || "").join("").substring(0,2).toUpperCase();
    const avatarEl = document.getElementById("ft-avatar-initials");
    const nameEl = document.getElementById("ft-user-name");
    const menuName = document.getElementById("ft-menu-name");
    const menuRole = document.getElementById("ft-menu-role");

    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) { nameEl.textContent = user.nom; nameEl.style.display = "block"; }
    if (menuName) menuName.textContent = user.nom;
    if (menuRole) menuRole.textContent = user.role;

    // Masquer les boutons de modification si lecture seule
    if (!this.canEdit()) {
      document.querySelectorAll(".btn-primary, .btn-danger").forEach(btn => {
        btn.style.display = "none";
      });
    }

    // Afficher le badge "Président" si applicable
    if (this.isPresident() && menuRole) {
      menuRole.innerHTML = user.role + ' <span style="font-size:10px;background:#1a1a1a;color:#fff;padding:1px 5px;border-radius:10px;margin-left:4px">Admin</span>';
    }
  }
};

// Rendre disponible globalement
window.FTAuth = FriAuth;

// Vérification automatique à chaque chargement de page
document.addEventListener("DOMContentLoaded", () => FriAuth.check());
