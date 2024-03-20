import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer"
import { ENV_EMAIL_ID_USER, ENV_EMAIL_USER_PASS } from 'src/common/const/env-keys.const';

interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string
}

@Injectable()
export class MailService {
    private transporter;
    private readonly configService: ConfigService

    constructor(configService: ConfigService){
        this.configService = configService
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>(ENV_EMAIL_ID_USER),
                pass: this.configService.get<string>(ENV_EMAIL_USER_PASS)
            },
        });
    }
    async sendauthenticateEmailCodeToEmail(email: string, code: number) {
        const emailOptions: EmailOptions = {
            from: this.configService.get<string>(ENV_EMAIL_ID_USER),
            to: email,
            subject: '당신을 보드에 초대합니다.',
            html: `<h1>인증 코드를 입력해야 보드에 참여할 수 있습니다.</h1><br/>${code}`
        };

        return await this.transporter.sendEmail(emailOptions)
    }
}
