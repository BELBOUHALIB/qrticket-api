import { Resend } from 'resend';

// Check if API key exists and initialize Resend
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.warn('Resend API key not found. Email functionality will be disabled.');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
interface EmailData {
  to: string;
  reservationNumber: string;
  eventName: string;
  eventDate: Date;
  location: string;
  ticketType: string;
  price: number;
}

export const sendReservationEmail = async (data: EmailData) => {
  try {
    if (!resend) {
      console.error('Email service not configured. Please add VITE_RESEND_API_KEY to your environment variables.');
      // For development, we'll just log the email data and return success
      console.log('Email would have been sent with data:', data);
      return true;
    }

    const { to, reservationNumber, eventName, eventDate, location, ticketType, price } = data;
    
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(eventDate);

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5; margin-bottom: 24px;">Confirmation de réservation</h1>
        
        <p style="margin-bottom: 16px;">Bonjour,</p>
        
        <p style="margin-bottom: 16px;">
          Nous avons bien reçu votre réservation pour l'événement "${eventName}".
        </p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; margin-bottom: 16px; color: #1F2937;">Détails de votre réservation</h2>
          
          <div style="background-color: #4F46E5; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px;">Votre numéro de réservation</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; font-family: monospace;">${reservationNumber}</p>
          </div>
          
          <p style="margin-bottom: 8px;">
            <strong>Événement:</strong> ${eventName}
          </p>
          <p style="margin-bottom: 8px;">
            <strong>Date:</strong> ${formattedDate}
          </p>
          <p style="margin-bottom: 8px;">
            <strong>Lieu:</strong> ${location}
          </p>
          <p style="margin-bottom: 8px;">
            <strong>Type de billet:</strong> ${ticketType}
          </p>
          <p style="margin-bottom: 8px;">
            <strong>Prix:</strong> ${price}€
          </p>
        </div>
        
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="margin-top: 0; color: #92400E;">Instructions importantes</h3>
          <p style="margin-bottom: 8px; color: #92400E;">
            <strong>⚠️ Conservez précieusement votre numéro de réservation !</strong>
          </p>
          <p style="margin-bottom: 8px;">
            1. Votre réservation est valable pendant 24 heures.
          </p>
          <p style="margin-bottom: 8px;">
            2. Présentez votre numéro de réservation au guichet pour finaliser le paiement.
          </p>
          <p style="margin-bottom: 0;">
            3. Après le paiement, votre ticket avec code QR vous sera remis.
          </p>
        </div>
        
        <p style="color: #6B7280; font-size: 14px;">
          Si vous avez des questions, n'hésitez pas à nous contacter.
        </p>
        
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            EventTicket - La billetterie simple et sécurisée
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'EventTicket <noreply@eventticket.com>',
      to: [to],
      subject: `Réservation #${reservationNumber} - ${eventName}`,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};