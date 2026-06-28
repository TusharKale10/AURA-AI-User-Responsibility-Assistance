import LifeBalance from '../models/LifeBalance.js';
import { computeAndSaveBalance } from '../utils/lifeBalanceEngine.js';

export const getLifeBalance = async (req, res, next) => {
  try {
    const latest = await LifeBalance.findOne({ user: req.user._id }).sort({ date: -1 });
    if (latest) return res.json({ lifeBalance: latest });
    // First visit — compute immediately
    const lb = await computeAndSaveBalance(req.user._id);
    return res.json({ lifeBalance: lb });
  } catch (err) {
    next(err);
  }
};

export const recalculate = async (req, res, next) => {
  try {
    const lb = await computeAndSaveBalance(req.user._id);
    res.json({ lifeBalance: lb });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await LifeBalance.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ history });
  } catch (err) {
    next(err);
  }
};

// kept for backward-compat (manual save from old clients)
export const saveLifeBalance = async (req, res, next) => {
  try {
    const lb = await computeAndSaveBalance(req.user._id);
    res.json({ lifeBalance: lb });
  } catch (err) {
    next(err);
  }
};
