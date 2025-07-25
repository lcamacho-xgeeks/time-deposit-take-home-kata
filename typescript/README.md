# To run the code

## Installation

### Install nvm (optional)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Running the above command downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

This is optional you can choose to directly install node directly (node >= 16.0.0)

### Install node using nvm

`nvm install 16.16.0`

### Install yarn (optional)

`npm install --global yarn`

This is optional, you can choose to use `npm` itself.

### Install node dependencies

`yarn install` or `npm install`

### Setup the database

start docker services

`docker compose up -d`

Setup the environment variables

`cp src/adapters/time-deposit/.env.example src/adapters/time-deposit/.env`

Run the database migrations

`yarn db:migrate`

Create database seed

`yarn db:seed`

## Run the server

### Dev server while watching

`yarn dev`

### Test suite while watching

`yarn test:watch`

To run integration tests using test-container execute

`yarn test:integration:watch`

### Run server

`yarn start`

### API Endpoint

To get all time-deposits with withdrawals

```bash
curl --request GET \
  --url http://localhost:3000/deposits 
```

To update all time-deposit interests

```bash
curl --request PUT \
  --url http://localhost:3000/deposits/update-balance
```
