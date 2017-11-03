@echo off
setlocal enabledelayedexpansion
::
set "PATH=%~dp0;%PATH%"
::
set app=%1
set resources="%~dp0resources"

:: app directory
pushd %app%

set id=/postman-custom-resources/
set key=/text\/javascript/

:: copy resource
xcopy /yse %resources% "%app%"

:: modify files, each version's file
for /f "delims=, tokens=*" %%i in ('%~2') do (
    for /f "delims= tokens=*" %%j in ('where /R %app% "%%~nxi"') do (
        call :modify "%%j" "%id%" "%key%" "%%i"
		type "%%j"	
    )
)
endlocal disabledelayedexpansion
goto:eof

:modify
setlocal enabledelayedexpansion

set FILE_BAK="%~dpn1"

set POS_ID=POS_ID
set POS_KEY=POS_KEY

call :first %2 %1 %POS_ID%
call :last %3 %1 %POS_KEY%

if %POS_ID% gtr 0 (
    set /a POS_ID=%POS_ID%-1
)
if %POS_ID% equ 0 (
	set /a POS_ID=%POS_KEY%
)
if %POS_KEY% gtr 0 (
	set /a POS_KEY=%POS_KEY%+1
)
::
ren %1 %~n1
cd.>%1

head -n %POS_ID% %FILE_BAK% >> %1
type %4 >> %1
echo. >> %1
tail -n +%POS_KEY% %FILE_BAK% >> %1

del %FILE_BAK%
endlocal disabledelayedexpansion
goto:eof

:first
setlocal
for /f %%i in ('gawk "%~1 {print NR; exit;}" %2') do (
    endlocal & set "%~3=%%i" & goto:eof
)
endlocal & set "%~3=0" & goto:eof

:last
setlocal
for /f %%i in ('gawk "%~1 {n=NR} END {print n}" %2') do (
    endlocal & set "%~3=%%i" & goto:eof
)
endlocal & set "%~3=0" & goto:eof
