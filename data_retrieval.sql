-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.2.2
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2024-12-29 14:32:48.141067
-- -------------------------------------------------------------

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Sequences
CREATE SEQUENCE IF NOT EXISTS akun_pegawai_id_seq;

-- Table Definition
CREATE TABLE "public"."akun_pegawai" (
    "id" int4 NOT NULL DEFAULT nextval('akun_pegawai_id_seq'::regclass),
    "name" varchar NOT NULL,
    "nik" varchar NOT NULL,
    "born_date" varchar NOT NULL,
    "phone_number" varchar NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar NOT NULL,
    "department" varchar
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Sequences
CREATE SEQUENCE IF NOT EXISTS create_file_id_seq;

-- Table Definition
CREATE TABLE "public"."create_file" (
    "id" int4 NOT NULL DEFAULT nextval('create_file_id_seq'::regclass),
    "nama_file" varchar NOT NULL,
    "creator" varchar NOT NULL,
    "creation_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."akun_pegawai" ("id","name","nik","born_date","phone_number","password","role","department") VALUES 
(3,'test pegawai','1122334455','12 August 1987','000000000','mypassword123','pegawai','WORKER'),
(2,'Pegawai Satu','9876543210','12 August 1987','081298765432','securepassword','pegawai','WORKER'),
(1,'Admin Utama 23','1234567890','12 August 1987','081234567890','password123','admin','MANAGER');

INSERT INTO "public"."create_file" ("id","nama_file","creator","creation_date") VALUES (27,'file 2','Admin Utama 23','2024-12-29 12:03:23.628928');

