import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "200px",
    opacity: 1,
    transition: { delay: 0.5 },
  },
};

const Modal = ({ showModal }) => {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="modal" variants={modal}>
            <p>Custom Alert Message in custom modal?</p>
            <Link to="/">
              <button>Clicker</button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

// (
//   <div className="order-place-modal">
//     <div className="order-placed">
//       <h1>Order Placed</h1>
//       <h2>You will be notified on your cell phone shortly.</h2>
//       <h2>Feel free to go through our website.</h2>
//       <h2>Here's some things you might be interested in</h2>
//       <button className="price">Wash your hands</button>
//       <Link to="/">
//         <button className="price">Back to our site</button>
//       </Link>
//       <Link to="/gallery">
//         <button className="price">
//           A Visual Walkthrough of our restaurant
//         </button>
//       </Link>
//       <Link to="/menu">
//         <button className="price">More Fooooood</button>
//       </Link>
//       <button className="price"> Know More About The Developer :v</button>
//     </div>
//     <div className="background"></div>
//   </div>
// ) : (
//   ""
// )
