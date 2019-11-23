@echo off
call wset.bat
htmlbilder %INP%/html/ -o %OUT%/index.html -t index.hbs -w