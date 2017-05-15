@echo off
:: Chrome Extensions
call ".\chrome\setup.cmd"

:: Native Apps
call ".\native\setup.cmd"

goto:eof
