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
        const inscriptionUrl = campaign._inscriptionLink || 'https://fritime-intyamon-1t2w.vercel.app/fritime_inscription_publique.html';
        const messageEcole = campaign._messageEcole || '';
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a">
            <div style="background:#1a1a1a;color:#fff;padding:20px;border-radius:10px 10px 0 0;text-align:center">
              <div style="font-size:18px;font-weight:600">Fri-Time Intyamon</div>
              <div style="opacity:.6;font-size:12px;margin-top:4px">Activités pour enfants</div>
            </div>
            <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;line-height:1.75;font-size:14px">
              <div style="background:#f0f7ff;border:1px solid #b8d4f0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
                <p style="margin:0 0 6px;font-weight:600;font-size:13px;color:#1a4a7a">📢 À l'attention de l'administration scolaire</p>
                <p style="margin:0 0 8px;font-size:13px;color:#1a4a7a">Madame, Monsieur,</p>
                <p style="margin:0 0 8px;font-size:13px;color:#1a4a7a">Le comité Fri-Time Intyamon vous adresse ses cordiales salutations et vous remercie chaleureusement pour votre précieuse collaboration.</p>
                <p style="margin:0 0 8px;font-size:13px;color:#1a4a7a">Nous nous permettons de vous solliciter afin de bien vouloir transmettre le message ci-dessous aux familles de vos élèves, par le biais de votre canal de communication habituel (Klapp ou autre).</p>
                <p style="margin:0;font-size:13px;color:#1a4a7a">En vous remerciant par avance de votre aide, nous vous adressons nos meilleures salutations.<br><em>Le comité Fri-Time Intyamon</em></p>
                ${messageEcole ? '<hr style="border:none;border-top:1px solid #b8d4f0;margin:12px 0"/><p style="margin:0;font-size:13px;color:#1a4a7a;white-space:pre-line">'+messageEcole+'</p>' : ''}
              </div>
              <p style="margin:0 0 16px"><strong>Chers Parents,</strong></p>
              <p style="margin:0 0 20px">Par ce communiqué, le comité de Fri-Time Intyamon a le plaisir de vous faire parvenir le calendrier d'activité Fri-Time pour les prochains mois.</p>

              <p style="margin:0 0 8px;font-weight:600;font-size:15px">Qu'est-ce que Fri-Time ?</p>
              <p style="margin:0 0 6px">C'est un projet associatif cantonal, organisé par des bénévoles souhaitant participer au développement et à l'épanouissement de notre jeune population.</p>
              <p style="margin:0 0 6px">Son but est de proposer aux enfants des activités dans la grande majorité gratuites, variées, encadrées et accessibles à tous (exemples : sorties nature, ateliers créatifs, sports, découvertes culturelles).</p>
              <p style="margin:0 0 20px">Ce projet est né du plaisir de créer ensemble des moments qui comptent et d'offrir à tous les enfants des possibilités d'activités extra-scolaires.</p>

              <p style="margin:0 0 8px;font-weight:600;font-size:15px">Comment s'inscrire ?</p>
              <p style="margin:0 0 12px">Les inscriptions se font en ligne via notre formulaire officiel Fri-Time Intyamon, en cliquant ci-dessous.</p>
              <div style="text-align:center;margin:16px 0">
                <a href="${inscriptionUrl}" style="background:#1a1a1a;color:#fff;padding:11px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">→ Accéder au formulaire d'inscription</a>
              </div>
              <p style="margin:8px 0 6px;font-size:12px;color:#888;text-align:center">Ou copiez ce lien : <a href="${inscriptionUrl}" style="color:#555">${inscriptionUrl}</a></p>

              <div style="background:#FFF8E1;border-left:3px solid #EF9F27;padding:12px 16px;border-radius:0 6px 6px 0;margin:16px 0">
                <p style="margin:0 0 8px;font-size:13px;color:#633806"><strong>CONFIRMATION D'INSCRIPTION :</strong> la confirmation que vous recevrez par email ne garantit pas à votre enfant de pouvoir participer aux activités choisies.</p>
                <p style="margin:0;font-size:13px;color:#633806">Un système de sélection automatique a été mis en place pour donner une chance égale à tous les enfants. La priorité est donnée aux enfants n'ayant pas encore participé.</p>
              </div>
              <div style="background:#EAF3DE;border-left:3px solid #639922;padding:12px 16px;border-radius:0 6px 6px 0;margin:0 0 20px">
                <p style="margin:0;font-size:13px;color:#27500A"><strong>CONFIRMATION DE PARTICIPATION :</strong> si votre enfant est sélectionné, vous recevrez automatiquement une confirmation par email avec toutes les informations.</p>
              </div>

              <p style="margin:0 0 8px;font-weight:600;font-size:15px">Règlement de participation</p>
              <p style="margin:0 0 20px;font-size:13px;color:#444">La participation implique de respecter quelques règles ; un communiqué se trouve en haut du formulaire d'inscription. Vous devez confirmer en avoir pris connaissance pour que votre enfant puisse participer.</p>

              <p style="margin:0 0 8px;font-weight:600;font-size:15px">Envie de vous impliquer ?</p>
              <p style="margin:0 0 8px;font-size:13px;color:#444">Fri-Time fonctionne grâce à ses bénévoles ! Si vous souhaitez proposer une activité ou être surveillant lors d'une sortie, contactez-nous :</p>
              <ul style="margin:0 0 20px;padding-left:18px;font-size:13px;color:#444;line-height:1.9">
                <li>Par email : <a href="mailto:fritimecommunesintyamon@gmail.com" style="color:#1a1a1a">fritimecommunesintyamon@gmail.com</a></li>
                <li>Par téléphone : 079 793 76 42</li>
              </ul>

              <p style="margin:0 0 8px;font-weight:600;font-size:15px">Informations importantes</p>
              <ul style="margin:0 0 20px;padding-left:18px;font-size:13px;color:#444;line-height:1.9">
                <li>En cas d'empêchement, merci de nous prévenir le plus tôt possible afin de libérer la place pour un autre enfant qui désirerait participer. Si l'absence n'est pas signalée en temps et en heure, nous nous réservons le droit de bannir l'enfant pour les futures inscriptions.</li>
                <li>Certaines activités peuvent être soumises à une participation financière modeste ; le coût est toujours indiqué dans le formulaire d'inscription.</li>
                <li>Les photos peuvent être utilisées pour la communication de l'association, sauf indication contraire par écrit.</li>
              </ul>

              <p style="margin:0 0 8px">Nous sommes impatients de partager de belles aventures avec vos enfants.</p>
              <p style="margin:0 0 20px">Merci pour votre confiance et votre soutien pour ce projet qui nous tient à cœur !</p>
              <p style="margin:0 0 24px">Cordialement,<br><strong>Le comité Fri-Time Intyamon</strong></p>

              <div style="border-top:1px solid #eee;padding-top:14px;font-size:12px;color:#aaa;text-align:center">
                Fri-Time Intyamon<br>
                <a href="mailto:fritimecommunesintyamon@gmail.com" style="color:#aaa">fritimecommunesintyamon@gmail.com</a> · 079 793 76 42
              </div>
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
