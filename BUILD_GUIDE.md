# 📱 Guide de Build APK - DiabeCare

## 🎯 Options de Build Disponibles

### 1. 🚀 Build avec EAS (Recommandé)

#### Prérequis
- Compte Expo (gratuit)
- EAS CLI installé

#### Étapes
```bash
# 1. Se connecter à Expo
eas login

# 2. Configurer le projet
eas build:configure

# 3. Build APK de développement
eas build --platform android --profile preview

# 4. Build APK de production
eas build --platform android --profile production
```

### 2. 🔧 Build Local (Alternative)

#### Prérequis
- Android Studio installé
- Android SDK configuré
- Java JDK 11+

#### Étapes
```bash
# 1. Préparer le projet natif
expo prebuild

# 2. Aller dans le dossier Android
cd android

# 3. Build APK debug
./gradlew assembleDebug

# 4. Build APK release
./gradlew assembleRelease
```

### 3. 📦 Export Web (Pour tests)

```bash
# Export pour le web
npm run build:apk
```

## 🛠️ Configuration Actuelle

### Fichiers de Configuration

#### `eas.json`
```json
{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### `app.json` - Configuration Android
```json
{
  "android": {
    "package": "com.diabecare.app",
    "versionCode": 1,
    "permissions": [
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "MANAGE_EXTERNAL_STORAGE"
    ]
  }
}
```

## 🎯 Builds Recommandés

### 1. 📱 APK de Développement
```bash
eas build --platform android --profile preview
```
- **Avantages** : Rapide, pour tests
- **Taille** : ~50-100 MB
- **Utilisation** : Tests internes

### 2. 🏪 APK de Production
```bash
eas build --platform android --profile production
```
- **Avantages** : Optimisé, signé
- **Taille** : ~20-50 MB
- **Utilisation** : Distribution finale

## 📋 Checklist Avant Build

### ✅ Vérifications Obligatoires
- [ ] Toutes les dépendances installées
- [ ] Application testée en développement
- [ ] Permissions Android configurées
- [ ] Icônes et splash screen présents
- [ ] Version et versionCode mis à jour

### ✅ Tests Fonctionnels
- [ ] Ajout de mesures de glycémie
- [ ] Conversion d'unités (mg/dL ↔ mmol/L)
- [ ] Export de données (CSV/JSON)
- [ ] Système de rappels
- [ ] Navigation entre écrans
- [ ] Stockage des données

## 🚨 Résolution de Problèmes

### Erreur : "Expo account required"
```bash
# Solution : Se connecter à Expo
eas login
# Ou créer un compte sur expo.dev
```

### Erreur : "Android SDK not found"
```bash
# Solution : Installer Android Studio
# Configurer ANDROID_HOME dans les variables d'environnement
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Erreur : "Java version incompatible"
```bash
# Solution : Installer Java JDK 11
# Vérifier la version
java -version
```

## 📱 Installation de l'APK

### Sur Appareil Android
1. Activer "Sources inconnues" dans Paramètres > Sécurité
2. Télécharger l'APK depuis EAS ou le dossier de build
3. Ouvrir le fichier APK
4. Suivre les instructions d'installation

### Via ADB (Développement)
```bash
# Installer via ADB
adb install path/to/diabecare.apk

# Désinstaller
adb uninstall com.diabecare.app
```

## 🎉 Résultat Final

Après le build, vous obtiendrez :

### 📦 Fichiers Générés
- `diabecare-v1.0.0.apk` - Application Android
- `build-logs.txt` - Logs de compilation
- `manifest.json` - Métadonnées de l'app

### 📊 Informations de l'APK
- **Nom** : DiabeCare
- **Package** : com.diabecare.app
- **Version** : 1.0.0
- **Taille** : ~30-80 MB (selon le build)
- **Permissions** : Stockage, Notifications

### 🎯 Fonctionnalités Incluses
- ✅ Suivi de glycémie complet
- ✅ Conversion d'unités automatique
- ✅ Export CSV/JSON professionnel
- ✅ Système de rappels intelligent
- ✅ Interface moderne et intuitive
- ✅ Stockage local sécurisé
- ✅ Statistiques et graphiques
- ✅ Mode sombre/clair

## 📞 Support

En cas de problème :
1. Vérifier les logs de build
2. Consulter la documentation Expo
3. Vérifier les permissions Android
4. Tester sur différents appareils

🏥 **DiabeCare est maintenant prêt pour la distribution !**
