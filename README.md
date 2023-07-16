# Utilities for AACSB v3

## Quick Start
This project contains four utilities currnetly: `Tools`, `Documents`, `Infrastructure` and `Data Restore`.

## Tools
Files are under `tools` folder.
- `.sql` files are used to export critical data from `ReportGenerator` database.

## Documents
Files are under `docs` folder.

## Infrastructure
Files are under `infrastructure` folder.

## Data Restore
Files are under `src` and `data` folder.
### Environment
- nodejs 18

### How to use
1. Create a file called `.env` which stores all the environment variables. The file should look like this:
```
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=AACSB
DB_HOST=your_host
```
2. Run the project by running `yarn dev`