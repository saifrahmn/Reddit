import {MikroORM} from "@mikro-orm/core";
import { __prod__ } from "./entities/constant";

const main = async () =>{
    const orm= await MikroORM.init({
        entities: [],
        dbName: 'reddit',
        type: 'postgresql',
        debug: !__prod__,
    });
}

console.log("Hello World");