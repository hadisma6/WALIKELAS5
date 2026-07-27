#!/bin/bash
sed -i "s/rowObj\[h\] || ''/rowObj[h] !== undefined ? rowObj[h] : ''/g" code.gs
