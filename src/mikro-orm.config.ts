import { Post } from "../entities/Post";
import { __prod__ } from "./constants";
import  { Options } from "@mikro-orm/core";
import path from "path";    
import { User } from "../entities/User";

const config: Options = {
    allowGlobalContext: true,
    migrations:{
        path: path.join(__dirname,'./migrations'),
        pathTs: undefined, 
        glob: '!(*.d).{js,ts}'
    },
        entities: [Post, User],
        dbName: 'lireddit',
        user: 'postgres',
        password: 'root',
        type: 'postgresql',
        debug: !__prod__,
    
};
export default config;
