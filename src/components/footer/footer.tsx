import { useState } from 'react';
import { motion } from 'framer-motion';
import { LinkedinIcon as LinkedIn, Github} from 'lucide-react';
import Button from '../button/button';

export default function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  const socialIcons = [
    { Icon: LinkedIn, href: '#' },
    { Icon: Github, href: '#' },
  ];

  return (
    <footer className="relative flex items-center bg-[#101218] justify-center flex-col gap-10 w-full text-[#f0f0f0] py-16">
      <div className="container z-30 mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
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

