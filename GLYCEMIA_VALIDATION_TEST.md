# 🩸 Test de Validation des Valeurs de Glycémie

## 📊 Valeurs de Référence Médicales

### **Hypoglycémie**
- **mg/dL** : < 70 mg/dL
- **mmol/L** : < 3.9 mmol/L

### **Glycémie Normale**
- **mg/dL** : 70-140 mg/dL (à jeun : 70-100)
- **mmol/L** : 3.9-7.8 mmol/L (à jeun : 3.9-5.6)

### **Hyperglycémie Sévère**
- **mg/dL** : > 300 mg/dL
- **mmol/L** : > 16.7 mmol/L

## 🧮 Formule de Conversion

**mg/dL vers mmol/L** : `mg/dL ÷ 18.018`
**mmol/L vers mg/dL** : `mmol/L × 18.018`

## ✅ Tests de Validation

### Test 1: Valeurs Normales
- **8.0 mmol/L** = 144 mg/dL ✅ **NORMAL**
- **5.5 mmol/L** = 99 mg/dL ✅ **NORMAL**
- **120 mg/dL** = 6.7 mmol/L ✅ **NORMAL**

### Test 2: Hypoglycémie
- **3.5 mmol/L** = 63 mg/dL ⚠️ **HYPOGLYCÉMIE**
- **3.0 mmol/L** = 54 mg/dL ⚠️ **HYPOGLYCÉMIE**
- **60 mg/dL** = 3.3 mmol/L ⚠️ **HYPOGLYCÉMIE**

### Test 3: Hyperglycémie Sévère
- **18.0 mmol/L** = 324 mg/dL 🚨 **HYPERGLYCÉMIE SÉVÈRE**
- **20.0 mmol/L** = 360 mg/dL 🚨 **HYPERGLYCÉMIE SÉVÈRE**
- **350 mg/dL** = 19.4 mmol/L 🚨 **HYPERGLYCÉMIE SÉVÈRE**

## 🔧 Corrections Apportées

### Avant (❌ Incorrect)
```typescript
// Validation fixe en mg/dL uniquement
if (numericValue < 70) {
  showWarning(`Hypoglycémie`); // ❌ 8 mmol/L = 144 mg/dL détecté comme hypoglycémie !
}
```

### Après (✅ Correct)
```typescript
// Validation selon l'unité
export const isHypoglycemia = (value: number, unit: GlycemiaUnit): boolean => {
  if (unit === 'mmol/L') {
    return value < 3.9; // ✅ Seuil correct pour mmol/L
  } else {
    return value < 70;  // ✅ Seuil correct pour mg/dL
  }
};
```

## 🎯 Résultat

Maintenant :
- **8.0 mmol/L** → ✅ **Valeur normale** (pas d'alerte)
- **3.5 mmol/L** → ⚠️ **Hypoglycémie détectée** (alerte appropriée)
- **18.0 mmol/L** → 🚨 **Hyperglycémie sévère** (alerte appropriée)

La validation est maintenant **médicalement correcte** et **cohérente** avec les unités utilisées !
