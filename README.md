# Whitelist Disabler tool

This tool disables whitelist functionality for regtest environments.

## Usage

Install the dependencies through
```
npm ci
```

Run the tool passing as the only argument the RSK node to connect to. e.g.:
```
node index.js http://localhost:4444
```

The tool will show the process as it goes.

e.g.
```
Starting whitelist Disabler
Calling disable whitelist returns 1
Going to disable whitelist
Finished succesfully
```

### Possible result codes calling the script

- -10: Caller is not authorized
- -2: Disable delay set in the past
- -1: Whitelisting already disabled
- 1: Whitelist will be disabled