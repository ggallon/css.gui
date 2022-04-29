import { HTMLAttributes, useId } from 'react'
import Link from 'next/link'
import { Logo } from '@compai/logo'
import { SyntaxHighlighting } from './SyntaxHighlighting'

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const Layout = (props: Props) => {
  const id = useId()
  return (
    <>
      <SyntaxHighlighting />
      <header
        sx={{
          fontFamily: 'body',
          borderBottom: 'thin solid',
          borderColor: 'border',
          px: [2, 3, 4],
          py: 2,
          fontSize: [2, 3],
          position: 'sticky',
          width: '100%',
          backgroundColor: 'background',
          zIndex: 999,
          top: 0,
        }}
      >
        <Link href="/home" passHref={true}>
          <a
            sx={{
              fontWeight: 500,
              color: 'text',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Logo seed={id} sx={{ mr: 2 }} /> CSS GUI
          </a>
        </Link>
      </header>
      <div
        sx={{
          fontFamily: 'body',
          display: 'flex',
          flexDirection: ['column', 'row'],
        }}
        {...props}
      />
    </>
  )
}
