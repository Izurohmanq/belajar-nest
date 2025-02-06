import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Address, Contact, User } from "@prisma/client";

@Injectable()
export class TestService {
    constructor (private prismaService: PrismaService){
        
    }

    async deleteAll() {
        await this.deleteAddress()
        await this.deleteContact()
        await this.deleteUser()
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test',
            }
        })
    }

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test',
            }
        })
    }

    async deleteAddress() {
        await this.prismaService.address.deleteMany({
            where: {
                contact:{
                    username: 'test'
                }
            }
        })
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        })
    }

    async getContact(): Promise<Contact> {
        return this.prismaService.contact.findFirst({
            where: {
                username: 'test'
            }
        })
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '089622209830',
                username: 'test',
            }
        })
    }
    
    async createAddress() {
        const contact = await this.getContact()
        await this.prismaService.address.create({
            data: {
                contact_id: contact.id,
                street: "street test",
                city: "city test",
                province: "province test",
                country: "country test",
                postal_code: "1234",
            }
        })
    }

    async getAddress(): Promise<Address> {
        return this.prismaService.address.findFirst({
            where: {
                contact: {
                    username: 'test'
                }
            }
        })
    }

    async getUser(): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                username: 'test',
            }
        })
    }


}