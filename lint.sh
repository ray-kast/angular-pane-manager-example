#!/bin/sh

echo $' -> projects/angular-pane-manager (lib)'
tslint --project projects/angular-pane-manager/tsconfig.lib.json || exit $?

echo $' -> projects/angular-pane-manager (spec)'
tslint --project projects/angular-pane-manager/tsconfig.spec.json || exit $?

echo $' -> angular-pane-manager-example (app)'
tslint --project tsconfig.app.json || exit $?

echo $' -> angular-pane-manager-example (spec)'
tslint --project tsconfig.spec.json || exit $?