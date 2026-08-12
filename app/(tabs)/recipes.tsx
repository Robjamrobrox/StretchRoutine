// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

interface Ingredient {
  amount: string;
  weight: string;
  item: string;
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  prepTime: string;
  calories: string;
  ingredients: Ingredient[];
  instructions: string[];
}

const RECIPES: Recipe[] = [
  {
    id: 'protein-shake',
    name: 'Protein Shake',
    emoji: '🥤',
    category: 'Recovery',
    prepTime: '2 min',
    calories: '~420 kcal',
    ingredients: [
      { amount: '1 cup', weight: '245g', item: 'Soy milk or dairy milk' },
      { amount: '1/2 cup', weight: '130g', item: 'Greek yogurt' },
      { amount: '2 tbsp', weight: '32g', item: 'Peanut butter' },
      { amount: '2 tbsp', weight: '20g', item: 'Hot chocolate powder' },
      { amount: '1 medium', weight: '120g', item: 'Frozen banana' },
    ],
    instructions: [
      'Put the milk, Greek yogurt, peanut butter, hot chocolate powder, and frozen banana into a blender.',
      'Blend on high speed for 60 seconds until smooth and creamy.',
      'Pour into a glass and drink right away.',
    ],
  },
];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.emojiWrap}>
          <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <MaterialIcons name="local-dining" size={11} color={Colors.primary} />
              <Text style={styles.tagText}>{recipe.category}</Text>
            </View>
            <View style={styles.tag}>
              <MaterialIcons name="schedule" size={11} color={Colors.textMuted} />
              <Text style={[styles.tagText, { color: Colors.textMuted }]}>{recipe.prepTime}</Text>
            </View>
            <View style={styles.tag}>
              <MaterialIcons name="local-fire-department" size={11} color="#FFB347" />
              <Text style={[styles.tagText, { color: '#FFB347' }]}>{recipe.calories}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ing, i) => (
          <View key={i} style={styles.ingredientRow}>
            <View style={styles.ingredientBullet} />
            <View style={styles.ingredientMeasure}>
              <Text style={styles.ingredientAmount}>{ing.amount}</Text>
              <Text style={styles.ingredientWeight}>{ing.weight}</Text>
            </View>
            <Text style={styles.ingredientItem}>{ing.item}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => setExpanded(v => !v)}
        style={({ pressed }) => [styles.instructionsToggle, pressed ? { opacity: 0.7 } : null]}
        accessibilityLabel={expanded ? 'Hide instructions' : 'Show instructions'}
      >
        <MaterialIcons name="menu-book" size={16} color={Colors.primary} />
        <Text style={styles.instructionsToggleText}>How to make it</Text>
        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={Colors.primary}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.instructionsBox}>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumWrap}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function RecipesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Recipes</Text>
            <Text style={styles.headerSub}>Fuel your performance</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeEmoji}>🍳</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <MaterialIcons name="info-outline" size={14} color={Colors.primary} />
          <Text style={styles.bannerText}>
            {RECIPES.length} recipe{RECIPES.length !== 1 ? 's' : ''} — tap a card to see instructions
          </Text>
        </View>

        {RECIPES.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '700' },
  headerSub: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeEmoji: { fontSize: 22 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
    paddingHorizontal: 2,
  },
  bannerText: { flex: 1, color: Colors.textMuted, fontSize: FontSize.xs },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeEmoji: { fontSize: 28 },
  cardHeaderText: { flex: 1 },
  recipeName: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700', marginBottom: 6 },
  tagRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { color: Colors.primary, fontSize: 10, fontWeight: '600' },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  ingredientMeasure: {
    alignItems: 'flex-end',
    minWidth: 72,
    gap: 1,
  },
  ingredientAmount: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  ingredientWeight: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  ingredientItem: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '400',
  },
  instructionsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  instructionsToggleText: {
    flex: 1,
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  instructionsBox: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  stepNumWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNum: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  stepText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
});
