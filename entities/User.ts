import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'data';

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({type: "text", unique: true})
  username!: string;

  @Property({type: "text"})
  password!: string;
};