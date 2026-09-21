import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageBanner } from "../../lib/hooks";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { localBusinessSchema } from "../../lib/seo-data";
import { PageHero } from "../components/PageHero";

const DEFAULT_BG = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80";

export default function ContactPage() {
  const { data: banner } = usePageBanner("contact");

  const locations = [
    {
      city: "Delhi (Head Office)",
      slug: "delhi",
      address: "Okhla Industrial Estate, New Delhi - 110020, Delhi, India",
      phone: "+91 98185 92113",
      email: "info@pacificproduct.in",
    },
    {
      city: "Mumbai",
      slug: "mumbai",
      address: "Andheri East, Mumbai, Maharashtra, India",
      phone: "+91 98185 92113",
      email: "info@pacificproduct.in",
    },
    {
      city: "Bangalore",
      slug: "bangalore",
      address: "Bangalore, Karnataka, India",
      phone: "+91 98185 92113",
      email: "info@pacificproduct.in",
    },
    {
      city: "Kolkata",
      slug: "kolkata",
      address: "Salt Lake Sector V, Kolkata - 700091, West Bengal, India",
      phone: "+91 98185 92113",
      email: "info@pacificproduct.in",
    },
    {
      city: "Dubai, UAE",
      slug: "uae",
      address: "Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
      phone: "+971 4 333 4444",
      email: "ejaj@pacificproduct.in",
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      <SEO
        title="Contact Pacific Products & Solutions | Get a Quote"
        description="Request a quote for restroom cubicles, cladding & locker systems. Call +91 98185 92113 or visit our Delhi office. Pan-India installation available."
        canonical="/contact"
        jsonLd={localBusinessSchema()}
      />
      {/* Hero Banner */}
      <PageHero
        title="Contact Us"
        accentWord="Us"
        subtitle="Get in touch with our team for quotes, project consultations, or any inquiries. We're ready to help you create better commercial spaces."
        breadcrumb="Contact Us"
        backgroundImage={banner?.image_url}
      />

      {/* Contact Form & Info */}
      <section className="py-20 sm:py-28 bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact Information</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Get in touch with us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#B5F823]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Phone</h4>
                    <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">+91 98185 92113</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#B5F823]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Email</h4>
                    <a href="mailto:info@pacificproduct.in" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">info@pacificproduct.in</a>
                    <a href="mailto:ejaj@pacificproduct.in" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">ejaj@pacificproduct.in</a>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#B5F823]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Head Office</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      Okhla Industrial Estate, New Delhi - 110020<br />
                      Delhi, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#B5F823]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Business Hours</h4>
                    <p className="text-gray-400">Monday - Friday: <span className="text-white font-medium">9:00 AM - 6:00 PM</span></p>
                    <p className="text-gray-400">Saturday: <span className="text-white font-medium">9:00 AM - 2:00 PM</span></p>
                    <p className="text-gray-400">Sunday: <span className="text-[#B5F823]">Closed</span></p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#7FB706]/20 to-[#6fa005]/5 border border-[#7FB706]/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B5F823]/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Need Quick Assistance?</h3>
                <p className="text-gray-300 mb-6 relative z-10">Chat with us on WhatsApp for instant support</p>
                <button
                  onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                  className="relative z-10 inline-flex items-center px-6 py-3 bg-[#7FB706] text-white font-medium rounded-xl hover:bg-[#8cc70a] shadow-lg shadow-[#7FB706]/30 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 sm:py-28 bg-[#0a0a1a] transition-colors border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Our Locations</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find us across major cities in India and the UAE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/locations/${location.slug}`}
                  className="block bg-[#030213] rounded-3xl p-8 border border-white/5 hover:border-[#7FB706]/30 hover:shadow-2xl hover:shadow-[#7FB706]/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#B5F823] transition-colors">{location.city}</h3>
                    <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-[#7FB706] transition-colors font-medium mt-1">
                      View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <div className="space-y-4 text-gray-400">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-[#7FB706] flex-shrink-0" />
                      <p className="leading-relaxed">{location.address}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[#7FB706]" />
                      <p>{location.phone}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[#7FB706]" />
                      <p>{location.email}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] sm:h-[500px] w-full relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112130.34005085694!2d76.99403816684724!3d28.514782017772656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="filter dark:invert dark:hue-rotate-180 opacity-60 dark:opacity-80 transition-all duration-300 grayscale dark:grayscale-0 contrast-125"
          title="Delhi NCR Office Location"
        ></iframe>
      </section>
    </div>
  );
}
