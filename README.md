Copyright

	Creative Commons License 3.0 (BY-NC-SA)

	BY: Attribution, NC: NonCommercial, SA: ShareAlike

Install Dependencies

	npm install

Create Database

	DROP TABLE IF EXISTS "todo";
	CREATE TABLE todo (
		id INTEGER NOT NULL, 
		topic VARCHAR(255) NOT NULL, 
		create_at DATE, 
		status BOOLEAN, 
		PRIMARY KEY (id), 
		CHECK (status IN (0, 1))
	);
	
Start Application

	node app.js