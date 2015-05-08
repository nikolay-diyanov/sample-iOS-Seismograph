#!/bin/sh
if [ -d "$SRCROOT/$PROJECT_NAME/tns_modules" ]
then
    cp -rp "$SRCROOT/$PROJECT_NAME/tns_modules" "$BUILT_PRODUCTS_DIR/$CONTENTS_FOLDER_PATH"
fi
