#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 DiabeCare - Script de Build APK');
console.log('=====================================\n');

// Vérifier si EAS CLI est installé
function checkEASCLI() {
  try {
    execSync('eas --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Vérifier si l'utilisateur est connecté à Expo
function checkExpoLogin() {
  try {
    execSync('eas whoami', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Installer EAS CLI si nécessaire
function installEASCLI() {
  console.log('📦 Installation d\'EAS CLI...');
  try {
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
    console.log('✅ EAS CLI installé avec succès\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation d\'EAS CLI');
    return false;
  }
}

// Se connecter à Expo
function loginToExpo() {
  console.log('🔐 Connexion à Expo requise...');
  console.log('Veuillez vous connecter avec votre compte Expo (ou créer un compte sur expo.dev)\n');
  try {
    execSync('eas login', { stdio: 'inherit' });
    console.log('✅ Connexion réussie\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion');
    return false;
  }
}

// Configurer le projet pour EAS
function configureEAS() {
  console.log('⚙️ Configuration du projet pour EAS...');
  try {
    // Vérifier si eas.json existe déjà
    if (fs.existsSync('eas.json')) {
      console.log('✅ Configuration EAS déjà présente\n');
      return true;
    }
    
    execSync('eas build:configure', { stdio: 'inherit' });
    console.log('✅ Configuration EAS terminée\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la configuration EAS');
    return false;
  }
}

// Build APK
function buildAPK(profile = 'preview') {
  console.log(`🔨 Démarrage du build APK (profil: ${profile})...`);
  console.log('⏳ Cela peut prendre 10-20 minutes...\n');
  
  try {
    const command = `eas build --platform android --profile ${profile}`;
    execSync(command, { stdio: 'inherit' });
    console.log('\n🎉 Build APK terminé avec succès !');
    console.log('📱 Vous pouvez télécharger l\'APK depuis votre dashboard Expo');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du build APK');
    return false;
  }
}

// Afficher les options de build
function showBuildOptions() {
  console.log('📋 Options de build disponibles :');
  console.log('1. preview  - APK de développement (rapide, pour tests)');
  console.log('2. production - APK de production (optimisé, pour distribution)');
  console.log('3. development - APK avec dev client (pour développement)\n');
}

// Fonction principale
async function main() {
  try {
    // Vérifier les prérequis
    console.log('🔍 Vérification des prérequis...\n');
    
    if (!checkEASCLI()) {
      console.log('⚠️ EAS CLI non trouvé');
      if (!installEASCLI()) {
        process.exit(1);
      }
    } else {
      console.log('✅ EAS CLI trouvé\n');
    }
    
    if (!checkExpoLogin()) {
      console.log('⚠️ Non connecté à Expo');
      if (!loginToExpo()) {
        process.exit(1);
      }
    } else {
      console.log('✅ Connecté à Expo\n');
    }
    
    // Configurer EAS si nécessaire
    if (!configureEAS()) {
      process.exit(1);
    }
    
    // Afficher les options
    showBuildOptions();
    
    // Demander le type de build
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Choisissez le type de build (1-3) ou appuyez sur Entrée pour "preview": ', (answer) => {
      let profile = 'preview';
      
      switch (answer.trim()) {
        case '1':
        case '':
          profile = 'preview';
          break;
        case '2':
          profile = 'production';
          break;
        case '3':
          profile = 'development';
          break;
        default:
          console.log('⚠️ Option invalide, utilisation de "preview" par défaut');
          profile = 'preview';
      }
      
      rl.close();
      
      // Lancer le build
      if (buildAPK(profile)) {
        console.log('\n🎯 Instructions post-build :');
        console.log('1. Allez sur https://expo.dev/accounts/[votre-compte]/projects/diabecare/builds');
        console.log('2. Téléchargez l\'APK une fois le build terminé');
        console.log('3. Installez l\'APK sur votre appareil Android');
        console.log('4. Activez "Sources inconnues" si nécessaire\n');
        console.log('🏥 DiabeCare est prêt à être testé !');
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur inattendue :', error.message);
    process.exit(1);
  }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node build-apk.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Afficher cette aide');
  console.log('  --preview      Build APK de développement');
  console.log('  --production   Build APK de production');
  console.log('  --development  Build APK avec dev client');
  console.log('');
  console.log('Exemples:');
  console.log('  node build-apk.js');
  console.log('  node build-apk.js --preview');
  console.log('  node build-apk.js --production');
  process.exit(0);
}

if (args.includes('--preview')) {
  buildAPK('preview');
} else if (args.includes('--production')) {
  buildAPK('production');
} else if (args.includes('--development')) {
  buildAPK('development');
} else {
  main();
}
