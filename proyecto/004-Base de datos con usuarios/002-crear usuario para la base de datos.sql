CREATE USER ' horti'@'localhost' IDENTIFIED BY ' proyecto1sge';

GRANT ALL PRIVILEGES ON  proyecto1sge.* TO ' horti'@'localhost';

FLUSH PRIVILEGES;
