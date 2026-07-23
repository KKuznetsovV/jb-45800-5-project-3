-- Schema for the vacations app, mirroring backend/src/models/{User,Vacation,Like}.ts
-- (Sequelize `underscored: false`, default timestamps). Kept in sync manually since
-- this is a separate deployable (no shared code with backend/).

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NULL,
  googleId VARCHAR(255) NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY uniq_users_email (email),
  INDEX idx_users_googleId (googleId)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vacations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  imageName VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  vacationId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY uniq_likes_user_vacation (userId, vacationId),
  CONSTRAINT fk_likes_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_vacation FOREIGN KEY (vacationId) REFERENCES vacations(id) ON DELETE CASCADE
) ENGINE=InnoDB;
