#!/bin/bash

function usage() {
    cat <<EOF >&2
Usage: ./lint.sh [flags]

  Lints angular-pane-manager-example.

Flags:
  -h    Display this message and quit
  -l    Only lint angular-pane-manager
  -u    Same as -h
  -V    Skip checking for npm version mismatches
EOF
}

lib=''
mismatch='1'

while getopts "hluV" opt; do
    case $opt in
        h|u)
            usage
            exit 0
            ;;
        l)
            lib='1'
            ;;
        V)
            mismatch=''
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

if [[ -n "$mismatch" ]]; then
    package_ver=$(jq '.version' projects/angular-pane-manager/package.json -r)

    for example in projects/angular-pane-manager/examples/*; do
        (
            set -e
            cd $example

            jq '..|objects|."@openopus/angular-pane-manager"|select(length>0)' package.json -r | while read ver; do
                if [[ "($ver)" != "(=$package_ver)" ]]; then
                    echo $'\e[1;38;5;1m'" !> Version mismatch for example '$example' ($ver vs $package_ver)"$'\x1b[m'
                    exit -1
                fi
            done
        )
    done
fi

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
