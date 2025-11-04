# ArcSoft Face React Native

[English](README.md) | [中文](README.zh-CN.md)

## 项目介绍

ArcSoft Face React Native 是一个强大的 React Native 库，集成了虹软人脸识别 SDK，为移动应用提供全面的人脸检测、识别和分析功能。

## 功能特性

- 🔍 **人脸检测**: 高精度检测图像中的人脸
- 🆔 **人脸识别**: 提取和比较面部特征进行身份识别
- 👤 **活体检测**: 验证检测到的人脸是否来自真人
- 📊 **年龄检测**: 估算检测到的人脸年龄
- 👥 **性别识别**: 判断检测到的人脸性别
- 🚀 **高性能**: 针对移动设备优化
- 📱 **跨平台**: 支持 iOS 和 Android

## 安装

```bash
npm install arcsoft-face-react-native
```

或者

```bash
yarn add arcsoft-face-react-native
```

## 环境要求

- React Native >= 0.60
- Android API Level >= 21
- 虹软人脸 SDK 许可证（生产环境必需）

## 权限配置

### Android

在 `android/app/src/main/AndroidManifest.xml` 中添加以下权限：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS

在 `ios/YourApp/Info.plist` 中添加：

```xml
<key>NSCameraUsageDescription</key>
<string>此应用需要访问相机进行人脸识别</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>此应用需要访问相册进行人脸识别</string>
```

## 配置

1. **获取虹软 SDK 许可证**

   - 访问[虹软官网](https://www.arcsoft.com.cn/)
   - 注册并获取您的 `APP_ID` 和 `SDK_KEY`

2. **原生模块配置**
   - React Native >= 0.60 支持自动链接
   - 旧版本可能需要手动链接

## 使用方法

### 1. 初始化 SDK

```javascript
import ArcsoftFace from "arcsoft-face-react-native";

const initializeSDK = async () => {
  try {
    const success = await ArcsoftFace.init(
      "YOUR_APP_ID", // 替换为您的 APP_ID
      "YOUR_SDK_KEY", // 替换为您的 SDK_KEY
      "YOUR_ACTIVE_KEY" // 可选：留空进行在线激活
    );

    if (success) {
      console.log("虹软 SDK 初始化成功");
    }
  } catch (error) {
    console.error("SDK 初始化失败:", error);
  }
};
```

### 2. 人脸检测

```javascript
const detectFaces = async (imagePath) => {
  try {
    const faces = await ArcsoftFace.detectFaces(imagePath);
    console.log("检测到的人脸:", faces);

    // faces 数组包含人脸信息：
    // - rect: 人脸边界框坐标
    // - orient: 人脸方向
    // - faceId: 唯一人脸标识符
  } catch (error) {
    console.error("人脸检测失败:", error);
  }
};
```

### 3. 人脸特征提取

```javascript
const extractFaceFeature = async (imagePath) => {
  try {
    // extractType: 0 表示注册，1 表示识别
    const feature = await ArcsoftFace.extractFeature(imagePath, 0);

    if (feature) {
      console.log("人脸特征提取成功");
      // 保存特征用于后续比较
      return feature;
    }
  } catch (error) {
    console.error("特征提取失败:", error);
  }
};
```

### 4. 人脸比对

```javascript
const compareFaces = async (feature1, feature2) => {
  try {
    const similarity = await ArcsoftFace.compareFaces(feature1, feature2);
    console.log("人脸相似度:", similarity);

    // 相似度范围 0 到 1
    // 通常相似度 > 0.8 表示同一人
    if (similarity > 0.8) {
      console.log("人脸匹配！");
    } else {
      console.log("人脸不匹配");
    }
  } catch (error) {
    console.error("人脸比对失败:", error);
  }
};
```

### 5. 活体检测

```javascript
const checkLiveness = async (imagePath) => {
  try {
    const isLive = await ArcsoftFace.livenessDetection(imagePath);

    if (isLive) {
      console.log("检测到活体");
    } else {
      console.log("非活体");
    }
  } catch (error) {
    console.error("活体检测失败:", error);
  }
};
```

### 6. 年龄和性别检测

```javascript
const analyzeface = async (imagePath) => {
  try {
    const age = await ArcsoftFace.detectAge(imagePath);
    const gender = await ArcsoftFace.detectGender(imagePath);

    console.log(`检测到的年龄: ${age}`);
    console.log(`检测到的性别: ${gender}`); // 'male' 或 'female'
  } catch (error) {
    console.error("人脸分析失败:", error);
  }
};
```

### 7. 清理资源

```javascript
const cleanup = async () => {
  try {
    await ArcsoftFace.uninit();
    console.log("SDK 清理完成");
  } catch (error) {
    console.error("清理失败:", error);
  }
};
```

## 完整示例

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
      Alert.alert("错误", "SDK 初始化失败");
    }
  };

  const selectImageAndDetect = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.assets && response.assets[0]) {
        const imagePath = response.assets[0].uri;

        // 检测人脸
        const faces = await ArcsoftFace.detectFaces(imagePath);

        if (faces.length > 0) {
          // 提取特征
          const feature = await ArcsoftFace.extractFeature(imagePath, 0);
          setStoredFeature(feature);

          // 分析人脸
          const age = await ArcsoftFace.detectAge(imagePath);
          const gender = await ArcsoftFace.detectGender(imagePath);

          Alert.alert(
            "人脸分析",
            `检测到人脸数: ${faces.length}\n年龄: ${age}\n性别: ${gender}`
          );
        } else {
          Alert.alert("无人脸", "图像中未检测到人脸");
        }
      }
    });
  };

  const selectImageAndCompare = () => {
    if (!storedFeature) {
      Alert.alert("错误", "请先注册人脸");
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
            "人脸比对",
            `相似度: ${(similarity * 100).toFixed(2)}%\n${
              isMatch ? "匹配！" : "不匹配"
            }`
          );
        }
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        SDK 状态: {isInitialized ? "已初始化" : "未初始化"}
      </Text>

      <Button
        title="注册人脸"
        onPress={selectImageAndDetect}
        disabled={!isInitialized}
      />

      <View style={{ marginVertical: 10 }} />

      <Button
        title="验证人脸"
        onPress={selectImageAndCompare}
        disabled={!isInitialized || !storedFeature}
      />
    </View>
  );
};

export default FaceRecognitionApp;
```

## API 参考

| 方法                                     | 参数                      | 返回类型           | 描述               |
| ---------------------------------------- | ------------------------- | ------------------ | ------------------ |
| `init(appId, sdkKey, activeKey?)`        | `string, string, string?` | `Promise<boolean>` | 初始化 SDK         |
| `uninit()`                               | -                         | `Promise<boolean>` | 反初始化 SDK       |
| `detectFaces(imagePath)`                 | `string`                  | `Promise<Array>`   | 检测图像中的人脸   |
| `extractFeature(imagePath, extractType)` | `string, number`          | `Promise<string>`  | 提取人脸特征       |
| `compareFaces(feature1, feature2)`       | `string, string`          | `Promise<number>`  | 比较人脸特征       |
| `livenessDetection(imagePath)`           | `string`                  | `Promise<boolean>` | 检测人脸是否为活体 |
| `detectAge(imagePath)`                   | `string`                  | `Promise<number>`  | 检测年龄           |
| `detectGender(imagePath)`                | `string`                  | `Promise<string>`  | 检测性别           |

## 错误处理

常见错误码及解决方案：

- **90114**: 无效的 APP_ID 或 SDK_KEY
- **90115**: SDK 未激活
- **90116**: 内存不足
- **90117**: 无效的图像格式
- **90118**: 未检测到人脸

## 性能优化建议

1. **图像优化**: 使用合适的图像尺寸（推荐：640x480 或更小）
2. **特征缓存**: 将提取的特征存储在本地数据库中以提高性能
3. **后台处理**: 在后台线程执行人脸操作
4. **内存管理**: 不再需要 SDK 时调用 `uninit()`

## 故障排除

1. **构建问题**

   - 确保正确链接原生依赖
   - 检查 Android/iOS 最低版本要求

2. **运行时错误**

   - 验证 SDK 许可证有效性
   - 检查图像文件权限和格式

3. **性能问题**
   - 优化图像尺寸
   - 使用适当的检测参数

## 许可证

此项目基于 ISC 许可证。

## 技术支持

如需技术支持和咨询：

- 在 GitHub 上创建 issue
- 联系虹软技术支持获取 SDK 相关问题帮助

## 贡献指南

欢迎贡献代码！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

## 更新日志

查看[更新日志](CHANGELOG.md)了解版本变更信息。
