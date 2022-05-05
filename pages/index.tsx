import Box from '@mui/material/Box'
import type { NextPage } from 'next'
import Exchange from '../modules/Exchange'

const Home: NextPage = () => {
  return (
    <>
      {/* <Box boxShadow="0 2px 4px #ccc" py={6}> */}
      <Exchange />
      {/* </Box> */}
    </>
  )
}

export default Home
