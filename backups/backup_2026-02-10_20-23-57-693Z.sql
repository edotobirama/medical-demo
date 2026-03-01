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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


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
-- Name: Appointment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointment" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "doctorId" text NOT NULL,
    "slotId" text NOT NULL,
    status public."AppointmentStatus" DEFAULT 'PENDING'::public."AppointmentStatus" NOT NULL,
    type public."AppointmentType" NOT NULL,
    "meetingLink" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Appointment" OWNER TO postgres;

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
-- Name: Slot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Slot" (
    id text NOT NULL,
    "doctorId" text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    status public."SlotStatus" DEFAULT 'AVAILABLE'::public."SlotStatus" NOT NULL,
    type public."AppointmentType" DEFAULT 'OFFLINE'::public."AppointmentType" NOT NULL,
    "lockedAt" timestamp(3) without time zone,
    "lockedBy" text
);


ALTER TABLE public."Slot" OWNER TO postgres;

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
-- Name: WaitlistEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WaitlistEntry" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "doctorId" text NOT NULL,
    status text DEFAULT 'WAITING'::text NOT NULL,
    "position" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WaitlistEntry" OWNER TO postgres;

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
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointment" (id, "patientId", "doctorId", "slotId", status, type, "meetingLink", notes, "createdAt", "updatedAt") FROM stdin;
cmlgvs6710018u9ikc90qltb3	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgvs65v000eu9iksrqwl308	CONFIRMED	OFFLINE	\N	\N	2026-02-10 17:34:40.478	2026-02-10 17:34:40.478
cmlgwcn360001u9msw616a562	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgvs65z000gu9ikqwmlu2qs	CONFIRMED	OFFLINE	\N	\N	2026-02-10 17:50:35.49	2026-02-10 17:50:35.49
cmlgwdum00001u9d0cpruq7l1	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgvs662000iu9ikbepwqfcd	CONFIRMED	ONLINE	\N	\N	2026-02-10 17:51:31.896	2026-02-10 17:51:31.896
cmlgwyfq10003u9d0ivg3p60b	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgwkup3000bu9vcaulrb9w7	CONFIRMED	OFFLINE	\N	\N	2026-02-10 18:07:32.377	2026-02-10 18:07:32.377
cmlgwyunt0005u9d0m9wt9og7	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgwkup00007u9vcygb664zb	CONFIRMED	OFFLINE	\N	\N	2026-02-10 18:07:51.737	2026-02-10 18:07:51.737
cmlgzqncx0001u9dsba2qo08q	cmlgvs65l000cu9ikskaslw5b	cmlgvs64z0006u9ikxebr4xww	cmlgwkuou0001u9vcdw09220j	CONFIRMED	OFFLINE	\N	\N	2026-02-10 19:25:27.873	2026-02-10 19:25:27.873
cmlh0dqr80003u9ds5meybaof	cmlgxs4ol0008u9d0gz2a1yl5	cmlgvs64z0006u9ikxebr4xww	cmlgwkuoy0003u9vclks906eg	CONFIRMED	OFFLINE	\N	\N	2026-02-10 19:43:25.364	2026-02-10 19:43:25.364
cmlh0tjxz0005u9dsu4cbwip0	cmlgxs4ol0008u9d0gz2a1yl5	cmlgvs64z0006u9ikxebr4xww	cmlgwkup10009u9vc1koo3d2s	CONFIRMED	OFFLINE	\N	\N	2026-02-10 19:55:43.032	2026-02-10 19:55:43.032
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", action, resource, details, "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: DoctorProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DoctorProfile" (id, "userId", specialization, "licenseNumber", bio, department, "consultationFee", achievements, rating, reviews) FROM stdin;
cmlgvs64z0006u9ikxebr4xww	cmlgvs64z0005u9ik678d98s1	Cardiologist	\N	Dr. Sarah Wilson is a leading cardiologist with over 15 years of experience...	Cardiology	150.000000000000000000000000000000	["Top Cardiologist 2025","Published 50+ Papers"]	4.9	124
cmlgvs65b0008u9ikok0k2naj	cmlgvs65b0007u9ik7opeb9ay	Neurologist	\N	Specializing in complex neurosurgery and cognitive treatment...	Neurology	200.000000000000000000000000000000	["Best Surgeon Award","Chief of Neurology"]	4.8	89
cmlgvs65g000au9iks0tc3bgs	cmlgvs65g0009u9ikyduhvsq4	Pediatrician	\N	Dr. Carter creates a friendly, safe environment for children...	Pediatrics	120.000000000000000000000000000000	["Child Advocacy Award","Best Pediatrician 2024"]	4.9	215
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
cmlgvs65l000cu9ikskaslw5b	cmlgvs65l000bu9ikfxcd2c17	1990-01-01 00:00:00	Male	O+	123 Main St, Metro City
cmlgxs4ol0008u9d0gz2a1yl5	cmlgxfijb0006u9d0nnqn6l7z	\N	\N	\N	\N
cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0005u9ik678d98s1	\N	\N	\N	\N
\.


--
-- Data for Name: Program; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Program" (id, title, description, date, image, location, "createdAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, description, category, price, duration, image, "createdAt", "updatedAt") FROM stdin;
cmlgvs64i0000u9ikf1660io3	Cardiology Consultation	Expert heart health assessment.	CONSULTATION	150.000000000000000000000000000000	30	\N	2026-02-10 17:34:40.387	2026-02-10 17:34:40.387
cmlgvs64p0001u9ikso6ft12e	Neurology Consultation	Brain and nervous system checkup.	CONSULTATION	200.000000000000000000000000000000	45	\N	2026-02-10 17:34:40.393	2026-02-10 17:34:40.393
cmlgvs64r0002u9ik1ytov0kt	Pediatric Checkup	Comprehensive health check for children.	CHECKUP	120.000000000000000000000000000000	30	\N	2026-02-10 17:34:40.396	2026-02-10 17:34:40.396
cmlgvs64u0003u9ikaai578m1	MRI Scan	High-resolution magnetic resonance imaging.	SCAN	500.000000000000000000000000000000	60	\N	2026-02-10 17:34:40.398	2026-02-10 17:34:40.398
cmlgvs64x0004u9ikpv6icjvq	Blood Test Panel	Complete blood count and metabolic panel.	LAB	80.000000000000000000000000000000	15	\N	2026-02-10 17:34:40.401	2026-02-10 17:34:40.401
\.


--
-- Data for Name: Slot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Slot" (id, "doctorId", "startTime", "endTime", status, type, "lockedAt", "lockedBy") FROM stdin;
cmlgvs664000ku9ik0r4ake5q	cmlgvs64z0006u9ikxebr4xww	2026-02-10 06:30:00	2026-02-10 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs666000mu9ik8cxf3md9	cmlgvs64z0006u9ikxebr4xww	2026-02-10 07:30:00	2026-02-10 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs669000ou9ik008i9h76	cmlgvs65b0008u9ikok0k2naj	2026-02-10 03:30:00	2026-02-10 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66c000qu9ik544oy64k	cmlgvs65b0008u9ikok0k2naj	2026-02-10 04:30:00	2026-02-10 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66e000su9ikynzvowa4	cmlgvs65b0008u9ikok0k2naj	2026-02-10 05:30:00	2026-02-10 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66h000uu9ikdends7d2	cmlgvs65b0008u9ikok0k2naj	2026-02-10 06:30:00	2026-02-10 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66j000wu9ikqr7ua7j1	cmlgvs65b0008u9ikok0k2naj	2026-02-10 07:30:00	2026-02-10 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66l000yu9ikof6y3xnx	cmlgvs65g000au9iks0tc3bgs	2026-02-10 03:30:00	2026-02-10 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66n0010u9ikmund2dcr	cmlgvs65g000au9iks0tc3bgs	2026-02-10 04:30:00	2026-02-10 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66r0012u9ikhtbghxr4	cmlgvs65g000au9iks0tc3bgs	2026-02-10 05:30:00	2026-02-10 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66u0014u9ikgtshs1k3	cmlgvs65g000au9iks0tc3bgs	2026-02-10 06:30:00	2026-02-10 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs66w0016u9ik7jcaxa5j	cmlgvs65g000au9iks0tc3bgs	2026-02-10 07:30:00	2026-02-10 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgvs65v000eu9iksrqwl308	cmlgvs64z0006u9ikxebr4xww	2026-02-10 03:30:00	2026-02-10 04:00:00	BOOKED	OFFLINE	\N	\N
cmlgvs65z000gu9ikqwmlu2qs	cmlgvs64z0006u9ikxebr4xww	2026-02-10 04:30:00	2026-02-10 05:00:00	BOOKED	OFFLINE	\N	\N
cmlgvs662000iu9ikbepwqfcd	cmlgvs64z0006u9ikxebr4xww	2026-02-10 05:30:00	2026-02-10 06:00:00	BOOKED	OFFLINE	\N	\N
cmlgwkuoz0005u9vcko8y7pow	cmlgvs64z0006u9ikxebr4xww	2026-02-11 05:30:00	2026-02-11 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkup6000du9vci6g2mdvz	cmlgvs64z0006u9ikxebr4xww	2026-02-11 09:30:00	2026-02-11 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkup8000fu9vccmn6mzxx	cmlgvs64z0006u9ikxebr4xww	2026-02-11 10:30:00	2026-02-11 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupa000hu9vcfkg2sthl	cmlgvs64z0006u9ikxebr4xww	2026-02-12 03:30:00	2026-02-12 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupb000ju9vc3r4t8eno	cmlgvs64z0006u9ikxebr4xww	2026-02-12 04:30:00	2026-02-12 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupd000lu9vcch92apo1	cmlgvs64z0006u9ikxebr4xww	2026-02-12 05:30:00	2026-02-12 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupe000nu9vcb8fn4qic	cmlgvs64z0006u9ikxebr4xww	2026-02-12 06:30:00	2026-02-12 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupf000pu9vc7am74wls	cmlgvs64z0006u9ikxebr4xww	2026-02-12 07:30:00	2026-02-12 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupg000ru9vchpm6cdt0	cmlgvs64z0006u9ikxebr4xww	2026-02-12 08:30:00	2026-02-12 09:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupi000tu9vc69uqwgx1	cmlgvs64z0006u9ikxebr4xww	2026-02-12 09:30:00	2026-02-12 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupj000vu9vc0pkic4ay	cmlgvs64z0006u9ikxebr4xww	2026-02-12 10:30:00	2026-02-12 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupk000xu9vcovt8zymf	cmlgvs65b0008u9ikok0k2naj	2026-02-11 03:30:00	2026-02-11 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupl000zu9vcvs66gn6g	cmlgvs65b0008u9ikok0k2naj	2026-02-11 04:30:00	2026-02-11 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupn0011u9vc48qcuuxa	cmlgvs65b0008u9ikok0k2naj	2026-02-11 05:30:00	2026-02-11 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupo0013u9vc38vjue5a	cmlgvs65b0008u9ikok0k2naj	2026-02-11 06:30:00	2026-02-11 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupp0015u9vcex1wpp7e	cmlgvs65b0008u9ikok0k2naj	2026-02-11 07:30:00	2026-02-11 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupq0017u9vcrg78gmuf	cmlgvs65b0008u9ikok0k2naj	2026-02-11 08:30:00	2026-02-11 09:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupr0019u9vcr621i2gt	cmlgvs65b0008u9ikok0k2naj	2026-02-11 09:30:00	2026-02-11 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkups001bu9vc4jsa0ooh	cmlgvs65b0008u9ikok0k2naj	2026-02-11 10:30:00	2026-02-11 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupt001du9vci0pepzqi	cmlgvs65b0008u9ikok0k2naj	2026-02-12 03:30:00	2026-02-12 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupu001fu9vc2fw5o6io	cmlgvs65b0008u9ikok0k2naj	2026-02-12 04:30:00	2026-02-12 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupv001hu9vcewnr2d0n	cmlgvs65b0008u9ikok0k2naj	2026-02-12 05:30:00	2026-02-12 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupw001ju9vckvkl5mbg	cmlgvs65b0008u9ikok0k2naj	2026-02-12 06:30:00	2026-02-12 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupx001lu9vcm659qnpx	cmlgvs65b0008u9ikok0k2naj	2026-02-12 07:30:00	2026-02-12 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupy001nu9vcpqnux919	cmlgvs65b0008u9ikok0k2naj	2026-02-12 08:30:00	2026-02-12 09:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkupz001pu9vc9bpkd3u8	cmlgvs65b0008u9ikok0k2naj	2026-02-12 09:30:00	2026-02-12 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq0001ru9vctnbr0mir	cmlgvs65b0008u9ikok0k2naj	2026-02-12 10:30:00	2026-02-12 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq0001tu9vccsjtdexm	cmlgvs65g000au9iks0tc3bgs	2026-02-11 03:30:00	2026-02-11 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq1001vu9vcihsytvbp	cmlgvs65g000au9iks0tc3bgs	2026-02-11 04:30:00	2026-02-11 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq2001xu9vclajiw2nc	cmlgvs65g000au9iks0tc3bgs	2026-02-11 05:30:00	2026-02-11 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq3001zu9vch82w4eu6	cmlgvs65g000au9iks0tc3bgs	2026-02-11 06:30:00	2026-02-11 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq40021u9vcigf5u5wv	cmlgvs65g000au9iks0tc3bgs	2026-02-11 07:30:00	2026-02-11 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq50023u9vc2f56qvyz	cmlgvs65g000au9iks0tc3bgs	2026-02-11 08:30:00	2026-02-11 09:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq60025u9vc1my6fq92	cmlgvs65g000au9iks0tc3bgs	2026-02-11 09:30:00	2026-02-11 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq70027u9vcctkej19j	cmlgvs65g000au9iks0tc3bgs	2026-02-11 10:30:00	2026-02-11 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq80029u9vcm93vny1d	cmlgvs65g000au9iks0tc3bgs	2026-02-12 03:30:00	2026-02-12 04:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq8002bu9vcx6t3j55q	cmlgvs65g000au9iks0tc3bgs	2026-02-12 04:30:00	2026-02-12 05:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuq9002du9vc4meod293	cmlgvs65g000au9iks0tc3bgs	2026-02-12 05:30:00	2026-02-12 06:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuqa002fu9vc1zxdga9e	cmlgvs65g000au9iks0tc3bgs	2026-02-12 06:30:00	2026-02-12 07:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuqb002hu9vctwkfkxbc	cmlgvs65g000au9iks0tc3bgs	2026-02-12 07:30:00	2026-02-12 08:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuqc002ju9vcivozcdf7	cmlgvs65g000au9iks0tc3bgs	2026-02-12 08:30:00	2026-02-12 09:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuqe002lu9vcbil0u0xy	cmlgvs65g000au9iks0tc3bgs	2026-02-12 09:30:00	2026-02-12 10:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkuqf002nu9vcrrax6f8i	cmlgvs65g000au9iks0tc3bgs	2026-02-12 10:30:00	2026-02-12 11:00:00	AVAILABLE	OFFLINE	\N	\N
cmlgwkup3000bu9vcaulrb9w7	cmlgvs64z0006u9ikxebr4xww	2026-02-11 08:30:00	2026-02-11 09:00:00	BOOKED	OFFLINE	\N	\N
cmlgwkup00007u9vcygb664zb	cmlgvs64z0006u9ikxebr4xww	2026-02-11 06:30:00	2026-02-11 07:00:00	BOOKED	OFFLINE	\N	\N
cmlgwkuou0001u9vcdw09220j	cmlgvs64z0006u9ikxebr4xww	2026-02-11 03:30:00	2026-02-11 04:00:00	BOOKED	OFFLINE	\N	\N
cmlgwkuoy0003u9vclks906eg	cmlgvs64z0006u9ikxebr4xww	2026-02-11 04:30:00	2026-02-11 05:00:00	BOOKED	OFFLINE	\N	\N
cmlgwkup10009u9vc1koo3d2s	cmlgvs64z0006u9ikxebr4xww	2026-02-11 07:30:00	2026-02-11 08:00:00	BOOKED	OFFLINE	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, image, "createdAt", "updatedAt") FROM stdin;
cmlgvs64z0005u9ik678d98s1	Dr. Sarah Wilson	sarah@grandview.com	\N	DOCTOR	/images/doctors/sarah.png	2026-02-10 17:34:40.403	2026-02-10 17:34:40.403
cmlgvs65b0007u9ik7opeb9ay	Dr. James Chen	james@grandview.com	\N	DOCTOR	/images/doctors/james.png	2026-02-10 17:34:40.415	2026-02-10 17:34:40.415
cmlgvs65g0009u9ikyduhvsq4	Dr. Emily Carter	emily@grandview.com	\N	DOCTOR	/images/doctors/emily.png	2026-02-10 17:34:40.42	2026-02-10 17:34:40.42
cmlgvs65l000bu9ikfxcd2c17	Alex Johnson	alex@patient.com	\N	PATIENT	\N	2026-02-10 17:34:40.425	2026-02-10 17:34:40.425
cmlgxfijb0006u9d0nnqn6l7z	Ganesh Maharaj M	ganeshmaharaj444@gmail.com	$2b$10$soYNBUbERPYNYPJq8d4d6uie.z2c.mIN669yR/osLFZBVTaTmtD0a	PATIENT	\N	2026-02-10 18:20:49.175	2026-02-10 18:20:49.175
\.


--
-- Data for Name: WaitlistEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WaitlistEntry" (id, "patientId", "doctorId", status, "position", "createdAt") FROM stdin;
cmlgyv6ac0003u9wcjowsgfex	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	1	2026-02-10 19:00:59.412
cmlgyv6af0005u9wc2nfr4n8p	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	2	2026-02-10 19:00:59.415
cmlgyv6ah0007u9wc8wqot323	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	3	2026-02-10 19:00:59.417
cmlgyv6aj0009u9wcl1bz0d60	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	4	2026-02-10 19:00:59.42
cmlgyv6al000bu9wcorw32plf	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	5	2026-02-10 19:00:59.422
cmlgyv6ao000du9wcowvc5kec	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs64z0006u9ikxebr4xww	WAITING	6	2026-02-10 19:00:59.424
cmlgyv6ar000fu9wcajz81p3h	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	1	2026-02-10 19:00:59.427
cmlgyv6at000hu9wczl51syua	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	2	2026-02-10 19:00:59.429
cmlgyv6au000ju9wcsyhhm8v0	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	3	2026-02-10 19:00:59.431
cmlgyv6aw000lu9wco06ydzys	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	4	2026-02-10 19:00:59.433
cmlgyv6ay000nu9wcl4isfhxe	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	5	2026-02-10 19:00:59.434
cmlgyv6b0000pu9wcyravxvek	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	6	2026-02-10 19:00:59.436
cmlgyv6b1000ru9wcbqghgnks	cmlgyv6aa0001u9wcqxcj5i60	cmlgvs65b0008u9ikok0k2naj	WAITING	7	2026-02-10 19:00:59.438
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
db18e454-ee2a-4007-bd10-c8116d034500	4dca6f4e30a5c9c650d44eceae41cb5e4c3f332e58ad9697f33f945fe5ecc4dc	2026-02-10 23:01:49.928854+05:30	20260203121552_init	\N	\N	2026-02-10 23:01:49.829568+05:30	1
cef305b9-e6e5-4962-8a9e-3d8c265bdc67	61ced770136f86f75ca6dc10595defce929490c7447b9e2b3b591b11d64e34cc	2026-02-10 23:01:51.463833+05:30	20260210173151_enable_appointments	\N	\N	2026-02-10 23:01:51.426789+05:30	1
\.


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


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
-- Name: Slot Slot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Slot"
    ADD CONSTRAINT "Slot_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WaitlistEntry WaitlistEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WaitlistEntry"
    ADD CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Appointment_slotId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Appointment_slotId_key" ON public."Appointment" USING btree ("slotId");


--
-- Name: DoctorProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON public."DoctorProfile" USING btree ("userId");


--
-- Name: PatientProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PatientProfile_userId_key" ON public."PatientProfile" USING btree ("userId");


--
-- Name: Slot_doctorId_startTime_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Slot_doctorId_startTime_idx" ON public."Slot" USING btree ("doctorId", "startTime");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Appointment Appointment_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."DoctorProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Appointment Appointment_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."PatientProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Appointment Appointment_slotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES public."Slot"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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
-- Name: Slot Slot_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Slot"
    ADD CONSTRAINT "Slot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."DoctorProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WaitlistEntry WaitlistEntry_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WaitlistEntry"
    ADD CONSTRAINT "WaitlistEntry_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."DoctorProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WaitlistEntry WaitlistEntry_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WaitlistEntry"
    ADD CONSTRAINT "WaitlistEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."PatientProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

