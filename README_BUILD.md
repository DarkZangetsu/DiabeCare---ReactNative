# 🏥 DiabeCare - Build APK Android

## 🚀 Build Rapide (Recommandé)

### Option 1 : Script Automatisé
```bash
npm run build:apk
```
Le script vous guidera à travers tout le processus !

### Option 2 : Build Direct
```bash
# APK de test (rapide)
npm run build:apk:preview

# APK de production (optimisé)
npm run build:apk:production
```

## 📋 Prérequis

### Obligatoires
- ✅ Node.js 18+ installé
- ✅ npm ou yarn installé
- ✅ Compte Expo (gratuit sur expo.dev)

### Optionnels (pour build local)
- Android Studio
- Android SDK
- Java JDK 11+

## 🎯 Types de Build

### 1. 📱 Preview (Développement)
```bash
npm run build:apk:preview
```
- **Temps** : 10-15 minutes
- **Taille** : ~50-80 MB
- **Usage** : Tests, démonstrations
- **Optimisations** : Minimales

### 2. 🏪 Production (Distribution)
```bash
npm run build:apk:production
```
- **Temps** : 15-25 minutes
- **Taille** : ~20-40 MB
- **Usage** : Distribution finale
- **Optimisations** : Maximales

## 📱 Installation de l'APK

### Sur Android
1. **Télécharger** l'APK depuis le dashboard Expo
2. **Activer** "Sources inconnues" dans Paramètres > Sécurité
3. **Ouvrir** le fichier APK téléchargé
4. **Suivre** les instructions d'installation

### Dashboard Expo
Après le build, accédez à :
```
https://expo.dev/accounts/[votre-compte]/projects/diabecare/builds
```

## 🔧 Configuration Actuelle

### Informations de l'App
- **Nom** : DiabeCare
- **Package** : com.diabecare.app
- **Version** : 1.0.0
- **Plateforme** : Android 5.0+ (API 21+)

### Permissions Incluses
- `WRITE_EXTERNAL_STORAGE` - Export de fichiers
- `READ_EXTERNAL_STORAGE` - Lecture de fichiers
- `MANAGE_EXTERNAL_STORAGE` - Gestion avancée du stockage

### Fonctionnalités Incluses
- ✅ Suivi de glycémie complet
- ✅ Conversion mg/dL ↔ mmol/L
- ✅ Export CSV/JSON professionnel
- ✅ Système de rappels
- ✅ Historique et statistiques
- ✅ Interface moderne
- ✅ Mode sombre/clair
- ✅ Stockage local sécurisé

## 🚨 Résolution de Problèmes

### "Expo account required"
```bash
# Se connecter à Expo
eas login
```

### "EAS CLI not found"
```bash
# Installer EAS CLI
npm install -g eas-cli
```

### "Build failed"
1. Vérifier la connexion internet
2. Vérifier les logs de build
3. Réessayer le build
4. Contacter le support Expo si nécessaire

### "APK not installing"
1. Activer "Sources inconnues"
2. Vérifier l'espace de stockage
3. Désinstaller l'ancienne version
4. Redémarrer l'appareil

## 📊 Métriques de Build

### Temps de Build Typiques
- **Preview** : 10-15 minutes
- **Production** : 15-25 minutes
- **Development** : 8-12 minutes

### Tailles d'APK Typiques
- **Preview** : 50-80 MB
- **Production** : 20-40 MB
- **Development** : 60-100 MB

## 🎉 Après le Build

### Vérifications Recommandées
- [ ] APK téléchargé avec succès
- [ ] Installation sur appareil test
- [ ] Toutes les fonctionnalités marchent
- [ ] Export de données fonctionne
- [ ] Rappels fonctionnent
- [ ] Interface responsive

### Distribution
1. **Tests internes** - Partager avec l'équipe
2. **Tests utilisateurs** - Groupe restreint
3. **Publication** - Google Play Store (optionnel)

## 📞 Support

### Ressources Utiles
- [Documentation Expo](https://docs.expo.dev/)
- [Guide EAS Build](https://docs.expo.dev/build/introduction/)
- [Troubleshooting](https://docs.expo.dev/build/troubleshooting/)

### En Cas de Problème
1. Consulter les logs de build
2. Vérifier la configuration
3. Tester sur différents appareils
4. Demander de l'aide sur les forums Expo

## 🏆 Résultat Final

Après un build réussi, vous aurez :

### 📦 Fichier APK
- Nom : `diabecare-[version].apk`
- Taille : 20-80 MB selon le profil
- Compatible : Android 5.0+

### 🎯 Application Complète
- Interface professionnelle
- Toutes les fonctionnalités de suivi diabétique
- Export de données médical
- Système de rappels intelligent
- Stockage local sécurisé

🏥 **DiabeCare est maintenant prêt pour vos patients !**

---

*Pour plus d'informations, consultez le fichier `BUILD_GUIDE.md` pour des instructions détaillées.*
