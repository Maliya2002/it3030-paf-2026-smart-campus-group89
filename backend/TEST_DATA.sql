-- Maintenance & Incident Ticketing System - Test Data Script
-- Run this script in MySQL after creating the database

-- Switch to the correct database
USE maintenance_ticketing;

-- Insert sample tickets
INSERT INTO tickets (ticket_id, title, description, status, priority, reported_by, assigned_technician, category, location, created_at, updated_at, resolved_at) VALUES
('TKT-20240402001', 'Network Connection Failed', 'Unable to connect to the main network server', 'OPEN', 'HIGH', 'john.doe@company.com', NULL, 'Network', 'Office Building A', NOW(), NOW(), NULL),
('TKT-20240402002', 'Printer Malfunction', 'Printer in 3rd floor not printing', 'IN_PROGRESS', 'MEDIUM', 'jane.smith@company.com', 'tech.support@company.com', 'Equipment', 'Office Building B', NOW(), NOW(), NULL),
('TKT-20240402003', 'Database Server Down', 'Production database server is offline', 'OPEN', 'CRITICAL', 'admin@company.com', NULL, 'Infrastructure', 'Data Center', NOW(), NOW(), NULL),
('TKT-20240402004', 'Software License Expired', 'AutoCAD license has expired', 'RESOLVED', 'LOW', 'design.team@company.com', 'it.manager@company.com', 'Software', 'Design Studio', NOW(), NOW(), NOW()),
('TKT-20240402005', 'Security Patch Required', 'Windows Server 2019 needs security update', 'ON_HOLD', 'HIGH', 'security.team@company.com', 'system.admin@company.com', 'Security', 'Server Room', NOW(), NOW(), NULL);

-- Insert sample comments
INSERT INTO comments (ticket_id, commented_by, comment_text, created_at, updated_at) VALUES
(1, 'tech.support@company.com', 'Checking network connectivity. Initial diagnosis shows router configuration issue.', NOW(), NOW()),
(1, 'john.doe@company.com', 'Thank you for the quick response. Please let me know the resolution time.', NOW(), NOW()),
(2, 'tech.support@company.com', 'Printer driver has been reinstalled. Testing now.', NOW(), NOW()),
(3, 'admin@company.com', 'This is critical. Immediate attention required.', NOW(), NOW()),
(3, 'system.admin@company.com', 'Database replication failed. Performing manual failover.', NOW(), NOW());

-- Display the inserted data
SELECT 'TICKETS' as 'Table';
SELECT * FROM tickets;

SELECT 'COMMENTS' as 'Table';
SELECT * FROM comments;

-- Show ticket summaries
SELECT 
    t.id,
    t.ticket_id,
    t.title,
    t.status,
    t.priority,
    COUNT(c.id) as comment_count,
    COUNT(a.id) as attachment_count
FROM tickets t
LEFT JOIN comments c ON t.id = c.ticket_id
LEFT JOIN attachments a ON t.id = a.ticket_id
GROUP BY t.id, t.ticket_id, t.title, t.status, t.priority;
