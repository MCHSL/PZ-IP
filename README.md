# how 2 run

1. Have Docker installed
2. Copy `.env.dist` in `/Backend` and rename it to just `.env`

If developing:

3. Run `docker compose -f docker-compose.dev.yml up --build`. This will set up a database and start listening on port 8000.

If running in prod:

3. Edit `.env` and set DEBUG to False, create a new Django secret key and configure database credentials if needed.
4. Run `docker compose up --build`. The website will be served on port 80.

5. If running for the first time or after updates, attach to the backend container using `docker exec -it <container name> bash`. The container name can be found using `docker ps`, it will probably be `pz-ip-backend-1`. Afterwards, run `python manage.py migrate` to apply schema changes to the database. When it finishes, you can close the terminal.
