'use client'

import React from 'react'

// PayloadCMS Lexical rich text node types
interface LexicalNode {
  type: string
  version: number
  [key: string]: any
}

interface LexicalText {
  type: 'text'
  text: string
  detail: number
  format: number
  mode: 'normal' | 'token' | 'segmented'
  style: string
}

interface LexicalElement {
  type: 'element'
  tag: string
  children: (LexicalText | LexicalElement)[]
  direction: 'ltr' | 'rtl'
  format: number
  indent: number
  [key: string]: any
}

interface LexicalRoot {
  type: 'root'
  children: (LexicalText | LexicalElement)[]
  direction: 'ltr' | 'rtl'
  format: number
  indent: number
}

interface RichTextRendererProps {
  content: LexicalRoot
  className?: string
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content || !content.children) {
    return <p className={`text-slate-600 ${className}`}>No content available</p>
  }

  const renderNode = (node: LexicalText | LexicalElement, index: number): React.ReactNode => {
    if (node.type === 'text') {
      const textNode = node as LexicalText
      let Element = 'span'
      let props: any = { key: index }

      // Handle text formatting
      if (textNode.format) {
        if (textNode.format & 1) { // Bold
          Element = 'strong'
        } else if (textNode.format & 2) { // Italic
          Element = 'em'
        }
      }

      // Handle text style (color, background, etc.)
      if (textNode.style) {
        props.style = { ...parseStyleString(textNode.style) }
      }

      return React.createElement(Element, props, textNode.text)
    }

    if (node.type === 'element') {
      const elementNode = node as LexicalElement
      const { tag, children } = elementNode

      // Map element tags to React components and Tailwind classes
      const tagMapping: Record<string, { component: string; className: string }> = {
        'p': { component: 'p', className: 'mb-4 text-slate-700 leading-relaxed' },
        'h1': { component: 'h1', className: 'text-3xl font-bold text-slate-900 mb-4 mt-6' },
        'h2': { component: 'h2', className: 'text-2xl font-bold text-slate-900 mb-3 mt-5' },
        'h3': { component: 'h3', className: 'text-xl font-bold text-slate-900 mb-2 mt-4' },
        'h4': { component: 'h4', className: 'text-lg font-semibold text-slate-900 mb-2 mt-3' },
        'h5': { component: 'h5', className: 'text-base font-semibold text-slate-900 mb-2 mt-3' },
        'h6': { component: 'h6', className: 'text-sm font-semibold text-slate-900 mb-2 mt-3' },
        'ul': { component: 'ul', className: 'list-disc list-inside mb-4 text-slate-700 space-y-1' },
        'ol': { component: 'ol', className: 'list-decimal list-inside mb-4 text-slate-700 space-y-1' },
        'li': { component: 'li', className: 'mb-1' },
        'blockquote': { 
          component: 'blockquote', 
          className: 'border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-slate-50 italic text-slate-700' 
        },
        'pre': { 
          component: 'pre', 
          className: 'bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4' 
        },
        'code': { 
          component: 'code', 
          className: 'bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm font-mono' 
        },
        'a': { component: 'a', className: 'text-indigo-600 hover:text-indigo-800 underline' },
        'strong': { component: 'strong', className: 'font-bold text-slate-900' },
        'em': { component: 'em', className: 'italic text-slate-700' },
        'u': { component: 'u', className: 'underline' },
        's': { component: 's', className: 'line-through text-slate-500' },
        'br': { component: 'br', className: '' },
        'hr': { component: 'hr', className: 'border-slate-200 my-6' },
      }

      const mapping = tagMapping[tag] || { component: 'div', className: '' }
      const Element = mapping.component

      // Build props for the element
      const props: any = { 
        key: index, 
        className: mapping.className 
      }

      // Handle links
      if (tag === 'a' && elementNode.attributes?.href) {
        props.href = elementNode.attributes.href
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }

      // Handle code language
      if (tag === 'code' && elementNode.attributes?.['data-highlight-language']) {
        props.className += ` language-${elementNode.attributes['data-highlight-language']}`
      }

      return React.createElement(
        Element,
        props,
        children?.map((child, childIndex) => renderNode(child, childIndex))
      )
    }

    return null
  }

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      {content.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}

// Helper function to parse style string to CSS object
function parseStyleString(styleString: string): React.CSSProperties {
  const styles: React.CSSProperties = {}
  
  if (!styleString) return styles

  styleString.split(';').forEach((style) => {
    const [property, value] = style.split(':').map(s => s.trim())
    if (property && value) {
      // Convert CSS property to camelCase for React
      const camelCaseProperty = property.replace(/-([a-z])/g, (match, letter) => 
        letter.toUpperCase()
      )
      
      // Convert CSS values to appropriate types
      if (property === 'color' || property === 'background-color') {
        styles[camelCaseProperty as keyof React.CSSProperties] = value
      } else if (property.includes('font-size') || property.includes('margin') || property.includes('padding')) {
        const numericValue = parseFloat(value)
        if (value.includes('px')) {
          styles[camelCaseProperty as keyof React.CSSProperties] = numericValue
        } else if (value.includes('rem')) {
          styles[camelCaseProperty as keyof React.CSSProperties] = numericValue * 16
        }
      }
    }
  })

  return styles
}

// Utility function to check if content is valid Lexical JSON
export function isValidLexicalContent(content: any): content is LexicalRoot {
  return (
    content &&
    typeof content === 'object' &&
    content.type === 'root' &&
    Array.isArray(content.children) &&
    content.children.every((child: any) => 
      child.type === 'text' || 
      (child.type === 'element' && Array.isArray(child.children))
    )
  )
}

// Fallback renderer for invalid or malformed content
export function FallbackRenderer({ content, className = '' }: { content: any; className?: string }) {
  if (typeof content === 'string') {
    return <div className={`text-slate-700 ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (Array.isArray(content)) {
    return (
      <div className={`text-slate-700 space-y-2 ${className}`}>
        {content.map((item, index) => (
          <div key={index} className="mb-2">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </div>
        ))}
      </div>
    )
  }

  return <div className={`text-slate-700 ${className}`}>Content not available</div>
}