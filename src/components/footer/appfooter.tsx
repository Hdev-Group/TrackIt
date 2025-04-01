"use client"

import { Github, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AppFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full bg-[#101218] border-t border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} TrackIt is a Hdev group product
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms
            </a>
            
            <div className="flex items-center gap-3">
              <motion.a
                href="#"
                className="text-gray-500 hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={16} />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-500 hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={16} />
                <span className="sr-only">GitHub</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
