-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema BLE_Sports_Tracker
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema BLE_Sports_Tracker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `BLE_Sports_Tracker` DEFAULT CHARACTER SET utf8 ;
USE `BLE_Sports_Tracker` ;

-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Team` (
  `idTeam` INT(11) NOT NULL AUTO_INCREMENT,
  `teamName` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idTeam`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Game` (
  `idGame` INT(11) NOT NULL AUTO_INCREMENT,
  `gameDate` DATETIME NOT NULL,
  `team1_id` INT(11) NOT NULL,
  `team2_id` INT(11) NOT NULL,
  PRIMARY KEY (`idGame`),
  INDEX `fk_Game_Team1_idx` (`team1_id` ASC) VISIBLE,
  INDEX `fk_Game_Team2_idx` (`team2_id` ASC) VISIBLE,
  CONSTRAINT `fk_Game_Team1`
    FOREIGN KEY (`team1_id`)
    REFERENCES `BLE_Sports_Tracker`.`Team` (`idTeam`),
  CONSTRAINT `fk_Game_Team2`
    FOREIGN KEY (`team2_id`)
    REFERENCES `BLE_Sports_Tracker`.`Team` (`idTeam`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Player`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Player` (
  `idPlayer` INT(11) NOT NULL AUTO_INCREMENT,
  `playerName` VARCHAR(45) NULL DEFAULT NULL,
  `teamId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idPlayer`),
  INDEX `fk_Player_Team_idx` (`teamId` ASC) VISIBLE,
  CONSTRAINT `fk_Player_Team`
    FOREIGN KEY (`teamId`)
    REFERENCES `BLE_Sports_Tracker`.`Team` (`idTeam`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Player_Peripheral_Game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Player_Peripheral_Game` (
  `idPlayer_Peripheral_Game` INT(11) NOT NULL AUTO_INCREMENT,
  `player_id` INT(11) NOT NULL,
  `game_id` INT(11) NOT NULL,
  PRIMARY KEY (`idPlayer_Peripheral_Game`),
  INDEX `fk_Player_Peripheral_Game_Player1_idx` (`player_id` ASC) VISIBLE,
  INDEX `fk_Player_Peripheral_Game_Game1_idx` (`game_id` ASC) VISIBLE,
  CONSTRAINT `fk_Player_Peripheral_Game_Game1`
    FOREIGN KEY (`game_id`)
    REFERENCES `BLE_Sports_Tracker`.`Game` (`idGame`),
  CONSTRAINT `fk_Player_Peripheral_Game_Player1`
    FOREIGN KEY (`player_id`)
    REFERENCES `BLE_Sports_Tracker`.`Player` (`idPlayer`))
ENGINE = InnoDB
AUTO_INCREMENT = 48
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Metrics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Metrics` (
  `ppg_id` INT(11) NOT NULL,
  `steps` INT(11) NULL DEFAULT NULL,
  `distance` DOUBLE NULL DEFAULT NULL,
  `jumps` INT(11) NULL DEFAULT NULL,
  `dribbling_time` DOUBLE NULL DEFAULT NULL,
  `still_time` DOUBLE NULL DEFAULT NULL,
  `walking_time` DOUBLE NULL DEFAULT NULL,
  `running_time` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`ppg_id`),
  INDEX `fk_Metrics_Player_Peripheral_Game1_idx` (`ppg_id` ASC) VISIBLE,
  CONSTRAINT `fk_Metrics_Player_Peripheral_Game1`
    FOREIGN KEY (`ppg_id`)
    REFERENCES `BLE_Sports_Tracker`.`Player_Peripheral_Game` (`idPlayer_Peripheral_Game`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Peripheral`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Peripheral` (
  `idPeripheral` INT(11) NOT NULL AUTO_INCREMENT,
  `peripheralAddress` VARCHAR(45) NOT NULL,
  `number` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idPeripheral`),
  UNIQUE INDEX `peripheralAddress_UNIQUE` (`peripheralAddress` ASC) VISIBLE,
  UNIQUE INDEX `number_UNIQUE` (`number` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`PG_Peripherals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`PG_Peripherals` (
  `idPG_Peripherals` INT(11) NOT NULL AUTO_INCREMENT,
  `peripheral_id` INT(11) NOT NULL,
  `peripheral_position` ENUM('FOOT', 'HIP', 'HAND', 'BACK') NOT NULL,
  `ppg_id` INT(11) NOT NULL,
  PRIMARY KEY (`idPG_Peripherals`),
  INDEX `fk_PG_Peripherals_1_idx` (`peripheral_id` ASC) VISIBLE,
  INDEX `fk_PG_Peripherals_2_idx` (`ppg_id` ASC) VISIBLE,
  CONSTRAINT `fk_PG_Peripherals_1`
    FOREIGN KEY (`peripheral_id`)
    REFERENCES `BLE_Sports_Tracker`.`Peripheral` (`idPeripheral`),
  CONSTRAINT `fk_PG_Peripherals_2`
    FOREIGN KEY (`ppg_id`)
    REFERENCES `BLE_Sports_Tracker`.`Player_Peripheral_Game` (`idPlayer_Peripheral_Game`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`Sample`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`Sample` (
  `idSample` INT(11) NOT NULL,
  `ppg_id` INT(11) NOT NULL,
  `acc_x` DOUBLE NULL DEFAULT NULL,
  `axx_y` DOUBLE NULL DEFAULT NULL,
  `acc_z` DOUBLE NULL DEFAULT NULL,
  `gyr_x` DOUBLE NULL DEFAULT NULL,
  `gyr_y` DOUBLE NULL DEFAULT NULL,
  `gyr_z` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`idSample`),
  INDEX `fk_Sample_Player_Peripheral_Game1_idx` (`ppg_id` ASC) VISIBLE,
  CONSTRAINT `fk_Sample_Player_Peripheral_Game1`
    FOREIGN KEY (`ppg_id`)
    REFERENCES `BLE_Sports_Tracker`.`Player_Peripheral_Game` (`idPlayer_Peripheral_Game`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `BLE_Sports_Tracker`.`TrackingPosition`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`TrackingPosition` (
  `idTrackingPosition` INT(11) NOT NULL,
  `x_coord` DOUBLE NULL DEFAULT NULL,
  `y_coord` VARCHAR(45) NULL DEFAULT NULL,
  `FK_ppg_id` INT(11) NOT NULL,
  PRIMARY KEY (`idTrackingPosition`),
  INDEX `fk_TrackingPosition_Metrics1_idx` (`FK_ppg_id` ASC) VISIBLE,
  CONSTRAINT `fk_TrackingPosition_Metrics1`
    FOREIGN KEY (`FK_ppg_id`)
    REFERENCES `BLE_Sports_Tracker`.`Metrics` (`ppg_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

USE `BLE_Sports_Tracker` ;

-- -----------------------------------------------------
-- Placeholder table for view `BLE_Sports_Tracker`.`gameTeams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`gameTeams` (`idGame` INT, `gameDate` INT, `team1_id` INT, `team1_name` INT, `team2_id` INT, `team2_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `BLE_Sports_Tracker`.`playerTeam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`playerTeam` (`idPlayer` INT, `playerName` INT, `idTeam` INT, `teamName` INT);

-- -----------------------------------------------------
-- Placeholder table for view `BLE_Sports_Tracker`.`teamPlayers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BLE_Sports_Tracker`.`teamPlayers` (`idTeam` INT, `teamName` INT, `idPlayer` INT, `playerName` INT, `teamId` INT);

-- -----------------------------------------------------
-- View `BLE_Sports_Tracker`.`gameTeams`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BLE_Sports_Tracker`.`gameTeams`;
USE `BLE_Sports_Tracker`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `BLE_Sports_Tracker`.`gameTeams` AS select `BLE_Sports_Tracker`.`Game`.`idGame` AS `idGame`,`BLE_Sports_Tracker`.`Game`.`gameDate` AS `gameDate`,`BLE_Sports_Tracker`.`Game`.`team1_id` AS `team1_id`,`t1`.`teamName` AS `team1_name`,`BLE_Sports_Tracker`.`Game`.`team2_id` AS `team2_id`,`t2`.`teamName` AS `team2_name` from ((`BLE_Sports_Tracker`.`Game` join `BLE_Sports_Tracker`.`Team` `t1` on((`BLE_Sports_Tracker`.`Game`.`team1_id` = `t1`.`idTeam`))) join `BLE_Sports_Tracker`.`Team` `t2` on((`BLE_Sports_Tracker`.`Game`.`team2_id` = `t2`.`idTeam`)));

-- -----------------------------------------------------
-- View `BLE_Sports_Tracker`.`playerTeam`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BLE_Sports_Tracker`.`playerTeam`;
USE `BLE_Sports_Tracker`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `BLE_Sports_Tracker`.`playerTeam` AS select `p`.`idPlayer` AS `idPlayer`,`p`.`playerName` AS `playerName`,`t`.`idTeam` AS `idTeam`,`t`.`teamName` AS `teamName` from (`BLE_Sports_Tracker`.`Player` `p` left join `BLE_Sports_Tracker`.`Team` `t` on((`p`.`teamId` = `t`.`idTeam`)));

-- -----------------------------------------------------
-- View `BLE_Sports_Tracker`.`teamPlayers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BLE_Sports_Tracker`.`teamPlayers`;
USE `BLE_Sports_Tracker`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `BLE_Sports_Tracker`.`teamPlayers` AS select `BLE_Sports_Tracker`.`Team`.`idTeam` AS `idTeam`,`BLE_Sports_Tracker`.`Team`.`teamName` AS `teamName`,`BLE_Sports_Tracker`.`Player`.`idPlayer` AS `idPlayer`,`BLE_Sports_Tracker`.`Player`.`playerName` AS `playerName`,`BLE_Sports_Tracker`.`Player`.`teamId` AS `teamId` from (`BLE_Sports_Tracker`.`Team` left join `BLE_Sports_Tracker`.`Player` on((`BLE_Sports_Tracker`.`Player`.`teamId` = `BLE_Sports_Tracker`.`Team`.`idTeam`)));
USE `BLE_Sports_Tracker`;

DELIMITER $$
USE `BLE_Sports_Tracker`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `BLE_Sports_Tracker`.`Game_AFTER_INSERT`
AFTER INSERT ON `BLE_Sports_Tracker`.`Game`
FOR EACH ROW
BEGIN
Insert into Player_Peripheral_Game (player_id, game_id)
select idPlayer, NEW.idGame
FROM BLE_Sports_Tracker.Player p
inner join Game g on new.idGame = g.idGame
where p.teamId = g.team1_id or p.teamId = g.team2_id;
END$$

USE `BLE_Sports_Tracker`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `BLE_Sports_Tracker`.`Player_Peripheral_Game_AFTER_INSERT`
AFTER INSERT ON `BLE_Sports_Tracker`.`Player_Peripheral_Game`
FOR EACH ROW
BEGIN
INSERT INTO `BLE_Sports_Tracker`.`Metrics` (ppg_id) VALUES (NEW.idPlayer_Peripheral_Game);
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
