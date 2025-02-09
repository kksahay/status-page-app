CREATE TYPE public.user_role AS ENUM
    ('admin', 'user');

CREATE SEQUENCE IF NOT EXISTS public.tblmaintenance_maintenance_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.tblservice_service_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.tblservicereport_status_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.tbluser_user_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;


CREATE TABLE IF NOT EXISTS public.tbluser
(
    user_id integer NOT NULL DEFAULT nextval('tbluser_user_id_seq'::regclass),
    role user_role NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    hashed_pwd text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tbluser_pkey PRIMARY KEY (user_id),
    CONSTRAINT tbluser_email_key UNIQUE (email)
);

INSERT INTO public.tblUser(role, email, hashed_pwd, name) VALUES ('admin', 'admin@status-app.com', '$2b$05$xUK1HzDiCguIDgdZpnVfV.vMb4Yu6aO5ebTIzmyzrN3o7QgZHrFO6', 'Admin');

CREATE TABLE IF NOT EXISTS public.tblservice
(
    service_id integer NOT NULL DEFAULT nextval('tblservice_service_id_seq'::regclass),
    created_by integer,
    status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    endpoint text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tblservice_pkey PRIMARY KEY (service_id),
    CONSTRAINT tblservice_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.tbluser (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.tblservicereport
(
    status_id integer NOT NULL DEFAULT nextval('tblservicereport_status_id_seq'::regclass),
    service_id integer,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    change_status character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tblservicereport_pkey PRIMARY KEY (status_id),
    CONSTRAINT tblservicereport_service_id_fkey FOREIGN KEY (service_id)
        REFERENCES public.tblservice (service_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.tblmaintenance
(
    maintenance_id integer NOT NULL DEFAULT nextval('tblmaintenance_maintenance_id_seq'::regclass),
    service_id integer,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) COLLATE pg_catalog."default",
    created_by integer,
    CONSTRAINT tblmaintenance_pkey PRIMARY KEY (maintenance_id),
    CONSTRAINT tblmaintenance_service_id_fkey FOREIGN KEY (service_id)
        REFERENCES public.tblservice (service_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);