/**
 * FRI-TIME INTYAMON — Cron : rappels de date limite de tâches
 * Tourne chaque matin à 08h00 (Europe/Zurich) via Vercel Cron.
 * Envoie un email à la personne assignée + la présidente
 * pour toute tâche dont la date_limite est dans exactement 7 jours.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER = { email: 'fritimecommunesintyamon@gmail.com', name: 'Fri-Time Intyamon' };
const CRON_SECRET = process.env.CRON_SECRET; // optionnel, pour sécuriser l'endpoint

async function supabaseGet(table, filter) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter || ''}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(`Supabase ${table} erreur: ${res.status}`);
  return await res.json();
}

async function sendEmail(to, subject, htmlContent) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: SENDER,
      to: Array.isArray(to) ? to : [{ email: to }],
      subject,
      htmlContent
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Brevo erreur ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function buildEmailHtml(tache, assigneeNom, joursRestants) {
  const date = tache.date_limite
    ? tache.date_limite.split('-').reverse().join('.')
    : '—';
  const priorite = tache.priorite || '';
  const prioriteHtml = priorite
    ? `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;background:${priorite === 'haute' ? '#faeeda' : '#f0f0f0'};color:${priorite === 'haute' ? '#633806' : '#555'}">${priorite.charAt(0).toUpperCase() + priorite.slice(1)}</span>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">

  <div style="background:#1a1a1a;border-radius:12px 12px 0 0;padding:20px 28px">
    <div style="font-size:17px;font-weight:700;color:#fff;letter-spacing:.05em">Fri-Time Intyamon</div>
    <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:3px">Programme d'activités intercommunal</div>
  </div>

  <div style="background:#fff;padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px">
    <div style="font-size:20px;font-weight:700;color:#633806;margin-bottom:6px">⏰ Rappel — Échéance dans ${joursRestants} jours</div>

    <p style="font-size:14px;color:#555;margin:0 0 20px">Bonjour ${assigneeNom},</p>
    <p style="font-size:14px;color:#333;margin:0 0 20px">
      La tâche suivante arrive à échéance le <strong>${date}</strong>.
    </p>

    <div style="background:#f5f5f3;border-radius:10px;padding:20px;margin-bottom:24px">
      <div style="font-size:17px;font-weight:700;color:#1a1a1a;margin-bottom:10px">${tache.titre}</div>
      ${tache.description ? `<p style="font-size:13px;color:#666;margin:0 0 12px;line-height:1.6">${tache.description}</p>` : ''}
      <table style="width:100%;font-size:13px;color:#555;border-collapse:collapse">
        <tr><td style="padding:4px 0;width:28px">📅</td><td style="padding:4px 0"><strong>Échéance</strong></td><td style="padding:4px 0">${date}</td></tr>
        <tr><td style="padding:4px 0">👤</td><td style="padding:4px 0"><strong>Responsable</strong></td><td style="padding:4px 0">${tache.assignee || '—'}</td></tr>
        ${priorite ? `<tr><td style="padding:4px 0">🏷️</td><td style="padding:4px 0"><strong>Priorité</strong></td><td style="padding:4px 0">${prioriteHtml}</td></tr>` : ''}
        ${tache.notes ? `<tr style="vertical-align:top"><td style="padding:4px 0">📝</td><td style="padding:4px 0"><strong>Notes</strong></td><td style="padding:4px 0;line-height:1.5">${tache.notes}</td></tr>` : ''}
      </table>
    </div>

    <div style="background:#faeeda;border-radius:8px;padding:14px 16px;font-size:13px;color:#633806;margin-bottom:24px">
      ⚠️ Merci de vous assurer que cette tâche est complétée ou de signaler tout blocage à la présidente avant la date limite.
    </div>

    <p style="font-size:13px;color:#888;margin:0">
      Accès à l'espace comité : <a href="https://fritime-intyamon-1t2w.vercel.app" style="color:#0c447c">fritime-intyamon-1t2w.vercel.app</a><br>
      Questions : <a href="mailto:fritimecommunesintyamon@gmail.com" style="color:#0c447c">fritimecommunesintyamon@gmail.com</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  // Sécurité : vérification du secret si configuré
  if (CRON_SECRET) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({ error: 'Non autorisé' });
    }
  }

  // GET seulement (Vercel cron appelle en GET)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_URL ou SUPABASE_KEY manquant' });
  }
  if (!BREVO_API_KEY) {
    return res.status(500).json({ error: 'BREVO_API_KEY manquant' });
  }

  try {
    // Date cible : aujourd'hui + 7 jours
    const today = new Date();
    const target = new Date(today);
    target.setDate(today.getDate() + 7);
    const targetStr = target.toISOString().split('T')[0]; // YYYY-MM-DD

    // Récupérer les tâches avec date_limite = dans 7 jours, actives, ponctuelles
    const taches = await supabaseGet(
      'taches',
      `?date_limite=eq.${targetStr}&statut=neq.terminee&statut=neq.archivee&order=titre`
    );

    const tachesPonctuelles = taches.filter(t => !t.type || t.type === 'ponctuelle');

    if (!tachesPonctuelles.length) {
      return res.status(200).json({ ok: true, message: 'Aucune tâche à rappeler pour le ' + targetStr });
    }

    // Récupérer les membres du comité pour retrouver les emails
    const membres = await supabaseGet('membres', '?statut=eq.actif');

    // Trouver la présidente
    const presidente = membres.find(m =>
      (m.role || '').toLowerCase().includes('présidente') ||
      (m.role || '').toLowerCase().includes('presidente') ||
      (m.role || '').toLowerCase().includes('président') ||
      (m.role || '').toLowerCase().includes('president')
    );

    // Construire un index nom complet -> email
    const emailByNom = {};
    membres.forEach(m => {
      if (m.email) {
        const fullName = `${m.prenom || ''} ${m.nom || ''}`.trim();
        emailByNom[fullName.toLowerCase()] = { email: m.email, nom: m.prenom || fullName };
      }
    });

    const results = [];
    let envoyés = 0;
    let erreurs = 0;

    for (const tache of tachesPonctuelles) {
      const assigneeNom = tache.assignee || '';
      const assigneeMembre = emailByNom[assigneeNom.toLowerCase()];
      const assigneeNomCourt = assigneeMembre ? assigneeMembre.nom : (assigneeNom.split(' ')[0] || 'Membre');

      const html = buildEmailHtml(tache, assigneeNomCourt, 7);
      const subject = `Rappel — Tâche à échéance dans 7 jours : ${tache.titre}`;

      // Destinataires : assignée + présidente (sans doublon)
      const destinataires = [];
      if (assigneeMembre) {
        destinataires.push({ email: assigneeMembre.email, name: assigneeNomCourt });
      }
      if (presidente && presidente.email && (!assigneeMembre || presidente.email !== assigneeMembre.email)) {
        destinataires.push({ email: presidente.email, name: `${presidente.prenom || ''} ${presidente.nom || ''}`.trim() });
      }

      if (!destinataires.length) {
        results.push({ tache: tache.titre, statut: 'ignoré', raison: 'aucun email trouvé' });
        continue;
      }

      try {
        await sendEmail(destinataires, subject, html);
        results.push({ tache: tache.titre, statut: 'envoyé', destinataires: destinataires.map(d => d.email) });
        envoyés++;
      } catch (e) {
        results.push({ tache: tache.titre, statut: 'erreur', message: e.message });
        erreurs++;
      }
    }

    return res.status(200).json({
      ok: true,
      date_cible: targetStr,
      taches_trouvées: tachesPonctuelles.length,
      envoyés,
      erreurs,
      details: results
    });

  } catch (error) {
    console.error('cron-rappels-taches erreur:', error);
    return res.status(500).json({ error: error.message });
  }
};
