SELECT
    c.CentreName,
    COUNT(d.DeliveryID) AS Total_Deliveries
FROM Centres c
LEFT JOIN Deliveries d
    ON c.CentreID = d.CentreID
GROUP BY c.CentreID, c.CentreName;