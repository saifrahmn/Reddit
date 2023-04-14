import "reflect-metadata";
import { defineConfig, MikroORM, RequestContext } from "@mikro-orm/core";
import { Post } from "../entities/Post";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import { Server } from "http";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const app = express();

  // app.get("/", (req, res) => {
  //   res.send("Hello");
  // });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ PostResolver],
      validate: false,
    }),
    context: () => ({em: orm.em})
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started on localhost: 4000");
  });
  const orm = await MikroORM.init(mikroConfig);
  await RequestContext.createAsync(orm.em, async () => {
    await orm.getMigrator().up();
    
    
    // await orm.em.persistAndFlush(post); // <-- use the fork instead of global
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);
  });
};
main();
