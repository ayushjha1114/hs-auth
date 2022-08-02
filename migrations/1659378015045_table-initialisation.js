/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
            CREATE TYPE user_type AS ENUM (
                'ENGINEER',
                'USER'
            );
            END IF;
        END
        $$;
        
        CREATE TABLE IF NOT EXISTS  user_profile  (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            mobile VARCHAR(20),
            password VARCHAR(255),
            type user_type,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
         DROP TYPE user_type;
         DROP TABLE user_profile;
    `);
};
