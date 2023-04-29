import { Controller, Get, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { AuthGuard } from "./auth/auth.guard"

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService
    ) {}

    @Get('info')
    @UseGuards(AuthGuard)
    async getAllInfo(){
        return this.appService.getAllInfo()
    }
}