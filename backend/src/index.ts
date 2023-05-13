import {MikroORM, RequiredEntityData} from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () =>{
    const orm= await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();


    const emfork = orm.em.fork();
    const post= emfork.create(Post, {
        title: 'my first post'
    }as RequiredEntityData<Post>);
    await emfork.persistAndFlush(post);
}
// main();
main().catch(err =>{
    console.error(err);
});