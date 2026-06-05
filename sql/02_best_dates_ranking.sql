-- 총 비용 기준 최저 날짜 조합 랭킹 (3박 4일 기준)

WITH total_cost AS (
    SELECT
        f.departure_date,
        f.destination,
        f.airline_name,
        f.airline_type,
        f.price                                               AS flight_price,
        h.avg_price_per_night                                 AS hotel_price_per_night,
        MIN(t.price)                                          AS min_transport_price,
        f.price + (h.avg_price_per_night * 3) + MIN(t.price) AS total_cost_3nights,
        f.is_weekend,
        f.is_peak_season,
        f.month
    FROM `flight-analysis-2026.flight_analysis.flights` f
    LEFT JOIN `flight-analysis-2026.flight_analysis.hotels` h
        ON f.departure_date = h.date
        AND f.destination   = h.destination
    LEFT JOIN `flight-analysis-2026.flight_analysis.transportation` t
        ON f.destination = t.destination
    WHERE t.airport_to_city = TRUE
    GROUP BY
        f.departure_date, f.destination, f.airline_name,
        f.airline_type, f.price, h.avg_price_per_night,
        f.is_weekend, f.is_peak_season, f.month
)
SELECT
    departure_date,
    destination,
    airline_name,
    airline_type,
    flight_price,
    hotel_price_per_night,
    min_transport_price,
    total_cost_3nights,
    is_weekend,
    is_peak_season,
    month,
    RANK() OVER (
        PARTITION BY destination
        ORDER BY total_cost_3nights ASC
    ) AS cost_rank
FROM total_cost
ORDER BY destination, cost_rank
