import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Target,
  Award,
  Users,
  Activity,
  Settings,
  ChevronRight,
  Clock,
  Shield,
  Database,
  FileText,
  Send,
  Mail,
  Phone,
  MapPin,
  User,
  MessageSquare,
  LogIn,
  UserPlus,
  Zap,
} from 'lucide-react';
import { Footer } from './components/Footer';
import { ActivityMonitoring } from './pages/features/ActivityMonitoring';
import { ConfigurationManagement } from './pages/features/ConfigurationManagement';
import { LicenseManagement } from './pages/features/LicenseManagement';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AMO
                </span>
              </motion.div>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/features/activity" element={<ActivityMonitoring />} />
        <Route
          path="/features/configuration"
          element={<ConfigurationManagement />}
        />
        <Route path="/features/license" element={<LicenseManagement />} />
        <Route
          path="/"
          element={
            <main className="pt-32 pb-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center"
                  initial="initial"
                  animate="animate"
                  variants={fadeIn}
                >
                  <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    Analyze, Monitor, Optimize
                    <span className="block text-blue-600">
                      Your Business Operations
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                    Seamlessly track your sales data, monitor QR code usage, and
                    optimize your business performance with real-time analytics
                    and insights.
                  </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg w-fit mb-4">
                      <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Activity Monitoring
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Real-time tracking of system usage, QR code scans, and
                      performance metrics with detailed analytics.
                    </p>
                    <Link to="/features/activity">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn More <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg w-fit mb-4">
                      <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Configuration Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Centralized control over application settings, user
                      permissions, and system preferences.
                    </p>
                    <Link to="/features/configuration">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="text-purple-600 flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn More <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg w-fit mb-4">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      License Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Flexible licensing options including monthly, annual, and
                      lifetime plans with automated renewals.
                    </p>
                    <Link to="/features/license">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="text-green-600 flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn More <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Additional feature cards... */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg w-fit mb-4">
                      <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Comprehensive Records
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Complete history of transactions, customer interactions,
                      and system changes with advanced search.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-orange-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg w-fit mb-4">
                      <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      24/7 Availability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Round-the-clock access to your business data with
                      real-time synchronization and backup.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-red-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg w-fit mb-4">
                      <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Smart Reports
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Automated report generation with customizable templates
                      and export options.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-teal-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* About Section */}
                <motion.section
                  className="mt-32"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      About AMO
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      AMO is your comprehensive business management solution,
                      designed to streamline operations and provide valuable
                      insights through advanced analytics and monitoring.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <Target className="w-8 h-8 text-blue-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Our Mission
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        To empower businesses with intelligent tools for better
                        decision-making and operational excellence.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <Award className="w-8 h-8 text-purple-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Why Choose Us
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Industry-leading features, reliable support, and
                        continuous innovation make AMO the perfect choice.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <Users className="w-8 h-8 text-green-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Our Commitment
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We're dedicated to your success with 24/7 support and
                        regular platform improvements.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Contact Section */}
                <motion.section
                  className="mt-32"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Contact Us
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      We'd Love to Hear From You
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Email</h3>
                          <a
                            href="mailto:enokccg28@gmail.com"
                            className="text-blue-600 hover:underline"
                          >
                            enokccg28@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Phone</h3>
                          <a
                            href="tel:+250784638694"
                            className="text-blue-600 hover:underline"
                          >
                            +250 784 638 694
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            Address
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Kigali, Rwanda
                          </p>
                        </div>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                    >
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-colors"
                              placeholder="Your name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-colors"
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Subject
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-colors"
                              placeholder="Message subject"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-colors"
                            placeholder="Your message"
                            required
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.section>
              </div>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
