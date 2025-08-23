--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: builds; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.builds (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    components jsonb,
    total_price numeric(10,2),
    performance_level character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.builds OWNER TO eda_user;

--
-- Name: builds_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.builds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.builds_id_seq OWNER TO eda_user;

--
-- Name: builds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.builds_id_seq OWNED BY public.builds.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO eda_user;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO eda_user;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.components (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer,
    price numeric(10,2) NOT NULL,
    specs jsonb,
    stock_quantity integer DEFAULT 0,
    image_url text,
    tdp integer,
    fps_fortnite integer,
    fps_gta5 integer,
    fps_warzone integer,
    compatibility text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.components OWNER TO eda_user;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.components_id_seq OWNER TO eda_user;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: order_comments; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.order_comments (
    id integer NOT NULL,
    order_id integer,
    user_id integer,
    content text NOT NULL,
    is_admin_comment boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_comments OWNER TO eda_user;

--
-- Name: order_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.order_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_comments_id_seq OWNER TO eda_user;

--
-- Name: order_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.order_comments_id_seq OWNED BY public.order_comments.id;


--
-- Name: order_logs; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.order_logs (
    id integer NOT NULL,
    order_id integer,
    status_from character varying(50),
    status_to character varying(50) NOT NULL,
    changed_by character varying(100) NOT NULL,
    comment text,
    metadata jsonb,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_logs OWNER TO eda_user;

--
-- Name: order_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.order_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_logs_id_seq OWNER TO eda_user;

--
-- Name: order_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.order_logs_id_seq OWNED BY public.order_logs.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(50),
    delivery_address text,
    notes text,
    components jsonb,
    total_price numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'created'::character varying,
    order_type character varying(20) DEFAULT 'guest'::character varying,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery timestamp without time zone,
    tracking_number character varying(100)
);


ALTER TABLE public.orders OWNER TO eda_user;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO eda_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    order_id integer,
    customer_name character varying(255) NOT NULL,
    rating integer,
    comment text,
    status character varying(20) DEFAULT 'pending'::character varying,
    admin_comment text,
    order_total numeric(10,2),
    components jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT reviews_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.reviews OWNER TO eda_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO eda_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: user_carts; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.user_carts (
    id integer NOT NULL,
    user_id integer,
    cart_data jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_carts OWNER TO eda_user;

--
-- Name: user_carts_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.user_carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_carts_id_seq OWNER TO eda_user;

--
-- Name: user_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.user_carts_id_seq OWNED BY public.user_carts.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.user_sessions (
    id integer NOT NULL,
    user_id integer,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_sessions OWNER TO eda_user;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.user_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_sessions_id_seq OWNER TO eda_user;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: eda_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'USER'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO eda_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: eda_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO eda_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eda_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: builds id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.builds ALTER COLUMN id SET DEFAULT nextval('public.builds_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: order_comments id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_comments ALTER COLUMN id SET DEFAULT nextval('public.order_comments_id_seq'::regclass);


--
-- Name: order_logs id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_logs ALTER COLUMN id SET DEFAULT nextval('public.order_logs_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: user_carts id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_carts ALTER COLUMN id SET DEFAULT nextval('public.user_carts_id_seq'::regclass);


--
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: builds; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.builds (id, name, description, components, total_price, performance_level, created_at, updated_at) FROM stdin;
1	Игровая сборка	Мощная игровая система для современных игр	[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 9, "name": "NVIDIA RTX 3060", "price": 45000, "quantity": 1}]	70000.00	\N	2025-08-15 21:44:11.791565	2025-08-15 21:44:11.791565
2	Рабочая станция	Профессиональная система для работы	[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 13, "name": "G.Skill Ripjaws 16GB DDR5", "price": 15000, "quantity": 2}]	110000.00	\N	2025-08-15 21:44:11.791565	2025-08-15 21:44:11.791565
3	Бюджетная сборка	Доступная система для повседневных задач	[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 20, "name": "AMD Ryzen 5 7600X", "price": 30000, "quantity": 1}]	65000.00	\N	2025-08-15 21:44:11.791565	2025-08-15 21:44:11.791565
4	Топовая сборка	Максимальная производительность	[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]	180000.00	\N	2025-08-15 21:44:11.791565	2025-08-15 21:44:11.791565
5	Starter 1080p	Оптимальная сборка для игр в 1080p. Баланс цены и FPS.	[973, 1085, 995, 1035, 1047, 1058]	733270.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
6	Streamer 1440p	Игры и стриминг в 1440p — стабильная производительность.	[967, 1077, 1001, 1035, 1042, 1069]	645564.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
7	4K Enthusiast	Для 4K-игр и творчества — топовое железо.	[964, 1087, 987, 1035, 1053, 1060]	972919.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
8	Esports Lite	Максимум FPS в киберспортивных тайтлах.	[979, 1083, 1016, 1038, 1054, 1068]	688595.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
9	Creator Pro	Работа с графикой и видео, быстрый рендер.	[964, 1083, 995, 1039, 1055, 1064]	760557.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
10	Budget Office	Офисные задачи и учеба, низкое энергопотребление.	[963, 1075, 1015, 1020, 1055, 1058]	499754.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
11	Compact ITX	Компактный корпус, тихая работа.	[983, 1083, 1004, 1020, 1043, 1065]	786057.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
12	VR Ready	Готов к VR — стабильные 90+ FPS.	[959, 1085, 988, 1040, 1051, 1063]	659247.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
13	Quiet Build	Тихая система с качественными вентиляторами.	[978, 1083, 1009, 1037, 1054, 1057]	829323.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
14	AI Dev Box	Машинное обучение и разработка, GPU-ускорение.	[976, 1078, 1015, 1040, 1044, 1072]	491595.00	\N	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
15	Starter 1080p	Оптимальная сборка для игр в 1080p. Баланс цены и FPS.	[1100, 1212, 1141, 1167, 1046, 1200]	770015.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
16	Streamer 1440p	Игры и стриминг в 1440p — стабильная производительность.	[1101, 1082, 1137, 1031, 1184, 1202]	888833.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
17	4K Enthusiast	Для 4K-игр и творчества — топовое железо.	[978, 1081, 1125, 1169, 1044, 1057]	695607.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
18	Esports Lite	Максимум FPS в киберспортивных тайтлах.	[958, 1080, 1128, 1163, 1042, 1197]	621454.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
19	Creator Pro	Работа с графикой и видео, быстрый рендер.	[962, 1216, 1123, 1158, 1043, 1208]	478544.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
20	Budget Office	Офисные задачи и учеба, низкое энергопотребление.	[1120, 1078, 1141, 1027, 1049, 1194]	713683.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
21	Compact ITX	Компактный корпус, тихая работа.	[1090, 1076, 1002, 1156, 1055, 1204]	427058.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
22	VR Ready	Готов к VR — стабильные 90+ FPS.	[958, 1076, 999, 1154, 1044, 1069]	226731.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
23	Quiet Build	Тихая система с качественными вентиляторами.	[957, 1076, 1002, 1158, 1052, 1200]	356605.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
24	AI Dev Box	Машинное обучение и разработка, GPU-ускорение.	[1110, 1084, 1135, 1024, 1045, 1060]	639610.00	\N	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.categories (id, name, description, icon, sort_order, created_at, updated_at) FROM stdin;
1	CPU	\N	\N	0	2025-08-16 08:32:29.578906	2025-08-16 08:32:29.578906
2	Motherboard	\N	\N	0	2025-08-16 08:32:29.673493	2025-08-16 08:32:29.673493
3	GPU	\N	\N	0	2025-08-16 08:32:29.783187	2025-08-16 08:32:29.783187
4	RAM	\N	\N	0	2025-08-16 08:32:29.881268	2025-08-16 08:32:29.881268
5	Storage	\N	\N	0	2025-08-16 08:32:29.975584	2025-08-16 08:32:29.975584
6	PSU	\N	\N	0	2025-08-16 08:32:30.067628	2025-08-16 08:32:30.067628
\.


--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.components (id, name, category_id, price, specs, stock_quantity, image_url, tdp, fps_fortnite, fps_gta5, fps_warzone, compatibility, created_at, updated_at) FROM stdin;
953	Intel Core i5-12400F v1	1	150485.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	43	/images/components/cpu-intel-i5.svg	65	90	61	106	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
954	Intel Core i5-12400F v2	1	105145.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	49	/images/components/cpu-intel-i5.svg	65	137	92	75	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
955	Intel Core i5-12400F v3	1	70231.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	15	/images/components/cpu-intel-i5.svg	65	150	67	72	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
956	Intel Core i5-12400F v4	1	195163.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	36	/images/components/cpu-intel-i5.svg	65	132	110	73	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
957	Intel Core i5-12400F v5	1	52277.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	56	/images/components/cpu-intel-i5.svg	65	110	73	87	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
958	Intel Core i5-12400F v6	1	42145.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	58	/images/components/cpu-intel-i5.svg	65	151	104	85	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
959	Intel Core i5-12400F v7	1	156845.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	32	/images/components/cpu-intel-i5.svg	65	179	101	117	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
960	Intel Core i5-12400F v8	1	176048.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	27	/images/components/cpu-intel-i5.svg	65	177	107	107	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
961	Intel Core i7-12700F v1	1	39717.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	22	/images/components/cpu-intel-i5.svg	125	177	59	66	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
962	Intel Core i7-12700F v2	1	153300.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	59	/images/components/cpu-intel-i5.svg	125	154	90	124	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
963	Intel Core i7-12700F v3	1	142740.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	53	/images/components/cpu-intel-i5.svg	125	148	98	106	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
964	Intel Core i7-12700F v4	1	196374.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	59	/images/components/cpu-intel-i5.svg	125	159	109	90	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
965	Intel Core i7-12700F v5	1	147880.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	42	/images/components/cpu-intel-i5.svg	125	94	92	73	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
966	Intel Core i7-12700F v6	1	186859.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	9	/images/components/cpu-intel-i5.svg	125	175	86	65	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
967	Intel Core i7-12700F v7	1	179219.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	46	/images/components/cpu-intel-i5.svg	125	149	57	116	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
968	Intel Core i7-12700F v8	1	166992.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	41	/images/components/cpu-intel-i5.svg	125	167	91	118	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
969	AMD Ryzen 5 5600 v1	1	188864.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	58	/images/components/cpu-intel-i5.svg	65	171	86	86	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
970	AMD Ryzen 5 5600 v2	1	4197.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	42	/images/components/cpu-intel-i5.svg	65	132	61	110	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
971	AMD Ryzen 5 5600 v3	1	11148.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	55	/images/components/cpu-intel-i5.svg	65	173	86	60	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
972	AMD Ryzen 5 5600 v4	1	179884.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	26	/images/components/cpu-intel-i5.svg	65	117	64	88	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
973	AMD Ryzen 5 5600 v5	1	159571.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	8	/images/components/cpu-intel-i5.svg	65	157	110	111	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
974	AMD Ryzen 5 5600 v6	1	119371.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	42	/images/components/cpu-intel-i5.svg	65	137	108	112	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
975	AMD Ryzen 5 5600 v7	1	149592.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	47	/images/components/cpu-intel-i5.svg	65	160	102	96	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
976	AMD Ryzen 5 5600 v8	1	95626.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	41	/images/components/cpu-intel-i5.svg	65	132	103	61	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
977	AMD Ryzen 7 5800X3D v1	1	10702.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	32	/images/components/cpu-intel-i5.svg	105	114	97	93	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
978	AMD Ryzen 7 5800X3D v2	1	181182.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	15	/images/components/cpu-intel-i5.svg	105	158	81	121	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
979	AMD Ryzen 7 5800X3D v3	1	134628.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	29	/images/components/cpu-intel-i5.svg	105	161	67	122	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
980	AMD Ryzen 7 5800X3D v4	1	127325.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	19	/images/components/cpu-intel-i5.svg	105	118	100	65	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
981	AMD Ryzen 7 5800X3D v5	1	186030.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	21	/images/components/cpu-intel-i5.svg	105	160	103	72	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
982	AMD Ryzen 7 5800X3D v6	1	118531.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	14	/images/components/cpu-intel-i5.svg	105	118	77	116	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
983	AMD Ryzen 7 5800X3D v7	1	103304.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	21	/images/components/cpu-intel-i5.svg	105	148	65	118	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
984	AMD Ryzen 7 5800X3D v8	1	152013.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	32	/images/components/cpu-intel-i5.svg	105	120	110	86	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
985	NVIDIA RTX 3060 12GB v1	3	148417.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	29	/images/components/gpu-rtx4070.svg	170	128	77	129	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
986	NVIDIA RTX 3060 12GB v2	3	54975.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	40	/images/components/gpu-rtx4070.svg	170	149	109	83	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
987	NVIDIA RTX 3060 12GB v3	3	149190.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	56	/images/components/gpu-rtx4070.svg	170	201	70	108	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
988	NVIDIA RTX 3060 12GB v4	3	132805.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	23	/images/components/gpu-rtx4070.svg	170	210	119	80	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
989	NVIDIA RTX 3060 12GB v5	3	14701.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	24	/images/components/gpu-rtx4070.svg	170	135	80	113	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
990	NVIDIA RTX 3060 12GB v6	3	8890.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	34	/images/components/gpu-rtx4070.svg	170	187	90	120	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
991	NVIDIA RTX 3060 12GB v7	3	23485.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	33	/images/components/gpu-rtx4070.svg	170	134	108	106	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
992	NVIDIA RTX 3060 12GB v8	3	95184.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	46	/images/components/gpu-rtx4070.svg	170	151	84	131	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
993	NVIDIA RTX 4070 Super 12GB v1	3	5148.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	39	/images/components/gpu-rtx4070.svg	225	130	89	100	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
994	NVIDIA RTX 4070 Super 12GB v2	3	54143.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	38	/images/components/gpu-rtx4070.svg	225	145	103	125	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
995	NVIDIA RTX 4070 Super 12GB v3	3	34535.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	58	/images/components/gpu-rtx4070.svg	225	151	100	93	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
996	NVIDIA RTX 4070 Super 12GB v4	3	119019.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	40	/images/components/gpu-rtx4070.svg	225	175	101	87	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
997	NVIDIA RTX 4070 Super 12GB v5	3	105218.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	18	/images/components/gpu-rtx4070.svg	225	133	94	97	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
998	NVIDIA RTX 4070 Super 12GB v6	3	43386.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	50	/images/components/gpu-rtx4070.svg	225	195	119	139	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
999	NVIDIA RTX 4070 Super 12GB v7	3	4372.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	22	/images/components/gpu-rtx4070.svg	225	195	107	111	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1000	NVIDIA RTX 4070 Super 12GB v8	3	132073.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	44	/images/components/gpu-rtx4070.svg	225	199	68	112	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1001	AMD RX 6700 XT 12GB v1	3	59675.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	43	/images/components/gpu-rtx4070.svg	230	161	119	119	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1002	AMD RX 6700 XT 12GB v2	3	49501.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	41	/images/components/gpu-rtx4070.svg	230	196	97	74	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1003	AMD RX 6700 XT 12GB v3	3	40152.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	11	/images/components/gpu-rtx4070.svg	230	193	95	112	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1004	AMD RX 6700 XT 12GB v4	3	183173.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	10	/images/components/gpu-rtx4070.svg	230	182	90	111	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1005	AMD RX 6700 XT 12GB v5	3	10809.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	50	/images/components/gpu-rtx4070.svg	230	196	68	90	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1006	AMD RX 6700 XT 12GB v6	3	185863.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	60	/images/components/gpu-rtx4070.svg	230	157	117	99	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1007	AMD RX 6700 XT 12GB v7	3	170045.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	18	/images/components/gpu-rtx4070.svg	230	134	77	130	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1008	AMD RX 6700 XT 12GB v8	3	88317.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	40	/images/components/gpu-rtx4070.svg	230	143	113	92	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1009	AMD RX 7800 XT 16GB v1	3	59809.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	16	/images/components/gpu-rtx4070.svg	263	140	94	130	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1010	AMD RX 7800 XT 16GB v2	3	9300.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	11	/images/components/gpu-rtx4070.svg	263	163	82	105	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1011	AMD RX 7800 XT 16GB v3	3	106703.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	59	/images/components/gpu-rtx4070.svg	263	171	85	97	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1012	AMD RX 7800 XT 16GB v4	3	117684.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	34	/images/components/gpu-rtx4070.svg	263	125	86	114	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1013	AMD RX 7800 XT 16GB v5	3	98275.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	39	/images/components/gpu-rtx4070.svg	263	142	82	123	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1014	AMD RX 7800 XT 16GB v6	3	24726.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	17	/images/components/gpu-rtx4070.svg	263	165	93	95	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1015	AMD RX 7800 XT 16GB v7	3	78678.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	20	/images/components/gpu-rtx4070.svg	263	161	103	125	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1016	AMD RX 7800 XT 16GB v8	3	166212.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	18	/images/components/gpu-rtx4070.svg	263	186	110	106	{"requires_atx":false,"min_psu":550}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1017	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v1	4	114234.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	40	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1018	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v2	4	161632.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	35	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1019	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v3	4	3030.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	29	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1020	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v4	4	46276.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	26	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1021	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v5	4	26517.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	16	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1022	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v6	4	75347.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	13	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1023	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v7	4	150509.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	49	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1024	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v8	4	118910.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	54	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1025	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v1	4	194788.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	23	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1026	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v2	4	98060.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	33	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1027	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v3	4	103397.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	56	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1028	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v4	4	24045.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	30	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1029	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v5	4	177804.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	53	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1030	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v6	4	142767.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	24	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1031	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v7	4	150773.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	16	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1032	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v8	4	77205.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	19	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1033	Corsair Vengeance DDR5-6000 32GB (2x16GB) v1	4	172547.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	6	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1034	Corsair Vengeance DDR5-6000 32GB (2x16GB) v2	4	158793.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	10	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1035	Corsair Vengeance DDR5-6000 32GB (2x16GB) v3	4	154347.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	56	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1036	Corsair Vengeance DDR5-6000 32GB (2x16GB) v4	4	155709.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	38	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1037	Corsair Vengeance DDR5-6000 32GB (2x16GB) v5	4	175196.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	55	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1038	Corsair Vengeance DDR5-6000 32GB (2x16GB) v6	4	132607.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	39	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1039	Corsair Vengeance DDR5-6000 32GB (2x16GB) v7	4	124200.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	39	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1040	Corsair Vengeance DDR5-6000 32GB (2x16GB) v8	4	79690.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	56	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1041	Kingston NV2 1TB NVMe v1	5	179744.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	31	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1042	Kingston NV2 1TB NVMe v2	5	193002.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	27	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1043	Kingston NV2 1TB NVMe v3	5	146925.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	5	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1044	Kingston NV2 1TB NVMe v4	5	3367.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	36	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1045	Kingston NV2 1TB NVMe v5	5	41461.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	60	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1046	Kingston NV2 1TB NVMe v6	5	36745.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	57	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1047	Kingston NV2 1TB NVMe v7	5	186170.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	37	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1048	Kingston NV2 1TB NVMe v8	5	123583.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	50	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1049	Crucial P5 Plus 2TB NVMe v1	5	82869.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	15	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1050	Crucial P5 Plus 2TB NVMe v2	5	114243.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	55	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1051	Crucial P5 Plus 2TB NVMe v3	5	42525.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	24	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1052	Crucial P5 Plus 2TB NVMe v4	5	40726.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	16	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1053	Crucial P5 Plus 2TB NVMe v5	5	109581.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	37	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1054	Crucial P5 Plus 2TB NVMe v6	5	103280.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	7	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1055	Crucial P5 Plus 2TB NVMe v7	5	133411.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	31	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1056	Crucial P5 Plus 2TB NVMe v8	5	152579.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	16	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1057	be quiet! Pure Power 11 FM 650W v1	6	183604.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	39	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1058	be quiet! Pure Power 11 FM 650W v2	6	75981.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	23	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1059	be quiet! Pure Power 11 FM 650W v3	6	100123.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	52	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1060	be quiet! Pure Power 11 FM 650W v4	6	194343.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	23	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1061	be quiet! Pure Power 11 FM 650W v5	6	116049.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	32	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1062	be quiet! Pure Power 11 FM 650W v6	6	38006.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	18	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1063	be quiet! Pure Power 11 FM 650W v7	6	124716.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	46	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1064	be quiet! Pure Power 11 FM 650W v8	6	145785.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	37	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1065	Cooler Master MWE Gold 750 V2 v1	6	180127.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	33	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1066	Cooler Master MWE Gold 750 V2 v2	6	194451.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	28	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1067	Cooler Master MWE Gold 750 V2 v3	6	4971.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	34	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1068	Cooler Master MWE Gold 750 V2 v4	6	25616.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	30	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1069	Cooler Master MWE Gold 750 V2 v5	6	7353.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	30	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1070	Cooler Master MWE Gold 750 V2 v6	6	36546.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	16	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1071	Cooler Master MWE Gold 750 V2 v7	6	33184.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	9	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1072	Cooler Master MWE Gold 750 V2 v8	6	116829.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	44	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1073	ASUS PRIME B660-PLUS D4 v1	2	128523.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	28	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1074	ASUS PRIME B660-PLUS D4 v2	2	88315.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	55	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1075	ASUS PRIME B660-PLUS D4 v3	2	22668.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	30	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1076	ASUS PRIME B660-PLUS D4 v4	2	3954.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	7	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1077	ASUS PRIME B660-PLUS D4 v5	2	51968.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	42	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1078	ASUS PRIME B660-PLUS D4 v6	2	117405.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	12	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1079	ASUS PRIME B660-PLUS D4 v7	2	79985.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	22	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1080	ASUS PRIME B660-PLUS D4 v8	2	99993.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	56	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1081	MSI PRO B650-P v1	2	71654.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	6	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1082	MSI PRO B650-P v2	2	180672.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	27	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1083	MSI PRO B650-P v3	2	126252.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	47	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1084	MSI PRO B650-P v4	2	46533.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	59	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1085	MSI PRO B650-P v5	2	122666.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	24	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1086	MSI PRO B650-P v6	2	98986.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	29	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1087	MSI PRO B650-P v7	2	169084.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	51	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1088	MSI PRO B650-P v8	2	18081.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	47	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-16 08:37:24.862297	2025-08-16 08:37:24.862297
1089	Intel Core i5-12400F v1	1	83058.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	59	/images/components/cpu-intel-i5.svg	65	91	87	93	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1090	Intel Core i5-12400F v2	1	84328.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	10	/images/components/cpu-intel-i5.svg	65	122	100	126	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1091	Intel Core i5-12400F v3	1	41401.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	50	/images/components/cpu-intel-i5.svg	65	105	66	63	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1092	Intel Core i5-12400F v4	1	70269.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	29	/images/components/cpu-intel-i5.svg	65	175	74	82	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1093	Intel Core i5-12400F v5	1	34260.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	31	/images/components/cpu-intel-i5.svg	65	162	65	125	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1094	Intel Core i5-12400F v6	1	185376.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	31	/images/components/cpu-intel-i5.svg	65	161	64	127	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1095	Intel Core i5-12400F v7	1	9004.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	35	/images/components/cpu-intel-i5.svg	65	99	89	69	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1096	Intel Core i5-12400F v8	1	93584.00	{"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}	32	/images/components/cpu-intel-i5.svg	65	133	75	116	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1097	Intel Core i7-12700F v1	1	90060.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	33	/images/components/cpu-intel-i5.svg	125	92	66	86	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1098	Intel Core i7-12700F v2	1	194413.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	48	/images/components/cpu-intel-i5.svg	125	146	74	124	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1099	Intel Core i7-12700F v3	1	27256.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	36	/images/components/cpu-intel-i5.svg	125	109	92	128	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1100	Intel Core i7-12700F v4	1	187162.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	8	/images/components/cpu-intel-i5.svg	125	178	62	126	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1101	Intel Core i7-12700F v5	1	150242.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	5	/images/components/cpu-intel-i5.svg	125	165	85	128	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1102	Intel Core i7-12700F v6	1	73704.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	46	/images/components/cpu-intel-i5.svg	125	169	59	112	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1103	Intel Core i7-12700F v7	1	185598.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	44	/images/components/cpu-intel-i5.svg	125	161	90	74	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1104	Intel Core i7-12700F v8	1	145486.00	{"cores": 12, "socket": "LGA1700", "threads": 20, "base_clock": 2.1, "boost_clock": 4.9}	9	/images/components/cpu-intel-i5.svg	125	154	79	73	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1105	AMD Ryzen 5 5600 v1	1	11692.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	6	/images/components/cpu-intel-i5.svg	65	105	102	125	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1106	AMD Ryzen 5 5600 v2	1	140169.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	15	/images/components/cpu-intel-i5.svg	65	102	106	68	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1107	AMD Ryzen 5 5600 v3	1	93588.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	35	/images/components/cpu-intel-i5.svg	65	179	110	91	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1108	AMD Ryzen 5 5600 v4	1	178619.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	44	/images/components/cpu-intel-i5.svg	65	107	109	116	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1109	AMD Ryzen 5 5600 v5	1	146521.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	43	/images/components/cpu-intel-i5.svg	65	127	102	125	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1110	AMD Ryzen 5 5600 v6	1	127927.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	26	/images/components/cpu-intel-i5.svg	65	170	82	98	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1111	AMD Ryzen 5 5600 v7	1	22343.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	41	/images/components/cpu-intel-i5.svg	65	168	78	109	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1112	AMD Ryzen 5 5600 v8	1	8403.00	{"cores": 6, "socket": "AM4", "threads": 12, "base_clock": 3.5, "boost_clock": 4.4}	9	/images/components/cpu-intel-i5.svg	65	154	64	72	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1113	AMD Ryzen 7 5800X3D v1	1	168981.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	7	/images/components/cpu-intel-i5.svg	105	92	72	97	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1114	AMD Ryzen 7 5800X3D v2	1	44655.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	16	/images/components/cpu-intel-i5.svg	105	174	90	95	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1115	AMD Ryzen 7 5800X3D v3	1	168332.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	19	/images/components/cpu-intel-i5.svg	105	138	55	71	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1116	AMD Ryzen 7 5800X3D v4	1	61343.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	14	/images/components/cpu-intel-i5.svg	105	112	84	107	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1117	AMD Ryzen 7 5800X3D v5	1	134640.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	55	/images/components/cpu-intel-i5.svg	105	106	80	107	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1118	AMD Ryzen 7 5800X3D v6	1	45131.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	54	/images/components/cpu-intel-i5.svg	105	163	65	128	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1119	AMD Ryzen 7 5800X3D v7	1	5114.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	19	/images/components/cpu-intel-i5.svg	105	96	59	92	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1120	AMD Ryzen 7 5800X3D v8	1	148813.00	{"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}	55	/images/components/cpu-intel-i5.svg	105	166	68	76	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1121	NVIDIA RTX 3060 12GB v1	3	118140.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	52	/images/components/gpu-rtx4070.svg	170	176	90	102	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1122	NVIDIA RTX 3060 12GB v2	3	99962.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	19	/images/components/gpu-rtx4070.svg	170	185	91	138	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1123	NVIDIA RTX 3060 12GB v3	3	52162.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	14	/images/components/gpu-rtx4070.svg	170	161	118	119	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1124	NVIDIA RTX 3060 12GB v4	3	42196.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	35	/images/components/gpu-rtx4070.svg	170	191	90	96	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1125	NVIDIA RTX 3060 12GB v5	3	181752.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	8	/images/components/gpu-rtx4070.svg	170	195	112	89	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1126	NVIDIA RTX 3060 12GB v6	3	42541.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	34	/images/components/gpu-rtx4070.svg	170	209	114	72	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1127	NVIDIA RTX 3060 12GB v7	3	7776.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	40	/images/components/gpu-rtx4070.svg	170	133	95	107	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1128	NVIDIA RTX 3060 12GB v8	3	76425.00	{"memory": 12, "cuda_cores": 3584, "boost_clock": 1777, "memory_type": "GDDR6"}	51	/images/components/gpu-rtx4070.svg	170	161	108	133	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1129	NVIDIA RTX 4070 Super 12GB v1	3	46348.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	6	/images/components/gpu-rtx4070.svg	225	161	92	114	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1130	NVIDIA RTX 4070 Super 12GB v2	3	97506.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	29	/images/components/gpu-rtx4070.svg	225	171	117	122	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1131	NVIDIA RTX 4070 Super 12GB v3	3	138453.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	14	/images/components/gpu-rtx4070.svg	225	122	78	127	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1132	NVIDIA RTX 4070 Super 12GB v4	3	197877.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	5	/images/components/gpu-rtx4070.svg	225	179	79	118	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1133	NVIDIA RTX 4070 Super 12GB v5	3	80250.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	16	/images/components/gpu-rtx4070.svg	225	177	81	107	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1134	NVIDIA RTX 4070 Super 12GB v6	3	30039.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	35	/images/components/gpu-rtx4070.svg	225	148	105	97	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1135	NVIDIA RTX 4070 Super 12GB v7	3	110436.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	51	/images/components/gpu-rtx4070.svg	225	170	67	118	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1136	NVIDIA RTX 4070 Super 12GB v8	3	184445.00	{"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}	25	/images/components/gpu-rtx4070.svg	225	145	91	132	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1137	AMD RX 6700 XT 12GB v1	3	143999.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	5	/images/components/gpu-rtx4070.svg	230	155	116	107	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1138	AMD RX 6700 XT 12GB v2	3	175706.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	25	/images/components/gpu-rtx4070.svg	230	122	90	110	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1139	AMD RX 6700 XT 12GB v3	3	74162.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	57	/images/components/gpu-rtx4070.svg	230	150	75	78	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1140	AMD RX 6700 XT 12GB v4	3	141601.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	50	/images/components/gpu-rtx4070.svg	230	144	93	72	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1141	AMD RX 6700 XT 12GB v5	3	182367.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	21	/images/components/gpu-rtx4070.svg	230	176	108	95	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1142	AMD RX 6700 XT 12GB v6	3	138596.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	26	/images/components/gpu-rtx4070.svg	230	152	99	81	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1143	AMD RX 6700 XT 12GB v7	3	75418.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	32	/images/components/gpu-rtx4070.svg	230	149	93	104	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1144	AMD RX 6700 XT 12GB v8	3	172147.00	{"memory": 12, "boost_clock": 2581, "memory_type": "GDDR6", "stream_processors": 2560}	40	/images/components/gpu-rtx4070.svg	230	153	96	140	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1145	AMD RX 7800 XT 16GB v1	3	82177.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	54	/images/components/gpu-rtx4070.svg	263	146	81	129	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1146	AMD RX 7800 XT 16GB v2	3	6245.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	31	/images/components/gpu-rtx4070.svg	263	132	106	116	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1147	AMD RX 7800 XT 16GB v3	3	133145.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	12	/images/components/gpu-rtx4070.svg	263	141	116	81	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1148	AMD RX 7800 XT 16GB v4	3	83569.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	59	/images/components/gpu-rtx4070.svg	263	199	100	97	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1149	AMD RX 7800 XT 16GB v5	3	147112.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	8	/images/components/gpu-rtx4070.svg	263	178	83	79	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1150	AMD RX 7800 XT 16GB v6	3	78049.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	10	/images/components/gpu-rtx4070.svg	263	159	79	89	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1151	AMD RX 7800 XT 16GB v7	3	173172.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	10	/images/components/gpu-rtx4070.svg	263	125	117	76	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1152	AMD RX 7800 XT 16GB v8	3	114611.00	{"memory": 16, "boost_clock": 2430, "memory_type": "GDDR6", "stream_processors": 3840}	56	/images/components/gpu-rtx4070.svg	263	148	71	77	{"requires_atx":false,"min_psu":550}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1153	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v1	4	20062.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	29	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1154	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v2	4	165540.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	32	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1155	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v3	4	25082.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	24	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1156	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v4	4	152016.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	52	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1157	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v5	4	82894.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	35	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1158	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v6	4	55281.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	37	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1159	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v7	4	194718.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	32	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1160	Kingston Fury Beast DDR4-3200 16GB (2x8GB) v8	4	104783.00	{"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}	39	/images/components/ram-corsair-ddr5.svg	6	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1161	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v1	4	148913.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	40	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1162	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v2	4	23234.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	9	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1163	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v3	4	185193.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	26	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1164	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v4	4	121503.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	16	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1165	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v5	4	138626.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	7	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1166	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v6	4	130460.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	6	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1167	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v7	4	145724.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	46	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1168	G.Skill Ripjaws V DDR4-3600 32GB (2x16GB) v8	4	130395.00	{"type": "DDR4", "speed": 3600, "latency": "CL18", "modules": 2, "size_gb": 32}	56	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1169	Corsair Vengeance DDR5-6000 32GB (2x16GB) v1	4	74048.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	11	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1170	Corsair Vengeance DDR5-6000 32GB (2x16GB) v2	4	87877.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	26	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1171	Corsair Vengeance DDR5-6000 32GB (2x16GB) v3	4	74769.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	32	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1172	Corsair Vengeance DDR5-6000 32GB (2x16GB) v4	4	22742.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	12	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1173	Corsair Vengeance DDR5-6000 32GB (2x16GB) v5	4	184134.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	10	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1174	Corsair Vengeance DDR5-6000 32GB (2x16GB) v6	4	5441.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	24	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1175	Corsair Vengeance DDR5-6000 32GB (2x16GB) v7	4	164834.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	26	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1176	Corsair Vengeance DDR5-6000 32GB (2x16GB) v8	4	156106.00	{"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}	58	/images/components/ram-corsair-ddr5.svg	7	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1177	Kingston NV2 1TB NVMe v1	5	108610.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	6	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1178	Kingston NV2 1TB NVMe v2	5	53544.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	27	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1179	Kingston NV2 1TB NVMe v3	5	116514.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	21	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1180	Kingston NV2 1TB NVMe v4	5	12504.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	30	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1181	Kingston NV2 1TB NVMe v5	5	171008.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	52	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1182	Kingston NV2 1TB NVMe v6	5	163639.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	58	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1183	Kingston NV2 1TB NVMe v7	5	198256.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	34	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1184	Kingston NV2 1TB NVMe v8	5	115165.00	{"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}	26	/images/components/ssd-samsung-970.svg	5	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1185	Crucial P5 Plus 2TB NVMe v1	5	83315.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	44	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1186	Crucial P5 Plus 2TB NVMe v2	5	96518.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	54	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1187	Crucial P5 Plus 2TB NVMe v3	5	9754.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	56	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1188	Crucial P5 Plus 2TB NVMe v4	5	25958.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	49	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1189	Crucial P5 Plus 2TB NVMe v5	5	186824.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	24	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1190	Crucial P5 Plus 2TB NVMe v6	5	54047.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	28	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1191	Crucial P5 Plus 2TB NVMe v7	5	30691.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	41	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1192	Crucial P5 Plus 2TB NVMe v8	5	55757.00	{"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}	54	/images/components/ssd-samsung-970.svg	8	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1193	be quiet! Pure Power 11 FM 650W v1	6	175855.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	57	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1194	be quiet! Pure Power 11 FM 650W v2	6	78832.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	25	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1195	be quiet! Pure Power 11 FM 650W v3	6	84912.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	12	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1196	be quiet! Pure Power 11 FM 650W v4	6	118543.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	36	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1197	be quiet! Pure Power 11 FM 650W v5	6	24696.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	20	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1198	be quiet! Pure Power 11 FM 650W v6	6	41041.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	59	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1199	be quiet! Pure Power 11 FM 650W v7	6	91973.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	23	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1200	be quiet! Pure Power 11 FM 650W v8	6	154866.00	{"modular": "Full", "wattage": 650, "efficiency": "80+ Gold", "form_factor": "ATX"}	22	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1201	Cooler Master MWE Gold 750 V2 v1	6	124650.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	15	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1202	Cooler Master MWE Gold 750 V2 v2	6	147982.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	23	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1203	Cooler Master MWE Gold 750 V2 v3	6	196745.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	22	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1204	Cooler Master MWE Gold 750 V2 v4	6	3848.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	40	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1205	Cooler Master MWE Gold 750 V2 v5	6	40759.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	5	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1206	Cooler Master MWE Gold 750 V2 v6	6	51507.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	25	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1207	Cooler Master MWE Gold 750 V2 v7	6	45892.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	29	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1208	Cooler Master MWE Gold 750 V2 v8	6	18336.00	{"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}	40	/images/components/psu-corsair-rm750.svg	0	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1209	ASUS PRIME B660-PLUS D4 v1	2	136085.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	37	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1210	ASUS PRIME B660-PLUS D4 v2	2	70600.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	52	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1211	ASUS PRIME B660-PLUS D4 v3	2	50105.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	22	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1212	ASUS PRIME B660-PLUS D4 v4	2	63151.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	60	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1213	ASUS PRIME B660-PLUS D4 v5	2	147164.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	38	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1214	ASUS PRIME B660-PLUS D4 v6	2	62105.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	47	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1215	ASUS PRIME B660-PLUS D4 v7	2	131529.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	14	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1216	ASUS PRIME B660-PLUS D4 v8	2	52540.00	{"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	55	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1217	MSI PRO B650-P v1	2	49385.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	14	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1218	MSI PRO B650-P v2	2	92241.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	45	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1219	MSI PRO B650-P v3	2	56206.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	56	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1220	MSI PRO B650-P v4	2	13551.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	25	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1221	MSI PRO B650-P v5	2	93400.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	50	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1222	MSI PRO B650-P v6	2	72936.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	13	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1223	MSI PRO B650-P v7	2	17555.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	49	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
1224	MSI PRO B650-P v8	2	50995.00	{"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}	26	/images/components/motherboard-msi-b760.svg	15	0	0	0	{}	2025-08-22 17:15:53.122063	2025-08-22 17:15:53.122063
\.


--
-- Data for Name: order_comments; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.order_comments (id, order_id, user_id, content, is_admin_comment, created_at, updated_at) FROM stdin;
1	1	1	Когда будет готов заказ?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
2	1	1	Спасибо за быструю обработку!	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
3	2	1	Отличный сервис!	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
4	3	1	Почему заказ отменен?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
5	4	3	Хотелось бы узнать статус заказа	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
6	4	3	Спасибо за информацию	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
7	5	3	Когда придет комплект?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
8	6	4	Отличное качество сборки!	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
9	6	4	Рекомендую всем	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
10	7	4	Есть ли возможность ускорить?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
11	8	5	Вопрос по совместимости компонентов	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
12	9	6	Превосходная работа!	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
13	10	7	Нужна консультация по настройке	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
14	11	8	Когда начнется сборка?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
15	12	9	Отличный выбор комплектующих	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
16	13	10	Есть ли гарантия на сборку?	f	2025-08-15 21:44:11.790136	2025-08-15 21:44:11.790136
\.


--
-- Data for Name: order_logs; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.order_logs (id, order_id, status_from, status_to, changed_by, comment, metadata, changed_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.orders (id, customer_name, customer_email, customer_phone, delivery_address, notes, components, total_price, status, order_type, user_id, created_at, updated_at, estimated_delivery, tracking_number) FROM stdin;
1	Администратор Системы	admin@eda.com	+7 (999) 000-00-01	Москва, ул. Технологическая, 1		[{"id": 1, "name": "Intel Core i7-12700K", "price": 50000, "quantity": 1}, {"id": 2, "name": "NVIDIA RTX 4070", "price": 39999, "quantity": 1}]	89999.00	processing	auth	1	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
2	Администратор Системы	admin@eda.com	+7 (999) 000-00-01	Москва, ул. Технологическая, 1		[{"id": 3, "name": "Kingston Fury 32GB DDR4", "price": 10000, "quantity": 2}, {"id": 4, "name": "Samsung 970 EVO Plus 1TB", "price": 109999, "quantity": 1}]	129999.00	delivered	auth	1	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
3	Администратор Системы	admin@eda.com	+7 (999) 000-00-01	Москва, ул. Технологическая, 1		[{"id": 5, "name": "MSI B660M", "price": 15000, "quantity": 1}, {"id": 6, "name": "Corsair RM750x", "price": 60000, "quantity": 1}]	75000.00	cancelled	auth	1	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
5	Иван Петров	ivan@example.com	+7 (999) 000-00-03	Санкт-Петербург, Невский пр., 10		[{"id": 9, "name": "NVIDIA RTX 3060", "price": 45000, "quantity": 1}, {"id": 10, "name": "Crucial P2 500GB", "price": 40000, "quantity": 1}]	85000.00	processing	auth	3	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
6	Мария Сидорова	maria@example.com	+7 (999) 000-00-04	Екатеринбург, ул. Ленина, 5		[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 12, "name": "ASUS ROG Strix Z690", "price": 40000, "quantity": 1}]	120000.00	delivered	auth	4	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
7	Мария Сидорова	maria@example.com	+7 (999) 000-00-04	Екатеринбург, ул. Ленина, 5		[{"id": 13, "name": "G.Skill Ripjaws 16GB DDR5", "price": 15000, "quantity": 2}, {"id": 14, "name": "Seagate Barracuda 2TB", "price": 35000, "quantity": 1}]	65000.00	processing	auth	4	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
8	Алексей Козлов	alex@example.com	+7 (999) 000-00-05	Казань, ул. Кремлевская, 3		[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 16, "name": "MSI MPG B550", "price": 20000, "quantity": 1}, {"id": 17, "name": "NVIDIA RTX 3070", "price": 40000, "quantity": 1}]	95000.00	created	auth	5	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
9	Елена Новикова	elena@example.com	+7 (999) 000-00-06	Новосибирск, Красный пр., 20		[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]	180000.00	delivered	auth	6	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
10	Дмитрий Волков	dmitry@example.com	+7 (999) 000-00-07	Нижний Новгород, ул. Большая, 7		[{"id": 20, "name": "AMD Ryzen 5 7600X", "price": 30000, "quantity": 1}, {"id": 21, "name": "ASRock B650", "price": 25000, "quantity": 1}]	55000.00	processing	auth	7	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
11	Анна Морозова	anna@example.com	+7 (999) 000-00-08	Самара, Московское ш., 15		[{"id": 22, "name": "Intel Core i5-13600K", "price": 35000, "quantity": 1}, {"id": 23, "name": "Gigabyte Z690", "price": 40000, "quantity": 1}]	75000.00	created	auth	8	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
12	Сергей Алексеев	sergey@example.com	+7 (999) 000-00-09	Уфа, пр. Октября, 12		[{"id": 24, "name": "AMD Ryzen 9 7900X", "price": 60000, "quantity": 1}, {"id": 25, "name": "NVIDIA RTX 4070 Ti", "price": 80000, "quantity": 1}]	140000.00	delivered	auth	9	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
13	Ольга Лебедева	olga@example.com	+7 (999) 000-00-10	Челябинск, ул. Труда, 9		[{"id": 26, "name": "Intel Core i7-13700K", "price": 45000, "quantity": 1}, {"id": 27, "name": "MSI MPG Z690", "price": 40000, "quantity": 1}]	85000.00	processing	auth	10	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
19	Иван	ivan@example.com	+7 (999) 111-11-11	СПб, Невский 1		[{"id": 101, "name": "Test CPU", "price": 10000, "quantity": 1, "category_id": 1}]	10000.00	created	auth	3	2025-08-15 22:06:48.28425	2025-08-15 22:06:48.28425	\N	\N
20	Администратор	admin@eda.com	123	123	123	[{"id": 2, "tdp": 105, "name": "AMD Ryzen 7 7700X", "price": 42000, "specs": {"tdp": 105, "cores": "8", "socket": "AM5", "frequency": "4.5 GHz"}, "fps_gta5": 115, "category_id": 1, "fps_warzone": 135, "fps_fortnite": 175, "compatibility": "AM5", "stock_quantity": 12}, {"id": 6, "tdp": 12, "name": "MSI MPG B650 CARBON", "price": 28000, "specs": {"socket": "AM5", "chipset": "B650", "ram_type": "DDR5", "form_factor": "ATX"}, "fps_gta5": 0, "category_id": 2, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "AM5", "stock_quantity": 8}, {"id": 4, "tdp": 263, "name": "AMD RX 7800 XT", "price": 75000, "specs": {"tdp": 263, "memory": "16 GB GDDR6", "boost_clock": "2.43 GHz"}, "fps_gta5": 140, "category_id": 3, "fps_warzone": 170, "fps_fortnite": 190, "compatibility": "ATX", "stock_quantity": 10}, {"id": 8, "tdp": 5, "name": "G.Skill Trident Z5 32GB DDR5-6400", "price": 22000, "specs": {"type": "DDR5", "speed": "6400 MHz", "latency": "CL32", "capacity": "32 GB"}, "fps_gta5": 0, "category_id": 4, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "DDR5", "stock_quantity": 15}, {"id": 10, "tdp": 3, "name": "WD Black SN850X 2TB", "price": 25000, "specs": {"capacity": "2 TB", "interface": "PCIe 4.0 x4", "read_speed": "7300 MB/s", "write_speed": "6600 MB/s"}, "fps_gta5": 0, "category_id": 5, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "M.2", "stock_quantity": 12}, {"id": 12, "tdp": 0, "name": "Seasonic Focus GX-750", "price": 12000, "specs": {"modular": "Full Modular", "wattage": "750W", "efficiency": "80+ Gold", "form_factor": "ATX"}, "fps_gta5": 0, "category_id": 6, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "ATX", "stock_quantity": 8}]	204000.00	created	auth	1	2025-08-15 22:15:05.180625	2025-08-15 22:15:05.180625	\N	\N
21	Иван	ivan@example.com	123	123	123	[{"id": 1, "tdp": 125, "name": "Intel Core i7-13700K", "price": 45000, "specs": {"tdp": 125, "cores": "16 (8P + 8E)", "socket": "LGA1700", "frequency": "3.4 GHz"}, "fps_gta5": 120, "category_id": 1, "fps_warzone": 140, "fps_fortnite": 180, "compatibility": "LGA1700", "stock_quantity": 15}, {"id": 5, "tdp": 15, "name": "ASUS ROG STRIX Z790-E", "price": 35000, "specs": {"socket": "LGA1700", "chipset": "Z790", "ram_type": "DDR5", "form_factor": "ATX"}, "fps_gta5": 0, "category_id": 2, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "LGA1700", "stock_quantity": 6}, {"id": 3, "tdp": 285, "name": "NVIDIA RTX 4070 Ti", "price": 85000, "specs": {"tdp": 285, "memory": "12 GB GDDR6X", "boost_clock": "2.61 GHz"}, "fps_gta5": 150, "category_id": 3, "fps_warzone": 180, "fps_fortnite": 200, "compatibility": "ATX", "stock_quantity": 8}, {"id": 7, "tdp": 5, "name": "Corsair Vengeance 32GB DDR5-6000", "price": 18000, "specs": {"type": "DDR5", "speed": "6000 MHz", "latency": "CL36", "capacity": "32 GB"}, "fps_gta5": 0, "category_id": 4, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "DDR5", "stock_quantity": 20}, {"id": 9, "tdp": 3, "name": "Samsung 970 EVO Plus 1TB", "price": 12000, "specs": {"capacity": "1 TB", "interface": "PCIe 3.0 x4", "read_speed": "3500 MB/s", "write_speed": "3300 MB/s"}, "fps_gta5": 0, "category_id": 5, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "M.2", "stock_quantity": 25}, {"id": 11, "tdp": 0, "name": "Corsair RM850x", "price": 15000, "specs": {"modular": "Full Modular", "wattage": "850W", "efficiency": "80+ Gold", "form_factor": "ATX"}, "fps_gta5": 0, "category_id": 6, "fps_warzone": 0, "fps_fortnite": 0, "compatibility": "ATX", "stock_quantity": 10}]	210000.00	created	auth	3	2025-08-15 22:16:36.437414	2025-08-15 22:16:36.437414	\N	\N
4	Иван Петров	ivan@example.com	+7 (999) 000-00-03	Санкт-Петербург, Невский пр., 10		[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 8, "name": "Gigabyte B550", "price": 20000, "quantity": 1}]	45000.00	cancelled	auth	3	2025-08-15 21:44:11.78941	2025-08-15 21:44:11.78941	\N	\N
22	Администратор	admin@eda.com	123	123		[{"id": 1220, "tdp": 15, "name": "MSI PRO B650-P v4", "price": "13551.00", "specs": {"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}, "fps_gta5": 0, "image_url": "/images/components/motherboard-msi-b760.svg", "category_id": 2, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Motherboard", "stock_quantity": 25}, {"id": 993, "tdp": 225, "name": "NVIDIA RTX 4070 Super 12GB v1", "price": "5148.00", "specs": {"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}, "fps_gta5": 89, "image_url": "/images/components/gpu-rtx4070.svg", "category_id": 3, "fps_warzone": 100, "fps_fortnite": 130, "category_name": "GPU", "stock_quantity": 39}, {"id": 1174, "tdp": 7, "name": "Corsair Vengeance DDR5-6000 32GB (2x16GB) v6", "price": "5441.00", "specs": {"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}, "fps_gta5": 0, "image_url": "/images/components/ram-corsair-ddr5.svg", "category_id": 4, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "RAM", "stock_quantity": 24}, {"id": 1187, "tdp": 8, "name": "Crucial P5 Plus 2TB NVMe v3", "price": "9754.00", "specs": {"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}, "fps_gta5": 0, "image_url": "/images/components/ssd-samsung-970.svg", "category_id": 5, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Storage", "stock_quantity": 56}, {"id": 1067, "tdp": 0, "name": "Cooler Master MWE Gold 750 V2 v3", "price": "4971.00", "specs": {"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}, "fps_gta5": 0, "image_url": "/images/components/psu-corsair-rm750.svg", "category_id": 6, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "PSU", "stock_quantity": 34}, {"id": 1119, "tdp": 105, "name": "AMD Ryzen 7 5800X3D v7", "price": "5114.00", "specs": {"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}, "fps_gta5": 59, "image_url": "/images/components/cpu-intel-i5.svg", "category_id": 1, "fps_warzone": 92, "fps_fortnite": 96, "category_name": "CPU", "stock_quantity": 19}]	43979.00	created	guest	1	2025-08-22 17:19:33.093904	2025-08-22 17:19:33.093904	\N	\N
23	123	123@eda.com	123	123	123	[{"id": 1119, "tdp": 105, "name": "AMD Ryzen 7 5800X3D v7", "price": "5114.00", "specs": {"cores": 8, "socket": "AM4", "threads": 16, "base_clock": 3.4, "boost_clock": 4.5}, "fps_gta5": 59, "image_url": "/images/components/cpu-intel-i5.svg", "category_id": 1, "fps_warzone": 92, "fps_fortnite": 96, "category_name": "CPU", "stock_quantity": 19}, {"id": 1220, "tdp": 15, "name": "MSI PRO B650-P v4", "price": "13551.00", "specs": {"socket": "AM5", "chipset": "B650", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}, "fps_gta5": 0, "image_url": "/images/components/motherboard-msi-b760.svg", "category_id": 2, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Motherboard", "stock_quantity": 25}, {"id": 993, "tdp": 225, "name": "NVIDIA RTX 4070 Super 12GB v1", "price": "5148.00", "specs": {"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}, "fps_gta5": 89, "image_url": "/images/components/gpu-rtx4070.svg", "category_id": 3, "fps_warzone": 100, "fps_fortnite": 130, "category_name": "GPU", "stock_quantity": 39}, {"id": 1174, "tdp": 7, "name": "Corsair Vengeance DDR5-6000 32GB (2x16GB) v6", "price": "5441.00", "specs": {"type": "DDR5", "speed": 6000, "latency": "CL36", "modules": 2, "size_gb": 32}, "fps_gta5": 0, "image_url": "/images/components/ram-corsair-ddr5.svg", "category_id": 4, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "RAM", "stock_quantity": 24}, {"id": 1187, "tdp": 8, "name": "Crucial P5 Plus 2TB NVMe v3", "price": "9754.00", "specs": {"type": "NVMe", "read_speed": 6600, "capacity_gb": 2000, "form_factor": "M.2", "write_speed": 5000}, "fps_gta5": 0, "image_url": "/images/components/ssd-samsung-970.svg", "category_id": 5, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Storage", "stock_quantity": 56}, {"id": 1067, "tdp": 0, "name": "Cooler Master MWE Gold 750 V2 v3", "price": "4971.00", "specs": {"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}, "fps_gta5": 0, "image_url": "/images/components/psu-corsair-rm750.svg", "category_id": 6, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "PSU", "stock_quantity": 34}]	43979.00	cancelled	auth	13	2025-08-22 19:52:06.095364	2025-08-22 19:52:06.095364	\N	\N
24	123	123@eda.com	123	123		[{"id": 958, "tdp": 65, "name": "Intel Core i5-12400F v6", "price": "42145.00", "specs": {"cores": 6, "socket": "LGA1700", "threads": 12, "base_clock": 2.5, "boost_clock": 4.4}, "fps_gta5": 104, "image_url": "/images/components/cpu-intel-i5.svg", "category_id": 1, "fps_warzone": 85, "fps_fortnite": 151, "category_name": "CPU", "stock_quantity": 58}, {"id": 1076, "tdp": 15, "name": "ASUS PRIME B660-PLUS D4 v4", "price": "3954.00", "specs": {"socket": "LGA1700", "chipset": "B660", "max_ram": 128, "ram_slots": 4, "pcie_slots": 3}, "fps_gta5": 0, "image_url": "/images/components/motherboard-msi-b760.svg", "category_id": 2, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Motherboard", "stock_quantity": 7}, {"id": 999, "tdp": 225, "name": "NVIDIA RTX 4070 Super 12GB v7", "price": "4372.00", "specs": {"memory": 12, "cuda_cores": 7168, "boost_clock": 2475, "memory_type": "GDDR6X"}, "fps_gta5": 107, "image_url": "/images/components/gpu-rtx4070.svg", "category_id": 3, "fps_warzone": 111, "fps_fortnite": 195, "category_name": "GPU", "stock_quantity": 22}, {"id": 1154, "tdp": 6, "name": "Kingston Fury Beast DDR4-3200 16GB (2x8GB) v2", "price": "165540.00", "specs": {"type": "DDR4", "speed": 3200, "latency": "CL16", "modules": 2, "size_gb": 16}, "fps_gta5": 0, "image_url": "/images/components/ram-corsair-ddr5.svg", "category_id": 4, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "RAM", "stock_quantity": 32}, {"id": 1044, "tdp": 5, "name": "Kingston NV2 1TB NVMe v4", "price": "3367.00", "specs": {"type": "NVMe", "read_speed": 3500, "capacity_gb": 1000, "form_factor": "M.2", "write_speed": 2100}, "fps_gta5": 0, "image_url": "/images/components/ssd-samsung-970.svg", "category_id": 5, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "Storage", "stock_quantity": 36}, {"id": 1069, "tdp": 0, "name": "Cooler Master MWE Gold 750 V2 v5", "price": "7353.00", "specs": {"modular": "Full", "wattage": 750, "efficiency": "80+ Gold", "form_factor": "ATX"}, "fps_gta5": 0, "image_url": "/images/components/psu-corsair-rm750.svg", "category_id": 6, "fps_warzone": 0, "fps_fortnite": 0, "category_name": "PSU", "stock_quantity": 30}]	226731.00	created	auth	13	2025-08-22 19:53:12.021341	2025-08-22 19:53:12.021341	\N	\N
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.reviews (id, user_id, order_id, customer_name, rating, comment, status, admin_comment, order_total, components, created_at, updated_at) FROM stdin;
1	1	2	Администратор Системы	5	Отличный сервис! Быстрая сборка и качественные компоненты. Рекомендую всем!	approved	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
2	4	6	Мария Сидорова	5	Превосходная работа! Компьютер работает отлично, сборка качественная.	approved	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
3	6	9	Елена Новикова	4	Хороший сервис, но можно было бы быстрее. В целом доволен.	approved	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
4	9	12	Анна Морозова	5	Отличный выбор комплектующих и профессиональная сборка!	pending	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
5	3	4	Иван Петров	3	Нормально, но есть задержки в обработке заказа.	pending	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
6	4	7	Мария Сидорова	4	Хороший сервис, но цены немного высокие.	pending	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
7	7	10	Сергей Алексеев	5	Отличная работа! Все сделано качественно и в срок.	pending	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
8	5	8	Алексей Козлов	1	Ужасный сервис! Все плохо!	rejected	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
9	8	11	Ольга Лебедева	2	Не доволен качеством сборки.	rejected	\N	\N	\N	2025-08-15 21:44:11.790777	2025-08-15 21:44:11.790777
\.


--
-- Data for Name: user_carts; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.user_carts (id, user_id, cart_data, created_at, updated_at) FROM stdin;
1	3	[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 8, "name": "Gigabyte B550", "price": 20000, "quantity": 1}]	2025-08-15 21:44:11.791912	2025-08-15 21:44:11.791912
2	4	[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 12, "name": "ASUS ROG Strix Z690", "price": 40000, "quantity": 1}]	2025-08-15 21:44:11.791912	2025-08-15 21:44:11.791912
3	5	[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 16, "name": "MSI MPG B550", "price": 20000, "quantity": 1}]	2025-08-15 21:44:11.791912	2025-08-15 21:44:11.791912
4	6	[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]	2025-08-15 21:44:11.791912	2025-08-15 21:44:11.791912
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.user_sessions (id, user_id, token_hash, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: eda_user
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) FROM stdin;
1	admin@eda.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Администратор	Системы	ADMIN	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
3	ivan@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Иван	Петров	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
4	maria@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Мария	Сидорова	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
5	alex@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Алексей	Козлов	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
6	elena@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Елена	Новикова	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
7	dmitry@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Дмитрий	Волков	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
8	anna@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Анна	Морозова	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
9	sergey@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Сергей	Алексеев	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
10	olga@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Ольга	Лебедева	USER	t	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
11	blocked@example.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Заблокированный	Пользователь	USER	f	2025-08-15 21:44:11.788722	2025-08-15 21:44:11.788722
12	123@123.com	$2a$12$qzfV3oxbK0pq7NQTdI.3quiEFk/xwg8tK2PWSvHp4yTqi2aO/HAj2	123		USER	t	2025-08-15 22:45:40.26589	2025-08-15 22:45:40.26589
2	manager@eda.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Менеджер	Отдела	ADMIN	t	2025-08-15 21:44:11.788722	2025-08-16 08:49:10.375049
13	123@eda.com	$2a$12$cM4onaHFe6/UEnqOXJh7PufC00/4n.lQQ3WWCwzS4Rs043djvereG	123		USER	t	2025-08-21 20:57:03.243184	2025-08-21 20:57:03.243184
\.


--
-- Name: builds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.builds_id_seq', 24, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.components_id_seq', 1224, true);


--
-- Name: order_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.order_comments_id_seq', 16, true);


--
-- Name: order_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.order_logs_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 24, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.reviews_id_seq', 9, true);


--
-- Name: user_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.user_carts_id_seq', 4, true);


--
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eda_user
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: builds builds_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.builds
    ADD CONSTRAINT builds_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);


--
-- Name: order_comments order_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_comments
    ADD CONSTRAINT order_comments_pkey PRIMARY KEY (id);


--
-- Name: order_logs order_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_logs
    ADD CONSTRAINT order_logs_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: user_carts user_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_carts
    ADD CONSTRAINT user_carts_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_components_category; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_components_category ON public.components USING btree (category_id);


--
-- Name: idx_components_price; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_components_price ON public.components USING btree (price);


--
-- Name: idx_order_comments_created_at; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_order_comments_created_at ON public.order_comments USING btree (created_at);


--
-- Name: idx_order_comments_order_id; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_order_comments_order_id ON public.order_comments USING btree (order_id);


--
-- Name: idx_order_comments_user_id; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_order_comments_user_id ON public.order_comments USING btree (user_id);


--
-- Name: idx_order_logs_order; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_order_logs_order ON public.order_logs USING btree (order_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_user; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);


--
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- Name: idx_user_carts_user_id; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_user_carts_user_id ON public.user_carts USING btree (user_id);


--
-- Name: idx_user_sessions_expires_at; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions USING btree (expires_at);


--
-- Name: idx_user_sessions_token_hash; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_user_sessions_token_hash ON public.user_sessions USING btree (token_hash);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: eda_user
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: components components_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: order_comments order_comments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_comments
    ADD CONSTRAINT order_comments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_comments order_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_comments
    ADD CONSTRAINT order_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: order_logs order_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.order_logs
    ADD CONSTRAINT order_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: reviews reviews_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_carts user_carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_carts
    ADD CONSTRAINT user_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eda_user
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

