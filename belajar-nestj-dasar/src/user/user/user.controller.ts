import { Controller, Get, Header, HttpCode, HttpRedirectResponse, Inject, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';

@Controller('/api/users')
export class UserController {

    // rekomendasi dependency injection tetap menggunakan constructor
    constructor(
        private service: UserService,
        private connection: Connection,
        private mailService: MailService, // sama aja
        @Inject('EmailService') private emailService: MailService, // ini ceritanya menggunakan alias, sama aja
        private userRepository: UserRepository,
        private memberService: MemberService
    ) {}

    @Get('/connection')
    async getConnection():Promise<string>{
        this.mailService.send();
        this.userRepository.save();
        this.emailService.send();
        console.info(this.memberService.getConnectionName())
        this.memberService.sendEmail();
        return this.connection.getName();
    }

    // jangan pake express request lagi
    // tapi pake decorator yang sudah disediakan
    // kalau async, return type datanya tambahkan Promise
    @Get('/hello')
    async sayHello(@Query("name") name: string):Promise<string>{
        return this.service.sayHello(name);
    }

    @Get('/set-cookie')
    setCookie(@Query('name') name: string, @Res() response: Response){
        response.cookie('name', name);
        response.status(200).send('Success Set Cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request): string{
        return request.cookies['name'];
    }

    @Get('sample-response')
    @Header("Content-type", "application/json")
    @HttpCode(200)
    sampleResponse() : Record<string, string>{
        return{
            "data" : "Hello JSON"
        }
    }
    // gak usah dibuat seperti di bawah, buat seperti di atasnya
    // sampleResponse(@Res() response: Response){
    //     response.status(200).json({
    //         data : 'hello asw'
    //     });
    // }

    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse {
        return {
            url:"/api/users/sample-response",
            statusCode:301
        }
    }

    @Get('/:id')
    getById(@Param("id") id:string):string {
        return `GET ${id}`;
    }

    @Post()
    post():string{
        return 'POST';
    }

    @Get('/sample')
    get():string {
        return 'GET';
    }
}
