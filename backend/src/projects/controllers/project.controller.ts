import { Request, Response } from "express"
import { createProject, getProjectsByUserId, getProjectById, updateProject, deleteProject } from "../services/service.js"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, link, description } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    if (!name || !link || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, link, and description are required",
      })
    }

    const project = await createProject({
      name,
      link,
      description,
      userId,
    })

    return res.status(201).json({
      success: true,
      data: project,
      message: "Project created successfully",
    })
  } catch (error: any) {
    console.error("Error creating project:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const projects = await getProjectsByUserId(userId)

    return res.status(200).json({
      success: true,
      data: projects,
    })
  } catch (error: any) {
    console.error("Error fetching projects:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getOne = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    return res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error: any) {
    console.error("Error fetching project:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, link, description } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const updateData: { name?: string; link?: string; description?: string } = {}
    if (name !== undefined) updateData.name = name
    if (link !== undefined) updateData.link = link
    if (description !== undefined) updateData.description = description

    const updatedProject = await updateProject(id, updateData)

    return res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating project:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteOne = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    await deleteProject(id)

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const updateStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'",
      })
    }

    const project = await getProjectById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const updatedProject = await updateProject(id, { status })

    return res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project status updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating project status:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
