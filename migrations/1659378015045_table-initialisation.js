/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
            CREATE TYPE user_type AS ENUM (
                'INDIVIDUAL',
                'COMPANY'
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

        CREATE TABLE IF NOT EXISTS user_profile (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            mobile VARCHAR(20),
            password VARCHAR(255),
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS features (
            id SERIAL PRIMARY KEY,
            label VARCHAR(100) NOT NULL,
            description VARCHAR(255),
            isDeleted BOOLEAN NOT NULL,
            isActive BOOLEAN NOT NULL,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS amc (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            company_name VARCHAR(100),
            date_of_registration timestamptz NOT NULL,
            plan_activation_date timestamptz NOT NULL,
            plan_expired_date timestamptz NOT NULL,
            user_plan INT NOT NULL,
            device jsonb,
            remaining_services INT NOT NULL,
            served_place VARCHAR(20),
            address VARCHAR(255),
            state VARCHAR(20),
            city VARCHAR(20),
            pincode VARCHAR(20),
            gst_number VARCHAR(20),
            pan_number VARCHAR(20),
            adhaar_number VARCHAR(20),--
            type user_type,
            description VARCHAR(255),
            isDeleted BOOLEAN NOT NULL,
            isActive BOOLEAN NOT NULL,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS amc_plan_type (
            id SERIAL PRIMARY KEY,
            label VARCHAR(100) NOT NULL,
            description VARCHAR(255),
            text VARCHAR(255),
            quantity INT NOT NULL,
            total_service_provided INT NOT NULL,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS amc_feature_detail (
            id SERIAL PRIMARY KEY,
            feature_id INT NOT NULL,
            amc_plan_id INT NOT NULL,
            details TEXT[],
            priority INT NOT NULL,
            isDeleted BOOLEAN NOT NULL,
            isActive BOOLEAN NOT NULL,
            created_on timestamptz NOT NULL DEFAULT NOW(),
            updated_on timestamptz NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS device (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            description VARCHAR(255),
            type device_type,
            isDeleted BOOLEAN NOT NULL,
            isActive BOOLEAN NOT NULL,
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
         DROP TABLE features;
         DROP TABLE amc;
         DROP TABLE amc_plan_type;
         DROP TABLE amc_feature_detail;
         DROP TABLE device;
    `);
};
