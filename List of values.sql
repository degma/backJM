--Eqiupos
INSERT INTO public."Equipos" (nombre,activo) values ('Urquiza', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Jujuy', true);
INSERT INTO public."Equipos" (nombre,activo) values ('La Rioja', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Malvinas', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Santa Fe', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Casanova', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Refugio Lopez', true);
INSERT INTO public."Equipos" (nombre,activo) values ('El Soberbio', true);
INSERT INTO public."Equipos" (nombre,activo) values ('La Toma', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Mar del Plata', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Tucumán', true);
INSERT INTO public."Equipos" (nombre,activo) values ('La Lucila', true);
INSERT INTO public."Equipos" (nombre,activo) values ('Bariloche', true);

--Partidos
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (12, 1, '2019-03-22', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (4, 2, '2019-03-30', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (10, 3, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (11, 4, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (7, 5, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (14, 6, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (3, 7, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (8, 8, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (6, 9, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (5, 10, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (9, 11, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (1, 12, '2019-04-06', 1, true, 0);
INSERT INTO public."Partidos" (id_equipo, nro, fecha_partido, id_torneo, activo, estado) values (13, 13, '2019-04-06', 1, true, 0);

INSERT INTO public."Torneos" (nombre, activo) values ('Torneo Inicial 2019 - Libres A', true);

--Queries
