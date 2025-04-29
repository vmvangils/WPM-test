-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2025 at 04:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `typing_speed_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('5Xw3qS8_FAEO1z5LS6SYgSj--FTs312C', '2025-04-25 14:25:32', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-04-25T14:10:43.866Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":1,\"username\":\"DonTeuni\",\"email\":\"test@example.com\"}}', '2025-04-24 14:10:43', '2025-04-24 14:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `typing_tests`
--

CREATE TABLE `typing_tests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wpm` decimal(5,2) NOT NULL,
  `accuracy` decimal(5,2) NOT NULL,
  `test_duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `typing_tests`
--

INSERT INTO `typing_tests` (`id`, `user_id`, `wpm`, `accuracy`, `test_duration`, `created_at`) VALUES
(2, 1, 149.00, 100.00, 20, '2025-04-24 11:09:29'),
(3, 1, 116.00, 100.00, 26, '2025-04-24 11:26:49'),
(4, 1, 114.00, 96.00, 21, '2025-04-24 11:54:39'),
(5, 1, 110.00, 96.00, 21, '2025-04-24 12:24:41'),
(6, 1, 125.00, 100.00, 20, '2025-04-24 13:43:47'),
(7, 1, 129.00, 100.00, 19, '2025-04-24 13:53:33'),
(8, 1, 117.00, 100.00, 21, '2025-04-24 13:54:00'),
(9, 1, 123.00, 100.00, 20, '2025-04-24 13:54:36'),
(10, 2, 111.00, 100.00, 23, '2025-04-24 14:10:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'DonTeuni', 'test@example.com', '123456', '2025-04-24 10:59:36'),
(2, 'Vasco', 'vasco@gmail.com', '123456', '2025-04-24 14:09:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `typing_tests`
--
ALTER TABLE `typing_tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `typing_tests`
--
ALTER TABLE `typing_tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `typing_tests`
--
ALTER TABLE `typing_tests`
  ADD CONSTRAINT `typing_tests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
