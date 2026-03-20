import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const search = req.query.search as string | undefined;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) where.title = { contains: search };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page, limit, total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) { next(error); }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json({ success: true, message: 'Task created successfully', data: { task } });
  } catch (error) { next(error); }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new AppError('Task not found.', 404);
    res.json({ success: true, data: { task } });
  } catch (error) { next(error); }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found.', 404);

    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    res.json({ success: true, message: 'Task updated successfully', data: { task } });
  } catch (error) { next(error); }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found.', 404);
    await prisma.task.delete({ where: { id } });
    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) { next(error); }
};

export const toggleTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found.', 404);

    const statusCycle: Record<TaskStatus, TaskStatus> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'PENDING',
    };

    const newStatus = statusCycle[existing.status as TaskStatus] || 'PENDING';

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    res.json({ success: true, message: `Task status changed to ${newStatus.replace('_', ' ')}`, data: { task } });
  } catch (error) { next(error); }
};
