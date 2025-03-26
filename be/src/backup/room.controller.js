const db = require('../config/db.config');

// Thêm người phòng mới
exports.addRoom = async (req, res, next) => {
  const { name, description, price, area, note, status } = req.body;

  try {
    const sql = `
      INSERT INTO Rooms (name, description, price, area, note, createdAt, status)
      VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `;
    const roomData = [
      name,
      description || null,
      price,
      area,
      note || null,
      status
    ];

    const [result] = await db.pool.execute(sql, roomData);

    res.status(201).json({ message: "Thêm mới phòng thành công!", roomId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin phòng
exports.updateRoom = async (req, res, next) => {
  const roomId = req.params.id;
  const { name, landlordId, description, price, area, note, status } = req.body;

  try {
    const [room] = await db.pool.execute(
      `SELECT id
       FROM Rooms
       WHERE id = ?`, 
      [roomId]
    );

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const sql = `
      UPDATE Rooms
      SET name = ?, tenant_id = ?, description = ?, price = ?, area = ?, note = ?, status = ?
      WHERE id = ?
    `;
    const roomData = [
      name,
      landlordId,
      description || null,
      price,
      area,
      note || null,
      status,
      roomId
    ];

    await db.pool.execute(sql, roomData);

    res.status(200).json({ message: "Cập nhật phòng thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa phòng
exports.deleteRoom = async (req, res, next) => {
  const roomId = req.params.id;
  try {
    const [room] = await db.pool.execute(
      `SELECT id
       FROM Rooms
       WHERE id = ?`, 
      [roomId]
    );

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    await db.pool.execute(
      `DELETE FROM Rooms
       WHERE id = ?`, 
      [roomId]
    );

    //Xóa các thiết bị trong phòng
    await db.pool.execute(
      `DELETE FROM Devices
       WHERE room_id = ?`, 
      [roomId]
    );

    //Xóa các hình ảnh của phòng
    await db.pool.execute(
      `DELETE FROM Files
       WHERE room_id = ?`, 
      [roomId]
    );

    res.status(200).json({ message: "Xóa phòng thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

exports.getRooms = async (req, res, next) => { 
  try {
    const [rooms] = await db.pool.execute(`
      SELECT id, name, status
      FROM Rooms`
    );
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

exports.getRoomById = async (req, res, next) => {
  const roomId = req.params.id;
  try {
    // Truy vấn thông tin phòng theo ID
    const [room] = await db.pool.execute(
      `SELECT id, name, tenant_id, description, price, area, note, status
       FROM Rooms
       WHERE id = ?`, 
      [roomId]
    );

    // Kiểm tra nếu không tìm thấy phòng
    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    let tenant = null;

    // Nếu phòng có trạng thái hợp lệ (1 hoặc '1'), lấy thông tin chủ nhà
    if (room[0].status === 1 || room[0].status === '1') {
      const [tenantData] = await db.pool.execute(
        `SELECT id, full_name, phone, email, address, gender, note
         FROM Users
         WHERE id = ?`, 
        [room[0].tenant_id]
      );

      if (tenantData.length > 0) {
        tenant = tenantData[0];
      }
    }

    // Lấy danh sách hình ảnh của phòng
    const [images] = await db.pool.execute(
      `SELECT id, url
       FROM Files
       WHERE room_id = ? AND device_id IS NULL`, 
      [roomId]
    );

    // Lấy danh sách thiết bị trong phòng
    const [devices] = await db.pool.execute(
      // `SELECT id, name, status
      `SELECT *
       FROM Devices
       WHERE room_id = ?`, 
      [roomId]
    );

    let deviceImages = [];
    let devicesWithImages = [];

    // Nếu có thiết bị, lấy danh sách ảnh thiết bị
    if (devices.length > 0) {
      const deviceIds = devices.map(device => device.id);
      
      // Tạo danh sách dấu '?' để tránh SQL Injection
      const placeholders = deviceIds.map(() => '?').join(',');
      
      const [deviceImagesData] = await db.pool.execute(
        `SELECT id, url, device_id
         FROM Files
         WHERE device_id IN (${placeholders})`, 
        deviceIds
      );

      deviceImages = deviceImagesData;

      // Gắn hình ảnh vào thiết bị tương ứng
      devicesWithImages = devices.map(device => ({
        ...device,
        images: deviceImages.filter(img => img.device_id === device.id)
      }));
    }

    // Trả về dữ liệu
    res.status(200).json({
      ...room[0],
      tenant,
      images,
      devices: devicesWithImages
    });

  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDevicesByRoomId = async (req, res, next) => { 
  const roomId = req.params.id;
  try {
    const [devices] = await db.pool.execute(`
      SELECT id, name, status
      FROM Devices
      WHERE room_id = ?`, [roomId]
    );

    // Map các thiet bi qua bảng files để lấy hình ảnh
    const deviceIds = devices.map(device => device.id);
    const [images] = await db.pool.execute(`
      SELECT id, url, device_id
      FROM Files
      WHERE device_id IN (${deviceIds.join(',')})
    `);

    const imagesByDeviceId = images.reduce((acc, image) => {
      if (!acc[image.device_id]) {
      acc[image.device_id] = [];
      }
      acc[image.device_id].push(image);
      return acc;
    }, {});

    devices.forEach(device => {
      device.images = imagesByDeviceId[device.id] || [];
    });

    res.status(200).json(devices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Thêm thiết bị vào phòng
exports.addDevice = async (req, res, next) => { 
  const { roomId, name, quantity, imageId } = req.body;

  try {
    const [room] = await db.pool.execute(
      `SELECT id
       FROM Rooms
       WHERE id = ?`, 
      [roomId]
    );

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const sql = `
      INSERT INTO Devices (name, room_id, status, quantity, createdAt)
      VALUES (?, ?, 1, ?, NOW())
    `;
    const deviceData = [name, roomId, quantity];
    const [result] = await db.pool.execute(sql, deviceData);

    // Cập nhật trường device_id của bảng Files bằng imageId
    await db.pool.execute(
      `UPDATE Files
       SET device_id = ?
       WHERE id = ?`, 
      [result.insertId, imageId]
    );

    res.status(201).json({ message: "Thêm thiết bị thành công!", deviceId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Xóa thiết bị
exports.deleteDevice = async (req, res, next) => { 
  const deviceId = req.params.id;
  console.log(deviceId);
  try {
    const [device] = await db.pool.execute(
      `SELECT id
       FROM Devices
       WHERE id = ?`, 
      [deviceId]
    );

    if (device.length === 0) {
      return res.status(404).json({ message: "Device not found" });
    }

    await db.pool.execute(
      `DELETE FROM Devices
       WHERE id = ?`, 
      [deviceId]
    );

    //Xóa các hình ảnh của thiết bị
    await db.pool.execute(
      `DELETE FROM Files
       WHERE device_id = ?`, 
      [deviceId]
    );

    res.status(200).json({ message: "Xóa thiết bị thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
