import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';



/** 슬랙 알림메세지 적용해볼 포인트
 * <등록 알림> 예시: ' ${card의 title}에 새로운 댓글이 달렸습니다. 링크 확인 ${~/cards/:cardId}
 * - 포인트 1. 새로운 댓글 등록시 
 * 
 * <업데이트 알림> 예시: ${card의 title}의 작업자가 ${이전 작업자 name}에서 ${변경된 작업자 name}으로 변경되었습니다. 링크 확인 ${~/cards/:cardId}
 * - 특정 카드의 컬럼 이동시 ( 상태 변경 : BackLog -> In Progress 또는 In Progress -> Done) 
 * - 특정 카드의 작업자 변경시
 * - 특정 카드의 마감일 변경시
 */


@Injectable()
export class SlackService {

    constructor(
        private readonly configService: ConfigService,
    ){}

  async sendSlackMessage(message: string) {

    const data = {
        channel: this.configService.get<string>('SLACK_CHANNEL_ID'),
        attachments: [
            {
              title: `창매이햄 ChatBot Message😈 :`,
              text: message,
            },
          ],
    }

    const config = {
        method: "post",
        url: "https://slack.com/api/chat.postMessage",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.configService.get<string>('SLACK_TOKEN')}`, 
        },
        data,
      };
      const result = await axios(config)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
        console.error('Slack 메시지 전송 중 오류:', error);
        throw new InternalServerErrorException('Slack 메시지 전송 중 오류가 발생했습니다.');
        });
      return result;
    }
}