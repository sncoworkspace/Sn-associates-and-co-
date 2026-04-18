/// <reference types="vite/client" />

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const emailService = {
    sendEmail: async (to: string | string[], subject: string, html: string) => {
        if (!RESEND_API_KEY) {
            console.warn("Resend API key not found. Email not sent.");
            return;
        }
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'SN Associates <onboarding@resend.dev>',
                    to,
                    subject,
                    html
                })
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("Resend API error:", error);
            }
        } catch (e) {
            console.error("Resend API failed", e);
        }
    },

    getAdminTemplate: (type: string, data: any) => `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Submission Alert</h1>
                <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 16px;">[INTERNAL] ${type}</p>
            </div>
            <div style="padding: 32px 24px;">
                <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">A new submission has been received from the <strong>SN Associates & Co</strong> website.</p>
                
                <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #f3f4f6;">
                    <h2 style="color: #111827; font-size: 18px; font-weight: 700; margin: 0 0 16px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">Submission Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Name</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.name || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.phone || 'N/A'}</td>
                        </tr>
                        ${data.service ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.service}</td>
                        </tr>` : ''}
                        ${data.date ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.date}</td>
                        </tr>` : ''}
                        ${data.time ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.time}</td>
                        </tr>` : ''}
                        ${data.amount ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">₹${data.amount}</td>
                        </tr>` : ''}
                        ${data.payment_id ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment ID</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.payment_id}</td>
                        </tr>` : ''}
                    </table>
                    
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                        <h3 style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Message/Notes:</h3>
                        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${data.message || data.notes || 'No message provided.'}</p>
                    </div>
                </div>
                
                <div style="margin-top: 32px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div style="background-color: #f3f4f6; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                This is an automated notification from SN Associates & Co.
            </div>
        </div>
    `,

    getUserTemplate: (type: string, data: any) => {
        const isPurchase = type.toLowerCase().includes('purchase') || type.toLowerCase().includes('enrollment');
        const title = isPurchase ? 'Enrollment Confirmed!' : 'Request Received!';
        const heroText = isPurchase
            ? `Welcome to the program! We've successfully received your enrollment fee and your spot is secured.`
            : `Thank you for reaching out to us. We have received your request for ${type} and our team of experts is already looking into it.`;

        return `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 48px 24px; text-align: center;">
                <div style="background: rgba(255, 255, 255, 0.1); width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">${title}</h1>
                <p style="color: #bfdbfe; margin: 12px 0 0; font-size: 18px; font-weight: 500;">SN Associates & Co</p>
            </div>
            <div style="padding: 40px 32px;">
                <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 16px 0;">Hello ${data.name.split(' ')[0]},</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">${heroText}</p>
                
                <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                    <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px 0;">Summary of your details</p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-size: 14px;">Reference:</span>
                            <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${type}</span>
                        </div>
                        ${data.items ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-size: 14px;">Items:</span>
                            <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${data.items}</span>
                        </div>` : ''}
                        ${data.program ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-size: 14px;">Program:</span>
                            <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${data.program}</span>
                        </div>` : ''}
                        ${data.date ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-size: 14px;">Date:</span>
                            <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${data.date}</span>
                        </div>` : ''}
                        ${data.amount ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-size: 14px;">Amount Paid:</span>
                            <span style="color: #1e293b; font-size: 14px; font-weight: 600;">₹${data.amount}</span>
                        </div>` : ''}
                    </div>
                </div>

                <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #dbeafe;">
                    <p style="color: #1e40af; font-size: 15px; font-weight: 600; margin: 0;">What happens next?</p>
                    <p style="color: #3b82f6; font-size: 14px; margin: 8px 0 0;">${isPurchase
                ? 'Our academic coordinator will reach out to you within 24 hours to provide access to your materials and start the onboarding process.'
                : 'One of our consultants will contact you within 24 business hours to discuss your requirements in detail.'
            }</p>
                </div>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #f1f5f9; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">Need immediate assistance?</p>
                    <a href="tel:+917406581456" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">Call Us: +91 7406581456</a>
                </div>
            </div>
            <div style="background-color: #f9fafb; padding: 32px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">SN Associates & Co</p>
                <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">#1, 1st Floor, Electronic City Main Road, <br>Bettadasanapura, Bangalore - 560100</p>
                <div style="margin-top: 16px; display: flex; justify-content: center; gap: 16px;">
                    <span style="color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} SN Associates & Co. All rights reserved.</span>
                </div>
            </div>
        </div>`;
    },

    sendNotification: async (type: string, data: any) => {
        // Admin Alert
        await emailService.sendEmail(
            ['snco.workspace@gmail.com', 'audit.snassociates@gmail.com'],
            `[SNA] New ${type} Received - ${data.name}`,
            emailService.getAdminTemplate(type, data)
        );

        // User Confirmation
        if (data.email) {
            await emailService.sendEmail(
                data.email,
                `We've received your request: SN Associates & Co`,
                emailService.getUserTemplate(type, data)
            );
        }
    }
};
