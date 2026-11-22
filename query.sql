USE MaziwaHubSchema;

-- 1. Create Farmers table
CREATE TABLE Farmers (
    FarmerNo VARCHAR(10) PRIMARY KEY,
    FarmerName VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL
);

-- 2. Create Centres table
CREATE TABLE Centres (
    CentreID INT AUTO_INCREMENT PRIMARY KEY,
    CentreName VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Create Deliveries table
CREATE TABLE Deliveries (
    DeliveryID VARCHAR(10) PRIMARY KEY,
    DeliveryDate DATE NOT NULL,
    FarmerNo VARCHAR(10) NOT NULL,
    CentreID INT NOT NULL,
    Litres DECIMAL(10,2) NOT NULL,
    Rate DECIMAL(10,2) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,

    CONSTRAINT chk_litres CHECK (Litres > 0),

    FOREIGN KEY (FarmerNo)
        REFERENCES Farmers(FarmerNo),

    FOREIGN KEY (CentreID)
        REFERENCES Centres(CentreID)
);

