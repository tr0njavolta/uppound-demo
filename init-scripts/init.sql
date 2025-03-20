CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INT,
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS adoptions (
  id SERIAL PRIMARY KEY,
  pet_id INT REFERENCES pets(id),
  applicant_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pets (name, species, breed, age, description, image_url)
VALUES 
  ('Hayden', 'Cat', 'Longhair domestic', 10, 'A sleepy, cuddly companion who can say "Hello" when she wants food.', '/images/hayden.jpg'),
  ('Milo', 'Dog', 'English Springer Spaniel', 1, 'Sweet and energetic puppy who loves attention', '/images/milo.jpg'),
  ('Phelix', 'Cat', 'Shorthair domestic', 1, 'Curious and playful kitten', '/images/phelix.jpg'),
  ('Jerry', 'Small', 'Ferret', 100, 'A wizard turned into a ferret after a spell gone wrong.', '/images/jerry.jpg'),
  ('Boogie', 'Dog', 'French Bulldog', 5, 'A lazy, loyal family dog', '/images/boogie.jpg'),
  ('Artemis', 'Cat', 'Tabby', 6, 'Artemis is blinged-out. If you have to ask you can''t afford her', '/images/artemis.jpg'),
  ('Simon', 'Cat', 'American Shorthair', 5, 'Cross-eyed and cuddly, Simon only has eyes for you', '/images/simon.jpg'),
  ('Eva', 'Dog', 'Bearded Collie', 16, 'She isn''t just a good dog, she''s the best dog, and will not tolerate any other dog that gets in the way of that', '/images/eva.jpg'),
  ('Mochi', 'Dog', 'Sharpei', 16, 'A handsome, well-dressed adventurer with a knack for finding the coziest cuddle spots', '/images/mochi.jpg');
