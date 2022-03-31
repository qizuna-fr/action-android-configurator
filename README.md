# Android Configurator

<a href="https://github.com/qizuna-fr/action-android-configurator/actions"><img alt="action-android-configurator status" src="https://github.com/qizuna-fr/action-android-configurator/workflows/build-test/badge.svg"></a>

Use this action to configure a fresh Android project created with the command `npx cap add android`.

This action will do the following changes :

- Set the versions in the `build.gradle` file (app version, build version).
- Set the "android:usesCleartextTraffic" option in the `AndroidManifest.xml` file.
- Add the permissions and features in the `AndroidManifest.xml` file.

## How to use

```yaml
# ...
jobs:
  # ...
  steps:
    # ...
    - uses: qizuna-fr/action-android-configurator@v1
```

## Configuration file

This action needs a `"build.config.json"` in the root directory of your project, with the following structure :

```json
{
  "android": {
    "projectDir": "android/",
    "build.gradle": {
      "versionCode": 1,
      "versionName": "1.0"
    },
    "AndroidManifest.xml": {
      "usesCleartextTraffic": false,
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      "features": ["android.hardware.location.gps"]
    }
  }
}
```

| Property | Description |
| :--- | :--- |
| `projectDir` | The folder where your project is (eg: `"android/"` or `"."`)<br>*Note: the trailing slash is not mandatory*
| `build.gradle` | At this time, the action only support `versionCode` and `versionName` properties


*Copyright (c) 2022 Qizuna*
