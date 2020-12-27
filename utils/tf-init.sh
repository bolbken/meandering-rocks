TFDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && cd ../tf && pwd )"
ENVS=$(ls -l $TFDIR | grep '^d' | awk '{ print $9 }')

for env in $ENVS; do
    terraform -chdir=$TFDIR/$env init
done
