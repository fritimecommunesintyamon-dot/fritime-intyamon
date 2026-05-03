/**
 * FRI-TIME INTYAMON — Envoi d'emails via Brevo
 * La clé API est sécurisée côté serveur (Vercel function)
 */

const SENDER = {email: 'fritimecommunesintyamon@gmail.com', name: 'Fri-Time Intyamon'};
const EMAIL_API = '/api/send-email';

const FriBrevo = {

  async sendEmail(to, subject, htmlContent) {
    const res = await fetch(EMAIL_API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        sender: SENDER,
        to: Array.isArray(to) ? to : [{email: to}],
        subject: subject,
        htmlContent: htmlContent
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error('Envoi échoué: ' + res.status + ' ' + err);
    }
    return await res.json();
  },

  async sendCampagne(campaign, destinataires) {
    const results = [];
    for (const dest of destinataires) {
      try {
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:#1a1a1a;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center">
              <h2 style="margin:0">Fri-Time Intyamon</h2>
              <p style="margin:8px 0 0;opacity:.7;font-size:14px">Activités pour enfants — Commune d'Intyamon</p>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <p>Bonjour,</p>
              ${campaign.message || "Nous vous contactons au sujet des activités Fri-Time Intyamon."}
              <div style="margin:24px 0;padding:16px;background:#f5f5f3;border-radius:8px;border-left:4px solid #1a1a1a">
                <strong>Délai d'inscription :</strong> ${campaign.deadline || "à définir"}
              </div>
              <p style="font-size:13px;color:#888;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
                Fri-Time Intyamon — Commune d'Intyamon<br>
                fritimecommunesintyamon@gmail.com
              </p>
            </div>
          </div>`;
        const r = await FriBrevo.sendEmail(dest.email, 'Fri-Time Intyamon — ' + campaign.titre, html);
        results.push({success: true, email: dest.email, id: r.messageId});
      } catch(e) {
        results.push({success: false, email: dest.email, error: e.message});
      }
    }
    return results;
  },

  async sendSondage(sondage, sondageId, baseUrl) {
    const participants = sondage.participants || [];
    const results = [];
    const lien = (baseUrl || window.location.origin) + '/fritime_sondage_parent.html?id=' + sondageId;
    
    for (const p of participants) {
      if (!p.email) continue;
      try {
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:#1a1a1a;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center">
              <h2 style="margin:0">Fri-Time Intyamon</h2>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <p>Bonjour ${p.nom},</p>
              <p>Merci d'avoir participé à l'activité <strong>${sondage.activite}</strong>.</p>
              <p>Nous aimerions connaître votre avis pour améliorer nos activités futures.</p>
              <div style="text-align:center;margin:24px 0">
                <a href="${lien}" style="background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
                  ⭐ Donner mon avis
                </a>
              </div>
              <p style="font-size:13px;color:#888;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
                Fri-Time Intyamon — Commune d'Intyamon
              </p>
            </div>
          </div>`;
        const r = await FriBrevo.sendEmail(p.email, 'Votre avis compte — ' + sondage.activite + ' 🙂', html);
        results.push({success: true, nom: p.nom, id: r.messageId});
      } catch(e) {
        results.push({success: false, nom: p.nom, error: e.message});
      }
    }
    return results;
  }
};

window.FriBrevo = FriBrevo;
console.log('Fri-Time Intyamon — Brevo connecté ✓');
