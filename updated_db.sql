DROP TABLE IF EXISTS airport CASCADE;

DROP TABLE IF EXISTS boarding_passes CASCADE;

DROP TABLE IF EXISTS seats CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

DROP TABLE IF EXISTS ticket CASCADE;

DROP TABLE IF EXISTS ticket_flights CASCADE;

DROP TABLE IF EXISTS bookings CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE; 

DROP TABLE IF EXISTS payment CASCADE;

DROP TABLE IF EXISTS trip CASCADE;

DROP TABLE IF EXISTS ticket_trips CASCADE;

DROP TABLE IF EXISTS boarding_flight CASCADE;

DROP TABLE IF EXISTS location CASCADE;
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
CREATE TABLE location(
    city_id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL
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

CREATE TABLE bookings (
    book_ref character(6) NOT NULL,
    book_date timestamp WITH time zone NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    class character varying(10) NOT NULL,
    PRIMARY KEY(book_ref),
    CONSTRAINT "payment_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE
);

CREATE TABLE ticket(
    ticket_no char(13) NOT NULL,
    book_ref character(6) NOT NULL,
    passenger_id varchar(20) NOT NULL,
    passenger_name text NOT NULL,
    email char(50),
    phone char(15),
    PRIMARY KEY (ticket_no),
    CONSTRAINT "tickets_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES bookings(book_ref),
    CONSTRAINT "ticket_trips_ticket_no_fkey" FOREIGN KEY (ticket_no) REFERENCES ticket(ticket_no)
);

CREATE TABLE ticket_flights (
    ticket_no character(13) NOT NULL,
    flight_id integer NOT NULL,
    fare_conditions character varying(10) NOT NULL,
    amount numeric(10, 2) NOT NULL,
    PRIMARY KEY (ticket_no, flight_id),
    CONSTRAINT ticket_flights_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    CONSTRAINT ticket_flights_ticket_no_fkey FOREIGN KEY (ticket_no) REFERENCES ticket(ticket_no) ON DELETE CASCADE,
    CONSTRAINT ticket_flights_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT ticket_flights_fare_conditions_check CHECK (
        (
            (fare_conditions)::text = ANY (
                ARRAY [('Economy'::character varying)::text, ('Comfort'::character varying)::text, ('Business'::character varying)::text]
            )
        )
    )
);

CREATE TABLE boarding_passes (
    ticket_no character(13) NOT NULL,
    flight_id integer NOT NULL,
    boarding_no integer NOT NULL,
    seat_no character varying(4) NOT NULL,
    checked_bags integer,
    PRIMARY KEY(ticket_no, flight_id),
    CONSTRAINT boarding_passes_ticket_no_fkey FOREIGN KEY (ticket_no, flight_id) REFERENCES ticket_flights(ticket_no, flight_id)
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
    book_ref character(6) NOT NULL,
    amount_per_tick integer NOT NULL,
    num_tickets integer NOT NULL,
    discount integer,
    PRIMARY KEY (book_ref),
    CONSTRAINT payment_book_ref_fkey FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE
);

CREATE TABLE trip (
    trip_no integer NOT NULL,
    flight_id1 integer NOT NULL,
    flight_id2 integer,
    PRIMARY KEY (trip_no),
    CONSTRAINT "ticket_trips_trip_no_fkey" FOREIGN KEY (trip_no) REFERENCES trip(trip_no) ON DELETE CASCADE
);

CREATE TABLE ticket_trips (
    ticket_no character(13) NOT NULL,
    trip_no integer NOT NULL,
    PRIMARY KEY (ticket_no, trip_no),
    CONSTRAINT ticket_trips_ticket_no_fkey FOREIGN KEY (ticket_no) REFERENCES ticket(ticket_no) ON DELETE CASCADE,
    CONSTRAINT ticket_trips_trip_no_fkey FOREIGN KEY (trip_no) REFERENCES trip(trip_no) ON DELETE CASCADE
);

CREATE TABLE boarding_flight (
    flight_id integer NOT NULL,
    d_boarding_time timestamp WITH time zone NOT NULL,
    d_gate varchar(4),
    a_gate varchar(4),
    baggage_claim integer NOT NULL
);

INSERT INTO LOCATION(city, country) VALUES
    ('Sukhumi ' ,  'Abkhazia ' ), 
    ('Kabul' , 'Afghanistan' ), 
    (  'Episkopi Cantonment ' ,  'Akrotiri and Dhekelia ' ), 
    (  'Tirana ' ,  'Albania ' ), 
    (  'Algiers ' ,  'Algeria ' ), 
    (  'Pago Pago ' ,  'American Samoa ' ), 
    (  'Andorra la Vella ' ,  'Andorra ' ), 
    (  'Luanda ' ,  'Angola ' ), 
    (  'The Valley ' ,  'Anguilla ' ), 
    (  'St. Johns ' ,  'Antigua and Barbuda ' ), 
    (  'Buenos Aires ' ,  'Argentina ' ), 
    (  'Yerevan ' ,  'Armenia ' ), 
    (  'Oranjestad ' ,  'Aruba ' ), 
    (  'Georgetown ' ,  'Ascension Island ' ), 
    (  'Canberra ' ,  'Australia ' ), 
    (  'Vienna ' ,  'Austria ' ), 
    (  'Baku ' ,  'Azerbaijan ' ), 
    (  'Nassau ' ,  'Bahamas ' ), 
    (  'Manama ' ,  'Bahrain ' ), 
    (  'Dhaka ' ,  'Bangladesh ' ), 
    (  'Bridgetown ' ,  'Barbados ' ), 
    (  'Minsk ' ,  'Belarus '  ), 
    (   'Brussels '  ,  'Belgium ' ), 
    (   'Belmopan '  ,  'Belize ' ), 
    (  'Porto-Novo '  ,  'Benin '  ), 
    (   'Hamilton '  ,  'Bermuda ' ), 
    (  'Thimphu '  ,  'Bhutan '  ), 
    (  'Sucre '  ,  'Bolivia '  ), 
    (   'La Paz '  ,  'Bolivia ' ), 
    (  'Sarajevo '  ,  'Bosnia and Herzegovina '  ), 
    (  'Gaborone '  ,  'Botswana '  ), 
    (  'Brasília '  ,  'Brazil '  ), 
    (   'Road Town ' ,  'British Virgin Islands '  ), 
    (  'Bandar Seri Begawan '  ,  'Brunei '  ), 
    (  'Sofia '  ,  'Bulgaria '  ), 
    (   'Ouagadougou '  ,  'Burkina Faso ' ), 
    (  'Bujumbura '  ,  'Burundi '  ), 
    (  'Phnom Penh '  ,  'Cambodia '  ), 
    (  'Yaoundé '  ,  'Cameroon '  ), 
    (   'Ottawa '  ,  'Canada ' ), 
    (  'Praia ' ,  'Cape Verde '   ), 

(  'George Town '  ,  'Cayman Islands '  ), 

(  'Bangui '  ,  'Central African Republic '  ), 

(  'NDjamena '  ,  'Chad '  ), 

(  'Santiago '  ,  'Chile '  ), 

(  'Beijing '  ,  'China '  ), 

(  'Flying Fish Cove ' ,  'Christmas Island '   ), 

(   'West Island '  ,  'Cocos (Keeling) Islands ' ), 

(   'Bogotá '  ,  'Colombia ' ), 

(  'Moroni '  ,  'Comoros '  ), 

(   'Avarua '  ,  'Cook Islands ' ), 

(  'San José '  ,  'Costa Rica '  ), 

(  'Zagreb '  ,  'Croatia '  ), 

(  'Havana '  ,  'Cuba '  ), 

(  'Willemstad '  ,  'Curaçao '  ), 

(   'Nicosia '  ,  'Cyprus ' ), 

(   'Prague '  ,  'Czech Republic ' ), 

(  'Yamoussoukro '  ,  'Côte dIvoire '  ), 

(  'Kinshasa '  ,  'Democratic Republic of the Congo '  ), 

(  'Copenhagen ' ,  'Denmark '   ), 

(  'Djibouti '  ,  'Djibouti '  ), 

(   'Roseau '  ,  'Dominica ' ), 

(   'Santo Domingo '  ,  'Dominican Republic ' ), 

(  'Dili '  ,  'East Timor (Timor-Leste) '  ), 

(  'Hanga Roa '  ,  'Easter Island '  ), 

(  'Quito '  ,  'Ecuador '  ), 

(  'Cairo '  ,  'Egypt '  ), 

(   'San Salvador '  ,  'El Salvador ' ), 

(  'Malabo '  ,  'Equatorial Guinea '  ), 

(   'Asmara '  ,  'Eritrea ' ), 

(  'Tallinn '  ,  'Estonia '  ), 

(  'Addis Ababa '  ,  'Ethiopia '  ), 

(  'Stanley '  ,  'Falkland Islands '  ), 

(  'Tórshavn '  ,  'Faroe Islands '  ), 

(   'Palikir '  ,  'Federated States of Micronesia ' ), 

(   'Suva '  ,  'Fiji ' ), 

(   'Helsinki '  ,  'Finland ' ), 

(   'Paris '  ,  'France ' ), 

(  'Cayenne '  ,  'French Guiana '  ), 

(  'Papeete '  ,  'French Polynesia '  ), 

(  'Libreville '  ,  'Gabon '  ), 

(  'Banjul ' ,  'Gambia '   ), 

(   'Tbilisi '  ,  'Georgia ' ), 

(  'Berlin '  ,  'Germany '  ), 

(  'Accra '  ,  'Ghana '  ), 

(  'Gibraltar '  ,  'Gibraltar '  ), 

(  'Athens '  ,  'Greece '  ), 

(   'Nuuk ' ,  'Greenland '  ), 

(   'St. Georges '  ,  'Grenada ' ), 

(   'Hagåtña '  ,  'Guam ' ), 

(  'Guatemala City ' ,  'Guatemala '   ), 

(  'St. Peter Port '  ,  'Guernsey '  ), 

(  'Conakry '  ,  'Guinea '  ), 

(  'Bissau '  ,  'Guinea-Bissau '  ), 

(  'Georgetown '  ,  'Guyana '  ), 

(  'Port-au-Prince '  ,  'Haiti '  ), 

(  'Tegucigalpa '  ,  'Honduras '  ), 

(  'Budapest '  ,  'Hungary '  ), 

(  'Reykjavík ' ,  'Iceland '   ), 

(   'New Delhi '  ,  'India ' ), 

(  'Jakarta '  ,  'Indonesia '  ), 

(  'Tehran '  ,  'Iran '  ), 

(  'Baghdad '  ,  'Iraq '  ), 

(  'Dublin '  ,  'Ireland ' ), 

(  'Douglas '  ,  'Isle of Man '  ), 

(  'Jerusalem '  ,  'Israel '  ), 

(  'Rome '  ,  'Italy '  ), 

(  'Kingston '  ,  'Jamaica '  ), 

(   'Tokyo '  ,  'Japan ' ), 

(  'St. Helier '  ,  'Jersey '  ), 

(  'Amman '  ,  'Jordan '  ), 

(  'Astana '  ,  'Kazakhstan '  ), 

(  'Nairobi '  ,  'Kenya '  ), 

(  'Tarawa '  ,  'Kiribati '  ), 

(  'Pristina '  ,  'Kosovo '  ), 

(  'Kuwait City '  ,  'Kuwait '  ), 

(  'Bishkek '  ,  'Kyrgyzstan ' ), 

(  'Vientiane '  ,  'Laos ' ), 

(  'Riga '  ,  'Latvia '  ), 

(  'Beirut '  ,  'Lebanon '  ), 

(  'Maseru '  ,  'Lesotho '  ), 

(  'Monrovia '  ,  'Liberia '  ), 

(   'Tripoli ' ,  'Libya '  ), 

(   'Vaduz '  ,  'Liechtenstein ' ), 

(   'Vilnius '  ,  'Lithuania ' ), 

(   'Luxembourg '  ,  'Luxembourg ' ), 

(  'Skopje '  ,  'Macedonia '  ), 

(  'Antananarivo '  ,  'Madagascar '  ), 

(   'Lilongwe '  ,  'Malawi ' ), 

(  'Kuala Lumpur '  ,  'Malaysia '  ), 

(  'Malé '  ,  'Maldives '  ), 

(  'Bamako '  ,  'Mali '  ), 

(  'Valletta '  ,  'Malta '  ), 

(  'Majuro '  ,  'Marshall Islands '  ), 

(  'Nouakchott '  ,  'Mauritania '  ), 

(  'Port Louis '  ,  'Mauritius '  ), 

(   'Mexico City '  ,  'Mexico ' ), 

(  'Chisinau '  ,  'Moldova '  ), 

(   'Monaco ' ,  'Monaco '  ), 

(   'Ulaanbaatar '  ,  'Mongolia ' ), 

(  'Podgorica '  ,  'Montenegro '  ), 

(  'Plymouth '  ,  'Montserrat '  ), 

(  'Rabat '   ,  'Morocco '  ), 

(   'Maputo '  ,  'Mozambique ' ), 

(  'Naypyidaw '  ,  'Myanmar '  ), 

(   'Stepanakert '  ,  'Nagorno-Karabakh Republic ' ), 

(   'Windhoek '  ,  'Namibia ' ), 

(  'Yaren '   ,  'Nauru '  ), 

(  'Kathmandu '  ,  'Nepal '  ), 

(  'Amsterdam '  ,  'Netherlands '  ), 

(  'Nouméa '  ,  'New Caledonia '  ), 

(  'Wellington '  ,  'New Zealand '  ), 

(  'Managua '  ,  'Nicaragua '  ), 

(  'Niamey '  ,  'Niger '  ), 

(  'Abuja '  ,  'Nigeria '  ), 

(  'Alofi '  ,  'Niue '  ), 

(  'Kingston '  ,  'Norfolk Island '  ), 

(  'Pyongyang '  ,  'North Korea '  ), 

(  'Nicosia ' ,  'Northern Cyprus '   ), 

(  'Belfast '  ,  'United Kingdom Northern Ireland '  ), 

(   'Saipan '  ,  'Northern Mariana Islands ' ), 

(  'Oslo '  ,  'Norway '  ), 

(  'Muscat '  ,  'Oman '  ), 

(   'Islamabad '  ,  'Pakistan ' ), 

(  'Ngerulmud '  ,  'Palau '  ), 

(  'Panama City '  ,  'Panama '  ), 

(  'Port Moresby '  ,  'Papua New Guinea '  ), 

(  'Asunción '  ,  'Paraguay '  ), 

(  'Lima '  ,  'Peru '  ), 

(   'Manila '  ,  'Philippines ' ), 

(  'Adamstown '  ,  'Pitcairn Islands '  ), 

(  'Warsaw '  ,  'Poland '  ), 

(  'Lisbon '  ,  'Portugal '  ), 

(  'San Juan '  ,  'Puerto Rico '  ), 

(  'Doha '  ,  'Qatar '  ), 

(  'Taipei '  ,  'Republic of China (Taiwan) '  ), 

(  'Brazzaville '  ,  'Republic of the Congo '  ), 

(  'Bucharest '  ,  'Romania '  ), 

(  'Moscow '  ,  'Russia '  ), 

(  'Kigali '  ,  'Rwanda '  ), 

(  'Gustavia '  ,  'Saint Barthélemy '  ), 

(   'Jamestown '  ,  'Saint Helena ' ), 

(  'Basseterre '  ,  'Saint Kitts and Nevis '  ), 

(  'Castries '  ,  'Saint Lucia '  ), 

(  'Marigot '  ,  'Saint Martin '  ), 

(  'St. Pierre '  ,  'Saint Pierre and Miquelon '  ), 

(   'Kingstown '  ,  'Saint Vincent and the Grenadines ' ), 

(  'Apia '  ,  'Samoa '  ), 

(  'San Marino '  ,  'San Marino '  ), 

(   'Riyadh '  ,  'Saudi Arabia ' ), 

(   'Edinburgh '  ,  'Scotland ' ), 

(  'Dakar '  ,  'Senegal '  ), 

(   'Belgrade '  ,  'Serbia ' ), 

(   'Victoria '  ,  'Seychelles ' ), 

(  'Freetown '  ,  'Sierra Leone ' ), 

(  'Singapore ' ,  'Singapore '   ), 

(  'Philipsburg '  ,  'Sint Maarten '  ), 

(  'Bratislava '  ,  'Slovakia '  ), 

(  'Ljubljana '  ,  'Slovenia '  ), 

(   'Honiara '  ,  'Solomon Islands ' ), 

(  'Mogadishu '  ,  'Somalia '  ), 

(  'Hargeisa '   ,  'Somaliland '  ), 

(   'Pretoria '  ,  'South Africa ' ), 

(  'Grytviken '  ,  'South Georgia and the South Sandwich Islands '  ), 

(   'Seoul '  ,  'South Korea ' ), 

(   'Tskhinvali '  ,  'South Ossetia ' ), 

(  'Juba '  ,  'South Sudan '  ), 

(  'Madrid '  ,  'Spain '  ), 

(  'Sri Jayawardenapura Kotte '  ,  'Sri Lanka '  ), 

(  'Khartoum '  ,  'Sudan '  ), 

(  'Paramaribo '  ,  'Suriname '  ), 

(  'Mbabane '  ,  'Swaziland '  ), 

(  'Stockholm '  ,  'Sweden '  ), 

(  'Bern '  ,  'Switzerland '  ), 

(  'Damascus '  ,  'Syria '  ), 

(  'São Tomé '  ,  'São Tomé and Príncipe '  ), 

(  'Dushanbe '  ,  'Tajikistan '  ), 

(  'Dodoma '  ,  'Tanzania '  ), 

(  'Bangkok '  ,  'Thailand '  ), 

(  'Lomé '  ,  'Togo '  ), 

(   'Nukuʻalofa '  ,  'Tonga ' ), 

(  'Tiraspol '  ,  'Transnistria '  ), 

(  'Port of Spain '  ,  'Trinidad and Tobago '  ), 

(  'Edinburgh of the Seven Seas '  ,  'Tristan da Cunha '  ), 

(  'Tunis '  ,  'Tunisia '  ), 

(  'Ankara '  ,  'Turkey '  ), 

(   'Ashgabat '  ,  'Turkmenistan ' ), 

(   'Cockburn Town '  ,  'Turks and Caicos Islands ' ), 

(  'Funafuti '  ,  'Tuvalu '  ), 

(  'Kampala '  ,  'Uganda '  ), 

(  'Kiev '  ,  'Ukraine '  ), 

(  'Abu Dhabi '  ,  'United Arab Emirates '  ), 

(   'London '  ,  'United Kingdom ' ), 

(   'Washington  D.C. '  ,  'United States ' ), 

(  'Charlotte Amalie ' ,  'United States Virgin Islands '   ), 

(  'Montevideo '  ,  'Uruguay '  ), 

(  'Tashkent '  ,  'Uzbekistan '  ), 

(  'Port Vila ' ,  'Vanuatu '   ), 

(  'Vatican City '  ,  'Vatican City '  ), 

(   'Caracas '  ,  'Venezuela ' ), 

(   'Hanoi '  ,  'Vietnam ' ), 

(   'Cardiff '  ,  'Wales ' ), 

(  'Mata-Utu ' ,  'Wallis and Futuna '   ), 

(  'El Aaiún ' ,  'Western Sahara '   ), 

(  'Sanaá '   ,  'Yemen '  ), 

(  'Lusaka '  ,  'Zambia '  ), 

(  'Harare '  ,  'Zimbabwe '  )
; 

/* INSERT VALUES */
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