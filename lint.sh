#!/bin/bash

function usage() {
    cat <<EOF >&2
Usage: ./lint.sh [flags]

  Lints angular-pane-manager-example.

Flags:
  -h    Display this message and quit
  -l    Only lint angular-pane-manager
  -u    Same as -h
EOF
}

lib=''

while getopts "hlu" opt; do
    case $opt in
        h|u)
            usage
            exit 0
            ;;
        l)
            lib=1
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

set -e

echo $' -> projects/angular-pane-manager (lib)'
tslint --project projects/angular-pane-manager/tsconfig.lib.json

echo $' -> projects/angular-pane-manager (spec)'
tslint --project projects/angular-pane-manager/tsconfig.spec.json

if [[ -z "$lib" ]]; then
    echo $' -> angular-pane-manager-example (app)'
    tslint --project tsconfig.app.json

    echo $' -> angular-pane-manager-example (spec)'
    tslint --project tsconfig.spec.json
fi