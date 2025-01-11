export const convertToWebP = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Error al convertir la imagen a WebP'));
                        return;
                    }
                    
                    // Create a new file with the webp extension
                    const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
                        type: 'image/webp'
                    });
                    resolve(webpFile);
                }, 'image/webp', 0.8); // 0.8 quality
            };
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(file);
    });
};
