// import { url } from "../axios";

// export async function imageUrlToFile(imageUrl: string) {
//   try {
//     const response = await url.get(imageUrl, {
//       responseType: 'blob'
//     })
//     // Extracting filename from URL
//     const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

//     // Creating a File object
//     const file = new File([response.data], filename, { type: response.data.type });
//     return file;
//   } catch (error) {
//     console.error('Error converting image URL to File:', error);
//     return null;
//   }
// }

export async function imageUrlToFile(imageUrl: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'Anonymous'; // Set crossOrigin to handle CORS

    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx: any = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob: any) => {
          // Extracting filename from URL
          const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

          // Creating a File object
          const file = new File([blob], filename, { type: blob.type });
          resolve(file);
        },
        img.src.includes('data:image/jpeg') ? 'image/jpeg' : 'image/png', // Specify image type if needed
        1 // JPEG image quality or PNG compression level
      );
    };

    img.onerror = function(error) {
      reject(error);
    };

    img.src = imageUrl;
  });
}

export async function videoUrlToFile(videoUrl: string) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'Anonymous'; // Set crossOrigin to handle CORS if needed

    video.onloadeddata = function() {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx: any = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob: any) => {
          const filename = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
          const file = new File([blob], filename, { type: blob.type });
          resolve(file);
        },
        'video/mp4', // Specify the video type if needed
        1 // Compression quality
      );
    };

    video.onerror = function(error) {
      reject(error);
    };

    video.src = videoUrl;
    video.load();
  });
}

