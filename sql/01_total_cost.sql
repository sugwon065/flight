-- 날짜별 목적지별 총 여행 비용 계산 (항공 + 숙박 × 여행일수 + 교통)

SELECT
    f.departure_date,
    f.destination,
    f.airline_name,
    f.airline_type,
    f.price                                               AS flight_price,
    h.avg_price_per_night                                 AS hotel_price_per_night,
    t.price                                               AS transport_price,
    t.transport_type,
    f.is_weekend,
    f.is_peak_season,
    f.month,
    f.price + (h.avg_price_per_night * 2) + t.price      AS total_cost_2nights,
    f.price + (h.avg_price_per_night * 3) + t.price      AS total_cost_3nights,
    f.price + (h.avg_price_per_night * 4) + t.price      AS total_cost_4nights

FROM `flight-analysis-2026.flight_analysis.flights` f
LEFT JOIN `flight-analysis-2026.flight_analysis.hotels` h
    ON f.departure_date = h.date
    AND f.destination   = h.destination
LEFT JOIN `flight-analysis-2026.flight_analysis.transportation` t
    ON f.destination = t.destination
WHERE t.airport_to_city = TRUE
