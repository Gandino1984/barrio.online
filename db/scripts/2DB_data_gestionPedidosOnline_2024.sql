USE `DB_gestionPedidosOnline_2024`;

-- Insert users first since they're referenced by shops and orders
INSERT INTO `user` (`name_user`, `pass_user`, `location_user`, `type_user`) VALUES
('John Doe', SHA2('pass123', 256), 'New York', 'customer'),
('Jane Smith', SHA2('pass456', 256), 'Los Angeles', 'seller'),
('Admin User', SHA2('admin789', 256), 'Chicago', 'admin'),
('Mary Johnson', SHA2('pass321', 256), 'Houston', 'seller'),
('BobWilson', '1234', 'Miami', 'customer');

-- Insert products since they're referenced by orders, sales, and produce
INSERT INTO `product` (`name_product`, `price_product`, `discount_product`, `season_product`, `calification_product`) VALUES
('Organic Apples', 2.99, 0, 'Fall', 4),
('Fresh Bread', 3.50, 10, 'All Year', 5),
('Summer Shorts', 29.99, 20, 'Summer', 3),
('Winter Jacket', 89.99, 0, 'Winter', 5),
('Spring Seeds', 4.99, 15, 'Spring', 4);

-- Insert providers since they're referenced by buys and produce
INSERT INTO `provider` (`name_provider`, `location_provider`, `pass_provider`) VALUES
('Fresh Farms Inc', 'California', SHA2('prov123', 256)),
('Textile Mills', 'Oregon', SHA2('prov456', 256)),
('Garden Supply Co', 'Washington', SHA2('prov789', 256)),
('Fashion Wholesale', 'New York', SHA2('prov321', 256)),
('Organic Foods Ltd', 'Vermont', SHA2('prov654', 256));

-- Insert shops since they're referenced by sales and buys
INSERT INTO `shop` (`name_shop`, `location_shop`, `type_shop`, `id_user`, `calification_shop`) VALUES
('Fresh Market', 'Boston', 'Fruteria', 2, 4),
('Organic Paradise', 'Seattle', 'Organic', 4, 5),
('Super Foods', 'Denver', 'Supermarket', 2, 3),
('Green Grocers', 'Portland', 'Fruteria', 4, 4),
('Mega Mart', 'Phoenix', 'Supermarket', 2, 4);

-- Insert orders
INSERT INTO `orders` (`id_user`, `id_product`, `delivery_date`, `finished`) VALUES
(1, 1, '2024-11-20 14:00:00', 0),
(5, 2, '2024-11-21 15:30:00', 1),
(1, 3, '2024-11-22 10:00:00', 0),
(5, 4, '2024-11-23 16:45:00', 1),
(1, 5, '2024-11-24 11:15:00', 0);

-- Insert sales
INSERT INTO `sales` (`id_shop`, `id_user`, `id_product`, `sale_date`) VALUES
(1, 1, 1, '2024-11-18 09:30:00'),
(2, 5, 2, '2024-11-18 10:45:00'),
(3, 1, 3, '2024-11-18 13:15:00'),
(4, 5, 4, '2024-11-18 14:30:00'),
(5, 1, 5, '2024-11-18 16:00:00');

-- Insert buys
INSERT INTO `buys` (`id_shop`, `id_provider`) VALUES
(1, 1),
(2, 5),
(3, 3),
(4, 2),
(5, 4);

-- Insert produce
INSERT INTO `produce` (`id_provider`, `id_product`) VALUES
(1, 1),
(5, 2),
(3, 5),
(2, 3),
(4, 4);