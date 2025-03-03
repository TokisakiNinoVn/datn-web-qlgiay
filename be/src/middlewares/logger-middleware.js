const db = require("../config/db.config");

const logAdminAction = async (idAdmin, actionType) => {
  const query = `
    INSERT INTO logs_admin (id_admin, action_type, createAt)
    VALUES (?, ?, NOW())
  `;
  const actionCreate = await db.pool.execute(query, [idAdmin, actionType]);
  return actionCreate;
};

const logAuditTrail = async (logId, tableName, targetId, fieldName, oldValue, newValue) => {
    const query = `
      INSERT INTO audit_trail (log_id, table_name, target_id, field_name, old_value, new_value, createAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.pool.execute(query, [logId, tableName, targetId, fieldName, oldValue, newValue]);
};

module.exports = { logAdminAction, logAuditTrail };
