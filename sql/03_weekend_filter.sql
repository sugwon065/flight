-- 주말 포함 vs 평일 여행 비용 비교

WITH total_cost AS (
    SELECT
        f.departure_date,
        f.destination,
        f.airline_name,
        f.airline_type,
        f.price + (h.avg_price_per_night * 3) + MIN(t.price) AS total_cost_3nights,
        f.is_weekend,
        f.is_peak_season
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
        f.is_weekend, f.is_peak_season
)
SELECT
    destination,
    is_weekend,
    ROUND(AVG(total_cost_3nights), 0) AS avg_total_cost,
    ROUND(MIN(total_cost_3nights), 0) AS min_total_cost,
    ROUND(MAX(total_cost_3nights), 0) AS max_total_cost,
    COUNT(*)                          AS date_count
FROM total_cost
GROUP BY destination, is_weekend
ORDER BY destination, is_weekend
