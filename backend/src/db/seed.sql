-- Optional demo data for NeuroFlow. Run after schema.sql.
-- Password for both demo users is: Password123!  (hash below is bcrypt of that string)

INSERT INTO users (name, email, password_hash, role, department, is_senior) VALUES
('Amaka Obi', 'amaka@neuroflow.demo', '$2a$10$8KQpZ8g0m8s4b8r5o7Y3He1kQwqf8b0m1vB3l3z1s2r8t9u0v1w2x.', 'admin', 'Engineering', 1),
('Tunde Bello', 'tunde@neuroflow.demo', '$2a$10$8KQpZ8g0m8s4b8r5o7Y3He1kQwqf8b0m1vB3l3z1s2r8t9u0v1w2x.', 'employee', 'Engineering', 0);

INSERT INTO nodes (type, title, description, status, owner_id) VALUES
('department', 'Engineering', 'Product engineering org', 'active', 1),
('project', 'Checkout Revamp', 'Rebuild of the checkout flow', 'active', 1),
('concept', 'Payment Retry Logic', 'How failed payments are retried and reconciled', 'gap', NULL);

INSERT INTO edges (source_node_id, target_node_id, relation_type) VALUES
(1, 2, 'owns'),
(2, 3, 'depends_on');
