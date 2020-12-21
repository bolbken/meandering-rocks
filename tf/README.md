# Terraform

## Environment Variables Mapping

The environment variables listed in the .env.\* files in the root directory will be used to generate
terraform variables. Below gives an example transformation.

Within the `../.env.\*` file

```env
MY_ENV_VARIABLE=myEnvVar
```

Will be transformed and exposed to terraform as

```env
TF_VAR_my_env_variable=myEnvVar
```

Within terraform script (ie. `variables.tf`) a variable could be referenced.

```terraform
# variables.tf

variable "my_env_var" {
  type = string
  description = "My environment variable."
}
```

## Running `terraform plan` using the .env file

The tools [dotenv-cli](https://github.com/entropitor/dotenv-cli#readme) and [tfenv](https://github.com/cloudposse/tfenv/releases/tag/0.4.0) are used to transform and export the `.env.*` file
in the root directory of this project.

Below is an example call to `terraform plan` that transforms `.env.development` and exposes it to terraform.

```shell
dotenv -e ../.env.development tfenv terraform plan
```
