[![codecov](https://codecov.io/gh/MCHSL/PZ-IP/branch/main/graph/badge.svg?token=QZY2BL3E7W)](https://codecov.io/gh/MCHSL/PZ-IP)

# how 2 run

1. Have Docker installed
2. Create a copy of `.env.dist` in `/Backend` and rename it to just `.env`

If developing:

3. Run `docker compose -f docker-compose.dev.yml up --build`. This will set up a database and start listening on port 80.

If running in prod:

3. Edit `.env` and set DEBUG to False, create a new Django secret key and configure database credentials if needed.
4. Run `docker compose up --build`. The website will be served on port 80.

If testing:

3. Run `docker compose -f docker-compose.test.yml up --build --force-recreate --remove-orphans --abort-on-container-exit`. It will run tests and report code coverage at the end.

Using Node v14.17.0 and Python 3.8.
