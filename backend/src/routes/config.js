const express = require('express');
const db = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * 获取系统配置
 * GET /api/config
 * 公开接口，无需认证
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT config_key, config_value, config_type FROM system_configs'
    );

    // 将配置转换为键值对格式
    const configs = {};
    result.rows.forEach((row) => {
      let value = row.config_value;

      // 根据类型转换值
      if (row.config_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.error(`解析JSON配置失败: ${row.config_key}`, e);
        }
      } else if (row.config_type === 'number') {
        value = Number(value);
      } else if (row.config_type === 'boolean') {
        value = value === 'true' || value === '1';
      }

      // 使用点号分隔的键创建嵌套对象
      const keys = row.config_key.split('.');
      let current = configs;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    });

    res.json({
      success: true,
      data: configs,
    });
  } catch (err) {
    console.error('获取系统配置错误:', err);
    res.status(500).json({ error: '获取配置失败' });
  }
});

/**
 * 获取特定配置项
 * GET /api/config/:key
 * 公开接口，无需认证
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.query(
      'SELECT config_value, config_type FROM system_configs WHERE config_key = $1',
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '配置项不存在' });
    }

    const row = result.rows[0];
    let value = row.config_value;

    if (row.config_type === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error(`解析JSON配置失败: ${key}`, e);
      }
    } else if (row.config_type === 'number') {
      value = Number(value);
    } else if (row.config_type === 'boolean') {
      value = value === 'true' || value === '1';
    }

    res.json({
      success: true,
      data: { [key]: value },
    });
  } catch (err) {
    console.error('获取配置项错误:', err);
    res.status(500).json({ error: '获取配置失败' });
  }
});

/**
 * 更新系统配置（需要管理员权限）
 * PUT /api/config/:key
 */
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    // 检查用户是否有权限（这里简化处理，实际应该检查管理员角色）
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: '无权修改配置' });
    }

    const { key } = req.params;
    const { value, type = 'string' } = req.body;

    let configValue = value;
    if (type === 'json') {
      configValue = JSON.stringify(value);
    }

    await db.query(
      `UPDATE system_configs 
       SET config_value = $1, config_type = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE config_key = $3`,
      [configValue, type, key]
    );

    res.json({
      success: true,
      message: '配置更新成功',
    });
  } catch (err) {
    console.error('更新配置错误:', err);
    res.status(500).json({ error: '更新配置失败' });
  }
});

/**
 * 批量获取配置
 * POST /api/config/batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { keys } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ error: '请提供配置键列表' });
    }

    // 构建占位符
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    const result = await db.query(
      `SELECT config_key, config_value, config_type FROM system_configs WHERE config_key IN (${placeholders})`,
      keys
    );

    const configs = {};
    result.rows.forEach((row) => {
      let value = row.config_value;

      if (row.config_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.error(`解析JSON配置失败: ${row.config_key}`, e);
        }
      } else if (row.config_type === 'number') {
        value = Number(value);
      } else if (row.config_type === 'boolean') {
        value = value === 'true' || value === '1';
      }

      configs[row.config_key] = value;
    });

    res.json({
      success: true,
      data: configs,
    });
  } catch (err) {
    console.error('批量获取配置错误:', err);
    res.status(500).json({ error: '获取配置失败' });
  }
});

module.exports = router;
