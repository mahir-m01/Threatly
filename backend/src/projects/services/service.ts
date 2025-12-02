import prisma from "../../lib/prisma.js"

export const createProject = async (data: {
  name: string
  link: string
  description: string
  userId: string
}) => {
  return await prisma.projects.create({
    data,
  })
}

export const getProjectsByUserId = async (userId: string) => {
  return await prisma.projects.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getProjectById = async (id: string) => {
  return await prisma.projects.findUnique({
    where: {
      id,
    },
  })
}

export const updateProject = async (id: string, data: {
  name?: string
  link?: string
  description?: string
  status?: string
}) => {
  return await prisma.projects.update({
    where: {
      id,
    },
    data,
  })
}

export const deleteProject = async (id: string) => {
  return await prisma.projects.delete({
    where: {
      id,
    },
  })
}
