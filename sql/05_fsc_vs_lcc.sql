-- FSC vs LCC 노선별 가격 비교 및 절감액 분석

SELECT
    destination,
    airline_type,
    ROUND(AVG(price), 0)         AS avg_flight_price,
    ROUND(MIN(price), 0)         AS min_flight_price,
    ROUND(MAX(price), 0)         AS max_flight_price,
    COUNT(DISTINCT airline_name) AS airline_count
FROM `flight-analysis-2026.flight_analysis.flights`
GROUP BY destination, airline_type
ORDER BY destination, airline_type
