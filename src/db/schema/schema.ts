import {
  mysqlTable,
  int,
  mysqlEnum,
  timestamp,
  index,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const messageTable = mysqlTable(
  "message_table",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", ["result", "error"]).notNull(),
    role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
    content: text("content").notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_id").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("user_id_idx").on(table.userId)],
);

export const usageTable = mysqlTable("usage", {
  key: varchar("key", { length: 255 }).primaryKey(),
  points: int("points").notNull(),
  expire: timestamp("expire"),
});
