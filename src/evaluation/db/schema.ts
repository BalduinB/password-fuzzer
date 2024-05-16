import { relations } from "drizzle-orm";
import { index, mysqlTable, serial, varchar, int, boolean } from "drizzle-orm/mysql-core";

export const analysedData = mysqlTable(
    "analysed_data",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 256 }).notNull(),
        pw: varchar("pw", { length: 256 }).notNull(),
        pwType: varchar("pw_type", { length: 256 }).notNull(),
        hit: boolean("hit").notNull(),
        originalVersionId: int("original_version_id"),
        version: varchar("version", { length: 256 }).notNull(),
    },
    (table) => ({
        emailIdx: index("email_idx").on(table.email),
        hitIdx: index("hit_idx").on(table.hit),
        pwTypeIdx: index("pw_type_idx").on(table.pwType),
        versionIdx: index("version_idx").on(table.version),
    }),
);
export const analysedDataTest = mysqlTable(
    "analysed_data_test",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 256 }).notNull(),
        pw: varchar("pw", { length: 256 }).notNull(),
        pwType: varchar("pw_type", { length: 256 }).notNull(),
        hit: boolean("hit").notNull(),
        originalVersionId: int("original_version_id"),
        version: varchar("version", { length: 256 }).notNull(),
    },
    (table) => ({
        emailIdx: index("email_idx").on(table.email),
        hitIdx: index("hit_idx").on(table.hit),
        pwTypeIdx: index("pw_type_idx").on(table.pwType),
        versionIdx: index("version_idx").on(table.version),
    }),
);

export const analysedDataRelations = relations(analysedData, ({ many, one }) => ({
    fuzzedPasswords: many(analysedData, { relationName: "originalVersion" }),
    originalVersion: one(analysedData, {
        fields: [analysedData.originalVersionId],
        references: [analysedData.id],
        relationName: "originalVersion",
    }),
}));
