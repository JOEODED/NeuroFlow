-- NeuroFlow database schema

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','employee') NOT NULL DEFAULT 'employee',
  department VARCHAR(120) DEFAULT NULL,
  is_senior TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('department','project','concept','document') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('active','dormant','gap') NOT NULL DEFAULT 'active',
  owner_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS edges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_node_id INT NOT NULL,
  target_node_id INT NOT NULL,
  relation_type VARCHAR(80) NOT NULL DEFAULT 'related_to',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  FOREIGN KEY (target_node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expertise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  node_id INT NOT NULL,
  level ENUM('contributor','expert') NOT NULL DEFAULT 'contributor',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_node (user_id, node_id)
);

CREATE TABLE IF NOT EXISTS onboarding_trails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(120) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_by INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trail_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trail_id INT NOT NULL,
  node_id INT DEFAULT NULL,
  step_order INT NOT NULL DEFAULT 0,
  title VARCHAR(200) NOT NULL,
  notes TEXT,
  FOREIGN KEY (trail_id) REFERENCES onboarding_trails(id) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trail_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trail_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  FOREIGN KEY (trail_id) REFERENCES onboarding_trails(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trail_step_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  step_id INT NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  completed_at DATETIME DEFAULT NULL,
  FOREIGN KEY (assignment_id) REFERENCES trail_assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES trail_steps(id) ON DELETE CASCADE,
  UNIQUE KEY unique_assignment_step (assignment_id, step_id)
);

CREATE TABLE IF NOT EXISTS surveys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prompt VARCHAR(500) NOT NULL,
  target_user_id INT NOT NULL,
  status ENUM('pending','answered','skipped') NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  survey_id INT NOT NULL,
  response_text TEXT NOT NULL,
  linked_node_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_node_id) REFERENCES nodes(id) ON DELETE SET NULL
);
