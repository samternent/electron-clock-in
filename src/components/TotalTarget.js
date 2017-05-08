import React from 'react'

const TotalTarget = ({ title, value, perc, radius, color }) => {
  const circumference = () => {
    return 2 * Math.PI * radius
  }

  const getDashoffset = () => {
    return circumference()- ((circumference() / 100) * perc)
  }

  return (
    <div className="item">
      <h3 className='clock-in__title'>{title}</h3>
      <div className='clock-in__total-target-time'>
        {value}
      </div>
      <svg width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="inset-shadow">
          <feFlood floodColor="#fff"/>
          <feComposite operator="xor" in2="SourceGraphic"/>
          <feGaussianBlur stdDeviation="1"/>
          <feComposite operator="in" in2="SourceGraphic" result="map"/>
          <feDiffuseLighting lightingColor="white" surfaceScale="2" diffuseConstant="1">
          <feSpotLight x="-30" y="-30" z="530"/>
        </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" />
          <feComposite operator="in" in2="SourceGraphic"/>

        </filter>
      </defs>
       <g>
         <circle
           r={radius}
           filter="url(#inset-shadow)"
           cy="50%" cx="50%"
           strokeWidth="8"
           stroke="#eee" fill="none"
         />
        <circle
          filter="url(#inset-shadow)"
          strokeDasharray={circumference()}
          strokeDashoffset={getDashoffset()}
          className="circle_animation"
          r={radius}
          cy="50%" cx="50%"
          strokeWidth="8"
          stroke={color} fill="none"
        />
       </g>
      </svg>
    </div>
  )
}

export default TotalTarget
