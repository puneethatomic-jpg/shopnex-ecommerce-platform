const logger = require('./logger');

// Local mock upload service to avoid requiring active credentials during development/testing
const cloudinary = {
  uploader: {
    upload: async (filePath, options = {}) => {
      logger.info(`[MOCK CLOUDINARY UPLOAD] Uploading file: ${filePath} with options: ${JSON.stringify(options)}`);
      // Return a random beautiful Unsplash image to look realistic
      const mockUrls = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      ];
      const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
      return {
        secure_url: randomUrl,
        public_id: `mock_image_${Date.now()}`,
      };
    },
    destroy: async (publicId) => {
      logger.info(`[MOCK CLOUDINARY DESTROY] Deleting image with public_id: ${publicId}`);
      return { result: 'ok' };
    },
  },
};

module.exports = cloudinary;
