#!/bin/bash

function usage() {
    cat <<EOF >&2
Usage: ./deploy.sh [flags]

  Builds and deploys angular-pane-manager-example.

Flags:
  -h    Display this message and quit
  -l    Only lint and build angular-pane-manager
  -n    Perform a dry-run, building but skipping the deploy step
  -u    Same as -h
EOF
}

noop=''
lib=''

while getopts "hlnu" opt; do
    case $opt in
        h|u)
            usage
            exit 0
            ;;
        l)
            lib='-l'
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

[[ -f .deploy.env ]] && . ./.deploy.env

if [[ -z "$ADDRESS" ]]; then
    echo $'\x1b[1;38;5;1mNo $ADDRESS found; aborting.\x1b[m'
    exit -1
fi

set -e

echo $'\x1b[1mLinting...\x1b[m'
./lint.sh $lib

echo $'\x1b[1mBuilding...\x1b[m'

if [[ -n "$lib" ]]; then
    ng build --prod angular-pane-manager
else
    ng build --prod
    mv dist/angular-pane-manager-example/index{.prod,}.html
fi

if [[ -z "$noop" ]]; then
    echo $'\x1b[1mDeploying...\x1b[m'

    if [[ -n "$lib" ]]; then
        cd dist/angular-pane-manager
        yarn publish --access=public
    else
        rsync -rcp --progress --delete dist/angular-pane-manager-example/ "$ADDRESS"
    fi
fi