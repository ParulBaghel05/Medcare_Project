import express from 'express';
import multer from 'multer';
import { getDoctors, getDoctor, createDoctor,updateDoctor, deleteDoctor, uploadImage } from '../controllers/doctorController';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/getDoctors', getDoctors);
router.get('/:id', getDoctor);
router.post('/create', createDoctor);

router.post('/upload-image', upload.single('image'), uploadImage);
router.put('/update/:id', updateDoctor);
router.delete('/delete/:id', deleteDoctor);


export default router;