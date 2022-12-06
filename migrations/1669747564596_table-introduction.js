/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
            CREATE TYPE user_type AS ENUM (
                'ADMIN',
                'ENGINEER',
                'AMC',
                'USER'
            );
            END IF;
        END
        $$;

        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'device_type') THEN
            CREATE TYPE device_type AS ENUM (
                'Laptop',
                'Computer'
            );
            END IF;
        END
        $$;
        
        CREATE TABLE IF NOT EXISTS user_role (
            id SERIAL PRIMARY KEY,
            role_type VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS user_profile (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            middle_name VARCHAR(255) DEFAULT NULL,
            last_name VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) NOT NULL,
            mobile VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            date_of_birth VARCHAR(255) DEFAULT NULL,
            gender VARCHAR(20) DEFAULT NULL,
            img_url VARCHAR(255) DEFAULT NULL,
            role user_type NOT NULL,
            current_address VARCHAR(255) DEFAULT NULL,
            permanent_address VARCHAR(255) DEFAULT NULL,
            current_state VARCHAR(20) DEFAULT NULL,
            current_city VARCHAR(20) DEFAULT NULL,
            current_pincode VARCHAR(20) DEFAULT NULL,
            permanent_state VARCHAR(20) DEFAULT NULL,
            permanent_city VARCHAR(20) DEFAULT NULL,
            permanent_pincode VARCHAR(20) DEFAULT NULL,
            aadhaar_number VARCHAR(20) DEFAULT NULL,
            isDeleted BOOLEAN DEFAULT FALSE,
            isActive BOOLEAN DEFAULT TRUE,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );


        CREATE TABLE IF NOT EXISTS device (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            description VARCHAR(255),
            type device_type,
            isDeleted BOOLEAN DEFAULT FALSE,
            isActive BOOLEAN DEFAULT TRUE,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
         DROP TYPE user_type;
         DROP TYPE device_type;
         DROP TABLE user_profile;
         DROP TABLE user_role;
         DROP TABLE device;
    `);
};

