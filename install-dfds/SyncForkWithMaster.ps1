git remote add upstream https://github.com/spotify/backstage.git
git fetch upstream
git checkout master
git rebase upstream/master
git push -f origin master