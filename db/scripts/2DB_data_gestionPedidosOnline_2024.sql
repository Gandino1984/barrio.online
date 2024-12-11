-- Insert Users with different types
INSERT INTO `user` (name_user, pass_user, location_user, type_user, id_shop) VALUES
    ('German Andino', '0000', 'Valencia', 'user', 1),
    ('German Andino 2', '0000', 'Barcelona', 'seller', 2);
    

-- Insert Shops with diverse types
INSERT INTO `shop` (name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop) VALUES
    ('Tienda General Perez', 'Madrid', 'Comida','ànadería', 1, 1),
    ('Fruteria Fresca', 'Barcelona', 'Ropa','Tienda infantil', 2, 2),
    ('Panaderia Del Sol', 'Valencia', 'Servicios','Lavado de coche', 1, 3),
    ('Pescaderia Mar Azul', 'Sevilla', 'Consultoría','Otros', 1, 4),
    ('Ferreteria Herramientas Plus', 'Bilbao', 'Ferreteria','General', 2, 5);

-- Insert Products for each shop with varied types and ensuring id_shop association
INSERT INTO `product` (name_product, price_product, discount_product, season_product, 
                       calification_product, type_product, stock_product, info_product, id_shop, id_provider) VALUES
    -- Products for Shop 1 (General Shop, id_shop = 1)
    ('Aceite de Oliva', 5.50, 10, 'Todo el Año', 4, 'comida', 100, 'Aceite de oliva extra virgen', 1, 1),
    ('Botella Agua Mineral', 1.20, 0, 'Todo el Año', 3, 'bebida', 200, 'Agua mineral natural', 1, 1),
    ('Detergente Liquido', 4.75, 15, 'Todo el Año', 4, 'otros', 50, 'Detergente para ropa', 1, 1),
    ('Linterna LED', 12.99, 20, 'Invierno', 5, 'electronico', 30, 'Linterna recargable', 1, 1),
    ('Set Cubiertos', 15.50, 5, 'Todo el Año', 4, 'herramientas', 45, 'Juego de cubiertos de acero', 1, 1),
    ('Papel Higienico', 3.20, 0, 'Todo el Año', 3, 'otros', 150, 'Pack de 6 rollos', 1, 1),
    ('Conservas Variadas', 2.50, 10, 'Todo el Año', 4, 'comida', 80, 'Surtido de conservas', 1, 1),
    ('Juego de Toallas', 22.00, 15, 'Verano', 5, 'otros', 40, 'Toallas de algodón', 1, 1),
    ('Pilas AA', 4.99, 0, 'Todo el Año', 4, 'electronico', 100, 'Pack de 4 pilas', 1, 1),
    ('Cepillo Dientes', 3.50, 5, 'Todo el Año', 3, 'otros', 60, 'Cepillo dental medio', 1, 1),

    -- Products for Shop 2 (Fruteria, id_shop = 2)
    ('Manzanas Rojas', 1.20, 10, 'Otoño', 5, 'fruta', 200, 'Manzanas frescas de temporada', 2, 2),
    ('Plátanos', 0.80, 0, 'Todo el Año', 4, 'fruta', 150, 'Plátanos maduros', 2, 2),
    ('Naranjas Valencia', 1.50, 5, 'Invierno', 5, 'fruta', 180, 'Naranjas dulces', 2, 2),
    ('Kiwis', 2.20, 15, 'Primavera', 4, 'fruta', 100, 'Kiwis importados', 2, 2),
    ('Aguacates', 3.50, 10, 'Verano', 4, 'fruta', 80, 'Aguacates maduros', 2, 2),
    ('Mango', 2.80, 0, 'Verano', 5, 'fruta', 90, 'Mangos de temporada', 2, 2),
    ('Uvas', 2.50, 5, 'Otoño', 4, 'fruta', 120, 'Racimos de uvas', 2, 2),
    ('Fresas', 3.20, 15, 'Primavera', 5, 'fruta', 110, 'Fresas frescas', 2, 2),
    ('Pera Conferencia', 1.80, 10, 'Otoño', 4, 'fruta', 140, 'Peras dulces', 2, 2),
    ('Sandía', 4.50, 0, 'Verano', 5, 'fruta', 70, 'Sandías grandes', 2, 2),

    -- Products for Shop 3 (Panaderia, id_shop = 3)
    ('Pan de Trigo', 1.20, 0, 'Todo el Año', 5, 'pan', 100, 'Pan fresco del día', 3, 3),
    ('Baguette', 1.50, 5, 'Todo el Año', 4, 'pan', 80, 'Baguette tradicional', 3, 3),
    ('Croissant', 1.20, 0, 'Todo el Año', 5, 'pan', 60, 'Croissant recién horneado', 3, 3),
    ('Magdalenas', 2.50, 10, 'Todo el Año', 4, 'pan', 50, 'Pack de 6 magdalenas', 3, 3),
    ('Rosca de Reyes', 8.99, 0, 'Invierno', 5, 'pan', 30, 'Rosca tradicional', 3,   3),
    ('Pan Integral', 1.80, 5, 'Todo el Año', 4, 'pan', 70, 'Pan integral de cereales', 3, 3),
    ('Donut', 1.20, 0, 'Todo el Año', 4, 'pan', 40, 'Donut glaseado', 3, 3),
    ('Empanada', 3.50, 10, 'Todo el Año', 5, 'pan', 35, 'Empanada de carne', 3, 3),
    ('Bocadillo', 2.20, 0, 'Todo el Año', 4, 'pan', 60, 'Bocadillo de jamón', 3, 3),
    ('Tarta de Queso', 12.50, 15, 'Todo el Año', 5, 'pan', 25, 'Tarta de queso casera', 3, 3),

    -- Products for Shop 4 (Pescaderia, id_shop = 4)
    ('Salmon Fresco', 12.50, 0, 'Todo el Año', 5, 'pescado', 50, 'Salmon del Atlántico', 4, 4),
    ('Bacalao', 9.99, 10, 'Invierno', 4, 'pescado', 40, 'Bacalao salado', 4, 4),
    ('Sardinas', 4.50, 5, 'Verano', 4, 'pescado', 70, 'Sardinas frescas', 4, 4),
    ('Atún', 8.75, 0, 'Todo el Año', 5, 'pescado', 60, 'Atún fresco', 4, 4),
    ('Merluza', 7.50, 10, 'Primavera', 4, 'pescado', 55, 'Merluza del Cantábrico', 4, 4),
    ('Boquerones', 5.20, 5, 'Verano', 5, 'pescado', 80, 'Boquerones en vinagre', 4, 4),
    ('Pulpo', 15.99, 0, 'Otoño', 5, 'marisco', 35, 'Pulpo gallego', 4, 4),
    ('Gambas', 18.50, 15, 'Todo el Año', 4, 'marisco', 45, 'Gambas frescas', 4, 4),
    ('Calamares', 9.75, 10, 'Todo el Año', 4, 'marisco', 65, 'Calamares limpios', 4, 4),
    ('Mejillones', 6.50, 5, 'Primavera', 5, 'marisco', 75, 'Mejillones de roca', 4, 4),

    -- Products for Shop 5 (Ferreteria, id_shop = 5)
    ('Martillo', 12.50, 0, 'Todo el Año', 4, 'herramientas', 50, 'Martillo profesional', 5, 5),
    ('Taladro', 89.99, 15, 'Todo el Año', 5, 'herramientas', 25, 'Taladro inalámbrico', 5, 5),
    ('Destornillador', 5.99, 0, 'Todo el Año', 4, 'herramientas', 100, 'Set de destornilladores', 5, 5),
    ('Alicate', 8.75, 5, 'Todo el Año', 4, 'herramientas', 75, 'Alicate de precisión', 5, 5),
    ('Cinta Métrica', 4.50, 0, 'Todo el Año', 3, 'herramientas', 90, 'Cinta métrica 5m', 5, 5),
    ('Nivel', 15.20, 10, 'Todo el Año', 4, 'herramientas', 40, 'Nivel de aluminio', 5, 5),
    ('Sierra', 29.99, 15, 'Todo el Año', 5, 'herramientas', 30, 'Sierra manual', 5, 5),
    ('Llave Inglesa', 12.50, 5, 'Todo el Año', 4, 'herramientas', 60, 'Llave inglesa ajustable', 5, 5),
    ('Pinzas', 6.75, 0, 'Todo el Año', 3, 'herramientas', 85, 'Pinzas de precisión', 5, 5),
    ('Kit Herramientas', 49.99, 20, 'Todo el Año', 5, 'herramientas', 20, 'Maletín completo', 5, 5);

    


-- Insert Providers 
INSERT INTO `provider` (name_provider, location_provider, pass_provider) VALUES
    ('Proveedor 1', 'Burgos', '1234'),
    ('Proveedor 2', 'Bilbao', '1234'),
    ('Proveedor 3', 'Sevilla', '1234'),
    ('Proveedor 4', 'Madrid', '1234'),
    ('Proveedor 5', 'Barcelona', '1234');
