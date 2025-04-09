import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextRequest, NextResponse } from 'next/server'

// Create a new project
export async function POST(request: NextRequest) {
  try {
    const cf = await getCloudflareContext()
    const { title, topic, target_audience, purpose } = await request.json()

    // Validate required fields
    if (!title || !topic || !target_audience) {
      return NextResponse.json(
        { error: 'Missing required fields: title, topic, and target_audience are required' },
        { status: 400 }
      )
    }

    // Insert the new project
    const { results } = await cf.env.DB.prepare(
      'INSERT INTO projects (title, topic, target_audience, purpose) VALUES (?, ?, ?, ?) RETURNING id, title, topic, target_audience, purpose, created_at, updated_at'
    )
      .bind(title, topic, target_audience, purpose || null)
      .all()

    // Create an initial outline for the project
    if (results.length > 0) {
      const projectId = results[0].id
      await cf.env.DB.prepare('INSERT INTO outlines (project_id, title, description) VALUES (?, ?, ?)')
        .bind(projectId, `${title} - Outline`, 'Initial outline')
        .run()
    }

    return NextResponse.json({ project: results[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// Get all projects
export async function GET() {
  try {
    const cf = await getCloudflareContext()
    const { results } = await cf.env.DB.prepare(
      'SELECT id, title, topic, target_audience, purpose, created_at, updated_at FROM projects ORDER BY updated_at DESC'
    ).all()

    return NextResponse.json({ projects: results })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
