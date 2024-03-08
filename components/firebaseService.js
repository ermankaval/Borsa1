// src/firebaseService.js
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';



const db = getFirestore();

export const getFirestoreData = async (collectionName) => {
    const data = [];
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error('Error getting Firestore data:', error);
        throw error;
    }
};

export const updateFirestoreData = async (collectionName, itemId, newData) => {
    const firestore = getFirestore();
    const collectionRef = doc(firestore, collectionName, itemId);

    try {
        await updateDoc(collectionRef, newData);
        console.log('Firestore data updated successfully');
    } catch (error) {
        console.error('Error updating Firestore data:', error);
        throw error;
    }
};
