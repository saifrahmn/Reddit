import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import {Response, Request, Express} from "express";

export type MyContext={
    em:  EntityManager<IDatabaseDriver<Connection>>;
    req: Request ;
    res: Response;
}