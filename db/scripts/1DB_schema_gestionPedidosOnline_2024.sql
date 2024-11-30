SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema DB_gestionPedidosOnline_2024
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `DB_gestionPedidosOnline_2024`;

-- -----------------------------------------------------
-- Schema DB_gestionPedidosOnline_2024
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `DB_gestionPedidosOnline_2024` DEFAULT CHARACTER SET utf8;
USE `DB_gestionPedidosOnline_2024`;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`ip`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ip_registry (
    ip_address VARCHAR(45) PRIMARY KEY,
    registration_count INT DEFAULT 0,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_last_attempt (last_attempt)
);

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`user` (
  `id_user` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_user` VARCHAR(100) NOT NULL,
  `pass_user` VARCHAR(255) NOT NULL,
  `location_user` VARCHAR(45) NOT NULL,
  `type_user` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE INDEX `id_user_UNIQUE` (`id_user` ASC) VISIBLE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`product` (
  `id_product` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_product` VARCHAR(100) NOT NULL,
  `price_product` DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  `discount_product` INT NULL DEFAULT 0,
  `season_product` ENUM('Spring', 'Summer', 'Fall', 'Winter', 'All Year') NOT NULL,
  `calification_product` INT NOT NULL DEFAULT 0,
  `id_shop` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_product`),
  UNIQUE INDEX `id_product_UNIQUE` (`id_product` ASC) VISIBLE,
  CONSTRAINT `chk_product_calification` CHECK (`calification_product` BETWEEN 0 AND 5),
  CONSTRAINT `chk_product_discount` CHECK (`discount_product` BETWEEN 0 AND 100)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`provider`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`provider` (
  `id_provider` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_provider` VARCHAR(100) NOT NULL,
  `location_provider` VARCHAR(45) NOT NULL,
  `pass_provider` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_provider`),
  UNIQUE INDEX `id_provider_UNIQUE` (`id_provider` ASC) VISIBLE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`shop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`shop` (
  `id_shop` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_shop` VARCHAR(100) NOT NULL,
  `location_shop` VARCHAR(45) NOT NULL,
  `type_shop` VARCHAR(45) NOT NULL,
  `id_user` INT UNSIGNED NOT NULL,
  `calification_shop` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_shop`),
  UNIQUE INDEX `id_shop_UNIQUE` (`id_shop` ASC) VISIBLE,
  INDEX `fk_shop_user_idx` (`id_user` ASC) VISIBLE,
  CONSTRAINT `fk_shop_user`
    FOREIGN KEY (`id_user`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chk_shop_calification` CHECK (`calification_shop` BETWEEN 0 AND 5)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`orders` (
  `id_order` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_user` INT UNSIGNED NOT NULL,
  `id_product` INT UNSIGNED NOT NULL,
  `delivery_date` DATETIME NOT NULL,
  `finished` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_order`),
  INDEX `fk_orders_product_idx` (`id_product` ASC) VISIBLE,
  INDEX `fk_orders_user_idx` (`id_user` ASC) VISIBLE,
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`id_user`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`user` (`id_user`)
    ON DELETE  CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_orders_product`
    FOREIGN KEY (`id_product`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`product` (`id_product`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chk_orders_finished` CHECK (`finished` IN (0,1))
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`sales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`sales` (
  `id_sales` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_shop` INT UNSIGNED NOT NULL,
  `id_user` INT UNSIGNED NOT NULL,
  `id_product` INT UNSIGNED NOT NULL,
  `sale_date` DATETIME NOT NULL,
  PRIMARY KEY (`id_sales`),
  INDEX `fk_sales_product_idx` (`id_product` ASC) VISIBLE,
  INDEX `fk_sales_shop_idx` (`id_shop` ASC) VISIBLE,
  INDEX `fk_sales_user_idx` (`id_user` ASC) VISIBLE,
  CONSTRAINT `fk_sales_shop`
    FOREIGN KEY (`id_shop`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`shop` (`id_shop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_user`
    FOREIGN KEY (`id_user`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`user` (`id_user`)
    ON DELETE  CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sales_product`
    FOREIGN KEY (`id_product`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`product` (`id_product`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`buys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`buys` (
  `id_buys` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_shop` INT UNSIGNED NOT NULL,
  `id_provider` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_buys`),
  INDEX `fk_buys_provider_idx` (`id_provider` ASC) VISIBLE,
  INDEX `fk_buys_shop_idx` (`id_shop` ASC) VISIBLE,
  CONSTRAINT `fk_buys_shop`
    FOREIGN KEY (`id_shop`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`shop` (`id_shop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_buys_provider`
    FOREIGN KEY (`id_provider`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`provider` (`id_provider`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_gestionPedidosOnline_2024`.`produce`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DB_gestionPedidosOnline_2024`.`produce` (
  `id_produce` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_provider` INT UNSIGNED NOT NULL,
  `id_product` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_produce`),
  INDEX `fk_produce_product_idx` (`id_product` ASC) VISIBLE,
  INDEX `fk_produce_provider_idx` (`id_provider` ASC) VISIBLE,
  CONSTRAINT `fk_produce_provider`
    FOREIGN KEY (`id_provider`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`provider` (`id_provider`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produce_product`
    FOREIGN KEY (`id_product`)
    REFERENCES `DB_gestionPedidosOnline_2024`.`product` (`id_product`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;