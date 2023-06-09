import React from 'react'

function Skill({skill}) {
    const skillsArray = skill?.split(",");
  return (
    <div className='poopi'>
    {skillsArray?.map((skill, index) => (
      <div id={index} className='bubble'>{skill?skill:"NA"}</div>
    ))}
  </div>
  )
}

export default Skill