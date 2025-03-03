const express = require('express');
const router = express.Router();
const { roomController } = require('../../controllers/index');

router.get('/', roomController.getRooms);
router.get('/details/:id', roomController.getRoomById);
router.get('/devices/:id', roomController.getDevicesByRoomId);

router.post('/add', roomController.addRoom);
router.post('/add-device', roomController.addDevice);

router.put('/update/:id', roomController.updateRoom);

router.delete('/delete/:id', roomController.deleteRoom);
router.delete('/remove-device/:id', roomController.deleteDevice);


module.exports = router;
