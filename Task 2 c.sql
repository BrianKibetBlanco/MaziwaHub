USE MaziwaHubSchema;

SELECT
    f.FarmerNo,
    f.FarmerName,
    SUM(d.Litres) AS Total_Litres,
    SUM(d.Amount) AS Total_Amount
FROM Farmers f
JOIN Deliveries d
    ON f.FarmerNo = d.FarmerNo
WHERE d.DeliveryDate >= '2026-10-01'
  AND d.DeliveryDate < '2026-11-01'
GROUP BY f.FarmerNo, f.FarmerName;