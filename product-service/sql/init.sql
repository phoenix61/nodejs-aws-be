CREATE EXTENSION "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stock (
  product_id UUID PRIMARY KEY REFERENCES products (id) ON DELETE CASCADE,
	count INTEGER NOT NULL
);

INSERT INTO products (id, title, description, price)
VALUES
	('9189ff3d-e259-4870-bbc6-edf48a092c50', 'Awesome Product', 'Short Product Description1', 24),
  ('7a2849e4-c846-4f1f-8844-a2f40df73aa0', 'Wonderful Product', 'Short Product Description2', 10),
	('45acdca2-1478-4db5-8665-205d1853ece2', 'Magnificent Product', 'Short Product Description3', 23),
	('86b1e6b2-a173-4480-bd31-50ee525c1708', 'Astonishing Product', 'Short Product Description4', 15),
	('f0383336-3d9d-4a1c-9125-5b0214f0342c', 'Incredible Product', 'Short Product Description5', 23),
	('4ad9d969-5823-4195-aa2f-6a20cad35b48', 'Breathtaking Product', 'Short Product Description6', 150),
	('9c115ee3-ab57-4538-8ec0-84ce30b86cb6', 'Just Simple Product', 'Short Product Description7', 5),
	('e268d289-c986-48f9-832d-bd45a993eaee', 'Imposing Product', 'Short Product Description8', 840);

INSERT INTO stock (product_id, count)
VALUES
	('9189ff3d-e259-4870-bbc6-edf48a092c50', 4),
	('7a2849e4-c846-4f1f-8844-a2f40df73aa0', 10),
	('45acdca2-1478-4db5-8665-205d1853ece2', 7),
	('86b1e6b2-a173-4480-bd31-50ee525c1708', 12),
	('f0383336-3d9d-4a1c-9125-5b0214f0342c', 15),
	('4ad9d969-5823-4195-aa2f-6a20cad35b48', 8),
	('9c115ee3-ab57-4538-8ec0-84ce30b86cb6', 2),
	('e268d289-c986-48f9-832d-bd45a993eaee', 3);
