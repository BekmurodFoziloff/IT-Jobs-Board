import nodemailer, { Transporter } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export class EmailService {
  private readonly transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      })
    );
  }

  public async emailConfirmation(
    email: string,
    emailConfirmationToken: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL as string,
      to: email,
      subject: 'Activate your account at IT Jobs',
      html: `
            <h3>Dear ${firstName} ${lastName}!</h3>
            
            <p>To complete your registration at the IT Jobs, please follow this link:</p>
            
            <p>${process.env.BASE_URL}/activate/${emailConfirmationToken}</p>
            
            <p>This link will expire after 5 days.</p>
            
            <h3>Best regards,</h3>
            <h3>IT Jobs</h3>
        `
    });
  }

  public async resetPassword(
    email: string,
    resetPasswordConfirmToken: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL as string,
      to: email,
      subject: 'Reset your account password at IT Jobs',
      html: `
              <h3>Dear ${firstName} ${lastName}!</h3>
              
              <p>To reset your password at the IT Jobs, please follow this link:</p>
              
              <p>${process.env.BASE_URL}/reset-password/${resetPasswordConfirmToken}</p>
              
              <p>This link will expire after 5 hours.</p>
              
              <h3>Best regards,</h3>
              <h3>IT Jobs</h3>
          `
    });
  }
}
