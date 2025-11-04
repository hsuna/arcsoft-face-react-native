# ArcSoft Face React Native

[English](README.md) | [中文](README.zh-CN.md)

### Description

ArcSoft Face React Native is a powerful React Native library that integrates ArcSoft's face recognition SDK, providing comprehensive face detection, recognition, and analysis capabilities for mobile applications.

### Features

- 🔍 **Face Detection**: Detect faces in images with high accuracy
- 🆔 **Face Recognition**: Extract and compare facial features for identification
- 👤 **Liveness Detection**: Verify if the detected face is from a live person
- 📊 **Age Detection**: Estimate the age of detected faces
- 👥 **Gender Detection**: Determine the gender of detected faces
- 🚀 **High Performance**: Optimized for mobile devices
- 📱 **Cross Platform**: Supports both iOS and Android

### Installation

```bash
npm install arcsoft-face-react-native
```

or

```bash
yarn add arcsoft-face-react-native
```

### Requirements

- React Native >= 0.60
- Android API Level >= 21
- ArcSoft Face SDK License (required for production use)

### Permissions

#### Android

Add the following permissions to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### iOS

Add the following to your `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera for face recognition</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library for face recognition</string>
```

### Setup

1. **Get ArcSoft SDK License**

   - Visit [ArcSoft Official Website](https://www.arcsoft.com.cn/)
   - Register and obtain your `APP_ID` and `SDK_KEY`

2. **Native Module Configuration**
   - For React Native >= 0.60, auto-linking is supported
   - For older versions, manual linking may be required

### Usage

#### 1. Initialize SDK

```javascript
import ArcsoftFace from "arcsoft-face-react-native";

const initializeSDK = async () => {
  try {
    const success = await ArcsoftFace.init(
      "YOUR_APP_ID", // Replace with your APP_ID
      "YOUR_SDK_KEY", // Replace with your SDK_KEY
      "YOUR_ACTIVE_KEY" // Optional: leave empty for online activation
    );

    if (success) {
      console.log("ArcSoft SDK initialized successfully");
    }
  } catch (error) {
    console.error("SDK initialization failed:", error);
  }
};
```

#### 2. Face Detection

```javascript
const detectFaces = async (imagePath) => {
  try {
    const faces = await ArcsoftFace.detectFaces(imagePath);
    console.log("Detected faces:", faces);

    // faces array contains face information:
    // - rect: face bounding box coordinates
    // - orient: face orientation
    // - faceId: unique face identifier
  } catch (error) {
    console.error("Face detection failed:", error);
  }
};
```

#### 3. Face Feature Extraction

```javascript
const extractFaceFeature = async (imagePath) => {
  try {
    // extractType: 0 for registration, 1 for recognition
    const feature = await ArcsoftFace.extractFeature(imagePath, 0);

    if (feature) {
      console.log("Face feature extracted");
      // Store the feature for later comparison
      return feature;
    }
  } catch (error) {
    console.error("Feature extraction failed:", error);
  }
};
```

#### 4. Face Comparison

```javascript
const compareFaces = async (feature1, feature2) => {
  try {
    const similarity = await ArcsoftFace.compareFaces(feature1, feature2);
    console.log("Face similarity:", similarity);

    // similarity ranges from 0 to 1
    // typically, similarity > 0.8 indicates same person
    if (similarity > 0.8) {
      console.log("Faces match!");
    } else {
      console.log("Faces do not match");
    }
  } catch (error) {
    console.error("Face comparison failed:", error);
  }
};
```

#### 5. Liveness Detection

```javascript
const checkLiveness = async (imagePath) => {
  try {
    const isLive = await ArcsoftFace.livenessDetection(imagePath);

    if (isLive) {
      console.log("Live person detected");
    } else {
      console.log("Not a live person");
    }
  } catch (error) {
    console.error("Liveness detection failed:", error);
  }
};
```

#### 6. Age and Gender Detection

```javascript
const analyzeface = async (imagePath) => {
  try {
    const age = await ArcsoftFace.detectAge(imagePath);
    const gender = await ArcsoftFace.detectGender(imagePath);

    console.log(`Detected age: ${age}`);
    console.log(`Detected gender: ${gender}`); // 'male' or 'female'
  } catch (error) {
    console.error("Face analysis failed:", error);
  }
};
```

#### 7. Cleanup

```javascript
const cleanup = async () => {
  try {
    await ArcsoftFace.uninit();
    console.log("SDK cleanup completed");
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};
```

### Complete Example

```javascript
import React, { useEffect, useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import ArcsoftFace from "arcsoft-face-react-native";
import { launchImageLibrary } from "react-native-image-picker";

const FaceRecognitionApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [storedFeature, setStoredFeature] = useState(null);

  useEffect(() => {
    initializeSDK();

    return () => {
      ArcsoftFace.uninit();
    };
  }, []);

  const initializeSDK = async () => {
    try {
      const success = await ArcsoftFace.init("YOUR_APP_ID", "YOUR_SDK_KEY", "");
      setIsInitialized(success);
    } catch (error) {
      Alert.alert("Error", "Failed to initialize SDK");
    }
  };

  const selectImageAndDetect = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.assets && response.assets[0]) {
        const imagePath = response.assets[0].uri;

        // Detect faces
        const faces = await ArcsoftFace.detectFaces(imagePath);

        if (faces.length > 0) {
          // Extract feature
          const feature = await ArcsoftFace.extractFeature(imagePath, 0);
          setStoredFeature(feature);

          // Analyze face
          const age = await ArcsoftFace.detectAge(imagePath);
          const gender = await ArcsoftFace.detectGender(imagePath);

          Alert.alert(
            "Face Analysis",
            `Faces detected: ${faces.length}\nAge: ${age}\nGender: ${gender}`
          );
        } else {
          Alert.alert("No Face", "No faces detected in the image");
        }
      }
    });
  };

  const selectImageAndCompare = () => {
    if (!storedFeature) {
      Alert.alert("Error", "Please register a face first");
      return;
    }

    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.assets && response.assets[0]) {
        const imagePath = response.assets[0].uri;
        const feature = await ArcsoftFace.extractFeature(imagePath, 1);

        if (feature) {
          const similarity = await ArcsoftFace.compareFaces(
            storedFeature,
            feature
          );
          const isMatch = similarity > 0.8;

          Alert.alert(
            "Face Comparison",
            `Similarity: ${(similarity * 100).toFixed(2)}%\n${
              isMatch ? "Match!" : "No match"
            }`
          );
        }
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        SDK Status: {isInitialized ? "Initialized" : "Not Initialized"}
      </Text>

      <Button
        title="Register Face"
        onPress={selectImageAndDetect}
        disabled={!isInitialized}
      />

      <View style={{ marginVertical: 10 }} />

      <Button
        title="Verify Face"
        onPress={selectImageAndCompare}
        disabled={!isInitialized || !storedFeature}
      />
    </View>
  );
};

export default FaceRecognitionApp;
```

### API Reference

| Method                                   | Parameters                | Return Type        | Description            |
| ---------------------------------------- | ------------------------- | ------------------ | ---------------------- |
| `init(appId, sdkKey, activeKey?)`        | `string, string, string?` | `Promise<boolean>` | Initialize the SDK     |
| `uninit()`                               | -                         | `Promise<boolean>` | Uninitialize the SDK   |
| `detectFaces(imagePath)`                 | `string`                  | `Promise<Array>`   | Detect faces in image  |
| `extractFeature(imagePath, extractType)` | `string, number`          | `Promise<string>`  | Extract face feature   |
| `compareFaces(feature1, feature2)`       | `string, string`          | `Promise<number>`  | Compare face features  |
| `livenessDetection(imagePath)`           | `string`                  | `Promise<boolean>` | Detect if face is live |
| `detectAge(imagePath)`                   | `string`                  | `Promise<number>`  | Detect age             |
| `detectGender(imagePath)`                | `string`                  | `Promise<string>`  | Detect gender          |

### Error Handling

Common error codes and solutions:

- **90114**: Invalid APP_ID or SDK_KEY
- **90115**: SDK not activated
- **90116**: Insufficient memory
- **90117**: Invalid image format
- **90118**: No face detected

### Performance Tips

1. **Image Optimization**: Use appropriate image sizes (recommended: 640x480 or smaller)
2. **Feature Caching**: Store extracted features in local database for better performance
3. **Background Processing**: Perform face operations on background threads
4. **Memory Management**: Call `uninit()` when the SDK is no longer needed

### Troubleshooting

1. **Build Issues**

   - Ensure proper native dependencies are linked
   - Check Android/iOS minimum version requirements

2. **Runtime Errors**

   - Verify SDK license validity
   - Check image file permissions and format

3. **Performance Issues**
   - Optimize image sizes
   - Use appropriate detection parameters

### License

This project is licensed under the ISC License.

### Support

For technical support and questions:

- Create an issue on GitHub
- Contact ArcSoft support for SDK-related questions

### Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
