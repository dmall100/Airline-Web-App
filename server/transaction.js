module.exports = {
    queryInsertBook: `
    INSERT INTO bookings(book_ref, book_date, no_tick,  contact_name, contact_phone, contact_email, status)
        VALUES($1, $2, $3, $4, $5, $6, 'Active');`,  

    queryInsertTick: `
    INSERT INTO ticket
        VALUES($1,$2,$3, $4);`, //trip no == 1 for now, change when set up 

    queryInsertPass: `
    INSERT INTO passenger
        VALUES($1, $2, $3, $4);`,
    
    queryInsertPay: `
    INSERT INTO payment(book_ref, amount_per_tick, num_tickets, credit_card, discount)
        VALUES($1,$2,$3,$4, $5); 
    `,

    queryUpdateAS: `
    UPDATE flights SET seats_booked = seats_booked + 1 ,seats_available = seats_available - 1 WHERE flight_id = $1;
    `
    
}

//REMOVE num_tickets it is dependent on book_ref