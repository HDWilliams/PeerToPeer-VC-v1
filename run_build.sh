

NUM_ARGS=$#

if [ $NUM_ARGS -lt 1 ]; 
then 
	echo "You must pass a commit message as an argument to this script!"
	exit 1
fi

COMMIT_MSG=$1

git add .
git commit -m "$1"
git push origin master 