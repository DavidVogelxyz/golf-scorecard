# Golf Scorecard

This repo manages the "Golf Scorecard" project.

## Installation

To deploy this project, `nodejs` and `npm` are required. To install on a Debian machine, run the following command to configure the server:

```
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
```

Then, install `nodejs`:

```
sudo apt install nodejs
```

After cloning and changing directory into the repo, run the following two commands:

```
npm install
npm run dev
```

This should enable connections to `http://127.0.0.1:5173`.
