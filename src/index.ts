import "reflect-metadata";
import { defineConfig, MikroORM, RequestContext } from "@mikro-orm/core";
import { Post } from "../entities/Post";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer, Config, ExpressContext } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";

import redis from 'redis';
const session = require('express-session')
import connectRedis from 'connect-redis';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  //express app
  const app = express();
  // app.get("/", (req, res) => {
  //   res.send("Hello");
  // });
  // const RedisStore = connectRedis(session);
  // const redisClient = redis.createClient();
  // Initialize store.
  const RedisStore =  connectRedis(session);
  const redisClient = redis.createClient();
  // Initialize sesssion storage.
  app.use(
    session({
      name: "COOKIE_NAME",
      store:  new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "session_SECRET",
      resave: false,
    })
  );
  // Initialize store.

  // Initialize sesssion storage.
  // app.use(
  //   session({
  //     name: "qid",
  //     store: new RedisStore({
  //       client: redisClient,
  //       disableTouch: true,
  //     }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 365, //10 years
  //       httpOnly: true,
  //       sameSite: "lax",
  //       secure: __prod__,
  //     },
  //     resave: false, // required: force lightweight session keep alive (touch)
  //     saveUninitialized: false, // recommended: only save session when data exists
  //     secret: "something",
  //   })
  // );

  //decalring apolloserver
  const apolloServer = new ApolloServer({
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),

    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
  });

  app.listen(4000, () => {
    console.log("server started on localhost: 4000");
  });

  // await RequestContext.createAsync(orm.em, async () => {

  //   // await orm.em.persistAndFlush(post); // <-- use the fork instead of global
  //   // const posts = await orm.em.find(Post, {});
  //   // console.log(posts);
  // });
};
main();
