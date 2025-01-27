import { debounce, uniq } from 'lodash-es'
import { useEffect, useState } from 'react'
import {
  buildFontFamiliesHref,
  buildVariableFontFamiliesHref,
} from '../inputs/FontFamily/FontTags'
import { HtmlNode } from './types'

export function getStyleFonts(style: any): string[] {
  if (!style) return []
  let fonts: string[] = []

  if (style.fontFamily) {
    fonts.push(style.fontFamily)
  }

  for (const [_, v] of Object.entries(style)) {
    if (typeof v === 'object') {
      fonts = [...fonts, ...getStyleFonts(v)]
    }
  }

  return uniq(fonts)
}

export function getHTMLTreeFonts(root: any): string[] {
  if (!root) return []
  let treeFonts: any[] = []

  if (root.style) {
    treeFonts = [...getStyleFonts(root.style)]
  }

  if (!root.children) {
    return treeFonts
  }

  for (const node of root.children) {
    if (node.type !== 'text') {
      treeFonts = [...treeFonts, ...getHTMLTreeFonts(node)]
    }
  }

  return uniq(treeFonts)
}

interface BuildHrefProps {
  tree: any
  style: any
  setStaticHref: Function
  setVariableHref: Function
}
async function buildHrefs({
  tree,
  style,
  setStaticHref,
  setVariableHref,
}: BuildHrefProps) {
  const fonts = style ? getStyleFonts(style) : getHTMLTreeFonts(tree)
  const staticHref = await buildFontFamiliesHref(fonts)
  const variableHref = await buildVariableFontFamiliesHref(fonts)

  setStaticHref(staticHref)
  setVariableHref(variableHref)
}

const debouncedBuildHref = debounce(buildHrefs, 1500)

interface Props {
  htmlTree: any
  style?: any
}
export function HTMLFontTags({ htmlTree = {}, style }: Props) {
  const [staticHref, setStaticHref] = useState<string>('')
  const [variableHref, setVariableHref] = useState<string>('')

  useEffect(() => {
    debouncedBuildHref({
      tree: htmlTree,
      style,
      setStaticHref,
      setVariableHref,
    })
  }, [htmlTree, style])

  return (
    <>
      {staticHref ? <link rel="stylesheet" href={staticHref} /> : null}
      {variableHref ? <link rel="stylesheet" href={variableHref} /> : null}
    </>
  )
}
