param([string]$AndroidSdk = '', [string]$JavaDirectory = 'C:/Program Files/Android/Android Studio/jbr')
$ErrorActionPreference = 'Stop'
if (!$AndroidSdk) {
 $sdkCandidates = @("$env:ANDROID_HOME", "$env:LOCALAPPDATA/Android/Sdk", "$env:USERPROFILE/AppData/Local/Android/Sdk")
 $AndroidSdk = $sdkCandidates | Where-Object { $_ -and (Test-Path -LiteralPath "$_/platforms") } | Select-Object -First 1
 if (!$AndroidSdk) { throw 'Indica la ruta del SDK con -AndroidSdk.' }
}
$projectDirectory = Split-Path $PSScriptRoot -Parent
$shortDrive = 'T:'
if (Test-Path "$shortDrive/") { throw 'La unidad temporal T: está ocupada. Libérala o cambia $shortDrive en este script.' }
if (!(Test-Path -LiteralPath "$AndroidSdk/platforms")) { throw "No se encuentra el SDK de Android en $AndroidSdk" }
if (!(Test-Path -LiteralPath "$JavaDirectory/bin/java.exe")) { throw "No se encuentra Java en $JavaDirectory" }
$ninjaExecutable = "$AndroidSdk/cmake/3.22.1/bin/ninja.exe"
if (Test-Path -LiteralPath $ninjaExecutable) {
 $ninjaVersion = (& $ninjaExecutable --version).Trim()
 if ([version]$ninjaVersion -lt [version]'1.12.0') {
  throw "Ninja $ninjaVersion no admite las rutas largas de este proyecto. Actualiza Ninja a 1.12 o posterior y conserva una copia del ejecutable anterior."
 }
}
$env:JAVA_HOME = $JavaDirectory
$env:ANDROID_HOME = $AndroidSdk
$env:GRADLE_USER_HOME = Join-Path $projectDirectory '.gradle-build'
$env:EXPO_NO_TELEMETRY = '1'
$env:__UNSAFE_EXPO_HOME_DIRECTORY = Join-Path $projectDirectory '.expo-home'
$env:NODE_ENV = 'production'
$socketDirectory = Join-Path $projectDirectory 'tmp'
New-Item -ItemType Directory -Path $socketDirectory -Force | Out-Null
$env:JAVA_TOOL_OPTIONS = "-Djava.net.preferIPv4Stack=true -Djdk.net.unixdomain.tmpdir=`"$socketDirectory`""
& subst.exe $shortDrive (Split-Path $projectDirectory -Parent)
if ($LASTEXITCODE -ne 0) { throw 'No se pudo crear la ruta corta temporal.' }
$buildDirectory = "$shortDrive/$(Split-Path $projectDirectory -Leaf)"
$env:GRADLE_USER_HOME = "$buildDirectory/.gradle-build"
Push-Location $buildDirectory
try {
 if (!(Test-Path -LiteralPath 'android/gradlew.bat')) {
  node scripts/expo.cjs prebuild --platform android --no-install
  if ($LASTEXITCODE -ne 0) { throw 'No se pudo generar el proyecto Android.' }
 }
 Push-Location android
 try {
  & ./gradlew.bat :app:assembleRelease --no-daemon --max-workers=4 '-PreactNativeArchitectures=arm64-v8a,armeabi-v7a' '-Pkotlin.incremental=false' '-Pkotlin.compiler.execution.strategy=in-process' --console=plain
  if ($LASTEXITCODE -ne 0) { throw 'La compilación de Android ha fallado.' }
 } finally { Pop-Location }
 $outputDirectory = Join-Path $projectDirectory 'output/android'
 New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
 $appVersion = (Get-Content -LiteralPath (Join-Path $projectDirectory 'app.json') -Raw | ConvertFrom-Json).expo.version
 Copy-Item -LiteralPath 'android/app/build/outputs/apk/release/app-release.apk' -Destination "$outputDirectory/Traquid-$appVersion.apk"
 Write-Output "APK: $outputDirectory/Traquid-$appVersion.apk"
} finally { Pop-Location; & subst.exe $shortDrive /D }
