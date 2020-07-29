#!/bin/bash

# I know set -e exists, but I like this better

function usage() {
    cat <<EOF >&2
Usage: ./deploy.sh [flags]

  Builds and deploys angular-pane-manager-example.

Flags:
  -h    Display this message and quit
  -n    Perform a dry-run, building but skipping the deploy step
  -u    Same as -h
EOF
}

noop=''

while getopts "hnu" opt; do
    case $opt in
        h|u)
            usage
            exit 0
            ;;
        n)
            noop=1
            ;;
        \?)
            usage
            exit 1
            ;;
    esac
done

shift $((OPTIND - 1))

if (( $# != 0 )); then
    usage
    exit 1
fi

[ -f .deploy.env ] && . ./.deploy.env

if [ -z "$ADDRESS" ]; then
    echo $'\x1b[1;38;5;1mNo $ADDRESS found; aborting.\x1b[m'
    exit -1
fi

set -e

echo $'\x1b[1mLinting...\x1b[m'
./lint.sh

echo $'\x1b[1mBuilding...\x1b[m'
ng build --prod
mv dist/angular-pane-manager-example/index{.prod,}.html

if [[ -z "$noop" ]]; then
    echo $'\x1b[1mDeploying...\x1b[m'
    rsync -rcp --progress --delete dist/angular-pane-manager-example/ "$ADDRESS"
fi