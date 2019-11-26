-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2019 a las 22:19:17
-- Versión del servidor: 10.4.8-MariaDB
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers`
--

CREATE TABLE `answers` (
  `answerId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `text` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `friendshiprequests`
--

CREATE TABLE `friendshiprequests` (
  `userRequester` int(11) NOT NULL,
  `userRequested` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `friendships`
--

CREATE TABLE `friendships` (
  `userId` int(11) NOT NULL,
  `friendId` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `questionId` int(11) NOT NULL,
  `text` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(50) NOT NULL,
  `genre` enum('hombre','mujer','otro') NOT NULL,
  `birthday` date DEFAULT NULL,
  `image` binary(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usersguesses`
--

CREATE TABLE `usersguesses` (
  `guessId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `responseId` int(11) NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usersresponses`
--

CREATE TABLE `usersresponses` (
  `responseId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `answerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answerId`,`questionId`),
  ADD KEY `questionId` (`questionId`);

--
-- Indices de la tabla `friendshiprequests`
--
ALTER TABLE `friendshiprequests`
  ADD PRIMARY KEY (`userRequester`,`userRequested`),
  ADD KEY `friendshiprequests_ibfk_2` (`userRequested`);

--
-- Indices de la tabla `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`userId`,`friendId`),
  ADD KEY `friendId` (`friendId`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`questionId`),
  ADD UNIQUE KEY `question_unq` (`text`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `password_unq` (`password`),
  ADD UNIQUE KEY `email_unq` (`email`);

--
-- Indices de la tabla `usersguesses`
--
ALTER TABLE `usersguesses`
  ADD PRIMARY KEY (`guessId`),
  ADD UNIQUE KEY `guess_unq` (`userId`,`responseId`),
  ADD KEY `responseId` (`responseId`);

--
-- Indices de la tabla `usersresponses`
--
ALTER TABLE `usersresponses`
  ADD PRIMARY KEY (`responseId`),
  ADD UNIQUE KEY `response_unq` (`userId`,`questionId`,`answerId`),
  ADD KEY `usersxanswers_ibfk_1` (`answerId`),
  ADD KEY `usersxanswers_ibfk_2` (`questionId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `questionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usersguesses`
--
ALTER TABLE `usersguesses`
  MODIFY `guessId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usersresponses`
--
ALTER TABLE `usersresponses`
  MODIFY `responseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `friendshiprequests`
--
ALTER TABLE `friendshiprequests`
  ADD CONSTRAINT `friendshiprequests_ibfk_1` FOREIGN KEY (`userRequester`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friendshiprequests_ibfk_2` FOREIGN KEY (`userRequested`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`friendId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usersguesses`
--
ALTER TABLE `usersguesses`
  ADD CONSTRAINT `usersguesses_ibfk_1` FOREIGN KEY (`responseId`) REFERENCES `usersresponses` (`responseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersguesses_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usersresponses`
--
ALTER TABLE `usersresponses`
  ADD CONSTRAINT `usersresponses_ibfk_1` FOREIGN KEY (`answerId`) REFERENCES `answers` (`answerId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersresponses_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`questionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersresponses_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
