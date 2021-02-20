#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd build/docs

# if you are deploying to a custom domain
echo 'handsfree.js.org' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:handsfreejs/handsfree.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:handsfreejs/handsfree.git master:gh-pages

cd -