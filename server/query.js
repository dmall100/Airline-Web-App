module.exports = {
    queryGetFlights: `SELECT *, lD.city as departure_city, lA.city as arrival_city
    FROM 
    (
      SELECT *, A.city_id AS a_city_id, D.city_id AS d_city_id 
      FROM flights AS F
      INNER JOIN 
      airport AS D
      on F.departure_airport = D.airport_code
      INNER JOIN
      airport As A
      on arrival_airport = A.airport_code
    ) B
    INNER JOIN 
    location AS lD
    on B.d_city_id = lD.city_id
    INNER JOIN 
    location AS lA
    on B.a_city_id = lA.city_id`, 

    queryGetTrips1: `SELECT trip_no, flight_id1,  f1_scheduled_departure, f1_departure_city, f1_scheduled_arrival, f1_arrival_city, flight_id2, f2_scheduled_departure, f2_departure_city, f2_scheduled_arrival, f2_arrival_city FROM trips T
    JOIN 
    (SELECT *, scheduled_departure as f1_scheduled_departure,scheduled_arrival as f1_scheduled_arrival , lD.city as f1_departure_city, lA.city as f1_arrival_city
      FROM 
      (
        SELECT *, A.city_id AS f1_a_city_id, D.city_id AS f1_d_city_id 
        FROM flights AS F
        INNER JOIN 
        airport AS D
        on F.departure_airport = D.airport_code
        INNER JOIN
        airport As A
        on arrival_airport = A.airport_code
      ) B
      INNER JOIN 
      location AS lD
      on B.f1_d_city_id = lD.city_id
      INNER JOIN 
      location AS lA
      on B.f1_a_city_id = lA.city_id
      WHERE seats_available >= $1 ) K
    ON K.flight_id = T.flight_id1
    JOIN
      (SELECT *, lD.city as f2_departure_city, lA.city as f2_arrival_city
        FROM 
        (
        SELECT *, scheduled_departure as f2_scheduled_departure,scheduled_arrival as f2_scheduled_arrival,  A.city_id AS f2_a_city_id, D.city_id AS f2_d_city_id 
        FROM flights AS F
        INNER JOIN 
        airport AS D
        on F.departure_airport = D.airport_code
        INNER JOIN
        airport As A
        on arrival_airport = A.airport_code
      ) AS B
      INNER JOIN 
      location AS lD
      on B.f2_d_city_id = lD.city_id
      INNER JOIN 
      location AS lA
      on f2_a_city_id = lA.city_id
      WHERE seats_available >= $1 ) K1
    ON K1.flight_id = T.flight_id2
    `,
    queryGetTrip:`SELECT trip_no, flight_id1,  f1_scheduled_departure, f1_departure_city, f1_d_city_id, f1_scheduled_arrival, f1_arrival_city, f1_a_city_id, flight_id2, f2_scheduled_departure, f2_departure_city, f2_d_city_id, f2_scheduled_arrival, f2_arrival_city, f2_a_city_id FROM trips T
    JOIN 
    (SELECT *,  scheduled_departure as f1_scheduled_departure,scheduled_arrival as f1_scheduled_arrival , lD.city as f1_departure_city, lA.city as f1_arrival_city
      FROM 
      (
        SELECT *, A.city_id AS f1_a_city_id, D.city_id AS f1_d_city_id 
        FROM flights AS F
        INNER JOIN 
        airport AS D
        on F.departure_airport = D.airport_code
        INNER JOIN
        airport As A
        on arrival_airport = A.airport_code
      ) B
      INNER JOIN 
      location AS lD
      on B.f1_d_city_id = lD.city_id
      INNER JOIN 
      location AS lA
      on B.f1_a_city_id = lA.city_id
      WHERE seats_available >= $1 ) K
    ON K.flight_id = T.flight_id1
    JOIN
      (SELECT *, lD.city as f2_departure_city, lA.city as f2_arrival_city
        FROM 
        (
        SELECT *, scheduled_departure as f2_scheduled_departure,scheduled_arrival as f2_scheduled_arrival,  A.city_id AS f2_a_city_id, D.city_id AS f2_d_city_id 
        FROM flights AS F
        INNER JOIN 
        airport AS D
        on F.departure_airport = D.airport_code
        INNER JOIN
        airport As A
        on arrival_airport = A.airport_code
      ) AS B
      INNER JOIN 
      location AS lD
      on B.f2_d_city_id = lD.city_id
      INNER JOIN 
      location AS lA
      on f2_a_city_id = lA.city_id
      WHERE seats_available >= $1 ) K1
    ON K1.flight_id = T.flight_id2
     WHERE f1_d_city_id = $2 and (f2_a_city_id = $3 or f1_a_city_id = $3)`
        }