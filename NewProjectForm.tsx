'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

export default function NewProjectForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    target_audience: '',
    purpose: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.topic || !formData.target_audience) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      
      const data = await response.json()
      
      toast({
        title: 'Project created!',
        description: 'Your new book project has been created successfully.'
      })
      
      // Redirect to the project page
      router.push(`/projects/${data.project.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Book Project</CardTitle>
        <CardDescription>
          Start your book writing journey by providing some basic information about your project.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Working Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., The Complete Guide to Digital Marketing"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">A brief phrase about what your book is about</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Topic <span className="text-red-500">*</span></Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g., Digital Marketing Strategies for Small Businesses"
              value={formData.topic}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">The main subject of your book</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience <span className="text-red-500">*</span></Label>
            <Input
              id="target_audience"
              name="target_audience"
              placeholder="e.g., Small business owners looking to improve their online presence"
              value={formData.target_audience}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">Who the book is for</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Book Purpose (Optional)</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="e.g., To help small business owners understand and implement effective digital marketing strategies with limited resources"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">The problem your book solves for the reader</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
