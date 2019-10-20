@echo off
call wset.bat
cmd /c sass %INP%/sass/style.scss:%OUT%/css/style.css --watch