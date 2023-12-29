import React from 'react'

const ProblemDescription = () => {
  return (
    <div className='w-[30%] bg-slate-800 flex flex-col h-fit min-h-[89.5vh] text-white border-r-2 border-white'>
        <div className="bg-black h-[40px] flex items-end"><span className='text-white bg-slate-800 ml-2 p-1 rounded-tl-lg rounded-tr-lg'>Introduction</span></div>
        <div className="font-2xl p-3">
        <span className='text-xl font-semibold'>Welcome 🎉 to CodeWars!</span><br/><br/>
        Let's get you set up and ready to compete.<br/>
        Follow these instructions to begin your coding journey.<br/><br/>
        <span className='text-xl font-semibold'>Invite Friends  🤝</span><br/><br/>
        Bring your friends along for the ride! <br/>
        Click the  🔗  on the top right corner to easily share the contest link and invite them to join the competition.<br/><br/>
        <span className='text-xl font-semibold'>Problems  🤔</span><br/><br/>
        Solve the challenge and come out on top! <br/>
        The first one to solve all the problems wins the contest.<br/><br/>
        <span className='text-xl font-semibold'>Editor  📝</span><br/><br/>
        Write your code, test it and submit it to win! <br/>
        Use the editor to write your solution and click the 'Run' 🏃‍♂️ to test it. <br/>
        Once you're confident in your solution, click the 'Submit' 💯 to solve the problem and compete for the victory<br/><br/>
        </div>
    </div>
  )
}

export default ProblemDescription