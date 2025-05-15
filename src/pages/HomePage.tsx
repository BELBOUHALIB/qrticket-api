import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, QrCode, Smartphone } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Créez et Gérez vos Événements</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Plateforme complète pour la création de tickets d'événements avec codes QR et validation mobile
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/events" 
              className="bg-white text-indigo-600 hover:bg-indigo-100 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg"
            >
              Découvrir les événements
            </Link>
            <Link 
              to="/login" 
              className="bg-indigo-800 hover:bg-indigo-900 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg"
            >
              Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Création de Tickets</h3>
              <p className="text-gray-600">
                Créez facilement des tickets personnalisés pour vos événements avec des codes QR uniques.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Codes QR Sécurisés</h3>
              <p className="text-gray-600">
                Chaque ticket est doté d'un code QR unique et sécurisé pour éviter la fraude.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Application Mobile</h3>
              <p className="text-gray-600">
                Scannez et validez les tickets avec notre application mobile dédiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment Ça Marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold mb-2">Créez un Événement</h3>
              <p className="text-gray-600">
                Définissez les détails de votre événement, date, lieu et types de billets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold mb-2">Vendez des Tickets</h3>
              <p className="text-gray-600">
                Partagez votre événement et vendez des billets avec codes QR intégrés.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold mb-2">Téléchargez l'App</h3>
              <p className="text-gray-600">
                Utilisez notre application mobile pour scanner les codes QR à l'entrée.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">4</div>
              <h3 className="text-xl font-semibold mb-2">Gérez l'Événement</h3>
              <p className="text-gray-600">
                Suivez les entrées en temps réel et gérez votre événement efficacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Gérer Vos Événements ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'organisateurs qui utilisent notre plateforme pour gérer leurs événements.
          </p>
          <Link 
            to="/login" 
            className="bg-white text-indigo-600 hover:bg-indigo-100 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg inline-block"
          >
            Se Connecter
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;