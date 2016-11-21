#!/bin/bash

cd `dirname $0`
pwd

git add .
git commit -m 'commit'
git push heroku master
heroku open