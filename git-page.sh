#! /bin/sh
echo "---- start deploy  doc branch ----"
cd dist
rm -rf .git
git init
git checkout -b gh-pages
git add .
git remote add origin git@github.com:jerry-i/jerry-i.github.io.git
git -c user.name='cicleci' -c user.email='jerry_ii@outlook.com' commit -m "update: docs-branch"
git push -f origin gh-pages
cd ..
echo "---- end deploy  doc branch ----"
