import { useState } from 'react';
import { motion } from 'framer-motion';
import { LinkedinIcon as LinkedIn, Github} from 'lucide-react';

export default function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  const socialIcons = [
    { Icon: LinkedIn, href: '#' },
    { Icon: Github, href: '#' },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br shadow-2xl shadow-cyan-500 from-[#090a0c] to-[#1c1e24] text-[#f0f0f0] py-16">
      <div className="container z-30 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <motion.h2 
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0099ff] to-cyan-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Join TrackIt Today
            </motion.h2>
            <motion.p 
              className="text-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              TrackIt helps start-ups manage teams, support requests, shifts, and projects efficiently.
            </motion.p>
          </div>
          <FooterLinks />
        </div>
        
        <div className="border-t z-50 border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Hdev Group. All rights reserved.
          </p>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
          <div className="flex space-x-4">
            {socialIcons.map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#0099ff]/35 to-cyan-500/30 blur-3xl pointer-events-none"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.8 }}
      />
    </footer>
  );
}



const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "FAQ"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
]

function FooterLinks() {
  return (
    <>
      {footerLinks.map((section, index) => (
        <div key={index}>
          <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-2">
            {section.links.map((link, linkIndex) => (
              <motion.li key={linkIndex} whileHover={{ x: 5 }}>
                <a href="#" className="text-gray-400 hover:text-white hover:after:h-[80%] hover:after:w-[1px] hover:after:bg-white/70 hover:after:absolute hover:after:right-full  hover:after:top-[10%] hover:after:mr-2 transition-colors duration-300">
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

