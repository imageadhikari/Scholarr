import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const svgVariants = {
  initial: { opacity: 0, y: -1000 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      // duration: 1,
    },
  },
};

const pathVariants = {
  initial: { opacity: 0, x: 10, y: 10, scale: 0 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 0.9,
    transition: {
      // x: { delay: 0.5 },
      // y: { delay: 0.5 },
      scale: {
        yoyo: Infinity,
        duration: 2,
      },
      // opacity: {
      //   yoyo: Infinity,
      //   duration: 2,
      // },
    },
  },
  exit: {
    opacity: 0.5,
    y: 1000,
  },
};
const moonVariants = {
  initial: { opacity: 0, fill: "#CDCDCD", y: -1000 },
  animate: {
    opacity: 1,
    fill: "#ffffff",
    y: 0,
    transition: {
      // x: { delay: 0.5 },
      // y: { delay: 0.5 },
      fill: {
        yoyo: Infinity,
        duration: 5,
      },
    },
  },
  exit: {
    opacity: 0.5,
    y: 1000,
    transition: {
      duration: 1,
    },
  },
};

const sunVariants = {
  initial: { opacity: 0, y: -1000 },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    y: 1000,
    transition: {
      duration: 1,
    },
  },
};

const cloudVariants = {
  initial: {
    x: -100,
    y: 200,
  },
  animate: {
    x: [-100, 300, 600],
    transition: {
      duration: 15,
      yoyo: Infinity,
    },
  },
};
const cloudTwoVariants = {
  initial: {
    x: 600,
    y: 100,
  },
  animate: {
    x: [600, 300, -100],
    transition: {
      duration: 15,
      yoyo: Infinity,
    },
  },
};

const Weather = () => {
  const [activeVector, setActiveVector] = useState(daySVG);
  const [time, setTime] = useState(new Date());

  console.log(time.getTime());

  const loadVector = () => {
    if (time.getHours() <= 17) {
      setActiveVector(daySVG);
    } else {
      setActiveVector(nightSVG);
    }
    console.log(time);
  };

  useEffect(() => {
    loadVector();
  });

  return (
    <div className="welcome-section">
      <AnimatePresence>{activeVector}</AnimatePresence>
      <div className="welcome-message">
        <h1 className="good">Good</h1>
        <h1 className="morning">Morning</h1>
        <h2 className="weather">Its Chillin 5deg</h2>
      </div>
    </div>
  );
};

export default Weather;

const nightSVG = (
  <motion.svg
    key={1234}
    variants={svgVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="svg-backdrop"
    width="68%"
    viewBox="0 0 1397 488"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_i)">
      <path
        d="M28.8041 427.897L0 466.796V0H28.8041H174.425H348.85H523.275H697.7H872.125H1048.15H1222.58H1397C1337.79 0 1280.18 -3.76075e-06 1222.58 48.6246C1163.37 97.2492 1105.76 194.498 1048.15 204.223C988.942 213.948 931.333 136.149 872.125 136.149C814.517 136.149 756.908 213.948 697.7 282.023C640.092 350.097 582.483 408.447 523.275 447.347C465.667 486.246 408.058 505.696 348.85 466.796C291.242 427.897 232.033 330.647 174.425 320.922C116.817 311.198 57.6082 388.997 28.8041 427.897Z"
        fill="#2E2B55"
      />
    </g>
    <motion.path
      variants={moonVariants}
      d="M465 135.5C465 156.211 448.211 173 427.5 173C406.789 173 390 156.211 390 135.5C390 114.789 406.789 98 427.5 98C448.211 98 465 114.789 465 135.5Z"
      fill="white"
    />
    <motion.path
      variants={cloudVariants}
      d="M106.68 33.0125C107.494 31.1973 107.95 29.2125 107.95 27.1429C107.95 18.1518 99.4172 10.8571 88.9 10.8571C84.9908 10.8571 81.3395 11.875 78.3233 13.6054C72.8266 5.4625 62.5673 0 50.8 0C33.2581 0 19.05 12.1464 19.05 27.1429C19.05 27.6009 19.0698 28.0589 19.0897 28.517C7.97719 31.8589 0 40.9179 0 51.5714C0 65.058 12.7992 76 28.575 76H101.6C115.63 76 127 66.2795 127 54.2857C127 43.7848 118.269 35.0143 106.68 33.0125Z"
      fill="url(#paint0_radial)"
    />
    <defs>
      <radialGradient
        id="paint0_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(27.6795 13.3704) rotate(45.365) scale(76.4755 128.866)"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="1" stopColor="white" stopOpacity="0.3" />
      </radialGradient>
    </defs>

    <motion.path
      variants={cloudTwoVariants}
      d="M106.68 33.0125C107.494 31.1973 107.95 29.2125 107.95 27.1429C107.95 18.1518 99.4172 10.8571 88.9 10.8571C84.9908 10.8571 81.3395 11.875 78.3233 13.6054C72.8266 5.4625 62.5673 0 50.8 0C33.2581 0 19.05 12.1464 19.05 27.1429C19.05 27.6009 19.0698 28.0589 19.0897 28.517C7.97719 31.8589 0 40.9179 0 51.5714C0 65.058 12.7992 76 28.575 76H101.6C115.63 76 127 66.2795 127 54.2857C127 43.7848 118.269 35.0143 106.68 33.0125Z"
      fill="url(#paint0_radial)"
    />
    <defs>
      <radialGradient
        id="paint0_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(27.6795 13.3704) rotate(45.365) scale(76.4755 128.866)"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="1" stopColor="white" stopOpacity="0.3" />
      </radialGradient>
    </defs>

    <motion.path
      variants={pathVariants}
      d="M519 157C519 155.343 517.657 154 516 154C514.343 154 513 155.343 513 157C513 158.657 514.343 160 516 160C517.657 160 519 158.657 519 157Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M350 44C350 42.3431 348.657 41 347 41C345.343 41 344 42.3431 344 44C344 45.6569 345.343 47 347 47C348.657 47 350 45.6569 350 44Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M447 251C447 249.343 445.657 248 444 248C442.343 248 441 249.343 441 251C441 252.657 442.343 254 444 254C445.657 254 447 252.657 447 251Z"
      fill="white"
    />
    <motion.path
      d="M522 60C522 58.3431 520.657 57 519 57C517.343 57 516 58.3431 516 60C516 61.6569 517.343 63 519 63C520.657 63 522 61.6569 522 60Z"
      fill="white"
    />

    <motion.path
      variants={pathVariants}
      d="M276 328C276 326.343 274.657 325 273 325C271.343 325 270 326.343 270 328C270 329.657 271.343 331 273 331C274.657 331 276 329.657 276 328Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M197 211C197 209.343 195.657 208 194 208C192.343 208 191 209.343 191 211C191 212.657 192.343 214 194 214C195.657 214 197 212.657 197 211Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M509 389C509 387.343 507.657 386 506 386C504.343 386 503 387.343 503 389C503 390.657 504.343 392 506 392C507.657 392 509 390.657 509 389Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M689 211C689 209.343 687.657 208 686 208C684.343 208 683 209.343 683 211C683 212.657 684.343 214 686 214C687.657 214 689 212.657 689 211Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M595 272C595 270.343 593.657 269 592 269C590.343 269 589 270.343 589 272C589 273.657 590.343 275 592 275C593.657 275 595 273.657 595 272Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M304 110C304 108.343 302.657 107 301 107C299.343 107 298 108.343 298 110C298 111.657 299.343 113 301 113C302.657 113 304 111.657 304 110Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M194 66C194 64.3431 192.657 63 191 63C189.343 63 188 64.3431 188 66C188 67.6569 189.343 69 191 69C192.657 69 194 67.6569 194 66Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M764 81C764 79.3431 762.657 78 761 78C759.343 78 758 79.3431 758 81C758 82.6569 759.343 84 761 84C762.657 84 764 82.6569 764 81Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M41 269C41 267.343 39.6569 266 38 266C36.3431 266 35 267.343 35 269C35 270.657 36.3431 272 38 272C39.6569 272 41 270.657 41 269Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M38 54C38 52.3431 36.6569 51 35 51C33.3431 51 32 52.3431 32 54C32 55.6569 33.3431 57 35 57C36.6569 57 38 55.6569 38 54Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M72 160C72 158.343 70.6569 157 69 157C67.3431 157 66 158.343 66 160C66 161.657 67.3431 163 69 163C70.6569 163 72 161.657 72 160Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M1079 63C1079 61.3431 1077.66 60 1076 60C1074.34 60 1073 61.3431 1073 63C1073 64.6569 1074.34 66 1076 66C1077.66 66 1079 64.6569 1079 63Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M1000 113C1000 111.343 998.657 110 997 110C995.343 110 994 111.343 994 113C994 114.657 995.343 116 997 116C998.657 116 1000 114.657 1000 113Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M932 17C932 15.3431 930.657 14 929 14C927.343 14 926 15.3431 926 17C926 18.6569 927.343 20 929 20C930.657 20 932 18.6569 932 17Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M47 383C47 381.343 45.6569 380 44 380C42.3431 380 41 381.343 41 383C41 384.657 42.3431 386 44 386C45.6569 386 47 384.657 47 383Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M350 420C350 418.343 348.657 417 347 417C345.343 417 344 418.343 344 420C344 421.657 345.343 423 347 423C348.657 423 350 421.657 350 420Z"
      fill="white"
    />
    <motion.path
      variants={pathVariants}
      d="M616 92C616 90.3431 614.657 89 613 89C611.343 89 610 90.3431 610 92C610 93.6569 611.343 95 613 95C614.657 95 616 93.6569 616 92Z"
      fill="white"
    />

    <defs>
      <filter
        id="filter0_i"
        x="0"
        y="0"
        width="1397"
        height="488"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="10" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
      </filter>
    </defs>
  </motion.svg>
);

const daySVG = (
  <motion.svg
    key={123}
    className="svg-backdrop"
    variants={svgVariants}
    exit="exit"
    initial="initial"
    animate="animate"
    width="68%"
    viewBox="0 0 1397 488"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_i)">
      <path
        d="M28.8041 427.897L0 466.796V0H28.8041H174.425H348.85H523.275H697.7H872.125H1048.15H1222.58H1397C1337.79 0 1280.18 -3.76075e-06 1222.58 48.6246C1163.37 97.2492 1105.76 194.498 1048.15 204.223C988.942 213.948 931.333 136.149 872.125 136.149C814.517 136.149 756.908 213.948 697.7 282.023C640.092 350.097 582.483 408.447 523.275 447.347C465.667 486.246 408.058 505.696 348.85 466.796C291.242 427.897 232.033 330.647 174.425 320.922C116.817 311.198 57.6082 388.997 28.8041 427.897Z"
        fill="#007388"
      />
    </g>
    <motion.path
      variants={sunVariants}
      d="M465 135.5C465 156.211 448.211 173 427.5 173C406.789 173 390 156.211 390 135.5C390 114.789 406.789 98 427.5 98C448.211 98 465 114.789 465 135.5Z"
      fill="#FFFF6D"
    />
    <defs>
      <filter
        id="filter0_i"
        x="0"
        y="0"
        width="1397"
        height="488"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="10" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
      </filter>
    </defs>
  </motion.svg>
);
