import { ContactForm } from "@/components/ui/contact-form";
import { GoogleMapsEmbed } from "@/components/ui/google-maps";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-scale-in">
            Contactez-Nous
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up animate-stagger-1">
            Nous sommes là pour répondre à vos questions et vous accompagner
            dans votre parcours de Ju-Jitsu
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#017444]/10 dark:bg-[#017444]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#017444]/20 dark:group-hover:bg-[#017444]/30 transition-colors duration-300">
                <MapPin className="h-8 w-8 text-[#017444]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Adresse
              </h3>
              <div className="text-muted-foreground space-y-1">
                <p>Complexe Sportif Mohammed V</p>
                <p>Avenue Hassan II</p>
                <p>Casablanca, Maroc 20000</p>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#017444]/10 dark:bg-[#017444]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#017444]/20 dark:group-hover:bg-[#017444]/30 transition-colors duration-300">
                <Phone className="h-8 w-8 text-[#017444]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Téléphone
              </h3>
              <a
                href="tel:+212522123456"
                className="text-[#017444] hover:text-emerald-700 transition-colors duration-300 font-medium"
              >
                +212 522 123 456
              </a>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#017444]/10 dark:bg-[#017444]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#017444]/20 dark:group-hover:bg-[#017444]/30 transition-colors duration-300">
                <Mail className="h-8 w-8 text-[#017444]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Email
              </h3>
              <a
                href="mailto:contact@lrcsjj.ma"
                className="text-[#017444] hover:text-emerald-700 transition-colors duration-300 font-medium"
              >
                contact@lrcsjj.ma
              </a>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#017444]/10 dark:bg-[#017444]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#017444]/20 dark:group-hover:bg-[#017444]/30 transition-colors duration-300">
                <Clock className="h-8 w-8 text-[#017444]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Heures d&apos;Ouverture
              </h3>
              <div className="text-muted-foreground space-y-1">
                <p>Lun-Ven: 9h00 - 18h00</p>
                <p>Samedi: 9h00 - 14h00</p>
                <p className="text-red-500">Dimanche: Fermé</p>
              </div>
            </div>
          </div>

          {/* Contact Form and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form - Takes more space */}
            <div className="lg:col-span-3 animate-slide-in-right">
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Envoyez-nous un Message
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Utilisez ce formulaire pour nous poser vos questions ou
                    demander des informations
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2 animate-slide-in-left">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Notre Localisation
                  </h3>
                  <p className="text-muted-foreground">
                    Trouvez-nous facilement sur la carte
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <GoogleMapsEmbed className="w-full h-80 lg:h-96" />
                </div>

                <div className="mt-6 p-6 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-3">
                    Informations de Transport
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>🚊 Tramway: Arrêt Mohammed V</p>
                    <p>🚌 Bus: Lignes 10, 15, 21</p>
                    <p>🚗 Parking gratuit disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
