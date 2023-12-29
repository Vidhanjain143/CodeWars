import React from 'react'
import Navbar from '../Navbars/Navbar'
import ProblemDescription from './ProblemDescription'
import CodeEditor from './CodeEditor'
import Chat from './Chat'

const Workspace = () => {
  return (
    <>
     <Navbar/>
     <div className="flex min-w-screen">
      <ProblemDescription/>
      <CodeEditor/>
      <Chat/>
     </div>
    </>
  )
}

export default Workspace