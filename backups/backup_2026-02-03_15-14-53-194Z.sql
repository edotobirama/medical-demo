--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'WIN1252';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
);


ALTER TYPE public."AppointmentStatus" OWNER TO postgres;

--
-- Name: AppointmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentType" AS ENUM (
    'ONLINE',
    'OFFLINE'
);


ALTER TYPE public."AppointmentType" OWNER TO postgres;

--
-- Name: SlotStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SlotStatus" AS ENUM (
    'AVAILABLE',
    'LOCKED',
    'BOOKED'
);


ALTER TYPE public."SlotStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'PATIENT',
    'DOCTOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    resource text NOT NULL,
    details jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: DoctorProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DoctorProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    specialization text NOT NULL,
    "licenseNumber" text,
    bio text,
    department text,
    "consultationFee" numeric(65,30) DEFAULT 0 NOT NULL,
    achievements text,
    rating double precision DEFAULT 5.0 NOT NULL,
    reviews integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."DoctorProfile" OWNER TO postgres;

--
-- Name: MedicalReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MedicalReport" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "aiSummary" text,
    "aiFlags" jsonb,
    "aiPatientNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MedicalReport" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "chatRoomId" text
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: PatientProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PatientProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "dateOfBirth" timestamp(3) without time zone,
    gender text,
    "bloodGroup" text,
    address text
);


ALTER TABLE public."PatientProfile" OWNER TO postgres;

--
-- Name: Program; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Program" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    image text,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Program" OWNER TO postgres;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    price numeric(65,30) DEFAULT 0 NOT NULL,
    duration integer NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    password text,
    role public."UserRole" DEFAULT 'PATIENT'::public."UserRole" NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", action, resource, details, "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: DoctorProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DoctorProfile" (id, "userId", specialization, "licenseNumber", bio, department, "consultationFee", achievements, rating, reviews) FROM stdin;
cml6kgbkc0003u94gjx2uo5mj	cml6kgbka0002u94gqpl8disj	Cardiology	CARD-12345	\N	\N	500.000000000000000000000000000000	\N	5	0
\.


--
-- Data for Name: MedicalReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MedicalReport" (id, "patientId", "uploadedById", title, "fileUrl", "fileType", "aiSummary", "aiFlags", "aiPatientNotes", "createdAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "senderId", content, "createdAt", "chatRoomId") FROM stdin;
\.


--
-- Data for Name: PatientProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PatientProfile" (id, "userId", "dateOfBirth", gender, "bloodGroup", address) FROM stdin;
cml6kgbj90001u94gw1agnpss	cml6kgbj90000u94gx3k3wy02	1990-01-01 00:00:00	Male	\N	123 Main St
\.


--
-- Data for Name: Program; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Program" (id, title, description, date, image, location, "createdAt") FROM stdin;
cml6q3s5i000bu9ykm8hh4nzd	Community Wellness Day	Free yoga, meditation, and health checkups in our hospital garden.	2026-02-10 14:58:02.691	/images/services/event_wellness.png	Hospital Garden	2026-02-03 14:58:02.694
cml6q3s5i000cu9ykdk7909oh	Blood Donation Camp	Join us in saving lives. Every drop counts.	2026-02-17 14:58:02.692	/images/services/treatment_surgery.png	Main Hall	2026-02-03 14:58:02.694
cml6q3s5i000du9yk8ftuexqa	Child Nutrition Workshop	Expert advice for parents on healthy eating habits for kids.	2026-02-24 14:58:02.692	/images/services/event_wellness.png	Conference Room B	2026-02-03 14:58:02.694
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, description, category, price, duration, image, "createdAt", "updatedAt") FROM stdin;
cml6q3s540000u9ykrgcuba7m	General Consultation	Basic health checkup and consultation with a general physician.	CONSULTATION	50.000000000000000000000000000000	30	/images/doctor-sarah.jpg	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550001u9yk98dtz4jk	Full Body Checkup	Comprehensive health screening including blood tests, ECG, and vitals.	CHECKUP	150.000000000000000000000000000000	60	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550002u9ykqmtzqw4n	MRI Scan	High-resolution magnetic resonance imaging for detailed body analysis.	SCAN	300.000000000000000000000000000000	45	/images/services/infrastructure_mri.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550003u9ykgomvt43g	Cardiology Screening	Specialized heart health assessment including Echo and TMT.	CHECKUP	200.000000000000000000000000000000	45	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550004u9ykvd1ye42d	Blood Test (CBC)	Complete blood count analysis.	LAB	20.000000000000000000000000000000	10	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550005u9yklcnvt62s	Dental Cleaning	Professional teeth cleaning and scaling.	TREATMENT	80.000000000000000000000000000000	45	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550006u9ykp5czxznj	X-Ray (Chest)	Digital X-Ray imaging for chest and lungs.	SCAN	60.000000000000000000000000000000	15	/images/services/infrastructure_mri.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550007u9ykxzu3a8cb	Root Canal Treatment	Endodontic therapy for infected tooth pulp.	TREATMENT	350.000000000000000000000000000000	90	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550008u9yk1vle0uw8	Physical Therapy Session	Rehabilitation session with a certified physiotherapist.	TREATMENT	75.000000000000000000000000000000	60	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s550009u9yknev4wais	Advanced Operation Theater	State of the art sterile surgery rooms equipped for complex procedures.	INFRASTRUCTURE	0.000000000000000000000000000000	0	/images/services/treatment_surgery.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
cml6q3s55000au9ykso9m5xy7	Dialysis Center	24/7 Dialysis support with comfortable seating and monitoring.	INFRASTRUCTURE	100.000000000000000000000000000000	240	/images/services/infrastructure_mri.png	2026-02-03 14:58:02.678	2026-02-03 14:58:02.678
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, image, "createdAt", "updatedAt") FROM stdin;
cml6kgbj90000u94gx3k3wy02	John Doe	patient@hospital.com	$2b$10$bIV5xvxoh8y4ZOuh/ztJRuaKaa8IrmjBLKBAi5Ubo5KMpKP5sl82.	PATIENT	\N	2026-02-03 12:19:49.986	2026-02-03 12:19:49.986
cml6kgbka0002u94gqpl8disj	Dr. Sarah Smith	doctor@hospital.com	$2b$10$bIV5xvxoh8y4ZOuh/ztJRuaKaa8IrmjBLKBAi5Ubo5KMpKP5sl82.	DOCTOR	\N	2026-02-03 12:19:50.026	2026-02-03 12:19:50.026
cml6kgbkr0004u94gj299ubn8	Admin User	admin@hospital.com	$2b$10$bIV5xvxoh8y4ZOuh/ztJRuaKaa8IrmjBLKBAi5Ubo5KMpKP5sl82.	ADMIN	\N	2026-02-03 12:19:50.043	2026-02-03 12:19:50.043
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b6855e89-8d99-49e4-8ecd-791e08245b39	4dca6f4e30a5c9c650d44eceae41cb5e4c3f332e58ad9697f33f945fe5ecc4dc	2026-02-03 17:45:52.879505+05:30	20260203121552_init	\N	\N	2026-02-03 17:45:52.761203+05:30	1
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: DoctorProfile DoctorProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorProfile"
    ADD CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY (id);


--
-- Name: MedicalReport MedicalReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalReport"
    ADD CONSTRAINT "MedicalReport_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: PatientProfile PatientProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatientProfile"
    ADD CONSTRAINT "PatientProfile_pkey" PRIMARY KEY (id);


--
-- Name: Program Program_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Program"
    ADD CONSTRAINT "Program_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: DoctorProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON public."DoctorProfile" USING btree ("userId");


--
-- Name: PatientProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PatientProfile_userId_key" ON public."PatientProfile" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DoctorProfile DoctorProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoctorProfile"
    ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MedicalReport MedicalReport_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalReport"
    ADD CONSTRAINT "MedicalReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."PatientProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MedicalReport MedicalReport_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalReport"
    ADD CONSTRAINT "MedicalReport_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PatientProfile PatientProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatientProfile"
    ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

