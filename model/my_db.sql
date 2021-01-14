-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 20, 2019 lúc 06:18 AM
-- Phiên bản máy phục vụ: 10.1.40-MariaDB
-- Phiên bản PHP: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `my_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `questionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `answers`
--

INSERT INTO `answers` (`id`, `content`, `questionId`) VALUES
(1, 'Xấu vcđ', 1),
(2, 'javascript', 3),
(3, 'C++', 3),
(4, 'Công', 2),
(5, 'Chắc chắn là công', 2),
(6, 'Tàm tạm', 1),
(7, 'Xinh', 1),
(8, 'Không thể xinh hơn', 1),
(9, 'C sharp', 3),
(10, 'Python', 3),
(11, 'Hoàng', 2),
(12, 'Mai', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `descript` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `valid` int(11) DEFAULT NULL,
  `total_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `courses`
--

INSERT INTO `courses` (`id`, `name`, `descript`, `valid`, `total_time`) VALUES
(1, 'DayOne', 'Overview về công ty, vị trí và công việc mà nhân viên sẽ đảm nhiệm...Blabla...', 1, 10),
(2, 'ISMS', 'Khóa học đào tạo về bảo mật thông tin, bảo mật tài sản...', 1, 60),
(3, 'CMMI3', 'Đào tạo các quy định, chính sách mới về quản lý dự án theo tiêu chuẩn CMMI3', 0, 20),
(4, 'RegularExpression', 'Training skill về biểu thức chính quy và cách ứng dụng biểu thức chính quy trong lập trình', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `category` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `type` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `correctId` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`id`, `category`, `type`, `content`, `correctId`, `courseId`) VALUES
(1, 'Gái Xinh', 'single', 'Mai xinh hay xấu?', '1', 1),
(2, 'Vớ vẩn', 'multi', 'Tên bạn là gì?', '4,5', 1),
(3, 'Vớ vẩn', 'multi', 'Dự án bạn đang làm về ngôn ngữ gì?', '2,3', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `email` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `fullname` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `position` text CHARACTER SET utf8 COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `position`) VALUES
(1, 'loan.nguyenkim', '123', 'loan.nguyenkim@vietis.com.vn', 'Nguyễn Thị Kim Loan', 'AD'),
(2, 'hieu.tatrung', '123', 'hieu.tatrung@vietis.com.vn', 'Tạ Trung Hiếu', 'DEV'),
(3, 'hieu.nguyentrung', '123', 'hieu.nguyentrung@vietis.com.vn', 'Nguyễn Trung Hiếu', 'DEV');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_courses`
--

CREATE TABLE `users_courses` (
  `userId` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `users_courses`
--

INSERT INTO `users_courses` (`userId`, `courseId`, `status`) VALUES
(1, 1, 0),
(1, 2, 0),
(2, 2, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Chỉ mục cho bảng `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
