
# meandering-rocks

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiY1VVam1XQjVNaktDVEpUU25PR1ViTGlXQmRCZXJGNCs4VGx4elpiNkRobDVpUC9ha2hpWmR5a054TWhBLzJzdWhEeHR3THlhWnVGandodDd6NlNwRUxnPSIsIml2UGFyYW1ldGVyU3BlYyI6Ik03cndyMlZCSHhocWQzOUoiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://console.aws.amazon.com/codesuite/codebuild/310674449483/projects/meandering-rocks-build-production/history?region=us-east-1)
[![APACHE-2.0 licensed](https://img.shields.io/github/license/bolbken/meandering-rocks)](https://raw.githubusercontent.com/bolbken/meandering-rocks/master/LICENSE)
[![Meandering Rocks Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fmeandering.rocks)](https://meandering.rocks)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/bolbken/meandering-rocks)


<p align="center">
  <a href="https://meandering.rocks">
    <img alt="site-logo" src="https://raw.githubusercontent.com/bolbken/meandering-rocks/master/web/content/assets/site-logo.svg" width="100" />
  </a>
</p>
<br/>

A shared personal blog between [@bolbken](https://github.com/bolbken) and [@notthecheesebri](https://github.com/notthecheesebri).

## Adding Blog Content

    After

## Running the Project Locally

**WARNING**: For simplification purposes, this project can not be _fully_ run locally on Windows machines.
This project is developed and tested on Ubuntu.  Any attempts to work with this project outside of Ubuntu operating systems
should be avoided.

### Environment Setup

Create a `.env.development` file in the top level directory of the cloned repo.
The following environment variables are required to be set:

* `BUILD_ENV=development`
* `GOOGLE_OAUTH_CLIENT_ID`
* `GOOGLE_OAUTH_CLIENT_SECRET`
* `GOOGLE_PHOTOS_TOKEN`
* `API_PHOTOS_SERVICE_GOOGLE_OAUTH_CLIENT_ID`
* `API_PHOTOS_SERVICE_GOOGLE_OAUTH_CLIENT_SECRET`
* `API_PHOTOS_SERVICE_GOOGLE_OAUTH_EMAIL`
* `API_PHOTOS_SERVICE_GOOGLE_OAUTH_PASSWORD`
* `API_NEWSLETTER_SERVICE_DYNAMODB_TABLE_NAME`

### Apt Package Installations

There are a few system packages that need to be installed and on `PATH` for scripts in the project to work properly.

```bash
# Install CLI command 'tfenv'
wget -O /usr/local/bin/tfenv https://github.com/cloudposse/tfenv/releases/download/0.4.0/tfenv_linux_amd64
chmod +x /usr/local/bin/tfenv

# Add terraform CLI apt repo
curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add -
apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"

# Add yarn CLI apt repo
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install apt packages
apt-get update -y && apt-get install zip terraform yarn -y
```

### NPM Package Installations

#### Global

Though not all the following global packages are _required_, they are _recommended_ :

* gatsby
* serverless
* dotenv-cli
* json

```bash
yarn global add gatsby serverless dotenv-cli json --prefix /usr/local
```

#### Package Dependencies

From the root directory of the repo execute the following commands.  
**Important**: This project utilizes yarn workspaces, thus `yarn install` will install all dependencies in all workspace packages.

```bash
yarn install
```

### Run all components

Once all package installs are complete, the following command can be run from the project root directory to start all packages.

```bash
yarn run develop
```

While the commands process is running changes can be made to the `web` package and will be automatically updated.
Changes to any `api/services/*` packages will have no effect until the command is restarted.
