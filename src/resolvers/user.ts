import { RequiredEntityData } from "@mikro-orm/core";
import * as argon2 from "argon2";
import {
  Arg,
  Args,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../../entities/User";
import { MyContext } from "../MyContext";

@InputType()
class UserID {
  @Field()
  user_name!: string;
  @Field()
  user_password!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}


@Resolver()
export class UserResolver {
  
  // @Query(() => User, { nullable: true })
  // me(@Ctx() { req }: MyContext) {
  //   // you are not logged in
  //   if (!req.session.userId) {
  //     return null;
  //   }

  //   return User.findOne(req.session.userId);
  // }

  
  
  
  //queries
  @Query(() => [User])
  Users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async Register(
    @Arg("options") options: UserID,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {

    const username1= options.user_name.toLowerCase();  
    if (username1.length <= 2) {
      return {
        error: [
          {
            field: "username",
            message: "invalid username",
          },
        ],
      };
    }
    if (options.user_password.length <= 3) {
      return {
        error: [
          {
            field: "password",
            message: "password too short",
          },
        ],
      };
    }
    if(await em.findOne(User, {username: username1})){
        return{
            error:[
                {
                    field:"username",
                    message: "username already exists"
                }
            ]
        }
    }
    const hashedpassword = await argon2.hash(options.user_password);
    const user = em.create(User, {
      username: username1,
      password: hashedpassword,
    } as RequiredEntityData<User>);
    await em.persistAndFlush(user);
    return {
      user,
    };
  }

  // login

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserID,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
      const username1=options.user_name.toLowerCase();
    const user = await em.findOne(User, {
      username: username1,
    });
    if (!user) {
      return {
        error: [
          {
            field: "username",
            message: "username doesn't exits",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.user_password);
    if (!valid) {
      return {
        error: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
      };
    }
    // req.session!.userId= user.id;

    //   const hashedpassword= await argon2.hash(options.user_password);
    // const user= em.create(User,{
    //     username: options.user_name,
    //     password: hashedpassword,
    // }as RequiredEntityData<User>);
    // await em.persistAndFlush(user);
    // return user;
    return {
      user,
    };
  }
}
