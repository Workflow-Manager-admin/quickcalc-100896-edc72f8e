#!/bin/bash
cd /home/kavia/workspace/code-generation/quickcalc-100896-edc72f8e/quickcalc
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

