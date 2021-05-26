
CREATE SCHEMA Sample;
GO

CREATE TABLE CustomSales (  
    OrderId int,  
    AppUserId int,  
    Product varchar(10),  
    Qty int,
    OrgId varchar(10),
    Department varchar(10)
);  
INSERT CustomSales VALUES
    (1, 1, 'Valve', 5, 'org1', 'D1'),
    (2, 1, 'Wheel', 2, 'org2', 'D1'),
    (3, 1, 'Valve', 4, 'org1', 'D2'),  
    (4, 2, 'Bracket', 2, 'org1', 'D2'),
    (5, 2, 'Wheel', 5, 'org2', 'D2'),
    (6, 2, 'Seat', 5, 'org1', 'D1');  


CREATE TABLE Sample.Sales  
    (  
    OrderID int,  
    Product varchar(10),  
    Qty int 
    );

INSERT INTO Sample.Sales VALUES (1, 'Valve', 5);
INSERT INTO Sample.Sales VALUES (2, 'Wheel', 2);
INSERT INTO Sample.Sales VALUES (3, 'Valve', 4);
INSERT INTO Sample.Sales VALUES (4, 'Bracket', 2);
INSERT INTO Sample.Sales VALUES (5, 'Wheel', 5);
INSERT INTO Sample.Sales VALUES (6, 'Seat', 5);

CREATE TABLE Sample.Lk_Salesman_Product
  ( Salesrep varchar(10), 
    Product varchar(10)
  ) ;

INSERT INTO Sample.Lk_Salesman_Product VALUES ('1', 'Valve');
INSERT INTO Sample.Lk_Salesman_Product VALUES ('2', 'Wheel');