-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/S9iPLh
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Jugadores" (
    "id" serial   NOT NULL,
    "nombre" varchar   NOT NULL,
    "apellido" varchar   NOT NULL,
    "apodo" varchar   NOT NULL,
    "dni" int   NOT NULL,
    "fecha_nac" date   NOT NULL,
    "nrosocio" int   NOT NULL,
    "celular" int   NOT NULL,
    "camiseta" int   NOT NULL,
    "posicion" varchar   NOT NULL,
    "fecha_creacion" timestamp   NOT NULL,
    "activo" boolean   NOT NULL,
    CONSTRAINT "pk_Jugadores" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Movimientos" (
    "id" serial   NOT NULL,
    "id_jugador" int   NOT NULL,
    "id_partido" int   NOT NULL,
    "id_operacion" int   NOT NULL,
    "importe" float   NOT NULL,
    "comentarios" text   NOT NULL,
    CONSTRAINT "pk_Movimientos" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Operaciones" (
    "id" serial   NOT NULL,
    "tipo" text   NOT NULL,
    "descripcion" text   NOT NULL,
    CONSTRAINT "pk_Operaciones" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Partidos" (
    "id" serial   NOT NULL,
    "id_equipo" int   NOT NULL,
    "nro" int   NOT NULL,
    "fecha_partido" date   NOT NULL,
    "id_torneo" int   NOT NULL,
    "activo" boolean   NOT NULL,
    "estado" int   NOT NULL,
    CONSTRAINT "pk_Partidos" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Torneos" (
    "id" serial   NOT NULL,
    "nombre" text   NOT NULL,
    "activo" boolean   NOT NULL,
    CONSTRAINT "pk_Torneos" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Equipos" (
    "id" serial   NOT NULL,
    "nombre" text   NOT NULL,
    "activo" boolean   NOT NULL,
    CONSTRAINT "pk_Equipos" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Usuarios" (
    "id" serial   NOT NULL,
    "nombre" text   NOT NULL,
    "email" text   NOT NULL,
    "creado" date   NOT NULL,
    CONSTRAINT "pk_Usuarios" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_Usuarios_email" UNIQUE (
        "email"
    )
);

CREATE TABLE "Login" (
    "id" serial   NOT NULL,
    "hash" text   NOT NULL,
    "email" text   NOT NULL,
    CONSTRAINT "pk_Login" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "Movimientos" ADD CONSTRAINT "fk_Movimientos_id_jugador" FOREIGN KEY("id_jugador")
REFERENCES "Jugadores" ("id");

ALTER TABLE "Movimientos" ADD CONSTRAINT "fk_Movimientos_id_partido" FOREIGN KEY("id_partido")
REFERENCES "Partidos" ("id");

ALTER TABLE "Movimientos" ADD CONSTRAINT "fk_Movimientos_id_operacion" FOREIGN KEY("id_operacion")
REFERENCES "Operaciones" ("id");

ALTER TABLE "Partidos" ADD CONSTRAINT "fk_Partidos_id_equipo" FOREIGN KEY("id_equipo")
REFERENCES "Equipos" ("id");

ALTER TABLE "Partidos" ADD CONSTRAINT "fk_Partidos_id_torneo" FOREIGN KEY("id_torneo")
REFERENCES "Torneos" ("id");

ALTER TABLE "Login" ADD CONSTRAINT "fk_Login_email" FOREIGN KEY("email")
REFERENCES "Usuarios" ("email");

