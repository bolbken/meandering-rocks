key_id=$1
unencrypted_key=$2

encrypted_plaintext=$(aws kms encrypt --key-id $key_id --plaintext $(echo -n $unencrypted_key | base64) --output text --query CiphertextBlob)

echo $encrypted_plaintext