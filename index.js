import { NativeModules } from 'react-native';

const { ArcsoftFaceModule } = NativeModules;

class ArcsoftFace {
  /**
   * 初始化 ArcSoft 人脸识别引擎
   * @param {string} appId - 应用 ID
   * @param {string} sdkKey - SDK 密钥
   * @param {string} activeKey - 激活密钥 (可选，默认为空字符串用于在线激活)
   * @returns {Promise<boolean>} 初始化是否成功
   */
  async init(appId, sdkKey, activeKey = '') {
    try {
      console.log('🚀 ArcsoftFace: Starting initialization...');
      console.log('📋 Parameters:');
      console.log('   APP_ID:', appId ? appId.substring(0, 8) + '...' : 'not provided');
      console.log('   SDK_KEY:', sdkKey ? sdkKey.substring(0, 8) + '...' : 'not provided');
      console.log(
        '   ACTIVE_KEY:',
        activeKey
          ? activeKey.length > 0
            ? activeKey.substring(0, 8) + '...'
            : '(empty for online activation)'
          : 'not provided',
      );

      const result = await ArcsoftFaceModule.init(appId, sdkKey, activeKey);
      console.log('✅ ArcsoftFace: Initialization successful');
      return result;
    } catch (error) {
      console.error('❌ ArcsoftFace: Initialization failed -', error.code, ':', error.message);
      // 重新抛出错误，让上层组件可以获得详细信息
      throw error;
    }
  }

  /**
   * 反初始化引擎
   * @returns {Promise<boolean>}
   */
  async uninit() {
    try {
      return await ArcsoftFaceModule.uninit();
    } catch (error) {
      console.error('ArcSoft Face uninit error:', error);
      return false;
    }
  }

  /**
   * 检测人脸
   * @param {string} imagePath - 图片路径
   * @returns {Promise<Array>} 人脸信息数组
   */
  async detectFaces(imagePath) {
    try {
      return await ArcsoftFaceModule.detectFaces(imagePath);
    } catch (error) {
      console.error('ArcSoft Face detect error:', error);
      return [];
    }
  }

  /**
   * 提取人脸特征
   * @param {string} imagePath - 图片路径
   * @param {string} extractType - 提取类型 (注册：0 | 识别：1)
   * @returns {Promise<string|null>} 人脸特征数据(base64)
   */
  async extractFeature(imagePath, extractType) {
    try {
      return await ArcsoftFaceModule.extractFeature(imagePath, extractType);
    } catch (error) {
      console.error('ArcSoft Face extract feature error:', error);
      return null;
    }
  }

  /**
   * 比较两个人脸特征
   * @param {string} feature1 - 第一个人脸特征(base64)
   * @param {string} feature2 - 第二个人脸特征(base64)
   * @returns {Promise<number>} 相似度(0-1之间)
   */
  async compareFaces(feature1, feature2) {
    try {
      return await ArcsoftFaceModule.compareFaces(feature1, feature2);
    } catch (error) {
      console.error('ArcSoft Face compare error:', error);
      return 0;
    }
  }

  /**
   * 活体检测
   * @param {string} imagePath - 图片路径
   * @returns {Promise<boolean>} 是否为活体
   */
  async livenessDetection(imagePath) {
    try {
      return await ArcsoftFaceModule.livenessDetection(imagePath);
    } catch (error) {
      console.error('ArcSoft Face liveness detection error:', error);
      return false;
    }
  }

  /**
   * 年龄检测
   * @param {string} imagePath - 图片路径
   * @returns {Promise<number>} 年龄
   */
  async detectAge(imagePath) {
    try {
      return await ArcsoftFaceModule.detectAge(imagePath);
    } catch (error) {
      console.error('ArcSoft Face age detection error:', error);
      return 0;
    }
  }

  /**
   * 性别检测
   * @param {string} imagePath - 图片路径
   * @returns {Promise<string>} 性别 ('male' | 'female')
   */
  async detectGender(imagePath) {
    try {
      return await ArcsoftFaceModule.detectGender(imagePath);
    } catch (error) {
      console.error('ArcSoft Face gender detection error:', error);
      return 'unknown';
    }
  }
}

export default new ArcsoftFace();
