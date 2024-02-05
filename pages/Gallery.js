// pages/Gallery.js
import React from 'react';
import { useEffect } from 'react';
import { PhotoSwipe } from 'react-photoswipe-2';
import 'react-photoswipe-2/lib/photoswipe.css';

const Gallery = () => {
    // Galeri öğeleri
    const items = [
        {
            src: 'pamuk.jpg/',
            w: 1200,
            h: 900,
            title: 'Resim 1',
        },
        {
            src: 'trajan.jpg',
            w: 800,
            h: 900,
            title: 'Resim 2',
        },
        // Diğer resimler
    ];

    // Galeri durumu
    const [isOpen, setIsOpen] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);

    useEffect(() => {
        // Sayfa yüklendiğinde galeriyi aç
        setIsOpen(true);
    }, []);

    // Galeri kapatma işlemi
    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            {/* Galeri açıldığında PhotoSwipe bileşeni oluştur */}
            {isOpen && (
                <PhotoSwipe
                    items={items}
                    options={{ history: false }}
                    isOpen={isOpen}
                    onClose={handleClose}
                    index={photoIndex}
                />
            )}
        </div>
    );
};

export default Gallery;
