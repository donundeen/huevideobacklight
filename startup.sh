#!/bin/sh
# startup listener
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

echo "dir is $DIR"

# start max mxf
open -a /Applications/Max 6.1 Runtime/Max\ Runtime.app $DIR/VideoBacklight.mxf & 
/usr/local/bin/node $DIR/hue.node.js 