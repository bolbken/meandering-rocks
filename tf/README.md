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
