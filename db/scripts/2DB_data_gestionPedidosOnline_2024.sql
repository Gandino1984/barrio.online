USE `DB_gestionPedidosOnline_2024`;

INSERT INTO `user` (`name_user`, `pass_user`, `location_user`, `type_user`) VALUES
('german andino', '0000', 'Uribarri', 'user'),
('german andino 2', '0000', 'Uribarri', 'seller'),
('MikelLandaburu', '0000', 'Matiko', 'seller'),
('AitorUrizar', '9012', 'Ciudad Jardin', 'provider'),
('GaixkaArtetxe', '4567', 'Arabella', 'user'),
('MirenAguirre', '7890', 'Uribarri', 'seller'),
('JonSalaverria', '2345', 'Matiko', 'provider'),
('AmaliaArregi', '6789', 'Ciudad Jardin', 'user'),
('AsierEtxebarria', '3456', 'Arabella', 'seller'),
('BlancaGomez', '8901', 'Uribarri', 'provider'),
('MikelZubiaurre', '5678', 'Matiko', 'user'),
('IdoiaElorriaga', '2109', 'Ciudad Jardin', 'seller'),
('EnekoBeitia', '7654', 'Arabella', 'provider'),
('MariaIbarretxe', '3210', 'Uribarri', 'user'),
('JuleneOlazabal', '9876', 'Matiko', 'seller'),
('XabierLaskibar', '4321', 'Ciudad Jardin', 'provider'),
('AneInza', '6543', 'Arabella', 'user'),
('IkerAgirre', '2198', 'Uribarri', 'seller'),
('LarraitzUranga', '7532', 'Matiko', 'provider'),
('MartaEtxeberria', '4567', 'Ciudad Jardin', 'user'),
('PaulaAranguren', '8901', 'Arabella', 'seller');

-- Insert products since they're referenced by orders, sales, and produce
INSERT INTO `product` (`name_product`, `price_product`, `discount_product`, `season_product`, `calification_product`, `id_shop`, `type_product`, `stock_product`, `info_product`) VALUES
('Organic Apples', 2.99, 0, 'Fall', 4, 1, 'Apple', 100, 'Organic apples are fresh and delicious'),
('Fresh Bread', 3.50, 10, 'All Year', 5, 2, 'Bread', 50, 'Freshly baked bread is perfect for breakfast'),
('Summer Shorts', 29.99, 20, 'Summer', 3, 3, 'Shorts', 100, 'Lightweight and comfortable summer shorts'),
('Winter Jacket', 89.99, 0, 'Winter', 5, 3, 'Jacket', 50, 'Warm and stylish winter jacket'),
('Spring Seeds', 4.99, 15, 'Spring', 4, 1, 'Seeds', 100, 'Healthy and nutritious spring seeds');

-- Insert providers since they're referenced by buys and produce
INSERT INTO `provider` (`name_provider`, `location_provider`, `pass_provider`) VALUES
('Fresh Farms Inc', 'California', SHA2('prov123', 256)),
('Textile Mills', 'Oregon', SHA2('prov456', 256)),
('Garden Supply Co', 'Washington', SHA2('prov789', 256)),
('Fashion Wholesale', 'New York', SHA2('prov321', 256)),
('Organic Foods Ltd', 'Vermont', SHA2('prov654', 256));

INSERT INTO `shop` (`name_shop`, `location_shop`, `type_shop`, `id_user`, `calification_shop`) VALUES
('Frutas Uribarri', 'Uribarri', 'Fruteria', 2, 4),
('Carnes del Barrio', 'Matiko', 'Carniceria', 4, 5),
('Mar y Tierra', 'Ciudad Jardin', 'Pescaderia', 2, 3),
('El Rincón Verde', 'Arabella', 'Fruteria', 4, 4),
('Bistro Sabores', 'Uribarri', 'Restaurante', 3, 5),
('Txoko Goxoa', 'Matiko', 'Bar', 4, 4),
('Pescados Frescos', 'Ciudad Jardin', 'Pescaderia', 2, 4),
('Cortes Selectos', 'Arabella', 'Carniceria', 4, 5),
('Peluquería Estilo', 'Uribarri', 'Peluquería', 2, 3),
('Ultramarinos Euskal', 'Matiko', 'General', 4, 4),
('Frutas y Verduras Miren', 'Ciudad Jardin', 'Fruteria', 2, 5),
('Carnicería Tradicional', 'Arabella', 'Carniceria', 4, 3),
('Taberna Vasca', 'Uribarri', 'Bar', 2, 4),
('Pescadería Kantauri', 'Matiko', 'Pescaderia', 4, 5),
('Gastrobar Uribarri', 'Ciudad Jardin', 'Restaurante', 2, 4),
('Peluquería Txikia', 'Arabella', 'Peluquería', 4, 3),
('Frutería Lore', 'Uribarri', 'Fruteria', 2, 5),
('Merkatu Txiki', 'Matiko', 'General', 4, 4),
('Restaurante Sabor', 'Ciudad Jardin', 'Restaurante', 2, 4),
('Carnes Premium', 'Arabella', 'Carniceria', 3, 5);

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