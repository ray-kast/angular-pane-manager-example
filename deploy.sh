#!/bin/bash

function usage() {
    cat <<EOF >&2
Usage: ./deploy.sh [flags]

  Builds and deploys angular-pane-manager-example.

Flags:
  -a    Build all targets, including the library and examples
  -h    Display this message and quit
  -l    Only lint and build angular-pane-manager
  -n    Perform a dry-run, building but skipping the deploy step
  -u    Same as -h
EOF
}

noop=''
lib=''
app='1'

while getopts "ahlnu" opt; do
    case $opt in
        a)
            lib='1'
            app='1'
            ;;
        h|u)
            usage
            exit 0
            ;;
        l)
            lib='1'
            app=''
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

lint_flags=()
[[ -n "$lib" && -z "$app" ]] && lint_flags+=('-l')
[[ -n "$lib" && -z "$noop" ]] && lint_flags+=('-V')

function do_yarn() {
    if [[ -n "$noop" ]]; then
        yarn install -A --frozen-lockfile || return $?
    else
        if ! yarn upgrade -A; then
            echo $'\x1b[1;38;5;3m -> yarn upgrade failed, attempting install...\x1b[m'
            yarn install -A && yarn upgrade -A || return $?
        fi
    fi
}

[[ -f .deploy.env ]] && . ./.deploy.env

if [[ -z "$ADDRESS" ]]; then
    echo $'\x1b[1;38;5;1mNo $ADDRESS found; aborting.\x1b[m'
    exit -1
fi

set -e

if [[ -n "$lib" && -z "$noop" ]]; then
    echo -n ' :: Enter decryption key: '
    read -s pass
    echo
fi

do_yarn

echo $'\x1b[1mLinting...\x1b[m'
./lint.sh "${lint_flags[@]}"

# It would be nice to do this after the build, but it seems to overwrite build files
echo $'\x1b[1mTesting...\x1b[m'

if [[ -n "$lib" || -z "$noop" ]]; then
    echo $'\x1b[1m -> Testing library...\x1b[m'
    ng test angular-pane-manager --browsers=FirefoxDeveloper --watch=false
fi

echo $'\x1b[1mBuilding...\x1b[m'

if [[ -n "$lib" ]]; then
    echo $'\x1b[1m -> Building library...\x1b[m'
    ng build --prod angular-pane-manager

    for example in projects/angular-pane-manager/examples/*; do
        (
            set -e
            cd $example
            echo $'\x1b[1m -> Building example '"'$example'"$'...\x1b[m'
            do_yarn
            ng build --prod
        )
    done
fi

if [[ -n "$app" ]]; then
    echo $'\x1b[1m -> Building app...\x1b[m'
    ng build --prod
    mv dist/angular-pane-manager-example/index{.prod,}.html
fi

if [[ -z "$noop" ]]; then
    echo $'\x1b[1mDeploying...\x1b[m'

    echo $'\x1b[38;5;3;1mBe sure to upgrade dependencies in package.json\x1b[m'

    if [[ -n "$lib" ]]; then
        (
            set -e
            cd dist/angular-pane-manager

            yarn login
            openssl aes-256-cbc -d -k "$pass" -iter 10000 -in .npm-password.enc | \
                yarn publish --access=public --new-version "$(jq '.version' package.json -r)"
        )
    fi

    if [[ -n "$app" ]]; then
        rsync -rcp --progress --delete dist/angular-pane-manager-example/ "$ADDRESS"
    fi
fi