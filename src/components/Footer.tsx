import { Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AMO Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Empowering businesses with intelligent monitoring and optimization
              solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/features/activity"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Activity Monitoring
                </a>
              </li>
              <li>
                <a
                  href="/features/configuration"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Configuration
                </a>
              </li>
              <li>
                <a
                  href="/features/license"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Licensing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:enokccg28@gmail.com"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  enockccg28@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+250784638694"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  +250 784 638 694
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                Kigali, Rwanda
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/menttech1019/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/enock-niyonsaba-58b02432a/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {currentYear} AMO Platform. Made with{' '}
            <Heart className="w-4 h-4 inline-block text-red-500" /> in Rwanda.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
