// Test file existence
const fs = require('fs')
const path = require('path')

const files = [
  'data/db.ts',
  'lib/utils.ts', 
  'lib/auth.ts',
  'lib/tmdb.ts',
  'types/index.ts',
  'components/layout/Sidebar.tsx',
  'components/ui/ContentCard.tsx'
]

files.forEach(f => {
  const exists = fs.existsSync(path.join(process.cwd(), f))
  console.log(`${exists ? 'EXISTS' : 'MISSING'}: ${f}`)
})
