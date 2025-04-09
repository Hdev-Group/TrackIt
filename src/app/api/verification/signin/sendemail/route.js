import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { createHmac } from 'crypto'; 

export async function POST(req) {
    const { to } = await req.json();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const secret = process.env.HASH_SECRET 
    const hashedCode = createHmac('sha256', secret)
        .update(code)
        .digest('hex');

    const sesClient = new SESClient({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const params = {
        Source: 'security@trackit.hdev.uk',
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: 'TrackIt Account Verification',
            },
            Body: {
                Text: {
                    Data: `Hello,\n\nThank you for signing up for TrackIt! To complete your account verification, please use the following code:\n\nVerification Code: ${code}\n\nThis code will expire in 2 hours. If you did not request this email, please ignore it.\n\nBest regards,\nThe TrackIt Team`,
                },
                Html: {
                    Data: `<html>
                        <body>
                            <p>Hello,</p>
                            <p>Thank you for signing up for <strong>TrackIt</strong>! To complete your account verification, please use the following code:</p>
                            <h2 style="color: #2e6c80;">${code}</h2>
                            <p>This code will expire in <strong>2 hours</strong>. If you did not request this email, please ignore it.</p>
                            <p>Best regards,<br>The TrackIt Team</p>
                        </body>
                    </html>`,
                },
            },
        },
    };

    try {
        const command = new SendEmailCommand(params);
        await sesClient.send(command);
        return new Response(JSON.stringify({ 
            message: 'Email sent successfully',
            hashedCode: hashedCode
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ 
            message: 'Failed to send email', 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}