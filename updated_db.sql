DROP TABLE IF EXISTS airport CASCADE;

DROP TABLE IF EXISTS boarding_passes CASCADE;

DROP TABLE IF EXISTS seats CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

DROP TABLE IF EXISTS ticket CASCADE;

DROP TABLE IF EXISTS ticket_flights CASCADE;

DROP TABLE IF EXISTS bookings CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE; 

DROP TABLE IF EXISTS passenger CASCADE; 

DROP TABLE IF EXISTS payment CASCADE;

DROP TABLE IF EXISTS trips CASCADE;


DROP TABLE IF EXISTS boarding_flight CASCADE;

/*create tables*/
CREATE TABLE aircraft(
    aircraft_code char(3),
    model char(25),
    RANGE integer,
    meal boolean,
    movie boolean,
    PRIMARY KEY(aircraft_code),
    CONSTRAINT "flights_aircraft_code_fkey" FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code),
    CONSTRAINT "seats_aircraft_code_fkey" FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code) ON DELETE CASCADE
);

CREATE TABLE airport (
    airport_code char(3) NOT NULL,
    airport_name char(40),
    city_id SERIAL,
    coordinates point,
    timezone VARCHAR(20),
    PRIMARY KEY (airport_code),
    CONSTRAINT "city_country" FOREIGN KEY (city_id)
    REFERENCES location(city_id) ON DELETE CASCADE
);

CREATE TABLE flights (
    flight_id integer NOT NULL,
    flight_no character(6) NOT NULL,
    scheduled_departure timestamp WITH time zone NOT NULL,
    scheduled_arrival timestamp WITH time zone NOT NULL,
    departure_airport character(3) NOT NULL,
    arrival_airport character(3) NOT NULL,
    STATUS character varying(20) NOT NULL,
    aircraft_code character(3) NOT NULL,
    seats_available integer NOT NULL,
    seats_booked integer NOT NULL,
    PRIMARY KEY (flight_id),
    CONSTRAINT flights_aircraft_code_fkey FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code) ON DELETE CASCADE,
    CONSTRAINT flights_arrival_airport_fkey FOREIGN KEY (arrival_airport) REFERENCES airport(airport_code) ON DELETE CASCADE,
    CONSTRAINT flights_departure_airport_fkey FOREIGN KEY (departure_airport) REFERENCES airport(airport_code) ON DELETE CASCADE,
    CONSTRAINT flights_check CHECK ((scheduled_arrival > scheduled_departure)),
    /*
     CONSTRAINT flights_check1 CHECK (
         (
             (actual_arrival IS NULL)
             OR (
                 (actual_departure IS NOT NULL)
                 AND (actual_arrival IS NOT NULL)
                 AND (actual_arrival > actual_departure)
             )
         )
     ),
     */
    CONSTRAINT flights_status_check CHECK (
        (
            (STATUS)::text = ANY (
                ARRAY [('On Time'::character varying)::text, ('Delayed'::character varying)::text, ('Departed'::character varying)::text, ('Arrived'::character varying)::text, ('Scheduled'::character varying)::text, ('Cancelled'::character varying)::text]
            )
        )
    )
);


CREATE TABLE trips (
    trip_no SERIAL PRIMARY KEY,
    flight_id1 integer NOT NULL,
    flight_id2 integer NOT NULL,
    CONSTRAINT trips_flight_id1_fkey FOREIGN KEY (flight_id1) REFERENCES flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT trips_flight_id2_fkey FOREIGN KEY (flight_id2) REFERENCES flights(flight_id) ON DELETE CASCADE
);






CREATE TABLE bookings (
    book_ref CHAR(6) PRIMARY KEY,
    book_date timestamp WITH time zone NOT NULL,
    no_tick integer NOT NULL, 
    contact_name text NOT NULL, 
    contact_phone VARCHAR(10) NOT NULL,
    contact_email text NOT NULL,
    STATUS character varying(10) NOT NULL
);




CREATE TABLE passenger(
    passenger_id VARCHAR(20) NOT NULL,
    passenger_name text NOT NULL,
    passenger_DOB TIMESTAMP NOT NULL, 
    passenger_nation char(20) NOT NULL,
    PRIMARY KEY (passenger_id)
);

CREATE TABLE ticket(
    ticket_no char(13) NOT NULL,
    book_ref CHAR(6) NOT NULL,
    passenger_id VARCHAR(20) NOT NULL,
    trip_no SERIAL NOT NULL, 
    PRIMARY KEY (ticket_no),
    CONSTRAINT "ticket_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE,
    CONSTRAINT "ticket_trip_no_fkey" FOREIGN KEY (trip_no) REFERENCES trips(trip_no) ON DELETE CASCADE,
    CONSTRAINT "ticket_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id) ON DELETE CASCADE
);


CREATE TABLE boarding_passes (
    boarding_no SERIAL PRIMARY KEY,
    flight_id integer NOT NULL,
    seat_no character varying(4) NOT NULL,
    checked_bags integer,
    meal character varying(10), 
    CONSTRAINT boarding_passes_ticket_no_fkey FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE 
);

CREATE TABLE seats (
    aircraft_code character(3) NOT NULL,
    seat_no character varying(4) NOT NULL,
    fare_conditions character varying(10) NOT NULL,
    PRIMARY KEY (aircraft_code, seat_no),
    CONSTRAINT seats_aircraft_code_fkey FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code) ON DELETE CASCADE,
    CONSTRAINT seats_fare_conditions_check CHECK (
        (
            (fare_conditions)::text = ANY (
                ARRAY [('Economy'::character varying)::text, ('Comfort'::character varying)::text, ('Business'::character varying)::text]
            )
        )
    )
);

CREATE TABLE payment (
    payment_num SERIAL PRIMARY KEY, 
    book_ref CHAR(6) NOT NULL,
    amount_per_tick integer NOT NULL,
    num_tickets integer NOT NULL,
    credit_card VARCHAR(16) NOT NULL, 
    discount integer,
    CONSTRAINT payment_book_ref_fkey FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE
);



CREATE TABLE boarding_flight (
    flight_id integer NOT NULL,
    d_boarding_time timestamp WITH time zone NOT NULL,
    d_gate varchar(4),
    a_gate varchar(4),
    baggage_claim varchar(3) NOT NULL, 
    CONSTRAINT boarding_flight_flight_if_fkey FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

/*airport table */
INSERT INTO airport
VALUES (
        'RUH',
        'King Khaled International',
        '190',
        NULL,
        'UTC+03:00'
    );

INSERT INTO airport
VALUES (
        'DCA',
        'Dulles International Airport',
        '234',
        NULL,
        'UTC-05:00'
    );

INSERT INTO airport
VALUES (
        'MAD',
        'Madrid International Airport',
        '208',
        NULL,
        'UTC+01:00'
    );

INSERT INTO airport
VALUES (
        'ARN',
        'Stockholm Arlanda Airport',
        '213', 
        NULL, 
        'UTC+01:00'
    );

INSERT INTO airport
VALUES (
        'TLV',
        'Ben Gurion Airport', 
        '106',
        NULL, 
        'UTC+02:00'
    );

/*aircraft*/
INSERT INTO aircraft
VALUES ('773', 'Boeing 777-300', 11100, TRUE, TRUE);

INSERT INTO aircraft
VALUES ('763', 'Boeing 767-300', 7900, TRUE, TRUE);

INSERT INTO aircraft
VALUES ('SU9', 'Boeing 777-300', 5700, FALSE, FALSE);

INSERT INTO aircraft
VALUES ('320', 'Boeing 777-300', 6400, FALSE, TRUE);

INSERT INTO aircraft
VALUES ('321', 'Boeing 777-300', 6100, FALSE, TRUE);



/*flights table*/
INSERT INTO flights
VALUES (
        1001,
        'PG0010',
        '2020-11-10 09:50:00+03',
        '2020-11-10 14:55:00+03',
        'DCA',
        'MAD',
        'Scheduled',
        '773',
        50,
        0
    );

INSERT INTO flights
VALUES (
        1002,
        'PG0020',
        '2020-11-11 09:50:00+03',
        '2020-11-11 15:55:00+03',
        'MAD',
        'RUH',
        'Scheduled',
        '763',
        50,
        0
    );

INSERT INTO flights
VALUES (
        1003,
        'PG0030',
        '2020-11-11 09:50:00+03',
        '2020-11-11 16:55:00+03',
        'DCA',
        'ARN',
        'Scheduled',
        'SU9',
        50,
        0
    );

INSERT INTO flights
VALUES (
        1004,
        'PG0040',
        '2020-11-12 09:50:00+03',
        '2020-11-12 12:55:00+03',
        'ARN',
        'DCA',
        'Scheduled',
        '320',
        50,
        0
    );

INSERT INTO flights
VALUES (
        1005,
        'PG0050',
        '2020-11-12 09:50:00+03',
        '2020-11-12 12:55:00+03',
        'RUH',
        'TLV',
        'Scheduled',
        '321',
        50,
        0
    );

INSERT INTO flights
VALUES (
    1006,
    'PG0060',
    '2020-11-13 09:50:00+03',
    '2020-11-13 12:55:00+03',
    'TLV',
    'DCA',
    'Scheduled',
    '773',
    50,
    0
);

INSERT INTO flights 
VALUES (
        1007,
        'PG0070',
        '2020-11-14 09:50:00+03',
        '2020-11-14 12:55:00+03',
        'RUH',
        'MAD',
        'Scheduled',
        '763',
        50,
        0
    );

INSERT INTO trips(flight_id1, flight_id2)
VALUES(1001, 1002); 


INSERT INTO trips(flight_id1, flight_id2)
VALUES(1005,1006);


