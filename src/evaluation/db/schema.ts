import { relations } from "drizzle-orm";
import { index, mysqlTable, serial, varchar, unique, int } from "drizzle-orm/mysql-core";

export const analysedData = mysqlTable(
    "analysed_data",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 256 }).notNull(),
        pw: varchar("pw", { length: 256 }).notNull(),
        pwType: varchar("pw_type", { length: 256 }).notNull(),
        hits: int("hit").notNull(),
        originalVersionId: int("original_version_id"),
        version: varchar("version", { length: 256 }).notNull(),
    },
    (table) => ({
        emailIdx: index("email_idx").on(table.email),
        hitIdx: index("hit_idx").on(table.hits),
        pwTypeIdx: index("pw_type_idx").on(table.pwType),
        versionIdx: index("version_idx").on(table.version),
        emailPwTypeUnique: unique("email_pw_type_unique").on(table.email, table.pw, table.pwType),
    }),
);
export const analysedDataTest = mysqlTable(
    "analysed_data_test",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 256 }).notNull(),
        pw: varchar("pw", { length: 256 }).notNull(),
        pwType: varchar("pw_type", { length: 256 }).notNull(),
        hits: int("hit").notNull(),
        originalVersionId: int("original_version_id"),
        version: varchar("version", { length: 256 }).notNull(),
    },
    (table) => ({
        emailIdx: index("email_idx").on(table.email),
        hitIdx: index("hit_idx").on(table.hits),
        pwTypeIdx: index("pw_type_idx").on(table.pwType),
        versionIdx: index("version_idx").on(table.version),
        emailPwTypeUnique: unique("email_pw_type_unique").on(table.email, table.pw, table.pwType),
    }),
);

export const analysedDataRelations = relations(analysedData, ({ many, one }) => ({
    fuzzedPasswords: many(analysedData),
    originalVersion: one(analysedData, {
        fields: [analysedData.originalVersionId],
        references: [analysedData.id],
    }),
}));
