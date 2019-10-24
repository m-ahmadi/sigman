@echo off
call wset.bat
sass %INP%/sass/style.scss:%OUT%/css/style.css --watch