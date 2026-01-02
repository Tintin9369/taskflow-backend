/*  Données de tests   */
DELETE FROM task_users;

DELETE FROM tasks;

DELETE FROM users;

INSERT INTO
    users (id, email, password)
VALUES
    (1, 'admin@test.com', '$2b$10$hashadmin'),
    (2, 'user@test.com', '$2b$10$hashuser'),
    (3, 'outsider@test.com', '$2b$10$hashoutsider');

INSERT INTO 
    tasks (id, title, isdone, creator_id)
    VALUES
    (1, 'faire un compte rendu', false, 1),
    (2, 'appeler le comptable', false, 2),
    (3, 'créer une maquette Figma', true, 1);

INSERT INTO
    task_user (user_id, task_id, role)
    VALUES
    (1, 1, 'admin'),
    (2, 1, 'participant'),
    (2, 2, 'admin'),
    (1, 3, 'admin');