#!/bin/sh

# I know set -e exists, but I like this better

[ -f .deploy.env ] && . ./.deploy.env

if [ -z "$ADDRESS" ]; then
    echo $'\x1b[1;38;5;1mNo $ADDRESS found; aborting.\x1b[m'
    exit -1
fi

echo $'\x1b[1mLinting...\x1b[m'
tslint --project projects/angular-pane-manager/tsconfig.lib.json || exit $?
tslint --project tsconfig.app.json || exit $?

echo $'\x1b[1mBuilding...\x1b[m'
ng build --prod || exit $?
mv dist/angular-pane-manager-example/index{.prod,}.html || exit $?

echo $'\x1b[1mDeploying...\x1b[m'
rsync -rcp --progress --delete dist/angular-pane-manager-example/ "$ADDRESS" || exit $?