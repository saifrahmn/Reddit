import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { RequiredEntityData } from "@mikro-orm/core";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}
@Resolver()
export class UserResolver {
    @Query(() => [User])
    user(
        @Ctx() {em} : MyContext
    ): Promise<User[]>{
        return em.find(User,{});
    }



    @Mutation(() => [User])
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const hashedpassword = await argon2.hash(options.password);
        const user = em.create(User, { username: options.username, password: hashedpassword } as RequiredEntityData<User>);
        await em.persistAndFlush(user);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg("_id") _id: number,
        @Ctx() { em }: MyContext
    ) :Promise<Boolean>{
        em.nativeDelete(User, {_id})
        return true;
    }
}
