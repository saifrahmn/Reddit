import {MikroORM, RequiredEntityData} from "@mikro-orm/core";
import { __prod__ } from "./entities/constant";
import { Post } from "./entities/Post";

const main = async () =>{
    const orm= await MikroORM.init({
        entities: [Post],
        dbName: 'reddit',
        type: 'postgresql',
        debug: !__prod__,
    });

    orm.em.create(Post, {title: 'my first post'}as RequiredEntityData<Post>);
}

console.log("Hello World");