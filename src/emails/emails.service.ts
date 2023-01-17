import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { emailOptions } from '../interfaces/emailOptions.interface';

export const transporter = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL as string,
      pass: process.env.SMTP_PASSWORD as string
    }
  })
);

export const emailConfirm = async (
  email: string,
  emailConfirmToken: string,
  firstName: string,
  lastName: string
): Promise<emailOptions> => {
  return {
    from: process.env.SMTP_EMAIL as string,
    to: email,
    subject: 'Activate your account at IT Jobs',
    html: `
            <h3>Dear ${firstName} ${lastName}!</h3>
            
            <p>To complete your registration at the IT Jobs, please follow this link:</p>
            
            <p>${process.env.BASE_URL}/activate/${emailConfirmToken}</p>
            
            <p>This link will expire after 5 days.</p>
            
            <h3>Best regards,</h3>
            <h3>IT Jobs</h3>
        `
  };
};

export const resetPassword = async (
  email: string,
  resetPasswordConfirmToken: string,
  firstName: string,
  lastName: string
): Promise<emailOptions> => {
  return {
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
  };
};
