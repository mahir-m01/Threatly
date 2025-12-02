import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'localkey';

const createUser = async (name: string, email: string, password: string) => {
  try {
    const exists = await prisma.users.findUnique({ where: { email } });
    if (exists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2d' });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  } catch (error) {
    throw error;
  }
};

const signInUser = async (email: string, password: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2d' });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, email: user.email, name: user.name };
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId: string, name?: string, email?: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // If email is being changed, check if it's already taken
    if (email && email !== user.email) {
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    return { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name };
  } catch (error) {
    throw error;
  }
};

export { createUser, signInUser, getUserById, updateUser };