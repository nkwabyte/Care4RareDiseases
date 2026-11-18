-- Link patients to clinician accounts using the legacy free-text assigned_clinician column.
INSERT OR IGNORE INTO `doctor_patient_assignments` (`doctor_id`, `patient_id`)
SELECT u.`id`, p.`id`
FROM `patients` p
JOIN `users` u ON u.`name` = p.`assigned_clinician` AND u.`role` = 'clinician';
