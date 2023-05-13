import { Options } from "@mikro-orm/postgresql";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import path from "path";

const config: Options = {
    migrations: {
        path: path.join(__dirname,'./migrations'), 
        glob: '!(*.d).{js,ts}', 
    },
    entities: [Post],
    dbName: "lireddit",
    user: "postgres",
    password: "root",
    type: "postgresql",
    debug : !__prod__,
};
export default config;