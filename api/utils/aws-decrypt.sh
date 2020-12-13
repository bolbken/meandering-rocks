encrypted_ciphertext_base64=$1

decrypted_key=$(aws kms decrypt --ciphertext-blob fileb://<(echo $encrypted_ciphertext_base64 | base64 --decode ) --output text --query Plaintext | base64 --decode)

echo $decrypted_key